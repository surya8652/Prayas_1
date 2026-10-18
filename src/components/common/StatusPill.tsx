import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  status: string;
}

export const StatusPill: React.FC<Props> = ({ status }) => {
  const norm = (status || "").toLowerCase();
  if (norm.includes("recruit") || norm.includes("open") || norm.includes("accept")) {
    return (
      <Badge variant="teal" className="gap-1 font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-600 inline-block" />
        {status}
      </Badge>
    );
  }
  if (norm.includes("progress") || norm.includes("pending")) {
    return (
      <Badge variant="accent" className="gap-1 font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 inline-block" />
        {status}
      </Badge>
    );
  }
  if (norm.includes("reject") || norm.includes("decline") || norm.includes("closed")) {
    return (
      <Badge variant="destructive" className="gap-1 font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-600 inline-block" />
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500 inline-block" />
      {status}
    </Badge>
  );
};
