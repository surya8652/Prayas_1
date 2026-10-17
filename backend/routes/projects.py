from flask import Blueprint, jsonify, request
from backend.models.project import Project
from backend.models.user import User
from backend.extensions import db

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")

@projects_bp.route("", methods=["GET"])
def get_projects():
    department = request.args.get("department")
    status = request.args.get("status")
    query = Project.query

    if department:
        query = query.filter(Project.department.ilike(f"%{department}%"))
    if status:
        query = query.filter(Project.status.ilike(f"%{status}%"))

    projects = query.all()
    return jsonify([p.to_dict() for p in projects]), 200

@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(project.to_dict()), 200

@projects_bp.route("", methods=["POST"])
def create_project():
    data = request.get_json() or {}
    required = ["title", "abstract", "department", "lead_id"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    lead = User.query.get(data["lead_id"])
    if not lead:
        return jsonify({"error": f"User with lead_id {data['lead_id']} not found"}), 404

    project = Project(
        title=data["title"],
        abstract=data["abstract"],
        department=data["department"],
        lead_id=data["lead_id"],
        status=data.get("status", "Recruiting"),
        open_positions=data.get("open_positions", 1)
    )
    project.tags = data.get("tags", [])
    project.required_skills = data.get("required_skills", [])

    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201
