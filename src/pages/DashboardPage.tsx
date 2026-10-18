import React from "react";
import {
  Users,
  FolderGit2,
  Sparkles,
  Building2,
  ArrowRight,
  ShieldCheck,
  Plus,
  GitPullRequest,
  CheckCircle2,
} from "lucide-react";
import { Researcher, Project } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { StatCard } from "../components/ui/stat-card";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ResearcherCard } from "../components/researchers/ResearcherCard";
import { NavTab } from "../components/layout/Sidebar";

interface Props {
  researchers: Researcher[];
  projects: Project[];
  onNavigate: (tab: NavTab) => void;
  onSelectProjectForMatch: (p: Project) => void;
  onRequestCollaboration?: (p: Project) => void;
}

export const DashboardPage: React.FC<Props> = ({
  researchers,
  projects,
  onNavigate,
  onSelectProjectForMatch,
  onRequestCollaboration,
}) => {
  const departments = Array.from(new Set(researchers.map((r) => r.department)));
  const totalOpenSlots = projects.reduce((acc, p) => acc + (p.open_positions || 0), 0);

  return (
    <div className="space-y-8 text-left">
      {/* Restrained Hero Welcome */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-600 inline-block" />
              <span>Campus Research Coordination Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Welcome back to PRAYAS
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore university initiatives, connect with interdisciplinary faculty, review collaboration proposals, and run explainable AI match scoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={() => onNavigate("matching")}
              className="gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              Run AI Matching
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("projects")}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Browse Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Researchers"
          value={researchers.length}
          subtitle="Scholars registered"
          trend={{ value: "+2 new this month", isPositive: true }}
          variant="brand"
        />
        <StatCard
          title="Synergy Rate"
          value="84.2%"
          subtitle="Interdisciplinary index"
          trend={{ value: "+5.1%", isPositive: true }}
          variant="synergy"
        />
        <StatCard
          title="Open Positions"
          value={totalOpenSlots}
          subtitle="Recruiting collaborator slots"
          variant="default"
        />
        <StatCard
          title="Engaged Disciplines"
          value={departments.length}
          subtitle="Campus departments"
          variant="default"
        />
      </div>

      {/* Quick Access Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate("matching")}
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  AI Matching Engine
                </div>
                <div className="text-[11px] text-slate-500">Find candidate partners</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("requests")}
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <GitPullRequest className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Collaboration Proposals
                </div>
                <div className="text-[11px] text-slate-500">2 pending reviews</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("admin")}
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                  Institutional Intelligence
                </div>
                <div className="text-[11px] text-slate-500">Dean metrics & matrix</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Featured Research Initiatives</h2>
            <p className="text-xs text-slate-500">Cross-departmental projects actively seeking collaborators</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("projects")}>
            View all ({projects.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onMatchCandidates={() => onSelectProjectForMatch(p)}
              onRequestCollaboration={onRequestCollaboration}
            />
          ))}
        </div>
      </div>

      {/* Featured Researchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Accredited Faculty & Scholars</h2>
            <p className="text-xs text-slate-500">Scholars available for interdisciplinary synergy</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("researchers")}>
            View all ({researchers.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchers.slice(0, 3).map((r) => (
            <ResearcherCard
              key={r.id}
              researcher={r}
              onFindMatches={() => onNavigate("matching")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
