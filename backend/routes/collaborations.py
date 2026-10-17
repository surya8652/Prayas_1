from flask import Blueprint, jsonify, request
from backend.models.collaboration import CollaborationRequest
from backend.models.project import Project
from backend.models.user import User
from backend.extensions import db

collaborations_bp = Blueprint("collaborations", __name__, url_prefix="/api/collaborations")

@collaborations_bp.route("", methods=["GET"])
def get_collaborations():
    project_id = request.args.get("project_id", type=int)
    user_id = request.args.get("user_id", type=int)
    query = CollaborationRequest.query

    if project_id:
        query = query.filter_by(project_id=project_id)
    if user_id:
        query = query.filter_by(user_id=user_id)

    requests = query.all()
    return jsonify([c.to_dict() for c in requests]), 200

@collaborations_bp.route("", methods=["POST"])
def create_collaboration():
    data = request.get_json() or {}
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "'project_id' and 'user_id' are required"}), 400

    if not Project.query.get(project_id):
        return jsonify({"error": f"Project {project_id} not found"}), 404
    if not User.query.get(user_id):
        return jsonify({"error": f"User {user_id} not found"}), 404

    existing = CollaborationRequest.query.filter_by(project_id=project_id, user_id=user_id).first()
    if existing:
        return jsonify({"error": "Collaboration request already exists", "request": existing.to_dict()}), 409

    req = CollaborationRequest(
        project_id=project_id,
        user_id=user_id,
        note=data.get("note", ""),
        status="Pending"
    )
    db.session.add(req)
    db.session.commit()
    return jsonify(req.to_dict()), 201
