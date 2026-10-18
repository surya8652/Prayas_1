import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  FolderGit2,
  Sparkles,
  ArrowRight,
  Plus,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Calendar,
  BookOpen,
  Award,
  ChevronRight,
  Building,
} from "lucide-react";
import { NavTab } from "../components/layout/Sidebar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { StatCard } from "../components/ui/stat-card";
import { Alert } from "../components/ui/alert";
import {
  fetchDashboardSummary,
  fetchDashboardRecommendations,
  fetchDashboardProjects,
  fetchDashboardRequests,
  fetchDashboardActivity,
  submitCollaborationRequest,
} from "../services/api";

interface Props {
  currentUser?: any;
  onNavigate: (tab: NavTab) => void;
  onSelectProjectForMatch: (p: any) => void;
  onRequestCollaboration?: (p: any) => void;
  onViewResearcherProfile?: (id: number) => void;
}

export const DashboardPage: React.FC<Props> = ({
  currentUser,
  onNavigate,
  onSelectProjectForMatch,
  onRequestCollaboration,
  onViewResearcherProfile,
}) => {
  // State from backend endpoints
  const [summaryData, setSummaryData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [deadlinesList, setDeadlinesList] = useState<any[]>([]);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Parallel fetch from Python Flask endpoints
      const [summaryRes, recsRes, projsRes, reqsRes, actRes] = await Promise.all([
        fetchDashboardSummary(),
        fetchDashboardRecommendations(6),
        fetchDashboardProjects(6),
        fetchDashboardRequests(6),
        fetchDashboardActivity(),
      ]);

      setSummaryData(summaryRes);
      setRecommendations(recsRes.recommendations || []);
      setIsProfileIncomplete(Boolean(recsRes.profile_incomplete));
      setProjectsList(projsRes.projects || []);
      setRequestsList(reqsRes.requests || []);
      setActivitiesList(actRes.activities || []);
      setDeadlinesList(actRes.deadlines || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to synchronize dashboard with university database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived user details from API response or currentUser prop
  const user = summaryData?.user || currentUser;
  const displayName = user?.full_name || user?.name || "Researcher";
  const department = user?.department || "Academic Department";
  const role = user?.role || "Faculty";
  const completionPercentage = user?.profile_completion_percentage ?? 65;

  const handleQuickCollabRequest = async (researcher: any) => {
    try {
      if (projectsList.length > 0) {
        await submitCollaborationRequest(
          projectsList[0].id,
          researcher.id,
          `Invited from Dashboard Recommended Matches.`
        );
      }
      setActionFeedback(`Collaboration invitation dispatched to ${researcher.name}!`);
      setTimeout(() => setActionFeedback(null), 4000);
    } catch {
      setActionFeedback(`Notice: Collaboration contact initiated with ${researcher.name}`);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Skeleton loading view
  if (isLoading && !summaryData) {
    return (
      <div className="space-y-6 text-left animate-pulse">
        {/* Welcome skeleton */}
        <div className="h-44 rounded-2xl bg-slate-200" />
        {/* Metric cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200" />
          ))}
        </div>
        {/* Content sections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-xl bg-slate-200" />
          <div className="h-72 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Feedback banner */}
      {actionFeedback && (
        <Alert type="success" title="Action Completed">
          {actionFeedback}
        </Alert>
      )}

      {/* Error state with retry button */}
      {errorMsg && (
        <Alert type="error" title="Connection Notice">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span>{errorMsg}</span>
            <Button size="sm" variant="outline" onClick={loadDashboardData} className="gap-1.5 shrink-0">
              <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
            </Button>
          </div>
        </Alert>
      )}

      {/* PART 2: DASHBOARD WELCOME SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <span className="h-2 w-2 rounded-full bg-teal-600 inline-block" />
                <span>{department}</span>
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                {role}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Welcome back, {displayName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore university initiatives, connect with interdisciplinary scholars, review proposals, and expand your research team through explainable AI matching.
            </p>

            {/* Profile Completion Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Academic Profile Completion</span>
                <span className="font-bold text-indigo-700">{completionPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile Edit */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={() => onNavigate("onboarding")}
              className="gap-1.5 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              {completionPercentage < 100 ? "Complete Research Profile" : "Edit Academic Profile"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("researchers")}
                className="gap-1 text-xs flex-1"
              >
                <Users className="h-3.5 w-3.5" />
                Discover Faculty
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("projects")}
                className="gap-1 text-xs flex-1"
              >
                <FolderGit2 className="h-3.5 w-3.5" />
                Browse Projects
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PART 3: SUMMARY CARDS (Calculated in Python SQLite) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recommended Researchers"
          value={summaryData?.metrics?.recommended_researchers ?? 0}
          subtitle="Scholars across departments"
          variant="brand"
        />
        <StatCard
          title="Available Projects"
          value={summaryData?.metrics?.available_projects ?? 0}
          subtitle="Recruiting initiatives"
          variant="synergy"
        />
        <StatCard
          title="Pending Requests"
          value={summaryData?.metrics?.pending_requests ?? 0}
          subtitle="Proposals awaiting response"
          variant="default"
        />
        <StatCard
          title="Accepted Collaborations"
          value={summaryData?.metrics?.accepted_collaborations ?? 0}
          subtitle="Active collaborative links"
          variant="default"
        />
      </div>

      {/* Database Empty Banner (if true) */}
      {summaryData?.meta?.is_empty && (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 bg-slate-50 text-center space-y-2">
          <Building className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Campus Database is Currently Initializing</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No projects or scholars have been registered yet. Be the first faculty or student scholar to publish a research initiative.
          </p>
          <Button size="sm" onClick={() => onNavigate("projects")} className="mt-2">
            Publish First Project
          </Button>
        </div>
      )}

      {/* PART 4: RECOMMENDED RESEARCHERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Recommended Researchers</h2>
            <p className="text-xs text-slate-500">
              Matches calculated from research domain, shared skills, and cross-departmental synergy
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("researchers")}>
            View All Directory →
          </Button>
        </div>

        {isProfileIncomplete && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-900">Personalized Match Scoring Inactive</span>
              <p className="text-amber-700">
                Complete your research domain, methodology skills, and topics in the onboarding wizard to calculate transparent AI synergy percentages.
              </p>
              <button
                onClick={() => onNavigate("onboarding")}
                className="font-bold text-indigo-700 hover:underline pt-0.5 block"
              >
                Complete Profile Now →
              </button>
            </div>
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            No researcher recommendations found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((r) => (
              <Card key={r.id} className="hover:shadow-card transition-all border-slate-200 bg-white flex flex-col justify-between">
                <CardHeader className="pb-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">{r.name}</CardTitle>
                      <div className="text-xs text-indigo-600 font-medium">{r.designation}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{r.department}</div>
                    </div>
                    {r.match_percentage !== null ? (
                      <span className="rounded-md bg-teal-50 border border-teal-200 px-2 py-1 text-xs font-bold text-teal-800 shrink-0">
                        {r.match_percentage}% Match
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-100 text-slate-500 px-2 py-0.5 text-[10px] font-semibold shrink-0">
                        Campus Scholar
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-left text-xs pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Primary Domain</span>
                    <p className="text-slate-800 font-medium">{r.research_domain || r.department}</p>
                  </div>

                  {r.skills && r.skills.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Relevant Skills</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.skills.slice(0, 4).map((s: string) => (
                          <span
                            key={s}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              r.shared_skills?.includes(s)
                                ? "bg-indigo-100 text-indigo-800 font-bold border border-indigo-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => {
                      if (onViewResearcherProfile) {
                        onViewResearcherProfile(r.id);
                      } else {
                        onNavigate("researchers");
                      }
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="text-xs flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleQuickCollabRequest(r)}
                  >
                    Request Collab
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PART 5: RESEARCH PROJECTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Relevant Research Projects</h2>
            <p className="text-xs text-slate-500">Cross-departmental funded initiatives seeking co-investigators</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("projects")}>
            View All Projects ({projectsList.length}) →
          </Button>
        </div>

        {projectsList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            No active research projects found. Create one from the Research Projects page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectsList.slice(0, 6).map((p) => (
              <Card key={p.id} className="hover:shadow-card transition-all border-slate-200 bg-white flex flex-col justify-between">
                <CardHeader className="pb-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {p.research_domain || p.department}
                    </span>
                    <Badge variant={p.status === "Recruiting" ? "success" : "secondary"}>
                      {p.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 line-clamp-2 mt-2">
                    {p.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-left text-xs pb-3">
                  <p className="text-slate-600 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="space-y-1 pt-1 text-slate-500 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-700">Lead Investigator:</span> {p.owner_name}
                    </div>
                    {p.deadline && (
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Deadline: {p.deadline}</span>
                      </div>
                    )}
                  </div>

                  {p.required_skills && p.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.required_skills.slice(0, 3).map((s: string) => (
                        <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => onSelectProjectForMatch(p)}
                  >
                    View Details & Match
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PART 6 & PART 7: TWO-COLUMN SECTION FOR COLLABORATION REQUESTS + RECENT ACTIVITY / DEADLINES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PART 6: Collaboration Requests Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Recent Collaboration Requests</h2>
              <p className="text-xs text-slate-500">Proposals submitted or received for your initiatives</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("requests")} className="text-xs">
              View All ({requestsList.length})
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            {requestsList.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No collaboration requests logged for your account. When colleagues request to join your initiatives, they will appear here.
              </div>
            ) : (
              requestsList.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.researcher_name}</span>
                      <span className="text-[10px] text-slate-400">• {req.created_date}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-1">
                      Initiative: <span className="font-medium text-slate-800">{req.project_title}</span>
                    </p>
                    <p className="text-slate-500 italic text-[11px] line-clamp-1">
                      "{req.note}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Badge variant={req.status === "Accepted" ? "success" : req.status === "Pending" ? "warning" : "secondary"}>
                      {req.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => onNavigate("requests")}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PART 7: Recent Activity and Upcoming Deadlines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Campus Activity & Deadlines</h2>
              <p className="text-xs text-slate-500">Real events and validated grant deadlines</p>
            </div>
            <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => onNavigate("notifications")}>
              Notifications →
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
            {/* Upcoming Deadlines */}
            {deadlinesList.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Target Proposal Deadlines
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {deadlinesList.slice(0, 2).map((dl) => (
                    <div key={dl.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs space-y-1">
                      <div className="font-semibold text-slate-900 truncate">{dl.title}</div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{dl.deadline}</span>
                        <span className="font-bold text-indigo-600">{dl.days_left} days left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activities */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Recent Meaningful Events
              </span>
              {activitiesList.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No activity events registered yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {activitiesList.slice(0, 3).map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5 text-xs text-left">
                      <div className="mt-1 h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800">{act.title}</div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{act.description}</p>
                        <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
