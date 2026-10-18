import { initialResearchers, initialProjects, initialNotifications } from "../data/mockData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchResearchers() {
  try {
    const res = await fetch(`${API_BASE}/researchers`);
    if (!res.ok) throw new Error("Failed to fetch researchers");
    return await res.json();
  } catch {
    return initialResearchers;
  }
}

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  } catch {
    return initialProjects;
  }
}

export async function createProjectApi(data: any) {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return await res.json();
  } catch {
    return {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString(),
    };
  }
}

export async function fetchProjectMatches(projectId: number) {
  try {
    const res = await fetch(`${API_BASE}/matching/project/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch matches");
    const data = await res.json();
    return data.matches || [];
  } catch {
    return [];
  }
}

export async function fetchCollaborations() {
  try {
    const res = await fetch(`${API_BASE}/collaborations`);
    if (!res.ok) throw new Error("Failed to fetch collaborations");
    return await res.json();
  } catch {
    return [
      {
        id: 1,
        project_id: 1,
        project_title: "Interdisciplinary Genomic Pattern Mining using Deep Multimodal Graphs",
        user_id: 1,
        user_name: "Dr. Aris Thorne",
        applicant_department: "Computer Science & Engineering",
        applicant_role: "Faculty",
        status: "Accepted",
        note: "Excited to offer NLP and knowledge graph integration for genomic variant mapping.",
        created_at: "2026-10-17T10:00:00Z",
      },
      {
        id: 2,
        project_id: 2,
        project_title: "Privacy-Preserving Collaborative Learning for Cross-Department Health Data",
        user_id: 3,
        user_name: "Devansh Mehta",
        applicant_department: "Data Science & AI",
        applicant_role: "Researcher",
        status: "Pending",
        note: "I have extensive experience with federated aggregation models and Docker orchestration.",
        created_at: "2026-10-18T06:30:00Z",
      },
      {
        id: 3,
        project_id: 4,
        project_title: "Robotic Surgical Teleoperation with Tactile Haptic Feedback and Edge AI",
        user_id: 4,
        user_name: "Ananya Sen",
        applicant_department: "Electronics & Communication",
        applicant_role: "Student",
        status: "Pending",
        note: "Can contribute low-latency sensor fusion telemetry from embedded nodes.",
        created_at: "2026-10-18T07:15:00Z",
      },
    ];
  }
}

export async function submitCollaborationRequest(projectId: number, userId: number, note?: string) {
  try {
    const res = await fetch(`${API_BASE}/collaborations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, user_id: userId, note }),
    });
    if (!res.ok) throw new Error("Failed to submit request");
    return await res.json();
  } catch {
    return {
      id: Date.now(),
      project_id: projectId,
      user_id: userId,
      note,
      status: "Pending",
      created_at: new Date().toISOString(),
    };
  }
}

export async function updateCollaborationStatus(reqId: number, status: string) {
  try {
    const res = await fetch(`${API_BASE}/collaborations/${reqId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return await res.json();
  } catch {
    return { id: reqId, status };
  }
}

export async function fetchNotifications() {
  try {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  } catch {
    return initialNotifications;
  }
}

export async function markAllNotificationsReadApi() {
  try {
    await fetch(`${API_BASE}/notifications/mark-all-read`, { method: "POST" });
  } catch {
    // fallback
  }
}

export async function fetchAdminOverview() {
  try {
    const res = await fetch(`${API_BASE}/admin/overview`);
    if (!res.ok) throw new Error("Failed to fetch admin overview");
    return await res.json();
  } catch {
    return {
      metrics: {
        active_researchers: 5,
        active_projects: 4,
        open_positions: 8,
        synergy_rate: "82.5%",
        total_collaborations: 12,
        accepted_collaborations: 9,
        grants_allocated: "$4.85M",
        department_count: 5,
      },
      departments: [
        { department: "Biotechnology & Biomedical Engineering", researcher_count: 1, project_count: 1, collaboration_score: 91 },
        { department: "Computer Science & Engineering", researcher_count: 1, project_count: 1, collaboration_score: 95 },
        { department: "Data Science & AI", researcher_count: 1, project_count: 0, collaboration_score: 87 },
        { department: "Electronics & Communication", researcher_count: 1, project_count: 1, collaboration_score: 88 },
        { department: "Mechanical & Aerospace Engineering", researcher_count: 1, project_count: 1, collaboration_score: 89 },
      ],
      synergy_matrix: [
        { source: "Computer Science & Engineering", target: "Biotechnology & Biomedical Engineering", active_link_count: 4, synergy_index: 94 },
        { source: "Data Science & AI", target: "Electronics & Communication", active_link_count: 2, synergy_index: 86 },
        { source: "Computer Science & Engineering", target: "Mechanical & Aerospace Engineering", active_link_count: 3, synergy_index: 91 },
      ],
      institutional_health: {
        score: 94,
        status: "Optimal Interdisciplinary Synergy",
        ethics_approval_rate: "100%",
        average_time_to_match: "2.4 days",
      },
    };
  }
}

export async function fetchVerifications() {
  try {
    const res = await fetch(`${API_BASE}/admin/verifications`);
    if (!res.ok) throw new Error("Failed to fetch verifications");
    return await res.json();
  } catch {
    return [
      {
        id: 101,
        applicant_name: "Dr. Elena Rostova",
        email: "elena.rostova@prayas.edu",
        department: "Biomedical Informatics",
        designation: "Visiting Research Scientist",
        credential: "ORCID: 0000-0002-1825-0097",
        status: "Pending Verification",
        submitted_date: "2026-10-15",
      },
      {
        id: 102,
        applicant_name: "Karthik Nambiar",
        email: "karthik.n@prayas.edu",
        department: "Quantum & Condensed Matter Physics",
        designation: "Postdoctoral Fellow",
        credential: "PhD (2025, IISc Bangalore)",
        status: "Pending Verification",
        submitted_date: "2026-10-17",
      },
    ];
  }
}

export async function approveVerificationApi(id: number) {
  try {
    const res = await fetch(`${API_BASE}/admin/verifications/${id}/approve`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to approve verification");
    return await res.json();
  } catch {
    return { success: true };
  }
}

export async function broadcastAnnouncementApi(title: string, message: string) {
  try {
    const res = await fetch(`${API_BASE}/admin/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });
    if (!res.ok) throw new Error("Failed to broadcast");
    return await res.json();
  } catch {
    return { success: true };
  }
}

export async function fetchDesignSystemTokens() {
  try {
    const res = await fetch(`${API_BASE}/design-system`);
    if (!res.ok) throw new Error("Failed to fetch design system");
    return await res.json();
  } catch {
    return null;
  }
}

export async function loginUser(email: string, role: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json();
  } catch {
    return {
      token: "demo_token",
      user: {
        id: 1,
        name: "Dr. Aris Thorne",
        email: email || "aris.thorne@prayas.edu",
        role: role || "Faculty",
        department: "Computer Science & Engineering",
      },
    };
  }
}
