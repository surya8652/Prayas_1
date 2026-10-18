import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar, NavTab } from "../components/layout/Sidebar";
import { NotificationDrawer } from "../components/notifications/NotificationDrawer";
import { NotificationItem } from "../types";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  backendConnected: boolean;
  pendingRequestsCount?: number;
  currentUser?: any;
  onLogout?: () => void;
  onSearch?: (q: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  notifications,
  onMarkAllRead,
  backendConnected,
  pendingRequestsCount = 0,
  currentUser,
  onLogout,
  onSearch,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        unreadCount={unreadCount}
        onOpenNotifications={() => setDrawerOpen(true)}
        backendConnected={backendConnected}
        onNavigateLanding={() => onSelectTab("landing")}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigateProfile={() => onSelectTab("profile")}
        onNavigateOnboarding={() => onSelectTab("onboarding")}
        onSearch={onSearch}
      />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          pendingRequestsCount={pendingRequestsCount}
          unreadNotifsCount={unreadCount}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          currentUser={currentUser}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 transition-all">
          {children}
        </main>
      </div>

      <NotificationDrawer
        isOpen={drawerOpen}
        notifications={notifications}
        onClose={() => setDrawerOpen(false)}
        onMarkAllRead={onMarkAllRead}
      />
    </div>
  );
};
