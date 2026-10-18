from backend.extensions import db

class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)

    researchers = db.relationship(
        "ResearcherProfile",
        secondary="researcher_skills",
        back_populates="skills"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
