import React from "react";
import { Users, Sparkles, Send } from "lucide-react";
import { Project } from "../../types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { DepartmentBadge } from "../common/DepartmentBadge";
import { StatusPill } from "../common/StatusPill";

interface Props {
  project: Project;
  onMatchCandidates: (project: Project) => void;
  onRequestCollaboration?: (project: Project) => void;
}

export const ProjectCard: React.FC<Props> = ({
  project,
  onMatchCandidates,
  onRequestCollaboration,
}) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base">{project.title}</CardTitle>
            <div className="text-xs text-slate-500">
              Lead: <span className="font-medium text-slate-700 dark:text-slate-300">{project.lead_name || `User #${project.lead_id}`}</span>
            </div>
          </div>
          <StatusPill status={project.status} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <DepartmentBadge department={project.department} />
          <span className="text-xs text-slate-500 font-medium">
            {project.open_positions} slot{project.open_positions > 1 ? "s" : ""} open
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {project.abstract}
        </p>

        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Required Skills
          </div>
          <div className="flex flex-wrap gap-1">
            {project.required_skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md border border-indigo-200/60 bg-indigo-50/50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Tags & Focus Areas
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          onClick={() => onMatchCandidates(project)}
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Explainable Matches
        </Button>

        {onRequestCollaboration && (
          <Button
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => onRequestCollaboration(project)}
          >
            <Send className="h-3.5 w-3.5" />
            Apply / Collaborate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
