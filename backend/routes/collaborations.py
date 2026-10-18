from flask import Blueprint, jsonify, request
from backend.models.collaboration import CollaborationRequest
from backend.models.project import Project
from backend.models.user import User
from backend.models.notification import Notification
from backend.extensions import db

collaborations_bp = Blueprint("collaborations", __name__, url_prefix="/api/collaborations")

@collaborations_bp.route("", methods=["GET"])
def get_collaborations():
    project_id = request.args.get("project_id", type=int)
    user_id = request.args.get("user_id", type=int)
    query = CollaborationRequest.query.order_by(CollaborationRequest.id.desc())

    if project_id:
        query = query.filter_by(project_id=project_id)
    if user_id:
        query = query.filter_by(user_id=user_id)

    requests = query.all()
    results = []
    for c in requests:
        d = c.to_dict()
        if c.applicant:
            d["applicant_department"] = c.applicant.department
            d["applicant_role"] = c.applicant.role
        if c.project:
            d["project_department"] = c.project.department
            d["lead_id"] = c.project.lead_id
            d["lead_name"] = c.project.lead.name if c.project.lead else None
        results.append(d)
    return jsonify(results), 200

@collaborations_bp.route("", methods=["POST"])
def create_collaboration():
    data = request.get_json() or {}
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "'project_id' and 'user_id' are required"}), 400

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": f"Project {project_id} not found"}), 404
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"User {user_id} not found"}), 404

    existing = CollaborationRequest.query.filter_by(project_id=project_id, user_id=user_id).first()
    if existing:
        return jsonify({"error": "Collaboration request already exists", "request": existing.to_dict()}), 409

    req = CollaborationRequest(
        project_id=project_id,
        user_id=user_id,
        note=data.get("note", "Interested in interdisciplinary collaboration on this research initiative."),
        status="Pending"
    )
    db.session.add(req)

    # Notify project lead
    if project.lead_id:
        notif = Notification(
            user_id=project.lead_id,
            title="New Collaboration Proposal Received",
            message=f"{user.name} ({user.department}) submitted a collaboration proposal for '{project.title}'.",
            type="collab",
            timestamp_str="Just now",
            read=False
        )
        db.session.add(notif)

    db.session.commit()

    resp = req.to_dict()
    resp["applicant_department"] = user.department
    resp["applicant_role"] = user.role
    resp["project_department"] = project.department
    resp["lead_name"] = project.lead.name if project.lead else None
    return jsonify(resp), 201

@collaborations_bp.route("/<int:req_id>/status", methods=["PUT", "PATCH"])
def update_status(req_id):
    req = CollaborationRequest.query.get(req_id)
    if not req:
        return jsonify({"error": "Collaboration request not found"}), 404

    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ["Accepted", "Rejected", "Pending"]:
        return jsonify({"error": "Status must be 'Accepted', 'Rejected', or 'Pending'"}), 400

    req.status = new_status

    # Notify applicant of outcome
    if req.user_id:
        outcome_word = "accepted" if new_status == "Accepted" else "declined"
        notif = Notification(
            user_id=req.user_id,
            title=f"Collaboration Proposal {new_status}",
            message=f"Your proposal for '{req.project.title if req.project else 'the project'}' was {outcome_word}.",
            type="collab",
            timestamp_str="Just now",
            read=False
        )
        db.session.add(notif)

    db.session.commit()
    return jsonify(req.to_dict()), 200
