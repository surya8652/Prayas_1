from flask import Blueprint, jsonify, request
from backend.models.project import Project
from backend.models.user import User
from backend.services.matching_service import ExplainableMatchingService

matching_bp = Blueprint("matching", __name__, url_prefix="/api/matching")

@matching_bp.route("/project/<int:project_id>", methods=["GET"])
def match_project_candidates(project_id):
    project = Project.query.get_or_404(project_id)
    candidates = User.query.all()
    results = ExplainableMatchingService.match_researchers_for_project(project, candidates)
    return jsonify({
        "project": project.to_dict(),
        "total_candidates_analyzed": len(candidates),
        "matches": results
    }), 200
