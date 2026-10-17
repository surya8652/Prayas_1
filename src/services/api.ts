import { Researcher, Project, CollaborationRequest, MatchCandidate } from "../types";
import { initialResearchers, initialProjects } from "../data/mockData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchResearchers(): Promise<Researcher[]> {
  try {
    const res = await fetch(`${API_BASE}/researchers`);
    if (!res.ok) throw new Error("Failed to fetch researchers");
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using initial researchers data", err);
    return initialResearchers;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using initial projects data", err);
    return initialProjects;
  }
}

export async function fetchProjectMatches(projectId: number): Promise<MatchCandidate[]> {
  try {
    const res = await fetch(`${API_BASE}/matching/project/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch matches");
    const data = await res.json();
    return data.matches || [];
  } catch (err) {
    console.warn("Backend unavailable, generating local simulated match", err);
    return [];
  }
}

export async function submitCollaborationRequest(
  projectId: number,
  userId: number,
  note?: string
): Promise<CollaborationRequest> {
  const res = await fetch(`${API_BASE}/collaborations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_id: projectId, user_id: userId, note }),
  });
  if (!res.ok) throw new Error("Failed to submit request");
  return await res.json();
}
