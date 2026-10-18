import React, { useState } from "react";
import { Search, Filter, LayoutGrid, List, Users } from "lucide-react";
import { Researcher } from "../types";
import { ResearcherCard } from "../components/researchers/ResearcherCard";
import { ResearcherProfileModal } from "../components/researchers/ResearcherProfileModal";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { DepartmentBadge } from "../components/common/DepartmentBadge";

interface Props {
  researchers: Researcher[];
  onFindMatches?: (r?: Researcher) => void;
  onRequestCollab?: (r: Researcher) => void;
  onViewProfile?: (r: Researcher) => void;
}

export const ResearchersPage: React.FC<Props> = ({
  researchers,
  onFindMatches,
  onRequestCollab,
  onViewProfile,
}) => {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProfile, setSelectedProfile] = useState<Researcher | null>(null);

  const departments = ["All", ...Array.from(new Set(researchers.map((r) => r.department)))];
  const roles = ["All", "Faculty", "Researcher", "Student"];

  const filtered = researchers.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      r.interests.some((i) => i.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept === "All" || r.department === selectedDept;
    const matchesRole = selectedRole === "All" || r.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesDept && matchesRole;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Faculty & Researchers Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse accredited scholars across departments, view research skills, and initiate interdisciplinary partnerships.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md ${
              viewMode === "grid" ? "bg-indigo-50 text-indigo-700" : "text-slate-400 hover:text-slate-700"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md ${
              viewMode === "table" ? "bg-indigo-50 text-indigo-700" : "text-slate-400 hover:text-slate-700"
            }`}
            aria-label="Table View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full">
            <Input
              placeholder="Search by researcher name, skill, interest, or discipline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Department filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Department:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6 text-slate-400" />}
          title="No researchers match your search criteria"
          description="Try broadening your search term or selecting 'All' departments to discover more faculty members."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSelectedDept("All");
            setSelectedRole("All");
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <ResearcherCard
              key={r.id}
              researcher={r}
              onFindMatches={onFindMatches}
              onViewProfile={onViewProfile ?? ((researcher) => setSelectedProfile(researcher))}
            />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholar</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Primary Skills</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-semibold text-slate-900">
                  <button
                    onClick={() => setSelectedProfile(r)}
                    className="hover:text-indigo-600 transition-colors text-left"
                  >
                    <div>{r.name}</div>
                    <div className="text-xs text-slate-400 font-normal">{r.designation}</div>
                  </button>
                </TableCell>
                <TableCell>
                  <DepartmentBadge department={r.department} />
                </TableCell>
                <TableCell>
                  <Badge variant={r.role === "Faculty" ? "default" : "secondary"}>
                    {r.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {r.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-indigo-600"
                      onClick={() => onViewProfile ? onViewProfile(r) : setSelectedProfile(r)}
                    >
                      Profile
                    </Button>
                    {onFindMatches && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => onFindMatches(r)}
                      >
                        Match
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Profile Detail Modal */}
      <ResearcherProfileModal
        researcher={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onFindMatches={onFindMatches}
        onRequestCollab={onRequestCollab}
      />
    </div>
  );
};
