import React from "react";
import { Bell, Sparkles, Network, Menu, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  unreadCount?: number;
  onOpenNotifications?: () => void;
  backendConnected: boolean;
  onNavigateLanding?: () => void;
  onToggleMobileSidebar?: () => void;
  activeRole?: string;
  onSelectRole?: (role: string) => void;
}

export const Navbar: React.FC<Props> = ({
  unreadCount = 0,
  onOpenNotifications,
  backendConnected,
  onNavigateLanding,
  onToggleMobileSidebar,
  activeRole = "Faculty",
  onSelectRole,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-subtle">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 font-heading">
                  PRAYAS
                </span>
                <span className="hidden sm:inline-block rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                  Research OS
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Academic Collaboration Platform
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Backend Status indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs text-slate-600">
            <span
              className={`h-2 w-2 rounded-full ${
                backendConnected ? "bg-teal-600" : "bg-amber-400"
              }`}
            />
            <span className="font-medium">
              {backendConnected ? "Python Backend Connected" : "Local Standalone Mode"}
            </span>
          </div>

          {/* Public Portal Switcher */}
          {onNavigateLanding && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-xs text-slate-600 hover:text-indigo-600 gap-1.5"
              onClick={onNavigateLanding}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Public Portal
            </Button>
          )}

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 hover:text-slate-900"
            onClick={onOpenNotifications}
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              AT
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-slate-900 leading-tight">Dr. Aris Thorne</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {activeRole} • Computer Science
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
