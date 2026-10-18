import React, { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { NavTab } from "./components/layout/Sidebar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ResearchersPage } from "./pages/ResearchersPage";
import { ResearcherProfilePage } from "./pages/ResearcherProfilePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { MatchingPage } from "./pages/MatchingPage";
import { RequestsPage } from "./pages/RequestsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { MatchingScoreModal } from "./components/matching/MatchingScoreModal";
import { Alert } from "./components/ui/alert";
import { usePrayasData } from "./hooks/usePrayasData";
import { Project, Researcher, MatchCandidate } from "./types";
import { fetchProjectMatches, submitCollaborationRequest, markAllNotificationsReadApi } from "./services/api";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "info"; text: string } | null>(null);
  const [viewingResearcherId, setViewingResearcherId] = useState<number | null>(null);

  const {
    researchers,
    projects,
    notifications,
    backendConnected,
    setNotifications,
    setProjects,
  } = usePrayasData();

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenMatching = async (project: Project) => {
    setSelectedProject(project);
    setIsMatchingLoading(true);

    try {
      const backendMatches = await fetchProjectMatches(project.id);
      if (backendMatches && backendMatches.length > 0) {
        setMatches(backendMatches);
      } else {
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
      title: "Collaboration Invitation Dispatched",
      message: `Invited ${candidate.researcher.name} (${candidate.researcher.department}) to join "${selectedProject?.title}".`,
      type: "collab" as const,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Invitation sent to ${candidate.researcher.name}!`);
  };

  const handleRequestCollaboration = async (project: Project, note?: string) => {
    try {
      await submitCollaborationRequest(
        project.id,
        1,
        note || "Interested in collaborating on this research initiative."
      );
    } catch {
      // fallback
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: "Proposal Submitted",
      message: `Your collaboration proposal for "${project.title}" has been submitted for lead review.`,
      type: "collab" as const,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Collaboration proposal submitted for "${project.title}"!`);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsReadApi();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleProjectCreated = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
    showToast(`Research initiative "${newProj.title}" published!`);
  };

  // If on public pages, render with public layout
  if (activeTab === "landing") {
    return (
      <LandingPage
        onEnterApp={() => setActiveTab("dashboard")}
        onGoLogin={() => setActiveTab("login")}
        onGoDesignSystem={() => setActiveTab("design-system")}
      />
    );
  }

  if (activeTab === "login") {
    return (
      <LoginPage
        onSuccessLogin={(user) => {
          showToast(`Signed in as ${user.name}`);
          setActiveTab("dashboard");
        }}
        onGoHome={() => setActiveTab("landing")}
      />
    );
  }

  // Authenticated pages with persistent sidebar and top header
  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
      backendConnected={backendConnected}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom duration-200">
          <Alert
            type={toastMessage.type}
            title={toastMessage.type === "success" ? "Operation Successful" : "Notification"}
            onDismiss={() => setToastMessage(null)}
          >
            {toastMessage.text}
          </Alert>
        </div>
      )}

      {activeTab === "dashboard" && (
        <DashboardPage
          researchers={researchers}
          projects={projects}
          onNavigate={(tab) => setActiveTab(tab)}
          onSelectProjectForMatch={handleOpenMatching}
          onRequestCollaboration={handleRequestCollaboration}
        />
      )}

      {activeTab === "researchers" && (
        viewingResearcherId ? (
          <ResearcherProfilePage
            researcherId={viewingResearcherId}
            onBack={() => setViewingResearcherId(null)}
            onFindMatches={() => {
              setViewingResearcherId(null);
              setActiveTab("matching");
            }}
          />
        ) : (
          <ResearchersPage
            researchers={researchers}
            onFindMatches={() => setActiveTab("matching")}
            onRequestCollab={(r) => {
              showToast(`Contact initiated with ${r.name}`);
            }}
            onViewProfile={(r) => setViewingResearcherId(r.id)}
          />
        )
      )}

      {activeTab === "projects" && (
        <ProjectsPage
          projects={projects}
          onSelectProjectForMatch={handleOpenMatching}
          onRequestCollaboration={handleRequestCollaboration}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {activeTab === "matching" && (
        <MatchingPage
          projects={projects}
          onTriggerMatch={handleOpenMatching}
        />
      )}

      {activeTab === "requests" && (
        <RequestsPage
          onNavigateToProjects={() => setActiveTab("projects")}
          onRequestAccepted={(msg) => showToast(msg)}
        />
      )}

      {activeTab === "notifications" && (
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
                Notification Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                All campus alerts, match recommendations, and collaboration proposal activities.
              </p>
            </div>
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-4 transition-all text-xs sm:text-sm flex items-start gap-3 ${
                  !n.read ? "border-indigo-200 bg-indigo-50/30" : "border-slate-200 bg-white"
                }`}
              >
                <div className="mt-0.5 rounded-lg bg-indigo-50 p-2 text-indigo-600 shrink-0">
                  ⚡
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-xs text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "admin" && <AdminDashboardPage />}

      {activeTab === "design-system" && <DesignSystemPage />}

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

// Client-side fallback explainable algorithm
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
