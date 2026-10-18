import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  FolderGit2,
  TrendingUp,
  CheckCircle2,
  Bell,
  Sparkles,
  Award,
  Send,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { StatCard } from "../components/ui/stat-card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { Modal } from "../components/ui/modal";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Alert } from "../components/ui/alert";
import {
  fetchAdminOverview,
  fetchVerifications,
  approveVerificationApi,
  broadcastAnnouncementApi,
} from "../services/api";

export const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [ov, verifs] = await Promise.all([fetchAdminOverview(), fetchVerifications()]);
    setOverview(ov);
    setVerifications(verifs);
    setIsLoading(false);
  };

  const handleApproveVerification = async (id: number) => {
    await approveVerificationApi(id);
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "Verified & Approved" } : v))
    );
    setActionNotice("Faculty credentials verified and approved for university collaboration.");
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    await broadcastAnnouncementApi(broadcastTitle, broadcastMessage);
    setIsBroadcastModalOpen(false);
    setBroadcastTitle("");
    setBroadcastMessage("");
    setActionNotice("Institutional announcement broadcasted to all campus departments.");
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-2.5 py-1 text-xs font-bold mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
            Institutional Governance & Dean Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Research Administration Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional metrics, cross-college synergy rates, and compliance oversight.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          className="gap-2 shrink-0"
          onClick={() => setIsBroadcastModalOpen(true)}
        >
          <Bell className="h-4 w-4" />
          Broadcast Institutional Call
        </Button>
      </div>

      {actionNotice && (
        <Alert type="success" title="Administrative Notice">
          {actionNotice}
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Synergy Index"
          value={overview?.metrics?.synergy_rate || "84.2%"}
          subtitle="Cross-department links"
          trend={{ value: "+4.8% this term", isPositive: true }}
          variant="synergy"
        />
        <StatCard
          title="Active Projects"
          value={overview?.metrics?.active_projects || "4"}
          subtitle="Funded initiatives"
          variant="brand"
        />
        <StatCard
          title="Total Faculty & Fellows"
          value={overview?.metrics?.active_researchers || "5"}
          subtitle="Registered scholars"
          variant="default"
        />
        <StatCard
          title="Grants Monitored"
          value={overview?.metrics?.grants_allocated || "$4.85M"}
          subtitle="Interdisciplinary funds"
          variant="default"
        />
      </div>

      {/* Interdisciplinary Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              Departmental Collaboration Matrix
            </CardTitle>
            <CardDescription>
              Cross-college partnership frequency between academic disciplines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(overview?.synergy_matrix || []).map((link: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-white hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">
                    {link.source}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="text-indigo-600">⇄</span>
                    <span className="line-clamp-1">{link.target}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-teal-700">
                    {link.synergy_index}%
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {link.active_link_count} active ties
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Faculty Ethics & Affiliation Verification
            </CardTitle>
            <CardDescription>
              Scholars pending credential review before publishing grant initiatives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {verifications.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-slate-200 p-3.5 space-y-2 bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{v.applicant_name}</span>
                    <div className="text-xs text-slate-500">{v.department} • {v.designation}</div>
                  </div>
                  <Badge variant={v.status.includes("Approved") ? "teal" : "warning"}>
                    {v.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-400 font-mono text-[11px]">{v.credential}</span>
                  {!v.status.includes("Approved") && (
                    <Button
                      size="sm"
                      variant="synergy"
                      className="text-xs h-7 px-2.5"
                      onClick={() => handleApproveVerification(v.id)}
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Broadcast Institutional Call for Proposals"
        description="This will send an accredited announcement notification to all researchers across all campus faculties."
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <Input
            label="Call Title / Subject"
            placeholder="e.g. 2026 University Interdisciplinary Seed Grant Round 2"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            required
          />

          <Textarea
            label="Notice Description & Eligibility"
            placeholder="Outline grant parameters, collaborating departments, and submission deadline..."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            rows={4}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsBroadcastModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
