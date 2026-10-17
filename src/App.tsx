import React, { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { NavTab } from "./components/layout/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { ResearchersPage } from "./pages/ResearchersPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { MatchingPage } from "./pages/MatchingPage";
import { MatchingScoreModal } from "./components/matching/MatchingScoreModal";
import { usePrayasData } from "./hooks/usePrayasData";
import { Project, Researcher, MatchCandidate } from "./types";
import { fetchProjectMatches, submitCollaborationRequest } from "./services/api";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const {
    researchers,
    projects,
    notifications,
    backendConnected,
    setNotifications,
  } = usePrayasData();

  const handleOpenMatching = async (project: Project) => {
    setSelectedProject(project);
    setIsMatchingLoading(true);

    try {
      // Attempt backend API match
      const backendMatches = await fetchProjectMatches(project.id);
      if (backendMatches && backendMatches.length > 0) {
        setMatches(backendMatches);
      } else {
        // Fallback local explainable matching calculation
        const localMatches = computeLocalExplainableMatches(project, researchers);
        setMatches(localMatches);
      }
    } catch {
      const localMatches = computeLocalExplainableMatches(project, researchers);
      setMatches(localMatches);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const handleSendInvite = (candidate: MatchCandidate) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: "Collaboration Invitation Sent",
      message: `Invited ${candidate.researcher.name} to join "${selectedProject?.title}".`,
      type: "collab" as const,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    alert(`Invitation sent to ${candidate.researcher.name}!`);
  };

  const handleRequestCollaboration = async (project: Project) => {
    try {
      // Demo: Dr. Aris Thorne (id: 1) applying
      await submitCollaborationRequest(project.id, 1, "Interested in collaborating on this initiative.");
    } catch {
      // Local fallback
    }
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: "Proposal Submitted",
      message: `Your collaboration proposal for "${project.title}" has been submitted.`,
      type: "collab" as const,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    alert(`Collaboration request submitted for "${project.title}"!`);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
      backendConnected={backendConnected}
    >
      {activeTab === "dashboard" && (
        <DashboardPage
          researchers={researchers}
          projects={projects}
          onNavigate={(tab) => setActiveTab(tab)}
          onSelectProjectForMatch={handleOpenMatching}
        />
      )}

      {activeTab === "researchers" && (
        <ResearchersPage
          researchers={researchers}
          onFindMatches={() => setActiveTab("matching")}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsPage
          projects={projects}
          onSelectProjectForMatch={handleOpenMatching}
          onRequestCollaboration={handleRequestCollaboration}
        />
      )}

      {activeTab === "matching" && (
        <MatchingPage
          projects={projects}
          onTriggerMatch={handleOpenMatching}
        />
      )}

      <MatchingScoreModal
        project={selectedProject}
        matches={matches}
        isLoading={isMatchingLoading}
        onClose={() => setSelectedProject(null)}
        onSendInvite={handleSendInvite}
      />
    </MainLayout>
  );
}

// Client-side fallback computation of explainable algorithm
function computeLocalExplainableMatches(project: Project, candidates: Researcher[]): MatchCandidate[] {
  const norm = (arr: string[]) => new Set((arr || []).map((s) => s.trim().toLowerCase()));
  const reqSkills = norm(project.required_skills);
  const projTags = norm(project.tags);

  const results: MatchCandidate[] = [];

  for (const r of candidates) {
    if (r.id === project.lead_id) continue;

    const rSkills = norm(r.skills);
    const rInterests = norm(r.interests);

    const matchedSkills = Array.from(reqSkills).filter((s) => rSkills.has(s));
    const matchedInterests = Array.from(projTags).filter((t) => rInterests.has(t));

    const skillScore = (matchedSkills.length / Math.max(reqSkills.size, 1)) * 45;
    const interestScore = (matchedInterests.length / Math.max(projTags.size, 1)) * 35;
    const isCrossDept = r.department.trim().toLowerCase() !== project.department.trim().toLowerCase();
    const synergyScore = isCrossDept ? 20 : 12;

    const totalScore = Math.round(Math.min(100, skillScore + interestScore + synergyScore));

    const reasons: string[] = [];
    if (matchedSkills.length > 0) {
      reasons.push(`Shares ${matchedSkills.length} required skill(s): ${matchedSkills.join(", ")}`);
    }
    if (matchedInterests.length > 0) {
      reasons.push(`Aligns on research interests: ${matchedInterests.join(", ")}`);
    }
    if (isCrossDept) {
      reasons.push(`Interdisciplinary synergy between ${r.department} and ${project.department}`);
    } else {
      reasons.push(`Departmental continuity within ${r.department}`);
    }

    results.push({
      researcher: r,
      score: totalScore,
      breakdown: {
        skill_score: Math.round(skillScore),
        interest_score: Math.round(interestScore),
        synergy_score: synergyScore,
      },
      matched_skills: matchedSkills,
      matched_interests: matchedInterests,
      is_cross_department: isCrossDept,
      explanation: reasons.join("; "),
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export default App;
