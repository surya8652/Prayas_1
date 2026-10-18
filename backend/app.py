import os
from flask import Flask, jsonify
from backend.config import config_by_name
from backend.extensions import db, cors
from backend.routes import (
    researchers_bp,
    projects_bp,
    collaborations_bp,
    matching_bp,
    notifications_bp,
    admin_bp,
    auth_bp,
    profile_bp,
    dashboard_bp,
    design_system_bp,
)
from backend.models.user import User
from backend.models.researcher_profile import ResearcherProfile
from backend.models.skill import Skill
from backend.models.research_project import ResearchProject
from backend.models.project import Project
from backend.models.collaboration import CollaborationRequest
from backend.models.notification import Notification

def seed_initial_data():
    """Seed prototype data safely if database is fresh."""
    if User.query.first():
        return

    # Seed demo researchers across diverse departments
    r1 = User(
        name="Dr. Aris Thorne",
        email="aris.thorne@prayas.edu",
        role="Faculty",
        department="Computer Science & Engineering",
        designation="Associate Professor",
        bio="Specializes in explainable artificial intelligence, NLP, and multimodal biomedical knowledge graphs.",
        is_active=True
    )
    r1.set_password("password")
    r1.interests = ["Natural Language Processing", "Knowledge Graphs", "Healthcare AI", "Deep Learning"]
    r1.skills = ["Python", "PyTorch", "Transformers", "Knowledge Representation", "SPARQL"]

    r2 = User(
        name="Dr. Kavita Raman",
        email="kavita.raman@prayas.edu",
        role="Faculty",
        department="Biotechnology & Biomedical Engineering",
        designation="Professor & Department Chair",
        bio="Pioneering research in genomic data analytics, targeted drug discovery, and clinical trials modeling.",
        is_active=True
    )
    r2.set_password("password")
    r2.interests = ["Genomics", "Targeted Therapeutics", "Computational Biology", "Bioinformatics"]
    r2.skills = ["Bioinformatics", "R", "Statistical Genomics", "Python", "Molecular Modeling"]

    r3 = User(
        name="Devansh Mehta",
        email="devansh.m@prayas.edu",
        role="Researcher",
        department="Data Science & AI",
        designation="Lead Research Fellow",
        bio="Focuses on distributed machine learning systems, privacy-preserving federated algorithms, and edge AI.",
        is_active=True
    )
    r3.set_password("password")
    r3.interests = ["Federated Learning", "Edge Computing", "Data Security", "Optimization"]
    r3.skills = ["Python", "C++", "Distributed Systems", "PyTorch", "Docker"]

    r4 = User(
        name="Ananya Sen",
        email="ananya.sen@prayas.edu",
        role="Student",
        department="Electronics & Communication",
        designation="Master's Scholar",
        bio="Exploring IoT sensor networks for environmental monitoring, smart grids, and signal processing.",
        is_active=True
    )
    r4.set_password("password")
    r4.interests = ["IoT Sensors", "Signal Processing", "Smart Agriculture", "Embedded Systems"]
    r4.skills = ["Embedded C", "Python", "Signal Processing", "MATLAB", "Sensor Fusion"]

    r5 = User(
        name="Dr. Marcus Vance",
        email="marcus.vance@prayas.edu",
        role="Faculty",
        department="Mechanical & Aerospace Engineering",
        designation="Assistant Professor",
        bio="Researching bio-inspired autonomous robotic systems and cooperative multi-agent dynamics.",
        is_active=True
    )
    r5.set_password("password")
    r5.interests = ["Autonomous Robotics", "Control Theory", "Kinematics", "Edge AI"]
    r5.skills = ["Python", "ROS2", "C++", "Embedded C", "Optimization"]

    db.session.add_all([r1, r2, r3, r4, r5])
    db.session.flush()

    # Create researcher profiles and skills
    all_skill_names = set()
    for u in [r1, r2, r3, r4, r5]:
        for s in u.skills:
            all_skill_names.add(s)

    skill_map = {}
    for s_name in sorted(all_skill_names):
        sk = Skill(name=s_name)
        db.session.add(sk)
        skill_map[s_name] = sk
    db.session.flush()

    # Link profiles
    prof1 = ResearcherProfile(
        user_id=r1.id,
        bio=r1.bio,
        research_domain="Artificial Intelligence & NLP",
        availability="Available for co-supervision and joint grants",
        profile_completed=True
    )
    prof1.research_interests = r1.interests
    prof1.skills = [skill_map[s] for s in r1.skills if s in skill_map]

    prof2 = ResearcherProfile(
        user_id=r2.id,
        bio=r2.bio,
        research_domain="Computational Biology & Genomics",
        availability="Open to PhD students and international consortia",
        profile_completed=True
    )
    prof2.research_interests = r2.interests
    prof2.skills = [skill_map[s] for s in r2.skills if s in skill_map]

    prof3 = ResearcherProfile(
        user_id=r3.id,
        bio=r3.bio,
        research_domain="Distributed AI Systems",
        availability="20 hrs/week for collaborative research",
        profile_completed=True
    )
    prof3.research_interests = r3.interests
    prof3.skills = [skill_map[s] for s in r3.skills if s in skill_map]

    prof4 = ResearcherProfile(
        user_id=r4.id,
        bio=r4.bio,
        research_domain="IoT & Embedded Hardware",
        availability="Seeking thesis co-mentor",
        profile_completed=True
    )
    prof4.research_interests = r4.interests
    prof4.skills = [skill_map[s] for s in r4.skills if s in skill_map]

    prof5 = ResearcherProfile(
        user_id=r5.id,
        bio=r5.bio,
        research_domain="Robotics & Autonomous Navigation",
        availability="Recruiting postdocs and interns",
        profile_completed=True
    )
    prof5.research_interests = r5.interests
    prof5.skills = [skill_map[s] for s in r5.skills if s in skill_map]

    db.session.add_all([prof1, prof2, prof3, prof4, prof5])
    db.session.commit()

    # Seed demo projects
    p1 = Project(
        title="Interdisciplinary Genomic Pattern Mining using Deep Multimodal Graphs",
        abstract="This initiative connects deep language models and graph neural networks with high-throughput genomic sequencing data to identify therapeutic targets for rare genetic mutations.",
        department="Biotechnology & Biomedical Engineering",
        lead_id=r2.id,
        status="Recruiting",
        open_positions=2
    )
    p1.tags = ["Genomics", "Healthcare AI", "Deep Learning", "Computational Biology"]
    p1.required_skills = ["Python", "PyTorch", "Bioinformatics", "Transformers"]

    p2 = Project(
        title="Privacy-Preserving Collaborative Learning for Cross-Department Health Data",
        abstract="Developing federated learning protocols enabling secure collaborative inference between academic medical centers without raw data exposure.",
        department="Computer Science & Engineering",
        lead_id=r1.id,
        status="Recruiting",
        open_positions=3
    )
    p2.tags = ["Federated Learning", "Data Security", "Distributed Systems", "Optimization"]
    p2.required_skills = ["Python", "Distributed Systems", "PyTorch", "Docker"]

    p3 = Project(
        title="Low-Power Autonomous Edge Sensing Nodes for Ecological Field Stations",
        abstract="Deploying energy-harvesting mesh networks for continuous real-time biodiversity and microclimate observation across forestry reserves.",
        department="Electronics & Communication",
        lead_id=r4.id,
        status="In Progress",
        open_positions=1
    )
    p3.tags = ["IoT Sensors", "Smart Agriculture", "Signal Processing"]
    p3.required_skills = ["Embedded C", "Sensor Fusion", "Python"]

    p4 = Project(
        title="Robotic Surgical Teleoperation with Tactile Haptic Feedback and Edge AI",
        abstract="Engineering low-latency force-feedback actuators paired with neural predictive filtering to assist surgeons in minimally invasive interventions.",
        department="Mechanical & Aerospace Engineering",
        lead_id=r5.id,
        status="Recruiting",
        open_positions=2
    )
    p4.tags = ["Autonomous Robotics", "Control Theory", "Healthcare AI", "Edge AI"]
    p4.required_skills = ["C++", "ROS2", "Python", "Optimization"]

    db.session.add_all([p1, p2, p3, p4])

    # Seed ResearchProject model instances
    rp1 = ResearchProject(
        title="Deep Multimodal Graphs for Genomic Therapeutics",
        description="High-throughput sequencing analysis powered by transformer graph networks for precision targeted medicine.",
        owner_id=r2.id,
        research_domain="Computational Biology",
        status="Active",
        deadline="2026-12-31"
    )
    rp2 = ResearchProject(
        title="Decentralized Privacy-Preserving Health Analytics",
        description="Multi-institutional federated learning without central raw data aggregation.",
        owner_id=r1.id,
        research_domain="Computer Science",
        status="Active",
        deadline="2027-04-30"
    )
    db.session.add_all([rp1, rp2])
    db.session.commit()

    # Seed collaboration requests
    c1 = CollaborationRequest(
        project_id=p1.id,
        user_id=r1.id,
        note="Excited to offer NLP and knowledge graph integration for genomic variant mapping.",
        status="Accepted"
    )
    c2 = CollaborationRequest(
        project_id=p2.id,
        user_id=r3.id,
        note="I have extensive experience with federated aggregation models and Docker orchestration.",
        status="Pending"
    )
    c3 = CollaborationRequest(
        project_id=p4.id,
        user_id=r4.id,
        note="Can contribute low-latency sensor fusion telemetry from embedded nodes.",
        status="Pending"
    )
    db.session.add_all([c1, c2, c3])

    # Seed notifications
    n1 = Notification(
        user_id=r1.id,
        title="New Interdisciplinary Match",
        message="Dr. Kavita Raman's Genomic project matches your expertise in Transformers & PyTorch (92% match score).",
        type="match",
        timestamp_str="10 mins ago",
        read=False
    )
    n2 = Notification(
        user_id=r1.id,
        title="Collaboration Proposal Received",
        message="Devansh Mehta requested to join 'Privacy-Preserving Collaborative Learning'.",
        type="collab",
        timestamp_str="2 hours ago",
        read=False
    )
    n3 = Notification(
        user_id=r1.id,
        title="Institutional Grant Call",
        message="Office of Sponsored Research announced $1.2M seed grants for cross-departmental AI-Biotech projects.",
        type="announcement",
        timestamp_str="1 day ago",
        read=True
    )
    db.session.add_all([n1, n2, n3])
    db.session.commit()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "default")

    app = Flask(__name__)
    config_class = config_by_name.get(config_name, config_by_name["default"])
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS")}},
        supports_credentials=True
    )

    # Register blueprints
    app.register_blueprint(researchers_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(collaborations_bp)
    app.register_blueprint(matching_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(design_system_bp)

    @app.route("/")
    def index():
        return jsonify({
            "name": "PRAYAS Backend API",
            "tagline": "Academic Research Collaboration Platform",
            "version": "1.0.0",
            "status": "operational",
            "endpoints": [
                "/api/researchers",
                "/api/projects",
                "/api/collaborations",
                "/api/matching/project/<id>",
                "/api/notifications",
                "/api/admin/overview",
                "/api/auth/register",
                "/api/auth/login",
                "/api/auth/logout",
                "/api/auth/me",
                "/api/profile",
                "/api/design-system"
            ]
        }), 200

    @app.route("/api/health")
    def health():
        return jsonify({"status": "healthy", "service": "prayas-backend"}), 200

    with app.app_context():
        db.create_all()
        seed_initial_data()

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=app.config.get("DEBUG", True))
