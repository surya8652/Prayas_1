import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Sparkles,
  Building2,
  GitPullRequest,
  Bell,
  ShieldCheck,
  Palette,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type NavTab =
  | "dashboard"
  | "researchers"
  | "projects"
  | "matching"
  | "requests"
  | "notifications"
  | "admin"
  | "design-system"
  | "landing"
  | "login";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingRequestsCount?: number;
  unreadNotifsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount = 2,
  unreadNotifsCount = 0,
  isOpenMobile,
  onCloseMobile,
}) => {
  const primaryItems = [
    { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "researchers" as NavTab, label: "Faculty & Directory", icon: Users },
    { id: "projects" as NavTab, label: "Research Projects", icon: FolderGit2 },
    {
      id: "matching" as NavTab,
      label: "Explainable Matching",
      icon: Sparkles,
      badge: "AI",
    },
    {
      id: "requests" as NavTab,
      label: "Collaboration Requests",
      icon: GitPullRequest,
      counter: pendingRequestsCount,
    },
    {
      id: "notifications" as NavTab,
      label: "Notifications",
      icon: Bell,
      counter: unreadNotifsCount,
    },
  ];

  const adminItems = [
    { id: "admin" as NavTab, label: "Institutional Admin", icon: ShieldCheck },
    {
      id: "design-system" as NavTab,
      label: "Design System Showcase",
      icon: Palette,
      highlight: true,
    },
  ];

  const renderNavButton = (item: any) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          onSelectTab(item.id);
          onCloseMobile?.();
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all text-left group",
          isActive
            ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 pl-2.5 font-bold shadow-2xs"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
          )}
        />
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
            {item.badge}
          </span>
        )}
        {item.counter > 0 && (
          <span className="rounded-full bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 text-[10px] font-bold">
            {item.counter}
          </span>
        )}
        {item.highlight && (
          <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            UI Kit
          </span>
        )}
      </button>
    );
  };

  const content = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Academic Platform Navigation */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Platform Workspaces
          </div>
          {primaryItems.map(renderNavButton)}
        </div>

        {/* Governance & UI Standards */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Institutional Oversight
          </div>
          {adminItems.map(renderNavButton)}
        </div>
      </div>

      {/* Interdisciplinary Badge Note */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
          <span>Interdisciplinary Synergy</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
          PRAYAS connects departmental silos across Engineering, Medicine, Science, and Humanities.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-72 max-w-full bg-white h-full shadow-modal">
            {content}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
