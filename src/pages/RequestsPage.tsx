import React, { useState, useEffect } from "react";
import { GitPullRequest, Check, X, Clock, MessageSquare, Send, Sparkles, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { EmptyState } from "../components/ui/empty-state";
import { DepartmentBadge } from "../components/common/DepartmentBadge";
import { StatusPill } from "../components/common/StatusPill";
import { fetchCollaborations, updateCollaborationStatus } from "../services/api";

interface Props {
  onNavigateToProjects?: () => void;
  onRequestAccepted?: (title: string) => void;
}

export const RequestsPage: React.FC<Props> = ({ onNavigateToProjects, onRequestAccepted }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("received");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    const data = await fetchCollaborations();
    setRequests(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (reqId: number, newStatus: string) => {
    await updateCollaborationStatus(reqId, newStatus);
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
    );
    if (newStatus === "Accepted") {
      onRequestAccepted?.(`Accepted collaboration proposal #${reqId}`);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">
            Collaboration Proposals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and manage cross-departmental partnership requests from faculty and researchers.
          </p>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["all", "pending", "accepted", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="received" badge={<span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">{requests.length}</span>}>
            Incoming Inquiries
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4 pt-2">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">Loading proposals...</div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title="No collaboration requests matching criteria"
              description="You currently have no proposals under this status filter. You can explore open projects or find new research candidates."
              actionLabel="Browse Projects"
              onAction={onNavigateToProjects}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map((req) => (
                <Card key={req.id} className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-slate-900">
                          {req.user_name || `User #${req.user_id}`}
                        </span>
                        {req.applicant_role && (
                          <Badge variant="secondary">{req.applicant_role}</Badge>
                        )}
                        <StatusPill status={req.status} />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Affiliation:</span>
                        <DepartmentBadge department={req.applicant_department || "Biomedical / Science"} />
                        <span>•</span>
                        <span>Target Initiative:</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {req.project_title || `Project #${req.project_id}`}
                        </span>
                      </div>

                      {req.note && (
                        <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900 block mb-1">Proposal Pitch:</span>
                          "{req.note}"
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 md:self-center">
                      {req.status === "Pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="synergy"
                            className="gap-1 text-xs"
                            onClick={() => handleStatusChange(req.id, "Accepted")}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                            onClick={() => handleStatusChange(req.id, "Rejected")}
                          >
                            <X className="h-3.5 w-3.5" />
                            Decline
                          </Button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 font-medium">
                          Decision recorded
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="pt-2">
          <EmptyState
            title="No outgoing applications currently pending"
            description="When you apply to join another faculty member's research initiative, your proposals will appear here for tracking."
            actionLabel="Discover Open Projects"
            onAction={onNavigateToProjects}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
