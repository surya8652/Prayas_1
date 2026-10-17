import pytest
from backend.app import create_app
from backend.extensions import db
from backend.models.user import User
from backend.models.project import Project
from backend.services.matching_service import ExplainableMatchingService

@pytest.fixture
def client():
    app = create_app("testing")
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "healthy"

def test_explainable_matching():
    u1 = User(id=1, name="Prof A", email="a@test.edu", department="Computer Science")
    u1.skills = ["Python", "PyTorch", "NLP"]
    u1.interests = ["AI", "Genomics"]

    u2 = User(id=2, name="Prof B", email="b@test.edu", department="Biology")
    u2.skills = ["Python", "Bioinformatics", "Microbiology"]
    u2.interests = ["Genomics", "Genetics"]

    project = Project(
        id=10,
        title="Computational Genomics",
        abstract="Genomic analysis with AI",
        department="Computer Science",
        lead_id=1
    )
    project.required_skills = ["Python", "Bioinformatics"]
    project.tags = ["Genomics", "AI"]

    matches = ExplainableMatchingService.match_researchers_for_project(project, [u1, u2])
    # u1 is lead, so only u2 is in candidates
    assert len(matches) == 1
    match = matches[0]
    assert match["researcher"]["id"] == 2
    assert "Python" in match["matched_skills"]
    assert "Bioinformatics" in match["matched_skills"]
    assert "Genomics" in match["matched_interests"]
    assert match["is_cross_department"] is True
    assert match["score"] > 50
    assert "Interdisciplinary synergy" in match["explanation"]
