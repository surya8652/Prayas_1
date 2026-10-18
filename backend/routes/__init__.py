from backend.routes.researchers import researchers_bp
from backend.routes.projects import projects_bp
from backend.routes.collaborations import collaborations_bp
from backend.routes.matching import matching_bp
from backend.routes.notifications import notifications_bp
from backend.routes.admin import admin_bp
from backend.routes.auth import auth_bp
from backend.routes.profile import profile_bp
from backend.routes.dashboard import dashboard_bp
from backend.routes.design_system import design_system_bp

__all__ = [
    "researchers_bp",
    "projects_bp",
    "collaborations_bp",
    "matching_bp",
    "notifications_bp",
    "admin_bp",
    "auth_bp",
    "profile_bp",
    "dashboard_bp",
    "design_system_bp",
]
