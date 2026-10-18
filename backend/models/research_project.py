from datetime import datetime, timezone
from backend.extensions import db

class ResearchProject(db.Model):
    __tablename__ = "research_projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    owner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    research_domain = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(50), default="Active", nullable=False)  # Active, Completed, In Review
    deadline = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    owner = db.relationship("User", back_populates="owned_research_projects")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "owner_id": self.owner_id,
            "owner_name": self.owner.full_name if self.owner else None,
            "research_domain": self.research_domain,
            "status": self.status,
            "deadline": self.deadline,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
