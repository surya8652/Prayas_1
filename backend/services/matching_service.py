from typing import List, Dict, Any
from backend.models.user import User
from backend.models.project import Project

class ExplainableMatchingService:
    """
    Explainable researcher and project matching engine.
    Calculates transparent scores and provides human-readable explanations.
    """

    @staticmethod
    def _normalize(words: List[str]) -> set:
        return {w.strip().lower() for w in words if w and w.strip()}

    @classmethod
    def match_researchers_for_project(cls, project: Project, candidates: List[User]) -> List[Dict[str, Any]]:
        results = []
        required_skills = cls._normalize(project.required_skills)
        project_tags = cls._normalize(project.tags)

        for user in candidates:
            # Skip project lead from candidates
            if user.id == project.lead_id:
                continue

            user_skills = cls._normalize(user.skills)
            user_interests = cls._normalize(user.interests)

            skill_lookup = {s.strip().lower(): s.strip() for s in (project.required_skills or []) + (user.skills or [])}
            interest_lookup = {t.strip().lower(): t.strip() for t in (project.tags or []) + (user.interests or [])}

            matched_skills = sorted([skill_lookup[s] for s in required_skills.intersection(user_skills)])
            matched_interests = sorted([interest_lookup[i] for i in project_tags.intersection(user_interests)])

            # Skill match ratio (weight: 45%)
            skill_score = (len(matched_skills) / max(len(required_skills), 1)) * 45

            # Interest/domain overlap ratio (weight: 35%)
            interest_score = (len(matched_interests) / max(len(project_tags), 1)) * 35

            # Cross-department synergy bonus (weight: 20%)
            is_cross_dept = (user.department.strip().lower() != project.department.strip().lower())
            dept_score = 20 if is_cross_dept else 12  # interdisciplinary bonus

            total_score = round(min(100.0, skill_score + interest_score + dept_score), 1)

            # Generate natural language explanation
            reasons = []
            if matched_skills:
                reasons.append(f"Shares {len(matched_skills)} required skill(s): {', '.join(matched_skills)}")
            if matched_interests:
                reasons.append(f"Aligns on research interests: {', '.join(matched_interests)}")
            if is_cross_dept:
                reasons.append(f"Interdisciplinary synergy between {user.department} and {project.department}")
            else:
                reasons.append(f"Departmental continuity within {user.department}")

            results.append({
                "researcher": user.to_dict(),
                "score": total_score,
                "breakdown": {
                    "skill_score": round(skill_score, 1),
                    "interest_score": round(interest_score, 1),
                    "synergy_score": dept_score,
                },
                "matched_skills": matched_skills,
                "matched_interests": matched_interests,
                "is_cross_department": is_cross_dept,
                "explanation": "; ".join(reasons) if reasons else "General research profile match."
            })

        # Sort descending by score
        results.sort(key=lambda x: x["score"], reverse=True)
        return results
