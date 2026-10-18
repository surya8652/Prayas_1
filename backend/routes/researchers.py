from flask import Blueprint, jsonify, request
from backend.models.user import User
from backend.models.project import Project
from backend.models.collaboration import CollaborationRequest
from backend.extensions import db

researchers_bp = Blueprint("researchers", __name__, url_prefix="/api/researchers")


@researchers_bp.route("", methods=["GET"])
def get_researchers():
    """
    List researchers with optional filters:
      - department: partial match on department name
      - role: partial match on role (Faculty, Student, Researcher)
      - q: keyword search across name, bio, skills (JSON), interests (JSON)
    """
    department = request.args.get("department")
    role = request.args.get("role")
    keyword = request.args.get("q", "").strip()
    query = User.query

    if department:
        query = query.filter(User.department.ilike(f"%{department}%"))
    if role:
        query = query.filter(User.role.ilike(f"%{role}%"))

    researchers = query.all()

    # Apply keyword post-filter across name, bio, skills_json, interests_json
    if keyword:
        kw = keyword.lower()
        researchers = [
            r for r in researchers
            if kw in (r.name or "").lower()
            or kw in (r.bio or "").lower()
            or kw in (r.skills_json or "").lower()
            or kw in (r.interests_json or "").lower()
            or kw in (r.department or "").lower()
        ]

    return jsonify([r.to_dict() for r in researchers]), 200


@researchers_bp.route("/stats", methods=["GET"])
def get_researcher_stats():
    """Summary statistics about the researcher pool."""
    all_users = User.query.all()
    dept_counts = {}
    role_counts = {"Faculty": 0, "Student": 0, "Researcher": 0}
    all_skills = {}
    all_interests = {}

    for u in all_users:
        dept_counts[u.department] = dept_counts.get(u.department, 0) + 1
        role_key = u.role if u.role in role_counts else "Researcher"
        role_counts[role_key] = role_counts.get(role_key, 0) + 1
        for s in (u.skills or []):
            all_skills[s] = all_skills.get(s, 0) + 1
        for i in (u.interests or []):
            all_interests[i] = all_interests.get(i, 0) + 1

    top_skills = sorted(all_skills.items(), key=lambda x: x[1], reverse=True)[:10]
    top_interests = sorted(all_interests.items(), key=lambda x: x[1], reverse=True)[:10]

    return jsonify({
        "total_researchers": len(all_users),
        "departments": dept_counts,
        "roles": role_counts,
        "top_skills": [s for s, _ in top_skills],
        "top_interests": [i for i, _ in top_interests],
    }), 200


@researchers_bp.route("/<int:user_id>", methods=["GET"])
def get_researcher(user_id):
    """Get researcher profile with their active projects and collaboration history."""
    user = User.query.get_or_404(user_id)
    data = user.to_dict()

    # Attach projects led by this researcher
    led_projects = Project.query.filter_by(lead_id=user_id).all()
    data["led_projects"] = [{
        "id": p.id,
        "title": p.title,
        "status": p.status,
        "department": p.department,
        "tags": p.tags,
        "open_positions": p.open_positions,
    } for p in led_projects]

    # Attach collaboration history
    collabs = CollaborationRequest.query.filter_by(user_id=user_id).all()
    data["collaborations"] = [{
        "id": c.id,
        "project_id": c.project_id,
        "project_title": c.project.title if c.project else None,
        "status": c.status,
        "note": c.note,
    } for c in collabs]

    return jsonify(data), 200


@researchers_bp.route("", methods=["POST"])
def create_researcher():
    """Create a new researcher profile."""
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
