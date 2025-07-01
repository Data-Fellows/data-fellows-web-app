import {
  createMilestone,
  createPriceOffer,
  deleteMilestone,
  getMatchMessages,
  getMatchMilestones,
  getMatchOffers,
  respondToPriceOffer,
  sendMessage,
  updateMilestone,
} from "@/api/match-communication";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Hook for managing messages with real-time updates
export const useMatchMessages = (matchId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["matchMessages", matchId],
    queryFn: () => getMatchMessages(matchId),
    enabled: !!matchId,
    refetchInterval: 30000, // Refetch every 30 seconds for demo
  });

  // Simulate real-time updates (in production, you'd use WebSocket)
  // Example WebSocket implementation:
  // useEffect(() => {
  //   const ws = new WebSocket(`ws://localhost:8080/matches/${matchId}`);
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'new_message') {
  //       queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
  //     }
  //   };
  //   return () => ws.close();
  // }, [matchId, queryClient]);

  useEffect(() => {
    if (!matchId) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
    }, 30000);

    return () => clearInterval(interval);
  }, [matchId, queryClient]);

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// Hook for sending messages with React Query mutation
export const useSendMessage = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, files }: { message: string; files?: File[] }) =>
      sendMessage(matchId, message, files),
    onSuccess: () => {
      // Invalidate and refetch messages after successful send
      queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });
};

// Hook for creating price offers
export const useCreatePriceOffer = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerData: { amount: number }) =>
      createPriceOffer(matchId, offerData.amount),
    onSuccess: () => {
      // Invalidate and refetch offers and messages after successful creation
      queryClient.invalidateQueries({ queryKey: ["matchOffers", matchId] });
      queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
    },
    onError: (error) => {
      console.error("Error creating price offer:", error);
    },
  });
};

// Hook for responding to price offers
export const useRespondToPriceOffer = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accepted }: { accepted: boolean }) =>
      respondToPriceOffer(matchId, accepted),
    onSuccess: () => {
      // Invalidate and refetch offers and messages after successful response
      queryClient.invalidateQueries({ queryKey: ["matchOffers", matchId] });
      queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
    },
    onError: (error) => {
      console.error("Error responding to price offer:", error);
    },
  });
};

// Hook for creating milestones
export const useCreateMilestone = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneData: { title: string; dueDate: string }) =>
      createMilestone(matchId, {
        title: milestoneData.title,
        description: "", // Not used in backend
        dueDate: milestoneData.dueDate,
        amount: 0, // Not used in backend
      }),
    onSuccess: () => {
      // Invalidate and refetch milestones after successful creation
      queryClient.invalidateQueries({ queryKey: ["matchMilestones", matchId] });
    },
    onError: (error) => {
      console.error("Error creating milestone:", error);
    },
  });
};

// Hook for updating milestones
export const useUpdateMilestone = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      updates,
    }: {
      milestoneId: string;
      updates: {
        inProgress?: boolean;
        completed?: boolean;
      };
    }) => updateMilestone(milestoneId, updates),
    onSuccess: () => {
      // Invalidate and refetch milestones after successful update
      queryClient.invalidateQueries({ queryKey: ["matchMilestones", matchId] });
    },
    onError: (error) => {
      console.error("Error updating milestone:", error);
    },
  });
};

// Hook for deleting milestones
export const useDeleteMilestone = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) => deleteMilestone(milestoneId),
    onSuccess: () => {
      // Invalidate and refetch milestones after successful deletion
      queryClient.invalidateQueries({ queryKey: ["matchMilestones", matchId] });
    },
    onError: (error) => {
      console.error("Error deleting milestone:", error);
    },
  });
};

// Hook for managing milestones
export const useMatchMilestones = (matchId: string) => {
  const query = useQuery({
    queryKey: ["matchMilestones", matchId],
    queryFn: () => getMatchMilestones(matchId),
    enabled: !!matchId,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "no milestones" error (if backend returns such errors)
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message?.includes("No milestone")
      ) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });

  return {
    milestones: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// Hook for managing price offers
export const useMatchOffers = (matchId: string) => {
  const query = useQuery({
    queryKey: ["matchOffers", matchId],
    queryFn: () => getMatchOffers(matchId),
    enabled: !!matchId,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "no negotiation" error
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message?.includes("No negotiation associated")
      ) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });

  return {
    offers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// Hook for real-time match communication updates
export const useMatchCommunication = (matchId: string) => {
  const queryClient = useQueryClient();

  // Invalidate all match-related queries for real-time effect
  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
    queryClient.invalidateQueries({ queryKey: ["matchMilestones", matchId] });
    queryClient.invalidateQueries({ queryKey: ["matchOffers", matchId] });
  };

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    if (!matchId) return;

    // In production, you would establish a WebSocket connection here
    console.log(`Establishing real-time connection for match ${matchId}`);

    // Simulate periodic updates
    const interval = setInterval(refreshAll, 60000); // Every minute

    return () => {
      clearInterval(interval);
      console.log(`Closing real-time connection for match ${matchId}`);
    };
  }, [matchId]);

  return {
    refreshAll,
  };
};

export default {
  useMatchMessages,
  useSendMessage,
  useCreatePriceOffer,
  useRespondToPriceOffer,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
  useMatchMilestones,
  useMatchOffers,
  useMatchCommunication,
};
