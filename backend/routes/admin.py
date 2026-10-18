from flask import Blueprint, jsonify, request
from backend.services.synergy_analytics import SynergyAnalyticsService
from backend.models.notification import Notification
from backend.extensions import db

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# In-memory mock list for faculty verifications
PENDING_VERIFICATIONS = [
    {
        "id": 101,
        "applicant_name": "Dr. Elena Rostova",
        "email": "elena.rostova@prayas.edu",
        "department": "Biomedical Informatics",
        "designation": "Visiting Research Scientist",
        "credential": "ORCID: 0000-0002-1825-0097",
        "status": "Pending Verification",
        "submitted_date": "2026-10-15"
    },
    {
        "id": 102,
        "applicant_name": "Karthik Nambiar",
        "email": "karthik.n@prayas.edu",
        "department": "Quantum & Condensed Matter Physics",
        "designation": "Postdoctoral Fellow",
        "credential": "PhD (2025, IISc Bangalore)",
        "status": "Pending Verification",
        "submitted_date": "2026-10-17"
    }
]

@admin_bp.route("/overview", methods=["GET"])
def get_overview():
    data = SynergyAnalyticsService.get_institutional_kpis()
    return jsonify(data), 200

@admin_bp.route("/verifications", methods=["GET"])
def get_verifications():
    return jsonify(PENDING_VERIFICATIONS), 200

@admin_bp.route("/verifications/<int:verif_id>/approve", methods=["POST"])
def approve_verification(verif_id):
    global PENDING_VERIFICATIONS
    for item in PENDING_VERIFICATIONS:
        if item["id"] == verif_id:
            item["status"] = "Verified & Approved"
            return jsonify({"success": True, "verification": item}), 200
    return jsonify({"error": "Verification request not found"}), 404

@admin_bp.route("/announcements", methods=["POST"])
def broadcast_announcement():
    data = request.get_json() or {}
    title = data.get("title", "Institutional Research Call")
    message = data.get("message", "A new collaborative funding opportunity is open.")

    notif = Notification(
        title=f"📢 Announcement: {title}",
        message=message,
        type="announcement",
        timestamp_str="Just now",
        read=False
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify({"success": True, "notification": notif.to_dict()}), 201
