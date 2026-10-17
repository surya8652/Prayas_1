export interface Researcher {
  id: number;
  name: string;
  email: string;
  role: "Faculty" | "Researcher" | "Student" | string;
  department: string;
  designation?: string;
  bio?: string;
  interests: string[];
  skills: string[];
  created_at?: string;
}

export interface Project {
  id: number;
  title: string;
  abstract: string;
  department: string;
  lead_id: number;
  lead_name?: string;
  status: "Recruiting" | "In Progress" | "Completed" | string;
  tags: string[];
  required_skills: string[];
  open_positions: number;
  created_at?: string;
}

export interface CollaborationRequest {
  id: number;
  project_id: number;
  project_title?: string;
  user_id: number;
  user_name?: string;
  status: "Pending" | "Accepted" | "Rejected" | string;
  note?: string;
  created_at?: string;
}

export interface MatchBreakdown {
  skill_score: number;
  interest_score: number;
  synergy_score: number;
}

export interface MatchCandidate {
  researcher: Researcher;
  score: number;
  breakdown: MatchBreakdown;
  matched_skills: string[];
  matched_interests: string[];
  is_cross_department: boolean;
  explanation: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "collab" | "match" | "system";
  timestamp: string;
  read: boolean;
}
