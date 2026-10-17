import React from "react";
import { Users, FolderGit2, Sparkles, Building2, ArrowRight } from "lucide-react";
import { Researcher, Project } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ResearcherCard } from "../components/researchers/ResearcherCard";

interface Props {
  researchers: Researcher[];
  projects: ProjectsProps;
  onNavigate: (tab: "researchers" | "projects" | "matching") => void;
  onSelectProjectForMatch: (p: Project) => void;
}

type ProjectsProps = Project[];

export const DashboardPage: React.FC<Props> = ({
  researchers,
  projects,
  onNavigate,
  onSelectProjectForMatch,
}) => {
  const departments = Array.from(new Set(researchers.map((r) => r.department)));
  const totalOpenSlots = projects.reduce((acc, p) => acc + (p.open_positions || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Research Coordination Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome to PRAYAS
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Discover faculty and scholars, publish interdisciplinary initiatives, find research collaborators, and leverage explainable AI matching across college departments.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-md font-semibold"
              onClick={() => onNavigate("matching")}
            >
              Explore AI Matching
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20"
              onClick={() => onNavigate("projects")}
            >
              Browse Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Active Researchers</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchers.length}</div>
            <p className="text-xs text-slate-500 mt-1">Faculty, scholars & students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Research Projects</CardTitle>
            <FolderGit2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-slate-500 mt-1">Ongoing initiatives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Open Collaborations</CardTitle>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpenSlots}</div>
            <p className="text-xs text-slate-500 mt-1">Recruiting positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-slate-500 mt-1">Engaged disciplines</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Featured Projects</h2>
            <p className="text-xs text-slate-500">Interdisciplinary opportunities seeking collaborators</p>
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
            />
          ))}
        </div>
      </div>

      {/* Featured Researchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Featured Researchers</h2>
            <p className="text-xs text-slate-500">Faculty & scholars available for interdepartmental synergy</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("researchers")}>
            View all ({researchers.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchers.slice(0, 3).map((r) => (
            <ResearcherCard key={r.id} researcher={r} />
          ))}
        </div>
      </div>
    </div>
  );
};
