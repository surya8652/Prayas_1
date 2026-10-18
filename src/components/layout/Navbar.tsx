import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Sparkles,
  Network,
  Menu,
  ExternalLink,
  LogOut,
  Search,
  UserCheck,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  unreadCount?: number;
  onOpenNotifications?: () => void;
  backendConnected: boolean;
  onNavigateLanding?: () => void;
  onToggleMobileSidebar?: () => void;
  activeRole?: string;
  onSelectRole?: (role: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  onNavigateProfile?: () => void;
  onNavigateOnboarding?: () => void;
  onSearch?: (q: string) => void;
}

export const Navbar: React.FC<Props> = ({
  unreadCount = 0,
  onOpenNotifications,
  backendConnected,
  onNavigateLanding,
  onToggleMobileSidebar,
  activeRole = "Faculty",
  onSelectRole,
  currentUser,
  onLogout,
  onNavigateProfile,
  onNavigateOnboarding,
  onSearch,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = currentUser?.full_name || currentUser?.name || "Dr. Aris Thorne";
  const displayRole = currentUser?.role || activeRole;
  const displayDept = currentUser?.department || "Computer Science";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-subtle">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

        {/* Global Search Field */}
        <div className="flex-1 max-w-md hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search researchers, projects, grants, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
            />
          </form>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Backend Status indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs text-slate-600">
            <span
              className={`h-2 w-2 rounded-full ${
                backendConnected ? "bg-teal-600" : "bg-amber-400"
              }`}
            />
            <span className="text-[11px] font-medium">
              {backendConnected ? "Python Connected" : "Local Mode"}
            </span>
          </div>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 hover:text-slate-900 h-9 w-9"
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

          {/* User Avatar with Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {initials || "U"}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                  {displayRole}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-modal z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
                {/* Header in dropdown */}
                <div className="p-2 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{displayName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser?.email || "academic@prayas.edu"}</div>
                  <div className="text-[11px] text-indigo-700 font-medium mt-0.5">{displayDept}</div>
                </div>

                <div className="py-1 text-xs">
                  {onNavigateProfile && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigateProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                  )}

                  {onNavigateOnboarding && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigateOnboarding();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Sparkles className="h-4 w-4 text-teal-600" />
                      <span>Complete / Edit Profile</span>
                    </button>
                  )}

                  {onNavigateLanding && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigateLanding();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                      <span>Public Portal</span>
                    </button>
                  )}
                </div>

                {onLogout && (
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
