from datetime import datetime, timezone
import json
from backend.extensions import db

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    abstract = db.Column(db.Text, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    lead_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(50), default="Recruiting")  # Recruiting, In Progress, Completed
    tags_json = db.Column(db.Text, default="[]")
    required_skills_json = db.Column(db.Text, default="[]")
    open_positions = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    lead = db.relationship("User", backref=db.backref("led_projects", lazy=True))

    @property
    def tags(self):
        try:
            return json.loads(self.tags_json or "[]")
        except Exception:
            return []

    @tags.setter
    def tags(self, value):
        self.tags_json = json.dumps(value or [])

    @property
    def required_skills(self):
        try:
            return json.loads(self.required_skills_json or "[]")
        except Exception:
            return []

    @required_skills.setter
    def required_skills(self, value):
        self.required_skills_json = json.dumps(value or [])

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "abstract": self.abstract,
            "department": self.department,
            "lead_id": self.lead_id,
            "lead_name": self.lead.name if self.lead else None,
            "status": self.status,
            "tags": self.tags,
            "required_skills": self.required_skills,
            "open_positions": self.open_positions,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
