import {
  applyToProblem,
  bookmarkProblem,
  getProblemDetails,
  getProblems,
  unbookmarkProblem,
  type Problem,
  type ProblemsParams,
  type ProblemsResponse,
} from "@/api/problems";
import { useToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Problems query
export const useProblems = (params: ProblemsParams) => {
  return useQuery<ProblemsResponse>({
    queryKey: ["problems", params],
    queryFn: () => getProblems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

// Problem details query
export const useProblemDetails = (problemId: string) => {
  return useQuery<Problem>({
    queryKey: ["problems", "details", problemId],
    queryFn: () => getProblemDetails(problemId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    enabled: !!problemId, // Only run if problemId exists
  });
};

// Apply to problem mutation
export const useApplyToProblem = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: applyToProblem,
    onSuccess: (data, problemId) => {
      // Update the problems cache to mark as applied
      queryClient.setQueriesData(
        { queryKey: ["problems"] },
        (oldData: ProblemsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            problems: oldData.problems.map((problem) =>
              problem._id === problemId
                ? {
                    ...problem,
                    isApplied: true,
                    noOfApplicants: problem.noOfApplicants + 1,
                  }
                : problem
            ),
          };
        }
      );

      // Also update problem details cache if it exists
      queryClient.setQueryData(
        ["problems", "details", problemId],
        (oldData: Problem | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isApplied: true,
            noOfApplicants: oldData.noOfApplicants + 1,
          };
        }
      );

      showToast("Application submitted successfully!", "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to apply to problem";
      showToast(message, "error");
    },
  });
};

// Bookmark problem mutation
export const useBookmarkProblem = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      problemId,
      isBookmarked,
    }: {
      problemId: string;
      isBookmarked: boolean;
    }) => {
      return isBookmarked
        ? unbookmarkProblem(problemId)
        : bookmarkProblem(problemId);
    },
    onSuccess: (data, { problemId, isBookmarked }) => {
      // Update the problems cache
      queryClient.setQueriesData(
        { queryKey: ["problems"] },
        (oldData: ProblemsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            problems: oldData.problems.map((problem) =>
              problem._id === problemId
                ? { ...problem, isBookmarked: !isBookmarked }
                : problem
            ),
          };
        }
      );

      // Also update problem details cache if it exists
      queryClient.setQueryData(
        ["problems", "details", problemId],
        (oldData: Problem | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, isBookmarked: !isBookmarked };
        }
      );

      showToast(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        "success"
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update bookmark";
      showToast(message, "error");
    },
  });
};

// Custom hook to get combined problems data with loading and error states
export const useProblemsData = (params: ProblemsParams) => {
  const { data: problemsData, isLoading, error, refetch } = useProblems(params);

  const applyMutation = useApplyToProblem();
  const bookmarkMutation = useBookmarkProblem();

  const handleApply = (problemId: string) => {
    applyMutation.mutate(problemId);
  };

  const handleBookmark = (
    problemId: string,
    isCurrentlyBookmarked: boolean
  ) => {
    bookmarkMutation.mutate({
      problemId,
      isBookmarked: isCurrentlyBookmarked,
    });
  };

  return {
    problems: problemsData?.problems || [],
    totalProblems: problemsData?.totalProblems || 0,
    totalPages: problemsData?.totalPages || 0,
    currentPage: problemsData?.currentPage || 1,
    isLoading,
    error,
    refetch,
    handleApply,
    handleBookmark,
    isApplying: applyMutation.isPending,
    isBookmarking: bookmarkMutation.isPending,
  };
};
