import {
  getDashboardStats,
  getSuggestedMatches,
  getUserApplications,
  getUserProfile,
  type Application,
  type DashboardStats,
  type JobMatch,
  type UserProfile,
} from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

// Dashboard stats query
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    refetchOnMount: false, // Don't refetch if data exists
    refetchOnReconnect: true, // Only refetch on network reconnect
  });
};

// User profile query
export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
    staleTime: 30 * 60 * 1000, // 30 minutes - profile data changes rarely
    gcTime: 60 * 60 * 1000, // 1 hour - keep profile data longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

// Suggested matches query
export const useSuggestedMatches = () => {
  return useQuery<JobMatch[]>({
    queryKey: ["jobs", "suggested"],
    queryFn: getSuggestedMatches,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    select: (data) => data?.slice(0, 3) || [], // Show only 3 suggested jobs
  });
};

// User applications query
export const useUserApplications = () => {
  return useQuery<Application[]>({
    queryKey: ["applications", "my"],
    queryFn: getUserApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes - applications might change more frequently
    gcTime: 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

// Combined dashboard data hook
export const useDashboardData = () => {
  const statsQuery = useDashboardStats();
  const profileQuery = useUserProfile();
  const matchesQuery = useSuggestedMatches();
  const applicationsQuery = useUserApplications();

  const isLoading =
    statsQuery.isLoading ||
    profileQuery.isLoading ||
    matchesQuery.isLoading ||
    applicationsQuery.isLoading;

  const hasError =
    statsQuery.isError ||
    profileQuery.isError ||
    matchesQuery.isError ||
    applicationsQuery.isError;

  return {
    stats: statsQuery.data || {
      totalApplications: 0,
      todaysApplications: 0,
      matches: 0,
    },
    profile: profileQuery.data,
    suggestedJobs: matchesQuery.data || [],
    applications: applicationsQuery.data || [],
    isLoading,
    hasError,
    queries: {
      stats: statsQuery,
      profile: profileQuery,
      matches: matchesQuery,
      applications: applicationsQuery,
    },
  };
};
