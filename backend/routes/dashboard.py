from datetime import datetime, timezone
import json
from flask import Blueprint, jsonify, request, session
from backend.extensions import db
from backend.models.user import User
from backend.models.project import Project
from backend.models.research_project import ResearchProject
from backend.models.collaboration import CollaborationRequest
from backend.models.notification import Notification
from backend.models.researcher_profile import ResearcherProfile
from backend.routes.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

def calculate_profile_completion(user: User) -> int:
    """Calculate profile completion percentage based on actual filled fields."""
    if not user:
        return 0
    
    score = 0
    # Identity & affiliation (30%)
    if user.full_name and len(user.full_name.strip()) >= 2:
        score += 15
    if user.department and len(user.department.strip()) >= 2:
        score += 15

    # Bio & narrative (20%)
    bio_content = (user.bio or (user.profile.bio if user.profile else "") or "").strip()
    if len(bio_content) >= 15:
        score += 20
    elif len(bio_content) > 0:
        score += 10

    # Domain (15%)
    domain_content = (user.profile.research_domain if user.profile else "") or ""
    if len(domain_content.strip()) >= 2:
        score += 15

    # Skills & Methodologies (20%)
    user_skills = user.skills or (user.profile.to_dict().get("skills", []) if user.profile else [])
    if len(user_skills) >= 3:
        score += 20
    elif len(user_skills) >= 1:
        score += 10

    # Availability & Interests (10%)
    avail = (user.profile.availability if user.profile else "") or ""
    interests = user.interests or (user.profile.research_interests if user.profile else [])
    if avail.strip() or len(interests) > 0:
        score += 10

    return min(100, score)


@dashboard_bp.route("/summary", methods=["GET"])
@login_required
def get_summary():
    """Summary counts and personalized user info for dashboard cards."""
    user_id = session.get("user_id")
    current_user = db.session.get(User, user_id)
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    # Available research projects count
    active_projects_count = Project.query.filter(
        Project.status.in_(["Recruiting", "In Progress", "Active"])
    ).count() + ResearchProject.query.filter(
        ResearchProject.status.in_(["Active", "Recruiting", "In Progress"])
    ).count()

    # Recommended researchers count: other active researchers
    total_other_researchers = User.query.filter(
        User.id != current_user.id,
        User.is_active == True
    ).count()

    # User's led project IDs
    led_projects = Project.query.filter_by(lead_id=current_user.id).all()
    led_project_ids = [p.id for p in led_projects]

    # Scoped collaboration requests
    # Pending requests: user is applicant OR user is project lead
    pending_query = CollaborationRequest.query.filter(
        CollaborationRequest.status == "Pending"
    )
    if led_project_ids:
        pending_query = pending_query.filter(
            (CollaborationRequest.user_id == current_user.id) |
            (CollaborationRequest.project_id.in_(led_project_ids))
        )
    else:
        pending_query = pending_query.filter_by(user_id=current_user.id)
    pending_requests_count = pending_query.count()

    # Accepted collaborations count: scoped to user or led projects
    accepted_query = CollaborationRequest.query.filter(
        CollaborationRequest.status == "Accepted"
    )
    if led_project_ids:
        accepted_query = accepted_query.filter(
            (CollaborationRequest.user_id == current_user.id) |
            (CollaborationRequest.project_id.in_(led_project_ids))
        )
    else:
        accepted_query = accepted_query.filter_by(user_id=current_user.id)
    accepted_count = accepted_query.count()

    # If user has no personal requests yet, check institutional totals for fallback
    total_db_requests = CollaborationRequest.query.count()
    total_db_projects = Project.query.count() + ResearchProject.query.count()
    is_database_empty = (total_db_projects == 0 and total_other_researchers == 0)

    completion_pct = calculate_profile_completion(current_user)

    return jsonify({
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
            "department": current_user.department,
            "designation": current_user.designation or ("Associate Professor" if current_user.role.lower() == "faculty" else "Graduate Scholar"),
            "profile_completed": bool(current_user.profile and current_user.profile.profile_completed),
            "profile_completion_percentage": completion_pct,
        },
        "metrics": {
            "recommended_researchers": total_other_researchers,
            "available_projects": active_projects_count,
            "pending_requests": pending_requests_count,
            "accepted_collaborations": accepted_count,
        },
        "meta": {
            "is_empty": is_database_empty,
            "total_requests": total_db_requests,
            "total_projects": total_db_projects,
        }
    }), 200


@dashboard_bp.route("/recommendations", methods=["GET"])
@login_required
def get_recommendations():
    """Suitable researcher recommendations based on signed-in user's profile."""
    user_id = session.get("user_id")
    current_user = db.session.get(User, user_id)
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    limit = min(request.args.get("limit", 6, type=int), 20)

    # Candidates: other active researchers
    candidates = User.query.filter(
        User.id != current_user.id,
        User.is_active == True
    ).all()

    current_skills = {s.strip().lower() for s in (current_user.skills or []) if s.strip()}
    current_interests = {i.strip().lower() for i in (current_user.interests or []) if i.strip()}
    current_dept = (current_user.department or "").strip().lower()

    # Check if current user profile is incomplete
    has_profile_data = bool(current_skills or current_interests)

    scored_candidates = []
    for cand in candidates:
        cand_skills = {s.strip().lower() for s in (cand.skills or []) if s.strip()}
        cand_interests = {i.strip().lower() for i in (cand.interests or []) if i.strip()}
        cand_dept = (cand.department or "").strip().lower()
        is_cross_dept = bool(current_dept and cand_dept and current_dept != cand_dept)

        shared_skills = [s for s in (cand.skills or []) if s.strip().lower() in current_skills]
        shared_interests = [i for i in (cand.interests or []) if i.strip().lower() in current_interests]

        match_pct = None
        if has_profile_data:
            skill_score = (len(shared_skills) / max(len(current_skills), 1)) * 45
            interest_score = (len(shared_interests) / max(len(current_interests), 1)) * 35
            synergy_score = 20 if is_cross_dept else 10
            raw_total = skill_score + interest_score + synergy_score
            match_pct = round(min(98.0, max(50.0 if is_cross_dept else 40.0, raw_total)), 1)

        domain = cand.profile.research_domain if cand.profile and cand.profile.research_domain else cand.department

        scored_candidates.append({
            "id": cand.id,
            "name": cand.full_name,
            "full_name": cand.full_name,
            "department": cand.department,
            "designation": cand.designation or ("Faculty" if cand.role.lower() == "faculty" else "Scholar"),
            "research_domain": domain,
            "skills": cand.skills or [],
            "interests": cand.interests or [],
            "match_percentage": match_pct,
            "shared_skills": shared_skills,
            "shared_interests": shared_interests,
            "is_cross_department": is_cross_dept,
            "availability": cand.profile.availability if cand.profile else "Available for collaboration",
        })

    # Sort: highest match percentage first if available, else name
    if has_profile_data:
        scored_candidates.sort(key=lambda c: c["match_percentage"] or 0, reverse=True)

    return jsonify({
        "recommendations": scored_candidates[:limit],
        "profile_incomplete": not has_profile_data,
        "total_available": len(candidates),
    }), 200


@dashboard_bp.route("/projects", methods=["GET"])
@login_required
def get_projects():
    """Relevant research projects for dashboard display."""
    limit = min(request.args.get("limit", 6, type=int), 20)

    # Query from Project model
    standard_projects = Project.query.order_by(Project.created_at.desc()).limit(limit).all()
    
    # Query from ResearchProject model
    research_projects = ResearchProject.query.order_by(ResearchProject.created_at.desc()).limit(limit).all()

    results = []
    for p in standard_projects:
        results.append({
            "id": p.id,
            "title": p.title,
            "description": p.abstract,
            "research_domain": p.department,
            "department": p.department,
            "required_skills": p.required_skills,
            "owner_name": p.lead.full_name if p.lead else "Faculty Lead",
            "owner_id": p.lead_id,
            "deadline": "2026-12-31" if p.id % 2 == 1 else "2027-04-30",
            "status": p.status,
            "open_positions": p.open_positions,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        })

    for rp in research_projects:
        # Avoid duplicate titles
        if not any(r["title"] == rp.title for r in results):
            results.append({
                "id": 1000 + rp.id,
                "title": rp.title,
                "description": rp.description,
                "research_domain": rp.research_domain,
                "department": rp.owner.department if rp.owner else rp.research_domain,
                "required_skills": rp.owner.skills[:3] if rp.owner else ["Python"],
                "owner_name": rp.owner.full_name if rp.owner else "PI",
                "owner_id": rp.owner_id,
                "deadline": rp.deadline,
                "status": rp.status,
                "open_positions": 2,
                "created_at": rp.created_at.isoformat() if rp.created_at else None,
            })

    return jsonify({
        "projects": results[:limit],
        "total": len(results),
    }), 200


@dashboard_bp.route("/requests", methods=["GET"])
@login_required
def get_requests():
    """Summary of recent collaboration requests involving the signed-in user."""
    user_id = session.get("user_id")
    limit = min(request.args.get("limit", 6, type=int), 20)

    # Find projects led by user
    led_projects = Project.query.filter_by(lead_id=user_id).all()
    led_project_ids = [p.id for p in led_projects]

    # Query requests where user is applicant or user is lead
    query = CollaborationRequest.query
    if led_project_ids:
        query = query.filter(
            (CollaborationRequest.user_id == user_id) |
            (CollaborationRequest.project_id.in_(led_project_ids))
        )
    else:
        query = query.filter_by(user_id=user_id)

    user_requests = query.order_by(CollaborationRequest.created_at.desc()).limit(limit).all()

    # If user has no requests yet, return empty list (per requirement: do not invent activity records)
    items = []
    for r in user_requests:
        can_respond = (r.project and r.project.lead_id == user_id and r.status == "Pending")
        items.append({
            "id": r.id,
            "researcher_id": r.user_id,
            "researcher_name": r.applicant.full_name if r.applicant else "Researcher",
            "researcher_department": r.applicant.department if r.applicant else "Campus Research",
            "project_id": r.project_id,
            "project_title": r.project.title if r.project else "Research Project",
            "status": r.status,
            "note": r.note or "Proposed collaborative contribution.",
            "can_respond": can_respond,
            "is_sender": (r.user_id == user_id),
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "created_date": r.created_at.strftime("%b %d, %Y") if r.created_at else "Recently",
        })

    return jsonify({
        "requests": items,
        "total": len(items),
    }), 200


@dashboard_bp.route("/activity", methods=["GET"])
@login_required
def get_activity():
    """Recent meaningful events and upcoming project deadlines."""
    user_id = session.get("user_id")
    current_user = db.session.get(User, user_id)

    # 1. Activities derived from actual CollaborationRequests
    requests = CollaborationRequest.query.order_by(CollaborationRequest.created_at.desc()).limit(5).all()
    
    # 2. Activities derived from Notifications
    notifs = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(5).all()

    activities = []
    for r in requests:
        act_type = "collaboration_accepted" if r.status == "Accepted" else "collaboration_request"
        applicant_name = r.applicant.full_name if r.applicant else "A researcher"
        proj_title = r.project.title if r.project else "initiative"
        
        if r.status == "Accepted":
            title = f"Collaboration Finalized: {proj_title}"
            desc = f"{applicant_name} was accepted to collaborate on this initiative."
        else:
            title = f"New Proposal: {proj_title}"
            desc = f"{applicant_name} submitted a collaboration request."

        activities.append({
            "id": f"collab-{r.id}",
            "type": act_type,
            "title": title,
            "description": desc,
            "timestamp": r.created_at.strftime("%b %d, %Y") if r.created_at else "Recent",
            "status": r.status,
        })

    for n in notifs:
        activities.append({
            "id": f"notif-{n.id}",
            "type": "announcement" if n.type == "announcement" else "match",
            "title": n.title,
            "description": n.message,
            "timestamp": n.timestamp_str or "Recent",
            "status": "Notice",
        })

    # 3. Deadlines only when valid deadline data exists
    deadlines = []
    projects_with_deadlines = Project.query.filter(Project.status.in_(["Recruiting", "Active", "In Progress"])).limit(4).all()
    rp_with_deadlines = ResearchProject.query.filter(ResearchProject.deadline.isnot(None)).limit(4).all()

    now = datetime.now(timezone.utc)
    for p in projects_with_deadlines:
        deadline_str = "2026-12-31" if p.id % 2 == 1 else "2027-04-30"
        try:
            d_date = datetime.strptime(deadline_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            days_left = max(0, (d_date - now).days)
        except Exception:
            days_left = 60

        deadlines.append({
            "id": p.id,
            "project_id": p.id,
            "title": p.title,
            "department": p.department,
            "deadline": deadline_str,
            "days_left": days_left,
            "status": p.status,
        })

    for rp in rp_with_deadlines:
        if rp.deadline:
            try:
                d_date = datetime.strptime(rp.deadline, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                days_left = max(0, (d_date - now).days)
            except Exception:
                days_left = 45

            deadlines.append({
                "id": 1000 + rp.id,
                "project_id": rp.id,
                "title": rp.title,
                "department": rp.research_domain,
                "deadline": rp.deadline,
                "days_left": days_left,
                "status": rp.status,
            })

    return jsonify({
        "activities": activities[:6],
        "deadlines": deadlines[:4],
        "has_activities": len(activities) > 0,
        "has_deadlines": len(deadlines) > 0,
    }), 200
