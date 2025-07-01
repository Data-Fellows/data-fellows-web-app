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

  useEffect(() => {
    fetchStats();

    // Listen for problem posted events to refetch data
    const handleProblemPosted = () => {
      fetchStats();
    };

    window.addEventListener("problemPosted", handleProblemPosted);

    return () => {
      window.removeEventListener("problemPosted", handleProblemPosted);
    };
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
}

export function useRecentApplications() {
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchApplications();

    // Listen for problem posted events to refetch data
    const handleProblemPosted = () => {
      fetchApplications();
    };

    window.addEventListener("problemPosted", handleProblemPosted);

    return () => {
      window.removeEventListener("problemPosted", handleProblemPosted);
    };
  }, []);

  return { applications, isLoading, error, refetch: fetchApplications };
}
