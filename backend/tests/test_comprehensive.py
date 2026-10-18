"""
Comprehensive PRAYAS API test suite.
Tests all REST endpoints: researchers, projects, collaborations,
matching, notifications, admin, auth, and the design system.
Uses session-scoped fixtures from conftest.py.
"""
import pytest


# ──────────────────────────────────────────────
# Health & Root
# ──────────────────────────────────────────────

class TestHealthAndRoot:
    def test_health_ok(self, client):
        res = client.get("/api/health")
        assert res.status_code == 200
        data = res.get_json()
        assert data["status"] == "healthy"
        assert data["service"] == "prayas-backend"

    def test_root_endpoint(self, client):
        res = client.get("/")
        assert res.status_code == 200
        data = res.get_json()
        assert data["name"] == "PRAYAS Backend API"
        assert "endpoints" in data
        assert "/api/researchers" in data["endpoints"]


# ──────────────────────────────────────────────
# Researchers
# ──────────────────────────────────────────────

class TestResearchers:
    def test_list_researchers_returns_all(self, client):
        res = client.get("/api/researchers")
        assert res.status_code == 200
        data = res.get_json()
        assert isinstance(data, list)
        assert len(data) >= 3  # seeded 3 researchers

    def test_researcher_has_expected_fields(self, client):
        res = client.get("/api/researchers")
        r = res.get_json()[0]
        for field in ("id", "name", "email", "role", "department", "skills", "interests"):
            assert field in r, f"Missing field: {field}"

    def test_filter_by_department(self, client):
        res = client.get("/api/researchers?department=Computer+Science")
        assert res.status_code == 200
        data = res.get_json()
        assert all("Computer Science" in r["department"] for r in data)

    def test_filter_by_role(self, client):
        res = client.get("/api/researchers?role=Student")
        assert res.status_code == 200
        data = res.get_json()
        assert all(r["role"] == "Student" for r in data)
        assert len(data) >= 1

    def test_get_single_researcher(self, client):
        # Get first researcher id from list
        researchers = client.get("/api/researchers").get_json()
        rid = researchers[0]["id"]
        res = client.get(f"/api/researchers/{rid}")
        assert res.status_code == 200
        data = res.get_json()
        assert data["id"] == rid

    def test_get_nonexistent_researcher_returns_404(self, client):
        res = client.get("/api/researchers/99999")
        assert res.status_code == 404

    def test_create_researcher(self, client):
        payload = {
            "name": "Dr. New Researcher",
            "email": "newresearcher@test.prayas.edu",
            "department": "Physics",
            "role": "Faculty",
            "designation": "Lecturer",
            "bio": "Quantum computing expert.",
            "skills": ["Python", "Qiskit"],
            "interests": ["Quantum Computing", "Cryptography"],
        }
        res = client.post("/api/researchers", json=payload)
        assert res.status_code == 201
        data = res.get_json()
        assert data["name"] == "Dr. New Researcher"
        assert data["email"] == "newresearcher@test.prayas.edu"
        assert "Python" in data["skills"]

    def test_create_researcher_missing_required_field(self, client):
        res = client.post("/api/researchers", json={"name": "Incomplete"})
        assert res.status_code == 400
        assert "error" in res.get_json()


# ──────────────────────────────────────────────
# Projects
# ──────────────────────────────────────────────

class TestProjects:
    def test_list_projects(self, client):
        res = client.get("/api/projects")
        assert res.status_code == 200
        data = res.get_json()
        assert isinstance(data, list)
        assert len(data) >= 2

    def test_project_has_expected_fields(self, client):
        res = client.get("/api/projects")
        p = res.get_json()[0]
        for field in ("id", "title", "abstract", "department", "lead_id",
                      "status", "tags", "required_skills", "open_positions"):
            assert field in p, f"Missing field: {field}"

    def test_filter_projects_by_status(self, client):
        res = client.get("/api/projects?status=Recruiting")
        assert res.status_code == 200
        data = res.get_json()
        assert all(p["status"] == "Recruiting" for p in data)
        assert len(data) >= 2

    def test_filter_projects_by_department(self, client):
        res = client.get("/api/projects?department=Biotechnology")
        assert res.status_code == 200
        data = res.get_json()
        assert all("Biotechnology" in p["department"] for p in data)

    def test_get_single_project(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/projects/{pid}")
        assert res.status_code == 200
        assert res.get_json()["id"] == pid

    def test_get_nonexistent_project_returns_404(self, client):
        res = client.get("/api/projects/99999")
        assert res.status_code == 404

    def test_create_project(self, client):
        researchers = client.get("/api/researchers").get_json()
        lead_id = researchers[0]["id"]
        payload = {
            "title": "Quantum Error Correction for Distributed AI",
            "abstract": "Applying quantum error correction codes to distributed ML training pipelines.",
            "department": "Physics",
            "lead_id": lead_id,
            "status": "Recruiting",
            "open_positions": 2,
            "tags": ["Quantum Computing", "AI", "Distributed Systems"],
            "required_skills": ["Python", "Qiskit", "PyTorch"],
        }
        res = client.post("/api/projects", json=payload)
        assert res.status_code == 201
        data = res.get_json()
        assert data["title"] == "Quantum Error Correction for Distributed AI"
        assert data["lead_id"] == lead_id
        assert "Quantum Computing" in data["tags"]

    def test_create_project_with_invalid_lead_id(self, client):
        res = client.post("/api/projects", json={
            "title": "Test Project",
            "abstract": "Abstract",
            "department": "Physics",
            "lead_id": 99999,
        })
        assert res.status_code == 404

    def test_create_project_missing_fields(self, client):
        res = client.post("/api/projects", json={"title": "Incomplete"})
        assert res.status_code == 400


# ──────────────────────────────────────────────
# Collaborations
# ──────────────────────────────────────────────

class TestCollaborations:
    def test_list_collaborations(self, client):
        res = client.get("/api/collaborations")
        assert res.status_code == 200
        data = res.get_json()
        assert isinstance(data, list)
        assert len(data) >= 2

    def test_collaboration_has_expected_fields(self, client):
        res = client.get("/api/collaborations")
        c = res.get_json()[0]
        for field in ("id", "project_id", "user_id", "status", "note"):
            assert field in c, f"Missing field: {field}"

    def test_filter_collaborations_by_project(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/collaborations?project_id={pid}")
        assert res.status_code == 200
        data = res.get_json()
        assert all(c["project_id"] == pid for c in data)

    def test_filter_collaborations_by_user(self, client):
        researchers = client.get("/api/researchers").get_json()
        uid = researchers[0]["id"]
        res = client.get(f"/api/collaborations?user_id={uid}")
        assert res.status_code == 200
        data = res.get_json()
        assert all(c["user_id"] == uid for c in data)

    def test_create_collaboration_request(self, client):
        projects = client.get("/api/projects").get_json()
        researchers = client.get("/api/researchers").get_json()

        # Use a researcher who is NOT the project lead
        pid = projects[0]["id"]
        lead_id = projects[0]["lead_id"]
        applicant = next(r for r in researchers if r["id"] != lead_id)

        # Clean up any existing request first
        existing = client.get(f"/api/collaborations?project_id={pid}&user_id={applicant['id']}").get_json()
        if not existing:
            res = client.post("/api/collaborations", json={
                "project_id": pid,
                "user_id": applicant["id"],
                "note": "Happy to bring cross-disciplinary expertise.",
            })
            assert res.status_code in (201, 409)  # 409 if already seeded

    def test_create_duplicate_collaboration_returns_409(self, client):
        # The seeded data already has a collaboration between u1 and p1
        collabs = client.get("/api/collaborations").get_json()
        c = collabs[0]
        res = client.post("/api/collaborations", json={
            "project_id": c["project_id"],
            "user_id": c["user_id"],
            "note": "Duplicate attempt.",
        })
        assert res.status_code == 409

    def test_update_collaboration_status_to_accepted(self, client):
        collabs = client.get("/api/collaborations").get_json()
        pending = next((c for c in collabs if c["status"] == "Pending"), None)
        assert pending is not None, "No pending collaboration found in seeded data"
        res = client.put(f"/api/collaborations/{pending['id']}/status", json={"status": "Accepted"})
        assert res.status_code == 200
        assert res.get_json()["status"] == "Accepted"

    def test_update_collaboration_invalid_status(self, client):
        collabs = client.get("/api/collaborations").get_json()
        cid = collabs[0]["id"]
        res = client.put(f"/api/collaborations/{cid}/status", json={"status": "Unknown"})
        assert res.status_code == 400

    def test_update_nonexistent_collaboration_returns_404(self, client):
        res = client.put("/api/collaborations/99999/status", json={"status": "Accepted"})
        assert res.status_code == 404


# ──────────────────────────────────────────────
# Matching Engine
# ──────────────────────────────────────────────

class TestMatchingEngine:
    def test_match_project_endpoint_returns_matches(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/matching/project/{pid}")
        assert res.status_code == 200
        data = res.get_json()
        assert "matches" in data
        assert "project" in data
        assert "total_candidates_analyzed" in data
        assert isinstance(data["matches"], list)

    def test_match_project_excludes_lead(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        lead_id = projects[0]["lead_id"]
        res = client.get(f"/api/matching/project/{pid}")
        matches = res.get_json()["matches"]
        matched_ids = [m["researcher"]["id"] for m in matches]
        assert lead_id not in matched_ids

    def test_match_score_is_in_valid_range(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/matching/project/{pid}")
        for m in res.get_json()["matches"]:
            assert 0 <= m["score"] <= 100

    def test_match_breakdown_fields_present(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/matching/project/{pid}")
        for m in res.get_json()["matches"]:
            bd = m["breakdown"]
            for key in ("skill_score", "interest_score", "synergy_score"):
                assert key in bd

    def test_match_results_sorted_descending(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/matching/project/{pid}")
        scores = [m["score"] for m in res.get_json()["matches"]]
        assert scores == sorted(scores, reverse=True)

    def test_match_nonexistent_project_returns_404(self, client):
        res = client.get("/api/matching/project/99999")
        assert res.status_code == 404

    def test_match_explanation_is_non_empty_string(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        res = client.get(f"/api/matching/project/{pid}")
        for m in res.get_json()["matches"]:
            assert isinstance(m["explanation"], str)
            assert len(m["explanation"]) > 0

    def test_cross_department_flag(self, client):
        projects = client.get("/api/projects").get_json()
        pid = projects[0]["id"]
        proj_dept = projects[0]["department"]
        res = client.get(f"/api/matching/project/{pid}")
        for m in res.get_json()["matches"]:
            is_cross = m["researcher"]["department"].lower() != proj_dept.lower()
            assert m["is_cross_department"] == is_cross


# ──────────────────────────────────────────────
# Notifications
# ──────────────────────────────────────────────

class TestNotifications:
    def test_list_notifications(self, client):
        res = client.get("/api/notifications")
        assert res.status_code == 200
        data = res.get_json()
        assert isinstance(data, list)

    def test_create_notification(self, client):
        researchers = client.get("/api/researchers").get_json()
        uid = researchers[0]["id"]
        res = client.post("/api/notifications", json={
            "user_id": uid,
            "title": "Funding Alert",
            "message": "A $500K SERB grant call is now open for AI-Biotech projects.",
            "type": "announcement",
        })
        assert res.status_code == 201
        data = res.get_json()
        assert data["title"] == "Funding Alert"
        assert data["read"] is False

    def test_create_notification_missing_fields(self, client):
        res = client.post("/api/notifications", json={"title": "Missing message"})
        assert res.status_code == 400

    def test_mark_single_notification_read(self, client):
        # Create a fresh unread notification and mark it read.
        # Note: response 'id' is 'notif-{int}' (string prefix) but route expects
        # an integer PK; use the 'db_id' field returned alongside.
        res_create = client.post("/api/notifications", json={
            "title": "Temp Read Test",
            "message": "Temporary notification for individual read test.",
            "type": "system",
        })
        assert res_create.status_code == 201
        db_id = res_create.get_json()["db_id"]  # integer PK
        res = client.put(f"/api/notifications/{db_id}/read")
        assert res.status_code == 200
        assert res.get_json()["read"] is True

    def test_mark_single_nonexistent_notification_returns_404(self, client):
        res = client.put("/api/notifications/99999/read")
        assert res.status_code == 404

    def test_mark_all_notifications_read(self, client):
        res = client.post("/api/notifications/mark-all-read")
        assert res.status_code == 200
        data = res.get_json()
        assert data["success"] is True


# ──────────────────────────────────────────────
# Admin
# ──────────────────────────────────────────────

class TestAdmin:
    def test_admin_overview_structure(self, client):
        res = client.get("/api/admin/overview")
        assert res.status_code == 200
        data = res.get_json()
        assert "metrics" in data
        assert "departments" in data
        assert "synergy_matrix" in data
        assert "institutional_health" in data

    def test_admin_overview_metrics_fields(self, client):
        data = client.get("/api/admin/overview").get_json()
        metrics = data["metrics"]
        for field in ("active_researchers", "active_projects", "open_positions",
                      "synergy_rate", "total_collaborations"):
            assert field in metrics, f"Missing metric: {field}"

    def test_admin_overview_counts_match_db(self, client):
        data = client.get("/api/admin/overview").get_json()
        researchers = client.get("/api/researchers").get_json()
        projects = client.get("/api/projects").get_json()
        assert data["metrics"]["active_researchers"] == len(researchers)
        assert data["metrics"]["active_projects"] == len(projects)

    def test_admin_verifications_list(self, client):
        res = client.get("/api/admin/verifications")
        assert res.status_code == 200
        data = res.get_json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_admin_approve_verification(self, client):
        verifications = client.get("/api/admin/verifications").get_json()
        pending = next((v for v in verifications if "Pending" in v["status"]), None)
        if pending:
            res = client.post(f"/api/admin/verifications/{pending['id']}/approve")
            assert res.status_code == 200
            assert res.get_json()["success"] is True

    def test_admin_approve_nonexistent_verification(self, client):
        res = client.post("/api/admin/verifications/99999/approve")
        assert res.status_code == 404

    def test_admin_broadcast_announcement(self, client):
        res = client.post("/api/admin/announcements", json={
            "title": "PRAYAS Annual Research Symposium",
            "message": "Registration is now open for the 2026 interdisciplinary research symposium.",
        })
        assert res.status_code == 201
        data = res.get_json()
        assert data["success"] is True
        assert "notification" in data


# ──────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────

class TestAuth:
    def test_login_with_existing_email(self, client):
        res = client.post("/api/auth/login", json={
            "email": "alice@test.prayas.edu",
            "role": "Faculty",
        })
        assert res.status_code == 200
        data = res.get_json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == "alice@test.prayas.edu"

    def test_login_with_unknown_email_returns_first_user(self, client):
        res = client.post("/api/auth/login", json={
            "email": "unknown@prayas.edu",
            "role": "Faculty",
        })
        assert res.status_code == 200
        data = res.get_json()
        assert "token" in data
        assert "user" in data

    def test_login_token_format(self, client):
        res = client.post("/api/auth/login", json={"email": "alice@test.prayas.edu"})
        token = res.get_json()["token"]
        assert token.startswith("prayas_token_")

    def test_current_user_endpoint(self, client):
        res = client.get("/api/auth/current-user")
        assert res.status_code == 200
        data = res.get_json()
        assert "id" in data
        assert "name" in data
        assert "email" in data


# ──────────────────────────────────────────────
# Design System
# ──────────────────────────────────────────────

class TestDesignSystem:
    def test_design_system_returns_tokens(self, client):
        res = client.get("/api/design-system")
        assert res.status_code == 200
        data = res.get_json()
        assert "tokens" in data
        assert "colors" in data["tokens"]

    def test_design_system_primary_color_token(self, client):
        data = client.get("/api/design-system").get_json()
        primary_text = data["tokens"]["colors"]["primary_text"]
        assert primary_text["hex"] == "#0F172A"
        # Design system uses 'label' as the descriptive name field
        assert "label" in primary_text

    def test_design_system_has_typography_tokens(self, client):
        data = client.get("/api/design-system").get_json()
        tokens = data["tokens"]
        assert "typography" in tokens

    def test_design_system_has_radii_tokens(self, client):
        data = client.get("/api/design-system").get_json()
        tokens = data["tokens"]
        # Design system exposes radii (border radii for cards, buttons, etc.)
        assert "radii" in tokens


# ──────────────────────────────────────────────
# Matching Service Unit Tests (no HTTP)
# ──────────────────────────────────────────────

class TestMatchingServiceUnit:
    """Pure unit tests for the ExplainableMatchingService, no database needed."""

    def _make_user(self, uid, dept, skills, interests):
        from backend.models.user import User
        u = User(id=uid, name=f"User{uid}", email=f"u{uid}@test.edu", department=dept)
        u.skills = skills
        u.interests = interests
        return u

    def _make_project(self, pid, dept, lead_id, skills, tags):
        from backend.models.project import Project
        p = Project(id=pid, title="Test", abstract="Abstract", department=dept, lead_id=lead_id)
        p.required_skills = skills
        p.tags = tags
        return p

    def test_lead_is_excluded_from_matches(self):
        from backend.services.matching_service import ExplainableMatchingService
        lead = self._make_user(1, "CS", ["Python"], ["AI"])
        other = self._make_user(2, "Biology", ["Python"], ["AI"])
        proj = self._make_project(10, "CS", 1, ["Python"], ["AI"])
        matches = ExplainableMatchingService.match_researchers_for_project(proj, [lead, other])
        ids = [m["researcher"]["id"] for m in matches]
        assert 1 not in ids
        assert 2 in ids

    def test_perfect_skill_match_gets_max_skill_score(self):
        from backend.services.matching_service import ExplainableMatchingService
        lead = self._make_user(1, "CS", [], [])
        candidate = self._make_user(2, "Bio", ["Python", "PyTorch"], ["Genomics"])
        proj = self._make_project(10, "CS", 1, ["Python", "PyTorch"], ["Genomics"])
        matches = ExplainableMatchingService.match_researchers_for_project(proj, [lead, candidate])
        assert len(matches) == 1
        assert matches[0]["breakdown"]["skill_score"] == 45.0

    def test_cross_department_bonus(self):
        from backend.services.matching_service import ExplainableMatchingService
        lead = self._make_user(1, "CS", [], [])
        same_dept = self._make_user(2, "CS", ["Python"], ["AI"])
        cross_dept = self._make_user(3, "Biology", ["Python"], ["AI"])
        proj = self._make_project(10, "CS", 1, ["Python"], ["AI"])
        matches = ExplainableMatchingService.match_researchers_for_project(proj, [lead, same_dept, cross_dept])
        same = next(m for m in matches if m["researcher"]["id"] == 2)
        cross = next(m for m in matches if m["researcher"]["id"] == 3)
        assert cross["breakdown"]["synergy_score"] == 20
        assert same["breakdown"]["synergy_score"] == 12
        assert cross["is_cross_department"] is True
        assert same["is_cross_department"] is False

    def test_results_sorted_descending_by_score(self):
        from backend.services.matching_service import ExplainableMatchingService
        lead = self._make_user(1, "CS", [], [])
        u2 = self._make_user(2, "Bio", ["Python", "PyTorch", "NLP"], ["Genomics", "AI"])
        u3 = self._make_user(3, "Physics", ["MATLAB"], ["Optics"])
        proj = self._make_project(10, "CS", 1, ["Python", "PyTorch", "NLP"], ["Genomics", "AI"])
        matches = ExplainableMatchingService.match_researchers_for_project(proj, [lead, u2, u3])
        scores = [m["score"] for m in matches]
        assert scores == sorted(scores, reverse=True)

    def test_no_match_returns_general_explanation(self):
        from backend.services.matching_service import ExplainableMatchingService
        lead = self._make_user(1, "CS", [], [])
        candidate = self._make_user(2, "CS", [], [])
        proj = self._make_project(10, "CS", 1, ["Python"], ["AI"])
        matches = ExplainableMatchingService.match_researchers_for_project(proj, [lead, candidate])
        assert len(matches) == 1
        explanation = matches[0]["explanation"]
        assert len(explanation) > 0

    def test_empty_candidates_returns_empty_list(self):
        from backend.services.matching_service import ExplainableMatchingService
        lead = self._make_user(1, "CS", ["Python"], ["AI"])
        proj = self._make_project(10, "CS", 1, ["Python"], ["AI"])
        matches = ExplainableMatchingService.match_researchers_for_project(proj, [lead])
        assert matches == []
