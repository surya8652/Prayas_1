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
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  notifications,
  onMarkAllRead,
  backendConnected,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col">
      <Navbar
        unreadCount={unreadCount}
        onOpenNotifications={() => setDrawerOpen(true)}
        backendConnected={backendConnected}
      />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
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
