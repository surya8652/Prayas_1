from flask import Blueprint, jsonify, request
from backend.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    role = data.get("role", "Faculty")

    user = None
    if email:
        user = User.query.filter(User.email.ilike(email)).first()

    if not user:
        # Default to first user or sample user
        user = User.query.first()

    user_dict = user.to_dict() if user else {
        "id": 1,
        "name": "Dr. Aris Thorne",
        "email": email or "aris.thorne@prayas.edu",
        "role": role,
        "department": "Computer Science & Engineering",
        "designation": "Associate Professor",
        "bio": "Specializes in explainable artificial intelligence, NLP, and biomedical knowledge graphs.",
        "skills": ["Python", "PyTorch", "Transformers", "Knowledge Representation"],
        "interests": ["Natural Language Processing", "Healthcare AI", "Knowledge Graphs"]
    }

    return jsonify({
        "token": f"prayas_token_{user_dict['id']}",
        "user": user_dict,
        "message": f"Successfully signed in as {user_dict['name']} ({user_dict['role']})"
    }), 200

@auth_bp.route("/current-user", methods=["GET"])
def current_user():
    user = User.query.first()
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({
        "id": 1,
        "name": "Dr. Aris Thorne",
        "email": "aris.thorne@prayas.edu",
        "role": "Faculty",
        "department": "Computer Science & Engineering"
    }), 200
