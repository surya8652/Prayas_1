import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  type = "info",
  title,
  children,
  onDismiss,
  className,
}: AlertProps) {
  const config = {
    info: {
      border: "border-indigo-200 bg-indigo-50/70 text-indigo-900",
      icon: <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />,
    },
    success: {
      border: "border-teal-200 bg-teal-50/70 text-teal-900",
      icon: <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />,
    },
    warning: {
      border: "border-amber-200 bg-amber-50/70 text-amber-900",
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />,
    },
    error: {
      border: "border-rose-200 bg-rose-50/70 text-rose-900",
      icon: <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />,
    },
  }[type];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm",
        config.border,
        className
      )}
    >
      {config.icon}
      <div className="flex-1 space-y-0.5 text-left">
        {title && <h5 className="font-bold leading-none">{title}</h5>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="rounded p-1 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
