import React from "react";
import { X, Sparkles, CheckCircle2, Building, BrainCircuit, Send } from "lucide-react";
import { MatchCandidate, Project } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DepartmentBadge } from "../common/DepartmentBadge";

interface Props {
  project: Project | null;
  matches: MatchCandidate[];
  isLoading: boolean;
  onClose: () => void;
  onSendInvite?: (candidate: MatchCandidate) => void;
}

export const MatchingScoreModal: React.FC<Props> = ({
  project,
  matches,
  isLoading,
  onClose,
  onSendInvite,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-modal border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden z-10 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  Explainable Candidate Match Results
                </h2>
                <Badge variant="teal" className="text-[10px]">Algorithm v1.0</Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                Target Initiative: <span className="font-semibold text-slate-700">{project.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
              <p className="text-xs font-semibold text-slate-600">Running multi-attribute explainable matching...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No candidate matches scored yet for this project.</p>
              <p className="text-xs text-slate-400 mt-1">Make sure other faculty and students are registered.</p>
            </div>
          ) : (
            matches.map((item, idx) => {
              const r = item.researcher;
              const isTop = idx === 0;
              return (
                <div
                  key={r.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isTop
                      ? "border-indigo-200 bg-indigo-50/20"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-slate-900">
                          {r.name}
                        </span>
                        <Badge variant="secondary">{r.role}</Badge>
                        {isTop && (
                          <Badge variant="teal" className="text-[10px]">
                            ★ Top Match
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <DepartmentBadge department={r.department} />
                        {item.is_cross_department && (
                          <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                            <Building className="h-3 w-3" /> Interdisciplinary
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Overall score */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-black text-indigo-600 font-heading">
                          {item.score}%
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Match Score
                        </div>
                      </div>
                      {onSendInvite && (
                        <Button
                          size="sm"
                          variant="synergy"
                          className="text-xs gap-1"
                          onClick={() => onSendInvite(item)}
                        >
                          <Send className="h-3 w-3" />
                          Invite
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Explainability section */}
                  <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200/60 p-3 text-xs space-y-2">
                    <div className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Why this match: </span>
                        {item.explanation}
                      </div>
                    </div>

                    {/* Breakdown bars */}
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-medium">Skills ({item.breakdown.skill_score}/45)</span>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${(item.breakdown.skill_score / 45) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Domain ({item.breakdown.interest_score}/35)</span>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${(item.breakdown.interest_score / 35) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Synergy ({item.breakdown.synergy_score}/20)</span>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${(item.breakdown.synergy_score / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 p-4 bg-slate-50 text-xs text-slate-500 gap-2">
          <span>Formula: 45% Required Skills + 35% Domain Overlap + 20% Interdisciplinary Synergy</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
