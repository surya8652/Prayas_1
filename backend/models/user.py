from datetime import datetime, timezone
import json
from backend.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), default="Faculty")  # Faculty, Student, Researcher
    department = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    interests_json = db.Column(db.Text, default="[]")  # List of research topics/keywords
    skills_json = db.Column(db.Text, default="[]")  # Technical and methodological skills
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def interests(self):
        try:
            return json.loads(self.interests_json or "[]")
        except Exception:
            return []

    @interests.setter
    def interests(self, value):
        self.interests_json = json.dumps(value or [])

    @property
    def skills(self):
        try:
            return json.loads(self.skills_json or "[]")
        except Exception:
            return []

    @skills.setter
    def skills(self, value):
        self.skills_json = json.dumps(value or [])

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "department": self.department,
            "designation": self.designation,
            "bio": self.bio,
            "interests": self.interests,
            "skills": self.skills,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
