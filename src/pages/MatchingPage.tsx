import React from "react";
import { Sparkles, BrainCircuit, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Project } from "../types";
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
    <div className="space-y-8 text-left">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading">
                Explainable Research Matching Engine
              </h1>
              <Badge variant="teal">Algorithm v1.0</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Unlike opaque black-box recommendations, PRAYAS provides transparent mathematical scoring and natural language rationales. The model calculates exact skill overlap, research interest alignment, and cross-departmental collaboration synergy bonuses.
            </p>
          </div>
        </div>

        {/* Scoring Formula Visual */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
            <div className="text-xs font-bold text-indigo-700">45% Weight</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Required Skills Overlap</div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Exact match ratio between project requisites and candidate technical skills.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
            <div className="text-xs font-bold text-purple-700">35% Weight</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Domain & Topic Overlap</div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Intersection of project focus areas with faculty research keywords.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
            <div className="text-xs font-bold text-teal-700">20% Weight</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Interdisciplinary Synergy</div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cross-department bonus incentivizing college-wide collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* Select Project to run match */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Select Target Initiative to Run Matching
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Click "Run Explainable Match" on any initiative below to compute real-time scores and candidate rationale.
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
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {p.abstract}
                </p>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Target Skills:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.required_skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-indigo-200 bg-indigo-50/60 px-1.5 py-0.5 text-[10px] text-indigo-700 font-semibold"
                      >
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
