import React from "react";
import { Bell, Search, Sparkles, Network } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Props {
  unreadCount?: number;
  onOpenNotifications?: () => void;
  backendConnected: boolean;
}

export const Navbar: React.FC<Props> = ({
  unreadCount = 0,
  onOpenNotifications,
  backendConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20 text-white">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                PRAYAS
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Research OS
              </span>
            </div>
            <p className="text-xs text-slate-500">Coordination & Collaboration Platform</p>
          </div>
        </div>

        {/* Global Search / Status */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                backendConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            {backendConnected ? "Backend Connected (Flask)" : "Offline Prototype Mode"}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onOpenNotifications}
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold">
              AT
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Dr. Aris Thorne</div>
              <div className="text-slate-400">Computer Science</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
