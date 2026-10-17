import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Researcher } from "../types";
import { ResearcherCard } from "../components/researchers/ResearcherCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

interface Props {
  researchers: Researcher[];
  onFindMatches?: (r: Researcher) => void;
}

export const ResearchersPage: React.FC<Props> = ({ researchers, onFindMatches }) => {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");

  const departments = ["All", ...Array.from(new Set(researchers.map((r) => r.department)))];

  const filtered = researchers.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      r.interests.some((i) => i.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept === "All" || r.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Researchers & Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse scholars across departments, view research interests, and connect.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by researcher name, skill, interest, or discipline..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-sm font-semibold">No researchers match your search.</p>
          <p className="text-xs text-slate-400 mt-1">Try refining or clearing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <ResearcherCard key={r.id} researcher={r} onFindMatches={onFindMatches} />
          ))}
        </div>
      )}
    </div>
  );
};
