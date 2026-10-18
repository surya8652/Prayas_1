from datetime import datetime, timezone
import json
from werkzeug.security import generate_password_hash, check_password_hash
from backend.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), default="faculty", nullable=False)  # student, faculty, admin
    department = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Legacy fields preserved for backward compatibility with seeded researchers and tests
    designation = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    interests_json = db.Column(db.Text, default="[]")
    skills_json = db.Column(db.Text, default="[]")

    # Relationships
    profile = db.relationship("ResearcherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    owned_research_projects = db.relationship("ResearchProject", back_populates="owner", cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        # Support both 'name' and 'full_name' transparently
        if "name" in kwargs and "full_name" not in kwargs:
            kwargs["full_name"] = kwargs.pop("name")
        password = kwargs.pop("password", None)
        super().__init__(**kwargs)
        if password:
            self.set_password(password)

    @property
    def name(self):
        return self.full_name

    @name.setter
    def name(self, value):
        self.full_name = value

    def set_password(self, password: str):
        if not password:
            raise ValueError("Password cannot be empty")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        if not self.password_hash or not password:
            return False
        return check_password_hash(self.password_hash, password)

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

    def to_dict(self, include_profile=False):
        data = {
            "id": self.id,
            "full_name": self.full_name,
            "name": self.full_name,
            "email": self.email,
            "role": (self.role or "Faculty").capitalize(),
            "department": self.department,
            "designation": self.designation,
            "bio": self.bio,
            "is_active": self.is_active,
            "interests": self.interests,
            "skills": self.skills,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if self.profile:
            data["profile_completed"] = self.profile.profile_completed
            if include_profile:
                data["profile"] = self.profile.to_dict()
        else:
            data["profile_completed"] = False

        return data
