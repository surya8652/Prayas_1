import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  department: string;
  className?: string;
}

export const DepartmentBadge: React.FC<Props> = ({ department, className }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 ${className || ""}`}
    >
      {department}
    </span>
  );
};
