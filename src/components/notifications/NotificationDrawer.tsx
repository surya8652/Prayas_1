import React from "react";
import { X, Bell, Check, Sparkles, UserPlus } from "lucide-react";
import { NotificationItem } from "../../types";
import { Button } from "../ui/button";

interface Props {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={onMarkAllRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-12">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-3.5 transition-all text-xs ${
                  !n.read
                    ? "border-indigo-200 bg-indigo-50/40 dark:border-indigo-900/50 dark:bg-indigo-950/20"
                    : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 rounded-lg bg-indigo-100 p-1.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {n.type === "match" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
