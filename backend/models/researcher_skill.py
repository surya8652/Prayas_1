from backend.extensions import db

class ResearcherSkill(db.Model):
    __tablename__ = "researcher_skills"

    researcher_id = db.Column(
        db.Integer,
        db.ForeignKey("researcher_profiles.id", ondelete="CASCADE"),
        primary_key=True
    )
    skill_id = db.Column(
        db.Integer,
        db.ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True
    )

    def to_dict(self):
        return {
            "researcher_id": self.researcher_id,
            "skill_id": self.skill_id
        }
