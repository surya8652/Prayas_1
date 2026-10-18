import { useState, useEffect } from "react";
import { Researcher, Project, NotificationItem } from "../types";
import { fetchResearchers, fetchProjects, fetchNotifications, checkBackendHealth } from "../services/api";
import { initialNotifications } from "../data/mockData";

export function usePrayasData() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // Check backend health first
      const isHealthy = await checkBackendHealth();
      if (mounted) setBackendConnected(isHealthy);

      try {
        const [rData, pData] = await Promise.all([
          fetchResearchers(),
          fetchProjects(),
        ]);
        if (mounted) {
          setResearchers(rData);
          setProjects(pData);
        }
      } catch (e) {
        console.error("Failed to load researchers/projects:", e);
      }

      // Load notifications from backend if available
      if (isHealthy) {
        try {
          const nData = await fetchNotifications();
          if (mounted && nData && nData.length > 0) {
            // Normalize backend notification shape to frontend NotificationItem
            const normalized: NotificationItem[] = nData.map((n: any) => ({
              id: n.id ?? `notif-${n.db_id}`,
              title: n.title,
              message: n.message,
              type: n.type as NotificationItem["type"],
              timestamp: n.timestamp ?? n.timestamp_str ?? "Just now",
              read: n.read ?? false,
            }));
            setNotifications(normalized);
          }
        } catch (e) {
          console.error("Failed to load notifications:", e);
          // Keep mock data as fallback
        }
      }

      if (mounted) setIsLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    researchers,
    projects,
    notifications,
    isLoading,
    backendConnected,
    setNotifications,
    setProjects,
    setResearchers,
  };
}

