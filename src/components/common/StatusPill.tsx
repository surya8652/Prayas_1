import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  status: string;
}

export const StatusPill: React.FC<Props> = ({ status }) => {
  const norm = status.toLowerCase();
  if (norm.includes("recruit") || norm.includes("open")) {
    return (
      <Badge variant="success" className="animate-pulse">
        ● {status}
      </Badge>
    );
  }
  if (norm.includes("progress")) {
    return <Badge variant="accent">⚡ {status}</Badge>;
  }
  return <Badge variant="secondary">✓ {status}</Badge>;
};
