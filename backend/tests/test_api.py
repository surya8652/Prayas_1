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

def test_design_system_endpoint(client):
    response = client.get("/api/design-system")
    assert response.status_code == 200
    data = response.get_json()
    assert "tokens" in data
    assert "colors" in data["tokens"]
    assert data["tokens"]["colors"]["primary_text"]["hex"] == "#0F172A"

def test_admin_overview_endpoint(client):
    response = client.get("/api/admin/overview")
    assert response.status_code == 200
    data = response.get_json()
    assert "metrics" in data
    assert "synergy_matrix" in data

def test_notifications_endpoint(client):
    # Test create notification
    post_res = client.post("/api/notifications", json={
        "title": "Test Match Notification",
        "message": "90% match detected for AI grant.",
        "type": "match"
    })
    assert post_res.status_code == 201

    get_res = client.get("/api/notifications")
    assert get_res.status_code == 200
    assert len(get_res.get_json()) >= 1

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
