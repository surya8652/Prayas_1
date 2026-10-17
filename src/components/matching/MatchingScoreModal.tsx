import React from "react";
import { X, Sparkles, CheckCircle2, Building, BrainCircuit } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Explainable Researcher Matching
                </h2>
                <Badge variant="accent" className="text-[10px]">Algorithm v1.0</Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                Target: {project.title}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="text-sm">Running multi-attribute explainable matching...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium">No candidate matches scored yet for this project.</p>
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
                      ? "border-indigo-300 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/30 dark:border-indigo-800 dark:from-indigo-950/20"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {r.name}
                        </span>
                        <Badge variant="secondary">{r.role}</Badge>
                        {isTop && (
                          <Badge variant="success" className="text-[10px]">
                            ★ Top Match
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <DepartmentBadge department={r.department} />
                        {item.is_cross_department && (
                          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Building className="h-3 w-3" /> Interdisciplinary
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Overall score gauge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                          {item.score}%
                        </div>
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Match Score
                        </div>
                      </div>
                      {onSendInvite && (
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() => onSendInvite(item)}
                        >
                          Invite
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Explainability section */}
                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60 space-y-2">
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                      <div>
                        <span className="font-semibold">Why this match: </span>
                        {item.explanation}
                      </div>
                    </div>

                    {/* Breakdown bars */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <div>
                        <span className="text-slate-400">Skills ({item.breakdown.skill_score}/45)</span>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(item.breakdown.skill_score / 45) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Interests ({item.breakdown.interest_score}/35)</span>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(item.breakdown.interest_score / 35) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Synergy ({item.breakdown.synergy_score}/20)</span>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
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
        <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500">
          <span>Formula: 45% Required Skills + 35% Domain Overlap + 20% Interdisciplinary Synergy</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
