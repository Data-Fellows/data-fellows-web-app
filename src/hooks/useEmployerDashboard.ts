import {
  EmployerStats,
  RecentApplication,
  getEmployerStats,
  getRecentApplications,
} from "@/api/problems";
import { useEffect, useState } from "react";

export function useEmployerStats() {
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEmployerStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching employer stats:", err);
        setError("Failed to load employer statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: () => setIsLoading(true) };
}

export function useRecentApplications() {
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRecentApplications();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching recent applications:", err);
        setError("Failed to load recent applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, isLoading, error, refetch: () => setIsLoading(true) };
}
