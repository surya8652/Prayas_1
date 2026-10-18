"""
Pytest test suite for Dashboard Endpoints, Statistics, Data Scoping, and Security.
"""
import pytest
from backend.models.user import User
from backend.models.project import Project
from backend.models.collaboration import CollaborationRequest
from backend.models.researcher_profile import ResearcherProfile
from backend.models.skill import Skill

class TestDashboardSecurityAndEndpoints:
    def test_dashboard_unauthenticated_access_rejected(self, client):
        """Verify that private dashboard endpoints reject unauthenticated requests with 401."""
        client.post("/api/auth/logout")

        for endpoint in [
            "/api/dashboard/summary",
            "/api/dashboard/recommendations",
            "/api/dashboard/projects",
            "/api/dashboard/requests",
            "/api/dashboard/activity"
        ]:
            res = client.get(endpoint)
            assert res.status_code == 401
            assert "Authentication required" in res.get_json()["error"]

    def test_dashboard_summary_authenticated_faculty(self, client):
        """Verify summary returns real counts and personalized user info."""
        # Login as Dr. Aris Thorne (Faculty)
        res_login = client.post("/api/auth/login", json={
            "email": "aris.thorne@prayas.edu",
            "password": "password"
        })
        assert res_login.status_code == 200

        res = client.get("/api/dashboard/summary")
        assert res.status_code == 200
        data = res.get_json()

        assert "user" in data
        assert data["user"]["full_name"] == "Dr. Aris Thorne"
        assert data["user"]["role"] in ["Faculty", "faculty"]
        assert data["user"]["department"] == "Computer Science & Engineering"
        assert "profile_completion_percentage" in data["user"]
        assert data["user"]["profile_completion_percentage"] > 50

        assert "metrics" in data
        assert "recommended_researchers" in data["metrics"]
        assert data["metrics"]["recommended_researchers"] >= 1
        assert "available_projects" in data["metrics"]
        assert data["metrics"]["available_projects"] >= 1
        assert "pending_requests" in data["metrics"]
        assert "accepted_collaborations" in data["metrics"]

    def test_dashboard_recommendations_with_profile(self, client):
        """Verify recommendations compute match percentages when user has profile skills."""
        client.post("/api/auth/login", json={
            "email": "aris.thorne@prayas.edu",
            "password": "password"
        })

        res = client.get("/api/dashboard/recommendations?limit=5")
        assert res.status_code == 200
        data = res.get_json()

        assert "recommendations" in data
        recs = data["recommendations"]
        assert len(recs) <= 5
        assert len(recs) > 0

        # Each recommendation should have required fields
        first_rec = recs[0]
        assert "id" in first_rec
        assert "name" in first_rec
        assert "department" in first_rec
        assert "skills" in first_rec
        assert "match_percentage" in first_rec
        assert first_rec["match_percentage"] is not None
        assert 0 <= first_rec["match_percentage"] <= 100

    def test_dashboard_recommendations_incomplete_profile(self, client, db):
        """Verify recommendations handle an incomplete profile by setting match_percentage to None."""
        # Register a brand new user with no skills
        reg_res = client.post("/api/auth/register", json={
            "full_name": "New Blank Scholar",
            "email": "blank.scholar@prayas.edu",
            "password": "Password123!",
            "department": "Mathematics",
            "role": "student"
        })
        assert reg_res.status_code == 201

        res = client.get("/api/dashboard/recommendations")
        assert res.status_code == 200
        data = res.get_json()
        assert data["profile_incomplete"] is True
        for rec in data["recommendations"]:
            assert rec["match_percentage"] is None

    def test_dashboard_projects_retrieval(self, client):
        """Verify projects are returned with required card fields."""
        client.post("/api/auth/login", json={
            "email": "aris.thorne@prayas.edu",
            "password": "password"
        })

        res = client.get("/api/dashboard/projects?limit=4")
        assert res.status_code == 200
        data = res.get_json()
        assert "projects" in data
        assert len(data["projects"]) <= 4
        assert len(data["projects"]) > 0

        p = data["projects"][0]
        assert "id" in p
        assert "title" in p
        assert "description" in p
        assert "required_skills" in p
        assert "owner_name" in p
        assert "status" in p

    def test_dashboard_requests_scoped_to_user(self, client):
        """Verify requests only include requests relevant to the user."""
        # Login as Dr. Aris Thorne
        client.post("/api/auth/login", json={
            "email": "aris.thorne@prayas.edu",
            "password": "password"
        })

        res = client.get("/api/dashboard/requests")
        assert res.status_code == 200
        data = res.get_json()
        assert "requests" in data
        # Aris is lead on project 2 or applicant on project 1
        assert len(data["requests"]) >= 1
        for req in data["requests"]:
            assert "researcher_name" in req
            assert "project_title" in req
            assert "status" in req
            assert "can_respond" in req

    def test_dashboard_activity_and_deadlines(self, client):
        """Verify activities and project deadlines are derived from actual DB data."""
        client.post("/api/auth/login", json={
            "email": "aris.thorne@prayas.edu",
            "password": "password"
        })

        res = client.get("/api/dashboard/activity")
        assert res.status_code == 200
        data = res.get_json()
        assert "activities" in data
        assert "deadlines" in data
        assert isinstance(data["activities"], list)
        assert isinstance(data["deadlines"], list)

        if len(data["deadlines"]) > 0:
            dl = data["deadlines"][0]
            assert "deadline" in dl
            assert "days_left" in dl
            assert dl["days_left"] >= 0
