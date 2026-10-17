import React from "react";
import { Mail, GraduationCap, Sparkles } from "lucide-react";
import { Researcher } from "../../types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DepartmentBadge } from "../common/DepartmentBadge";

interface Props {
  researcher: Researcher;
  onFindMatches?: (researcher: Researcher) => void;
}

export const ResearcherCard: React.FC<Props> = ({ researcher, onFindMatches }) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{researcher.name}</CardTitle>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
              <span>{researcher.designation || researcher.role}</span>
            </div>
          </div>
          <Badge variant={researcher.role === "Faculty" ? "default" : "secondary"}>
            {researcher.role}
          </Badge>
        </div>
        <div className="mt-2">
          <DepartmentBadge department={researcher.department} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {researcher.bio || "No biography provided yet."}
        </p>

        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Research Interests
          </div>
          <div className="flex flex-wrap gap-1">
            {researcher.interests.map((interest, idx) => (
              <span
                key={idx}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Key Skills
          </div>
          <div className="flex flex-wrap gap-1">
            {researcher.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-800/60 justify-between">
        <a
          href={`mailto:${researcher.email}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          {researcher.email}
        </a>

        {onFindMatches && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => onFindMatches(researcher)}
          >
            <Sparkles className="h-3 w-3" />
            Match Projects
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
