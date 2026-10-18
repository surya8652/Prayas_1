from flask import Blueprint, jsonify, request
from backend.models.notification import Notification
from backend.extensions import db

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")

@notifications_bp.route("", methods=["GET"])
def list_notifications():
    user_id = request.args.get("user_id", type=int)
    query = Notification.query.order_by(Notification.id.desc())
    if user_id:
        query = query.filter((Notification.user_id == user_id) | (Notification.user_id.is_(None)))
    items = query.all()
    return jsonify([n.to_dict() for n in items]), 200

@notifications_bp.route("", methods=["POST"])
def create_notification():
    data = request.get_json() or {}
    title = data.get("title")
    message = data.get("message")
    if not title or not message:
        return jsonify({"error": "'title' and 'message' are required"}), 400

    notif = Notification(
        user_id=data.get("user_id"),
        title=title,
        message=message,
        type=data.get("type", "system"),
        timestamp_str=data.get("timestamp", "Just now"),
        read=False
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify(notif.to_dict()), 201

@notifications_bp.route("/<int:notif_id>/read", methods=["PUT", "PATCH"])
def mark_read(notif_id):
    notif = Notification.query.get(notif_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404
    notif.read = True
    db.session.commit()
    return jsonify(notif.to_dict()), 200

@notifications_bp.route("/mark-all-read", methods=["POST", "PUT"])
def mark_all_read():
    Notification.query.update({Notification.read: True})
    db.session.commit()
    return jsonify({"success": True, "message": "All notifications marked as read"}), 200
