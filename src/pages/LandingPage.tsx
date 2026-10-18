import React from "react";
import {
  Network,
  Sparkles,
  ArrowRight,
  Users,
  FolderGit2,
  Building2,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { StatCard } from "../components/ui/stat-card";
import { DepartmentBadge } from "../components/common/DepartmentBadge";

interface Props {
  onEnterApp: () => void;
  onGoLogin: () => void;
  onGoDesignSystem: () => void;
  onGoRegister?: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onEnterApp,
  onGoLogin,
  onGoDesignSystem,
  onGoRegister,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Public Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-heading">
                PRAYAS
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                Academic Research OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoDesignSystem}
              className="text-xs text-slate-600 hover:text-indigo-600"
            >
              Design System
            </Button>
            {onGoRegister && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoRegister}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Register
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onGoLogin}
              className="text-xs font-semibold"
            >
              University Sign In
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onEnterApp}
              className="text-xs font-semibold gap-1.5"
            >
              Launch Platform
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Next-Generation University Research Collaboration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              Bridging Academic Silos Through{" "}
              <span className="text-indigo-600">Explainable Intelligence</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              PRAYAS connects faculty, research scholars, and students across Engineering, Medicine, Science, and Humanities. Discover interdisciplinary initiatives with transparent algorithmic matching.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button size="lg" onClick={onEnterApp} className="gap-2">
                Explore Research Hub
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onGoLogin}>
                Sign In With Institutional SSO
              </Button>
            </div>
          </div>

          {/* Institutional Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
            <StatCard
              title="Active Researchers"
              value="500+"
              subtitle="Faculty & scholars"
              variant="brand"
            />
            <StatCard
              title="Synergy Score"
              value="84.2%"
              subtitle="Cross-department rate"
              variant="synergy"
            />
            <StatCard
              title="Funded Projects"
              value="120+"
              subtitle="Multi-disciplinary"
              variant="default"
            />
            <StatCard
              title="Ethics Compliance"
              value="100%"
              subtitle="Institutional audit"
              variant="default"
            />
          </div>
        </section>

        {/* Core Pillars */}
        <section className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge variant="teal">Trustworthy & Practical</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                Designed for Rigorous Academic Workflows
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Built specifically for university research teams requiring explainability, governance, and transparent collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-cardHover transition-all">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Explainable AI Matching</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transparent formula: 45% skills overlap, 35% research interests, and 20% cross-department synergy. No black boxes.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-cardHover transition-all">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Interdisciplinary Synergy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Breaks down administrative silos between computer scientists, biologists, clinicians, and engineers.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-cardHover transition-all">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Institutional Governance</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Deans and research officers monitor departmental metrics, grant synergy, and compliance verification requests.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PRAYAS Academic Platform</span>
            <span>•</span>
            <span>Research Coordination System</span>
          </div>
          <div>
            Adheres to University IT Governance & Accessible Higher-Ed Standards.
          </div>
        </div>
      </footer>
    </div>
  );
};
