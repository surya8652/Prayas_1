from flask import Blueprint, jsonify, request
from backend.models.user import User
from backend.extensions import db

researchers_bp = Blueprint("researchers", __name__, url_prefix="/api/researchers")

@researchers_bp.route("", methods=["GET"])
def get_researchers():
    department = request.args.get("department")
    role = request.args.get("role")
    query = User.query

    if department:
        query = query.filter(User.department.ilike(f"%{department}%"))
    if role:
        query = query.filter(User.role.ilike(f"%{role}%"))

    researchers = query.all()
    return jsonify([r.to_dict() for r in researchers]), 200

@researchers_bp.route("/<int:user_id>", methods=["GET"])
def get_researcher(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@researchers_bp.route("", methods=["POST"])
def create_researcher():
    data = request.get_json() or {}
    required = ["name", "email", "department"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    user = User(
        name=data["name"],
        email=data["email"],
        role=data.get("role", "Faculty"),
        department=data["department"],
        designation=data.get("designation"),
        bio=data.get("bio", ""),
    )
    user.interests = data.get("interests", [])
    user.skills = data.get("skills", [])

    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201
