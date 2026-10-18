import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-600 text-white shadow-xs hover:bg-indigo-700",
        secondary: "border-slate-200 bg-slate-100 text-slate-800",
        destructive: "border-rose-200 bg-rose-50 text-rose-700",
        outline: "text-slate-700 border-slate-300 bg-white",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        teal: "border-teal-200 bg-teal-50 text-teal-800 font-medium",
        synergy: "border-teal-300/80 bg-teal-50 text-teal-800 font-medium",
        accent: "border-indigo-200 bg-indigo-50 text-indigo-700",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
        navy: "border-slate-800 bg-slate-900 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
