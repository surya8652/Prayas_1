import { useState, useEffect } from "react";
import { Researcher, Project, NotificationItem } from "../types";
import { fetchResearchers, fetchProjects } from "../services/api";
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
      try {
        const [rData, pData] = await Promise.all([
          fetchResearchers(),
          fetchProjects()
        ]);
        if (mounted) {
          setResearchers(rData);
          setProjects(pData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }

      // Check backend health
      try {
        const res = await fetch("http://localhost:5000/api/health");
        if (mounted && res.ok) {
          setBackendConnected(true);
        }
      } catch {
        if (mounted) setBackendConnected(false);
      }
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
