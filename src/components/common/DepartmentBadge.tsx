import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  department: string;
  className?: string;
}

export const DepartmentBadge: React.FC<Props> = ({ department, className }) => {
  return (
    <Badge
      variant="outline"
      className={`border-indigo-200 bg-indigo-50/70 text-indigo-700 font-medium dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 ${className || ""}`}
    >
      {department}
    </Badge>
  );
};
