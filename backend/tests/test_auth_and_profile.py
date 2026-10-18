"""
Comprehensive pytest test suite for Authentication, Password Security, 
Session Handling, Profile Management, and Access Control in PRAYAS.
"""
import pytest
from backend.models.user import User
from backend.models.researcher_profile import ResearcherProfile
from backend.models.skill import Skill
from backend.models.research_project import ResearchProject
from werkzeug.security import check_password_hash

class TestUserAndModels:
    def test_user_password_hashing(self, db):
        """Verify that passwords are never stored in plaintext and hashing works."""
        user = User(
            full_name="Dr. Hashing Test",
            email="hash.test@prayas.edu",
            role="faculty",
            department="Computer Science"
        )
        user.set_password("SecretPass123!")
        
        # Verify hash is created and is not plaintext
        assert user.password_hash is not None
        assert user.password_hash != "SecretPass123!"
        assert user.password_hash.startswith("scrypt:") or user.password_hash.startswith("pbkdf2:")
        
        # Verify check_password
        assert user.check_password("SecretPass123!") is True
        assert user.check_password("WrongPassword") is False
        assert user.check_password("") is False

    def test_user_to_dict_never_exposes_password_hash(self, db):
        """Verify password_hash is omitted from user dictionary representations."""
        user = User(
            full_name="Dr. Exposure Test",
            email="exposure.test@prayas.edu",
            role="faculty",
            department="Biotechnology"
        )
        user.set_password("SuperSecret999")
        user_dict = user.to_dict()
        assert "password_hash" not in user_dict
        assert "password" not in user_dict
        assert user_dict["full_name"] == "Dr. Exposure Test"
        assert user_dict["email"] == "exposure.test@prayas.edu"

    def test_researcher_profile_and_skills_relationship(self, db):
        """Verify ResearcherProfile, Skill, and ResearcherSkill associations."""
        user = User(
            full_name="Dr. Skill Researcher",
            email="skills.test@prayas.edu",
            role="faculty",
            department="Robotics"
        )
        user.set_password("pass123")
        db.session.add(user)
        db.session.flush()

        skill1 = Skill(name="Quantum Computing")
        skill2 = Skill(name="Algorithm Design")
        db.session.add_all([skill1, skill2])
        db.session.flush()

        profile = ResearcherProfile(
            user_id=user.id,
            bio="Researching quantum algorithms.",
            research_domain="Quantum Computing",
            availability="Full-time",
            profile_completed=True
        )
        profile.skills = [skill1, skill2]
        profile.research_interests = ["Quantum Gates", "Error Correction"]
        db.session.add(profile)
        db.session.commit()

        # Query back
        fetched_profile = ResearcherProfile.query.filter_by(user_id=user.id).first()
        assert fetched_profile is not None
        assert len(fetched_profile.skills) == 2
        assert "Quantum Computing" in [s.name for s in fetched_profile.skills]
        assert "Quantum Gates" in fetched_profile.research_interests
        assert fetched_profile.user.full_name == "Dr. Skill Researcher"

    def test_research_project_creation(self, db):
        """Verify ResearchProject creation and owner foreign key relationship."""
        user = User(
            full_name="Dr. Project Owner",
            email="proj.owner@prayas.edu",
            role="faculty",
            department="Physics"
        )
        user.set_password("pass123")
        db.session.add(user)
        db.session.flush()

        rp = ResearchProject(
            title="Dark Matter Particle Detection",
            description="Cryogenic liquid xenon observatory analysis.",
            owner_id=user.id,
            research_domain="Astroparticle Physics",
            status="Active",
            deadline="2027-12-31"
        )
        db.session.add(rp)
        db.session.commit()

        fetched_rp = ResearchProject.query.filter_by(title="Dark Matter Particle Detection").first()
        assert fetched_rp is not None
        assert fetched_rp.owner_id == user.id
        assert fetched_rp.owner.full_name == "Dr. Project Owner"


class TestAuthenticationEndpoints:
    def test_successful_registration(self, client):
        """Verify registration happy path with status 201 and auto session."""
        payload = {
            "full_name": "Sarah Connor",
            "email": "sarah.connor@prayas.edu",
            "password": "SecurePassword123",
            "confirm_password": "SecurePassword123",
            "department": "Cybernetics & AI",
            "role": "student"
        }
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 201
        data = res.get_json()
        assert "user" in data
        assert data["user"]["email"] == "sarah.connor@prayas.edu"
        assert data["user"]["full_name"] == "Sarah Connor"
        assert "password_hash" not in data["user"]
        assert data["user"]["is_active"] is True

        # Verify session was established: /api/auth/me should return current user
        me_res = client.get("/api/auth/me")
        assert me_res.status_code == 200
        assert me_res.get_json()["user"]["email"] == "sarah.connor@prayas.edu"

    def test_duplicate_email_rejection(self, client):
        """Verify duplicate registration returns HTTP 409 Conflict."""
        payload = {
            "full_name": "Duplicate Sarah",
            "email": "SARAH.CONNOR@PRAYAS.EDU",  # Test case-insensitivity
            "password": "AnotherPassword456",
            "department": "Cybernetics & AI",
            "role": "student"
        }
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 409
        assert "already exists" in res.get_json()["error"]

    def test_invalid_registration_missing_fields(self, client):
        """Verify validation errors for incomplete or invalid data."""
        # Missing email
        res1 = client.post("/api/auth/register", json={
            "full_name": "Test Name",
            "password": "Password123",
            "department": "Physics"
        })
        assert res1.status_code == 400

        # Short password (< 6 chars)
        res2 = client.post("/api/auth/register", json={
            "full_name": "Test Name",
            "email": "short.pass@prayas.edu",
            "password": "123",
            "department": "Physics"
        })
        assert res2.status_code == 400
        assert "at least 6 characters" in res2.get_json()["error"]

        # Password mismatch
        res3 = client.post("/api/auth/register", json={
            "full_name": "Test Name",
            "email": "mismatch@prayas.edu",
            "password": "Password123",
            "confirm_password": "DifferentPassword",
            "department": "Physics"
        })
        assert res3.status_code == 400
        assert "do not match" in res3.get_json()["error"]

        # Invalid email format
        res4 = client.post("/api/auth/register", json={
            "full_name": "Test Name",
            "email": "invalid-email-string",
            "password": "Password123",
            "department": "Physics"
        })
        assert res4.status_code == 400

    def test_admin_registration_rejection(self, client):
        """Verify public registration cannot create an admin account."""
        res = client.post("/api/auth/register", json={
            "full_name": "Sneaky Attacker",
            "email": "attacker@prayas.edu",
            "password": "Password123",
            "department": "Administration",
            "role": "admin"
        })
        assert res.status_code == 403
        assert "Administrator accounts cannot be created" in res.get_json()["error"]

    def test_successful_login(self, client):
        """Verify login sets session and returns user info without password hash."""
        # Log in with the registered user
        res = client.post("/api/auth/login", json={
            "email": "sarah.connor@prayas.edu",
            "password": "SecurePassword123"
        })
        assert res.status_code == 200
        data = res.get_json()
        assert data["user"]["email"] == "sarah.connor@prayas.edu"
        assert "password_hash" not in data["user"]

        # Verify /api/auth/me reflects the logged in session
        me_res = client.get("/api/auth/me")
        assert me_res.status_code == 200
        assert me_res.get_json()["user"]["email"] == "sarah.connor@prayas.edu"

    def test_incorrect_password_rejection(self, client):
        """Verify incorrect password returns HTTP 401 Unauthorized."""
        res = client.post("/api/auth/login", json={
            "email": "sarah.connor@prayas.edu",
            "password": "WrongPassword999"
        })
        assert res.status_code == 401
        assert "Invalid email or password" in res.get_json()["error"]

    def test_inactive_account_rejection(self, client, db):
        """Verify inactive account is blocked from signing in."""
        user = User(
            full_name="Deactivated User",
            email="deactivated@prayas.edu",
            role="faculty",
            department="Chemistry",
            is_active=False
        )
        user.set_password("ValidPassword123")
        db.session.add(user)
        db.session.commit()

        res = client.post("/api/auth/login", json={
            "email": "deactivated@prayas.edu",
            "password": "ValidPassword123"
        })
        assert res.status_code == 403
        assert "inactive" in res.get_json()["error"].lower()

    def test_logout(self, client):
        """Verify logout clears session and subsequent /me returns 401."""
        # Log in first
        client.post("/api/auth/login", json={
            "email": "sarah.connor@prayas.edu",
            "password": "SecurePassword123"
        })
        me_before = client.get("/api/auth/me")
        assert me_before.status_code == 200

        # Logout
        logout_res = client.post("/api/auth/logout")
        assert logout_res.status_code == 200

        # Verify session is cleared
        me_after = client.get("/api/auth/me")
        assert me_after.status_code == 401

    def test_unauthenticated_api_access(self, client):
        """Verify protected endpoints return 401 when not logged in."""
        # Ensure session is empty
        client.post("/api/auth/logout")

        res_me = client.get("/api/auth/me")
        assert res_me.status_code == 401

        res_profile_get = client.get("/api/profile")
        assert res_profile_get.status_code == 401

        res_profile_put = client.put("/api/profile", json={"bio": "hacker"})
        assert res_profile_put.status_code == 401


class TestProfileEndpointsAndSecurity:
    def test_profile_creation_and_update(self, client):
        """Verify user can update their own profile and add skills."""
        # Sign in as Sarah
        client.post("/api/auth/login", json={
            "email": "sarah.connor@prayas.edu",
            "password": "SecurePassword123"
        })

        # Update profile via PUT /api/profile
        update_data = {
            "bio": "Pioneering distributed neural networks and autonomous systems.",
            "research_domain": "Artificial Intelligence & Autonomous Systems",
            "research_interests": ["Deep Learning", "Sensor Networks", "Robotics"],
            "availability": "15 hrs/week",
            "profile_completed": True,
            "skills": ["Python", "TensorFlow", "ROS2", "Reinforcement Learning"]
        }
        put_res = client.put("/api/profile", json=update_data)
        assert put_res.status_code == 200
        put_json = put_res.get_json()
        assert put_json["profile"]["research_domain"] == "Artificial Intelligence & Autonomous Systems"
        assert put_json["profile"]["availability"] == "15 hrs/week"
        assert put_json["profile"]["profile_completed"] is True
        assert "ROS2" in put_json["profile"]["skills"]

        # Fetch profile via GET /api/profile
        get_res = client.get("/api/profile")
        assert get_res.status_code == 200
        get_json = get_res.get_json()
        assert get_json["profile"]["bio"] == "Pioneering distributed neural networks and autonomous systems."
        assert len(get_json["profile"]["skills"]) == 4

    def test_unauthorized_profile_modification_blocked(self, client, db):
        """Verify client cannot tamper with or modify another user's profile."""
        # Create second user
        victim = User(
            full_name="Dr. Victim",
            email="victim@prayas.edu",
            role="faculty",
            department="Medicine"
        )
        victim.set_password("VictimPass123")
        db.session.add(victim)
        db.session.flush()

        victim_profile = ResearcherProfile(
            user_id=victim.id,
            bio="Original medical research."
        )
        db.session.add(victim_profile)
        db.session.commit()

        # Login as Sarah (student)
        client.post("/api/auth/login", json={
            "email": "sarah.connor@prayas.edu",
            "password": "SecurePassword123"
        })

        # Attempt to modify victim's profile by injecting user_id in the payload
        tamper_res = client.put("/api/profile", json={
            "user_id": victim.id,
            "bio": "Maliciously overwritten bio"
        })
        # Should be rejected with 403 Unauthorized
        assert tamper_res.status_code == 403
        assert "Unauthorized" in tamper_res.get_json()["error"]

        # Verify victim's bio was NOT modified in the database
        db.session.refresh(victim_profile)
        assert victim_profile.bio == "Original medical research."
