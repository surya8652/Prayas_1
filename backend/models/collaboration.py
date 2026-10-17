from datetime import datetime, timezone
from backend.extensions import db

class CollaborationRequest(db.Model):
    __tablename__ = "collaboration_requests"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(50), default="Pending")  # Pending, Accepted, Rejected
    note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    project = db.relationship("Project", backref=db.backref("collaboration_requests", lazy=True))
    applicant = db.relationship("User", backref=db.backref("applied_collaborations", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "project_title": self.project.title if self.project else None,
            "user_id": self.user_id,
            "user_name": self.applicant.name if self.applicant else None,
            "status": self.status,
            "note": self.note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
