import React from "react";
import { cn } from "../../lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  variant?: "default" | "brand" | "synergy";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const iconVariants = {
    default: "bg-slate-100 text-slate-700",
    brand: "bg-indigo-50 text-indigo-600",
    synergy: "bg-teal-50 text-teal-700",
  }[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-5 shadow-card transition-all hover:shadow-cardHover text-left",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconVariants)}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold flex items-center gap-0.5",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      {(subtitle || trend?.label) && (
        <p className="mt-1 text-xs text-slate-500">
          {trend?.label ? `${trend.label} ` : ""}
          {subtitle}
        </p>
      )}
    </div>
  );
}
