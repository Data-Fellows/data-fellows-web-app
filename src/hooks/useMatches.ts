import { getMatches, Match, MatchesParams } from "@/api/matches";
import { useToast } from "@/context/ToastContext";
import { useCallback, useEffect, useState } from "react";

interface UseMatchesReturn {
  matches: Match[];
  totalMatches: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateParams: (newParams: Partial<MatchesParams>) => void;
  params: MatchesParams;
}

export const useMatches = (
  initialParams: MatchesParams = {}
): UseMatchesReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<MatchesParams>({
    page: 1,
    limit: 12,
    ...initialParams,
  });

  const { showToast } = useToast();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMatches(params);

      setMatches(response.matches);
      // Since the API doesn't return pagination info, we'll calculate it based on the matches
      setTotalMatches(response.matches.length);
      setTotalPages(Math.ceil(response.matches.length / (params.limit || 12)));
      setCurrentPage(params.page || 1);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch matches";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [params, showToast]);

  const updateParams = useCallback((newParams: Partial<MatchesParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page !== undefined ? newParams.page : 1, // Reset to page 1 when other params change
    }));
  }, []);

  const refetch = useCallback(async () => {
    await fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    totalMatches,
    totalPages,
    currentPage,
    loading,
    error,
    refetch,
    updateParams,
    params,
  };
};
