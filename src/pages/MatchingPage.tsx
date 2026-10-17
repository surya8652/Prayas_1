import React, { useState } from "react";
import { Sparkles, BrainCircuit, ArrowRight, CheckCircle2 } from "lucide-react";
import { Project, MatchCandidate } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DepartmentBadge } from "../components/common/DepartmentBadge";

interface Props {
  projects: Project[];
  onTriggerMatch: (p: Project) => void;
}

export const MatchingPage: React.FC<Props> = ({ projects, onTriggerMatch }) => {
  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 dark:border-indigo-950 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-slate-900">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Explainable Researcher Matching Engine
              </h1>
              <Badge variant="success">Algorithm v1.0</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Unlike black-box recommendation systems, PRAYAS provides transparent mathematical scoring and natural language rationales. The model calculates exact skill overlap, research interest alignment, and cross-departmental collaboration synergy bonuses.
            </p>
          </div>
        </div>

        {/* Scoring Formula visual */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-indigo-200/50 dark:border-indigo-900/50">
          <div className="rounded-xl bg-white/80 p-4 shadow-xs dark:bg-slate-900/80">
            <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">45% Weight</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">Required Skills Overlap</div>
            <p className="text-[11px] text-slate-500 mt-1">Exact match ratio between project requisites and candidate technical skills.</p>
          </div>
          <div className="rounded-xl bg-white/80 p-4 shadow-xs dark:bg-slate-900/80">
            <div className="text-xs font-semibold text-purple-700 dark:text-purple-400">35% Weight</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">Domain & Topic Alignment</div>
            <p className="text-[11px] text-slate-500 mt-1">Intersection of project focus areas with faculty research keywords.</p>
          </div>
          <div className="rounded-xl bg-white/80 p-4 shadow-xs dark:bg-slate-900/80">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">20% Weight</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">Interdisciplinary Synergy</div>
            <p className="text-[11px] text-slate-500 mt-1">Cross-department bonus incentivizing college-wide collaboration.</p>
          </div>
        </div>
      </div>

      {/* Select Project to run match */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Select a Target Project to Match
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Click "Run Explainable Match" on any project below to compute real-time scores and candidate rationale.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Card key={p.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-base">{p.title}</CardTitle>
                <div className="mt-2">
                  <DepartmentBadge department={p.department} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {p.abstract}
                </p>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.required_skills.map((s, idx) => (
                      <span key={idx} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Button
                  className="w-full text-xs gap-2"
                  onClick={() => onTriggerMatch(p)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Run Explainable Match
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
