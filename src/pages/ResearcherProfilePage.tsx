import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  FolderGit2,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { DepartmentBadge } from "../components/common/DepartmentBadge";
import { Researcher } from "../types";

interface ResearcherProfile extends Researcher {
  led_projects?: Array<{
    id: number;
    title: string;
    status: string;
    department: string;
    tags: string[];
    open_positions: number;
  }>;
  collaborations?: Array<{
    id: number;
    project_id: number;
    project_title: string | null;
    status: string;
    note: string;
  }>;
}

interface Props {
  researcherId: number;
  onBack: () => void;
  onFindMatches?: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const statusConfig = {
  Accepted: { icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50 border-teal-200", label: "Accepted" },
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "Pending" },
  Rejected: { icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 border-rose-200", label: "Declined" },
};

const projectStatusConfig: Record<string, { color: string; badge: string }> = {
  Recruiting: { color: "text-indigo-700", badge: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  "In Progress": { color: "text-teal-700", badge: "bg-teal-50 border-teal-200 text-teal-700" },
  Completed: { color: "text-slate-600", badge: "bg-slate-100 border-slate-200 text-slate-600" },
};

function roleColor(role: string) {
  if (role === "Faculty") return "bg-indigo-50 border-indigo-200 text-indigo-700";
  if (role === "Student") return "bg-purple-50 border-purple-200 text-purple-700";
  return "bg-teal-50 border-teal-200 text-teal-700";
}

export const ResearcherProfilePage: React.FC<Props> = ({ researcherId, onBack, onFindMatches }) => {
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${API_BASE}/researchers/${researcherId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Researcher not found");
        return r.json();
      })
      .then((data) => setProfile(data))
      .catch((e) => setError(e.message || "Failed to load profile"))
      .finally(() => setIsLoading(false));
  }, [researcherId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Researchers
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Researchers
        </button>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-rose-700 font-semibold">{error || "Profile not found"}</p>
          <Button variant="outline" onClick={onBack} className="mt-4">Return to Directory</Button>
        </div>
      </div>
    );
  }

  const ledProjects = profile.led_projects || [];
  const collaborations = profile.collaborations || [];
  const acceptedCollabs = collaborations.filter((c) => c.status === "Accepted").length;

  return (
    <div className="space-y-6 text-left">
      {/* Back nav */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Researchers
      </button>

      {/* Hero card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl font-bold shadow-xs select-none">
            {profile.name?.charAt(0) ?? "?"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading leading-tight">
                {profile.name}
              </h1>
              <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${roleColor(profile.role)}`}>
                {profile.role}
              </span>
            </div>

            {profile.designation && (
              <p className="text-sm font-medium text-slate-600 mb-1">{profile.designation}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {profile.department}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {onFindMatches && (
              <Button variant="outline" size="sm" onClick={onFindMatches} className="gap-2 text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Find Matches
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{profile.bio}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-heading">{ledProjects.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Projects Led</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-heading">{collaborations.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Collaborations</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-teal-600 font-heading">{acceptedCollabs}</div>
            <div className="text-xs text-slate-500 mt-0.5">Accepted</div>
          </div>
        </div>
      </div>

      {/* Two-column: Skills + Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills listed</p>
            )}
          </CardContent>
        </Card>

        {/* Research Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-violet-600" />
              Research Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-violet-200 bg-violet-50/60 px-2.5 py-1 text-xs font-semibold text-violet-700"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No interests listed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Led Projects */}
      {ledProjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FolderGit2 className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Projects Led ({ledProjects.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ledProjects.map((proj) => {
              const sc = projectStatusConfig[proj.status] || projectStatusConfig["Recruiting"];
              return (
                <div
                  key={proj.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{proj.title}</h3>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${sc.badge}`}>
                      {proj.status}
                    </span>
                  </div>
                  <DepartmentBadge department={proj.department} />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {proj.open_positions > 0 && (
                    <p className="mt-2 text-xs text-teal-600 font-semibold">
                      {proj.open_positions} open position{proj.open_positions !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collaboration history */}
      {collaborations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Collaboration Activity ({collaborations.length})</h2>
          </div>
          <div className="space-y-3">
            {collaborations.map((collab) => {
              const sc = statusConfig[collab.status as keyof typeof statusConfig] || statusConfig["Pending"];
              const Icon = sc.icon;
              return (
                <div
                  key={collab.id}
                  className={`rounded-xl border p-4 flex items-start gap-3 ${sc.bg}`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${sc.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {collab.project_title || `Project #${collab.project_id}`}
                      </span>
                      <span className={`shrink-0 text-[10px] font-bold ${sc.color}`}>{sc.label}</span>
                    </div>
                    {collab.note && (
                      <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{collab.note}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for no activity */}
      {ledProjects.length === 0 && collaborations.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No project activity yet</p>
          <p className="text-xs text-slate-400 mt-1">
            This researcher hasn't led or collaborated on any projects in the platform.
          </p>
        </div>
      )}
    </div>
  );
};
