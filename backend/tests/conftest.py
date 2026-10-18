"""
Shared pytest fixtures for PRAYAS backend tests.
Provides isolated in-memory SQLite test database per test session.
"""
import pytest
from backend.app import create_app
from backend.extensions import db as _db
from backend.models.user import User
from backend.models.project import Project
from backend.models.collaboration import CollaborationRequest
from backend.models.notification import Notification


@pytest.fixture(scope="session")
def app():
    """Create application for testing with in-memory SQLite database."""
    app = create_app("testing")
    with app.app_context():
        _db.create_all()
        _seed_test_data()
        yield app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture(scope="session")
def client(app):
    """Test client bound to the session-level app."""
    return app.test_client()


@pytest.fixture(scope="session")
def db(app):
    """Database bound to the session-level app context."""
    with app.app_context():
        yield _db


def _seed_test_data():
    """Seed minimal, deterministic test data."""
    u1 = User(
        name="Dr. Alice Nguyen",
        email="alice@test.prayas.edu",
        role="Faculty",
        department="Computer Science",
        designation="Associate Professor",
        bio="Expert in explainable AI and NLP systems.",
    )
    u1.skills = ["Python", "PyTorch", "NLP", "Transformers"]
    u1.interests = ["AI", "Genomics", "Healthcare AI"]

    u2 = User(
        name="Dr. Ben Okafor",
        email="ben@test.prayas.edu",
        role="Faculty",
        department="Biotechnology",
        designation="Professor",
        bio="Specializes in computational genomics and drug discovery.",
    )
    u2.skills = ["Python", "R", "Bioinformatics", "Molecular Modeling"]
    u2.interests = ["Genomics", "Bioinformatics", "Drug Discovery"]

    u3 = User(
        name="Priya Sharma",
        email="priya@test.prayas.edu",
        role="Student",
        department="Data Science",
        designation="PhD Scholar",
        bio="Federated learning and privacy-preserving ML research.",
    )
    u3.skills = ["Python", "PyTorch", "Distributed Systems", "Docker"]
    u3.interests = ["Federated Learning", "Data Security", "Edge AI"]

    _db.session.add_all([u1, u2, u3])
    _db.session.flush()

    p1 = Project(
        title="Genomic Pattern Mining with Deep Graphs",
        abstract="Combines graph neural networks with genomic sequencing data.",
        department="Biotechnology",
        lead_id=u2.id,
        status="Recruiting",
        open_positions=2,
    )
    p1.tags = ["Genomics", "AI", "Healthcare AI"]
    p1.required_skills = ["Python", "PyTorch", "Bioinformatics"]

    p2 = Project(
        title="Privacy-Preserving Federated Health Learning",
        abstract="Federated learning protocols for secure inter-hospital inference.",
        department="Computer Science",
        lead_id=u1.id,
        status="Recruiting",
        open_positions=3,
    )
    p2.tags = ["Federated Learning", "Data Security", "AI"]
    p2.required_skills = ["Python", "PyTorch", "Distributed Systems", "Docker"]

    _db.session.add_all([p1, p2])
    _db.session.flush()

    c1 = CollaborationRequest(
        project_id=p1.id,
        user_id=u1.id,
        note="Bringing NLP expertise for genomic text mining.",
        status="Pending",
    )
    c2 = CollaborationRequest(
        project_id=p2.id,
        user_id=u3.id,
        note="Experienced with federated aggregation algorithms.",
        status="Accepted",
    )
    _db.session.add_all([c1, c2])

    n1 = Notification(
        user_id=u1.id,
        title="New Match Found",
        message="85% match detected for Genomic Pattern Mining project.",
        type="match",
        timestamp_str="5 mins ago",
        read=False,
    )
    _db.session.add(n1)
    _db.session.commit()
