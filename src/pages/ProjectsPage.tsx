import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Project } from "../types";
import { ProjectCard } from "../components/projects/ProjectCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

interface Props {
  projects: Project[];
  onSelectProjectForMatch: (p: Project) => void;
  onRequestCollaboration?: (p: Project) => void;
}

export const ProjectsPage: React.FC<Props> = ({
  projects,
  onSelectProjectForMatch,
  onRequestCollaboration,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.required_skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" ||
      p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Research Projects & Initiatives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore collaborative projects seeking faculty, students, and interdisciplinary partners.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects by topic, title, required skill, or department..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {["All", "Recruiting", "In Progress"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-sm font-semibold">No research projects match your search.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onMatchCandidates={() => onSelectProjectForMatch(p)}
              onRequestCollaboration={onRequestCollaboration}
            />
          ))}
        </div>
      )}
    </div>
  );
};
