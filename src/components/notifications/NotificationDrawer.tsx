import React from "react";
import { X, Bell, Sparkles, UserPlus, Megaphone, Check } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative h-full w-full max-w-md bg-white p-6 shadow-modal border-l border-slate-200 flex flex-col z-10 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
              <p className="text-[11px] text-slate-400">Activity and matching alerts</p>
            </div>
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

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-3.5 transition-all text-xs ${
                  !n.read
                    ? "border-indigo-200 bg-indigo-50/50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 rounded-lg p-1.5 shrink-0 bg-indigo-50 text-indigo-600">
                    {n.type === "match" ? (
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    ) : n.type === "announcement" ? (
                      <Megaphone className="h-3.5 w-3.5 text-amber-600" />
                    ) : (
                      <UserPlus className="h-3.5 w-3.5 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Synced with university notifications</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};
