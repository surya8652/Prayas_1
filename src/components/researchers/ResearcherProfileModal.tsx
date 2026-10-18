import React from "react";
import { Mail, GraduationCap, Building2, Sparkles, Send, Award, BookOpen } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DepartmentBadge } from "../common/DepartmentBadge";
import { Researcher } from "../../types";

interface Props {
  researcher: Researcher | null;
  isOpen: boolean;
  onClose: () => void;
  onFindMatches?: (r: Researcher) => void;
  onRequestCollab?: (r: Researcher) => void;
}

export const ResearcherProfileModal: React.FC<Props> = ({
  researcher,
  isOpen,
  onClose,
  onFindMatches,
  onRequestCollab,
}) => {
  if (!researcher) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {researcher.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{researcher.name}</div>
            <div className="text-xs text-slate-500 font-normal">
              {researcher.designation || researcher.role}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <a
            href={`mailto:${researcher.email}`}
            className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1.5"
          >
            <Mail className="h-3.5 w-3.5" />
            {researcher.email}
          </a>

          <div className="flex items-center gap-2">
            {onFindMatches && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => {
                  onClose();
                  onFindMatches(researcher);
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Match Projects
              </Button>
            )}
            {onRequestCollab && (
              <Button
                variant="default"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => {
                  onClose();
                  onRequestCollab(researcher);
                }}
              >
                <Send className="h-3.5 w-3.5" />
                Contact Researcher
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-left">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Department & Affiliation
          </span>
          <DepartmentBadge department={researcher.department} />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Biography & Research Scope
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
            {researcher.bio || "No biography provided yet for this scholar."}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Research Interests & Focus Areas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {researcher.interests.map((interest, idx) => (
              <span
                key={idx}
                className="rounded-md bg-slate-100 border border-slate-200/60 px-2.5 py-1 text-xs text-slate-700"
              >
                #{interest}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Technical & Methodological Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {researcher.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md border border-indigo-200 bg-indigo-50/60 px-2.5 py-1 text-xs font-semibold text-indigo-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
