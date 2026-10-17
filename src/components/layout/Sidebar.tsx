import React from "react";
import { LayoutDashboard, Users, FolderGit2, Sparkles, Building2 } from "lucide-react";
import { cn } from "../../lib/utils";

export type NavTab = "dashboard" | "researchers" | "projects" | "matching";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const items: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "researchers", label: "Faculty & Researchers", icon: Users },
    { id: "projects", label: "Research Projects", icon: FolderGit2 },
    { id: "matching", label: "Explainable Matching", icon: Sparkles },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/60 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-left",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
              {item.label}
              {item.id === "matching" && (
                <span className="ml-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 p-4 dark:border-indigo-950 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
          <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Cross-Departmental
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          PRAYAS bridges silos between Engineering, Medicine, Science, and Humanities.
        </p>
      </div>
    </aside>
  );
};
