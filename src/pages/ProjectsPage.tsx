import React, { useState } from "react";
import { Search, Filter, Plus, Send, FolderGit2, CheckCircle2 } from "lucide-react";
import { Project } from "../types";
import { ProjectCard } from "../components/projects/ProjectCard";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import { EmptyState } from "../components/ui/empty-state";
import { Alert } from "../components/ui/alert";
import { createProjectApi } from "../services/api";

interface Props {
  projects: Project[];
  onSelectProjectForMatch: (p: Project) => void;
  onRequestCollaboration?: (p: Project, note?: string) => void;
  onProjectCreated?: (newProject: Project) => void;
}

export const ProjectsPage: React.FC<Props> = ({
  projects,
  onSelectProjectForMatch,
  onRequestCollaboration,
  onProjectCreated,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");

  // Create Project Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAbstract, setNewAbstract] = useState("");
  const [newDept, setNewDept] = useState("Computer Science & Engineering");
  const [newPositions, setNewPositions] = useState(2);
  const [newSkills, setNewSkills] = useState("");
  const [newTags, setNewTags] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply Modal state
  const [applyingProject, setApplyingProject] = useState<Project | null>(null);
  const [applyNote, setApplyNote] = useState("");

  const departments = ["All", ...Array.from(new Set(projects.map((p) => p.department)))];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.required_skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDept = selectedDept === "All" || p.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTitle.length < 5) {
      setFormError("Project title must be at least 5 characters.");
      return;
    }
    if (!newAbstract.trim() || newAbstract.length < 20) {
      setFormError("Please provide an abstract with at least 20 characters describing the initiative.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    const skillsArray = newSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: newTitle,
      abstract: newAbstract,
      department: newDept,
      lead_id: 1, // Demo user
      status: "Recruiting",
      open_positions: Number(newPositions),
      required_skills: skillsArray.length > 0 ? skillsArray : ["Python", "Research Analysis"],
      tags: tagsArray.length > 0 ? tagsArray : ["Interdisciplinary", "Innovation"],
    };

    const created = await createProjectApi(payload);
    onProjectCreated?.(created);
    setIsSubmitting(false);
    setIsCreateOpen(false);

    // Reset form
    setNewTitle("");
    setNewAbstract("");
    setNewSkills("");
    setNewTags("");
  };

  const handleConfirmApply = () => {
    if (applyingProject && onRequestCollaboration) {
      onRequestCollaboration(applyingProject, applyNote);
      setApplyingProject(null);
      setApplyNote("");
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Title & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Research Projects & Initiatives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore collaborative projects seeking faculty, students, and interdisciplinary partners.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Propose Initiative
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="w-full">
          <Input
            placeholder="Search projects by topic, title, required skill, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Recruiting", "In Progress"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Department selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Discipline:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 font-medium"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="h-6 w-6 text-slate-400" />}
          title="No research projects match your search criteria"
          description="Try broadening your search keywords or resetting the status and discipline filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setStatusFilter("All");
            setSelectedDept("All");
          }}
          secondaryActionLabel="Propose New Initiative"
          onSecondaryAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onMatchCandidates={() => onSelectProjectForMatch(p)}
              onRequestCollaboration={(proj) => setApplyingProject(proj)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Propose Collaborative Research Initiative"
        description="Publish a project to discover interdisciplinary faculty partners, postdocs, and student researchers."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <Alert type="error" title="Validation Requirement">
              {formError}
            </Alert>
          )}

          <Input
            label="Initiative Title"
            placeholder="e.g. Distributed Knowledge Graphs for Rare Oncology Variants"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            helperText="Provide a clear, descriptive title."
          />

          <Select
            label="Host Department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            options={[
              { value: "Computer Science & Engineering", label: "Computer Science & Engineering" },
              { value: "Biotechnology & Biomedical Engineering", label: "Biotechnology & Biomedical Engineering" },
              { value: "Data Science & AI", label: "Data Science & AI" },
              { value: "Electronics & Communication", label: "Electronics & Communication" },
              { value: "Mechanical & Aerospace Engineering", label: "Mechanical & Aerospace Engineering" },
            ]}
          />

          <Textarea
            label="Project Abstract & Scope"
            placeholder="Outline the research hypothesis, target outcomes, and cross-departmental collaboration goals..."
            value={newAbstract}
            onChange={(e) => setNewAbstract(e.target.value)}
            rows={4}
            required
            helperText="Include sufficient context so scholars understand the synergy."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Required Skills (comma-separated)"
              placeholder="e.g. Python, PyTorch, Genomics, SPARQL"
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              helperText="Used by AI matching algorithm."
            />

            <Input
              label="Open Collaborator Positions"
              type="number"
              min={1}
              max={10}
              value={newPositions}
              onChange={(e) => setNewPositions(Number(e.target.value))}
              helperText="Positions available."
            />
          </div>

          <Input
            label="Domain Tags (comma-separated)"
            placeholder="e.g. Healthcare AI, Deep Learning, Genomics"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Publish Initiative
            </Button>
          </div>
        </form>
      </Modal>

      {/* Apply / Collaboration Proposal Modal */}
      <Modal
        isOpen={!!applyingProject}
        onClose={() => setApplyingProject(null)}
        title={`Apply to Collaborate on "${applyingProject?.title}"`}
        description="Send a collaboration proposal directly to the project lead with your background and value proposition."
        footer={
          <>
            <Button variant="outline" onClick={() => setApplyingProject(null)}>
              Cancel
            </Button>
            <Button variant="synergy" onClick={handleConfirmApply} className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Submit Collaboration Proposal
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-1">
            <div className="font-semibold text-slate-800">Lead Department: {applyingProject?.department}</div>
            <div className="text-slate-500">Positions open: {applyingProject?.open_positions}</div>
          </div>

          <Textarea
            label="Collaboration Pitch & Skill Alignment"
            placeholder="Explain how your expertise aligns with this project, which skills you bring, and your availability..."
            value={applyNote}
            onChange={(e) => setApplyNote(e.target.value)}
            rows={4}
            helperText="Project lead will receive your profile and pitch note."
          />
        </div>
      </Modal>
    </div>
  );
};
