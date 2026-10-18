from datetime import datetime, timezone
import json
from backend.extensions import db

class ResearcherProfile(db.Model):
    __tablename__ = "researcher_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    bio = db.Column(db.Text, nullable=True)
    research_domain = db.Column(db.String(150), nullable=True)
    research_interests_json = db.Column(db.Text, default="[]")
    availability = db.Column(db.String(100), nullable=True)  # e.g., "Full-time", "10 hrs/week", "Open to new projects"
    profile_completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    user = db.relationship("User", back_populates="profile")
    skills = db.relationship(
        "Skill",
        secondary="researcher_skills",
        back_populates="researchers",
        lazy="joined"
    )

    @property
    def research_interests(self):
        try:
            return json.loads(self.research_interests_json or "[]")
        except Exception:
            return []

    @research_interests.setter
    def research_interests(self, value):
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    self.research_interests_json = json.dumps(parsed)
                    return
            except Exception:
                # Comma separated string
                parts = [s.strip() for s in value.split(",") if s.strip()]
                self.research_interests_json = json.dumps(parts)
                return
        elif isinstance(value, list):
            self.research_interests_json = json.dumps(value)
        else:
            self.research_interests_json = json.dumps([])

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "bio": self.bio or "",
            "research_domain": self.research_domain or "",
            "research_interests": self.research_interests,
            "availability": self.availability or "",
            "profile_completed": self.profile_completed,
            "skills": [s.name for s in (self.skills or [])],
            "skills_detail": [{"id": s.id, "name": s.name} for s in (self.skills or [])],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
