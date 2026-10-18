from flask import Blueprint, jsonify, request, session
from backend.extensions import db
from backend.models.user import User
from backend.models.researcher_profile import ResearcherProfile
from backend.models.skill import Skill
from backend.routes.auth import login_required

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

@profile_bp.route("", methods=["GET"])
@login_required
def get_profile():
    # Never trust client-supplied ID; always use the server-side session user_id
    user_id = session.get("user_id")
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile:
        profile = ResearcherProfile(user_id=user.id, profile_completed=False)
        db.session.add(profile)
        db.session.commit()

    return jsonify({
        "user": user.to_dict(),
        "profile": profile.to_dict()
    }), 200

@profile_bp.route("", methods=["PUT"])
@login_required
def update_profile():
    # Backend Authorization: Enforce that user only updates their own profile
    user_id = session.get("user_id")
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}

    # Security check: if client attempts to specify a different user_id or researcher_id without admin role, reject
    requested_user_id = data.get("user_id") or data.get("id")
    if requested_user_id and int(requested_user_id) != user_id and session.get("role") != "admin":
        return jsonify({"error": "Unauthorized: You may only modify your own profile."}), 403

    profile = user.profile
    if not profile:
        profile = ResearcherProfile(user_id=user.id)
        db.session.add(profile)

    # Update basic profile fields
    if "bio" in data:
        profile.bio = str(data["bio"]).strip()
        user.bio = profile.bio
    if "research_domain" in data:
        profile.research_domain = str(data["research_domain"]).strip()
    if "availability" in data:
        profile.availability = str(data["availability"]).strip()
    if "profile_completed" in data:
        profile.profile_completed = bool(data["profile_completed"])

    # Update research interests
    if "research_interests" in data:
        profile.research_interests = data["research_interests"]
        user.interests = profile.research_interests

    # Update skills
    if "skills" in data:
        raw_skills = data["skills"]
        skill_names = []
        if isinstance(raw_skills, list):
            skill_names = [str(s).strip() for s in raw_skills if str(s).strip()]
        elif isinstance(raw_skills, str):
            skill_names = [s.strip() for s in raw_skills.split(",") if s.strip()]

        skill_records = []
        for s_name in skill_names:
            # Case-insensitive skill match or create
            skill = Skill.query.filter(db.func.lower(Skill.name) == s_name.lower()).first()
            if not skill:
                skill = Skill(name=s_name)
                db.session.add(skill)
                db.session.flush()
            skill_records.append(skill)

        profile.skills = skill_records
        user.skills = [s.name for s in skill_records]

    # Optionally update User entity basic fields if supplied
    if "full_name" in data and data["full_name"].strip():
        user.full_name = data["full_name"].strip()
    if "department" in data and data["department"].strip():
        user.department = data["department"].strip()
    if "designation" in data and data["designation"]:
        user.designation = str(data["designation"]).strip()

    try:
        db.session.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict(include_profile=True),
            "profile": profile.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save profile: {str(e)}"}), 500
