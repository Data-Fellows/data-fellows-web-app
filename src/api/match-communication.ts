import apiClient from "@/api";

// Message types
export interface MessageFile {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Message {
  _id: string;
  sender: {
    _id: string;
    email: string;
    photoUrl?: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    companyLogo?: string;
    isCurrentUser: boolean;
  };
  message: string; // Backend uses 'message' not 'content'
  timestamp: string; // Backend uses 'timestamp' not 'createdAt'
  messageType?: "text" | "offer" | "milestone" | "system";
  files: MessageFile[];
  readAt?: string;
  matchId?: string;
}

export interface MessageThread {
  _id: string;
  matchId: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

// Milestone types
export interface Milestone {
  _id: string;
  matchId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  amount: number;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
}

// Price negotiation types
export interface PriceOffer {
  _id: string;
  matchId: string;
  offeredBy: string; // user ID
  amount: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "countered";
  parentOfferId?: string; // for counter offers
  createdAt: string;
  respondedAt?: string;
}

export interface Payment {
  _id: string;
  matchId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  paymentIntent?: string;
  createdAt: string;
  completedAt?: string;
  milestoneId?: string;
}

// API Functions

// Messages
export const getMatchMessages = async (matchId: string): Promise<Message[]> => {
  const response = await apiClient.get(`/matches/${matchId}/messages`);
  return response.data.data || []; // Backend returns data in response.data.data
};

export const sendMessage = async (
  matchId: string,
  content: string,
  files?: File[],
  messageType: "text" | "offer" | "milestone" = "text"
): Promise<Message> => {
  if (files && files.length > 0) {
    // Handle file upload
    const formData = new FormData();
    formData.append("message", content); // Backend expects 'message' field
    formData.append("messageType", messageType);
    files.forEach((file) => {
      formData.append("files", file); // Backend handles files via multer
    });

    const response = await apiClient.post(
      `/matches/${matchId}/send-message`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data; // Backend returns data in response.data.data
  } else {
    // Handle text message
    const response = await apiClient.post(`/matches/${matchId}/send-message`, {
      message: content, // Backend expects 'message' field
      messageType,
    });
    return response.data.data; // Backend returns data in response.data.data
  }
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await apiClient.patch(`/messages/${messageId}/read`);
};

// Milestones
export const getMatchMilestones = async (
  matchId: string
): Promise<Milestone[]> => {
  const response = await apiClient.get(`/matches/${matchId}/milestones`);
  return response.data.milestones || [];
};

export const createMilestone = async (
  matchId: string,
  milestone: Omit<
    Milestone,
    "_id" | "matchId" | "createdAt" | "completedAt" | "completedBy"
  >
): Promise<Milestone> => {
  const response = await apiClient.post(
    `/matches/${matchId}/milestones`,
    milestone
  );
  return response.data.milestone;
};

export const updateMilestone = async (
  milestoneId: string,
  updates: Partial<Milestone>
): Promise<Milestone> => {
  const response = await apiClient.patch(`/milestones/${milestoneId}`, updates);
  return response.data.milestone;
};

export const completeMilestone = async (
  milestoneId: string
): Promise<Milestone> => {
  const response = await apiClient.patch(`/milestones/${milestoneId}/complete`);
  return response.data.milestone;
};

// Price Offers
export const getMatchOffers = async (
  matchId: string
): Promise<PriceOffer[]> => {
  const response = await apiClient.get(`/matches/${matchId}/offers`);
  return response.data.offers || [];
};

export const createPriceOffer = async (
  matchId: string,
  amount: number,
  message?: string,
  parentOfferId?: string
): Promise<PriceOffer> => {
  const response = await apiClient.post(`/matches/${matchId}/offers`, {
    amount,
    message,
    parentOfferId,
  });
  return response.data.offer;
};

export const respondToPriceOffer = async (
  offerId: string,
  status: "accepted" | "rejected",
  counterAmount?: number,
  message?: string
): Promise<PriceOffer> => {
  const response = await apiClient.patch(`/offers/${offerId}/respond`, {
    status,
    counterAmount,
    message,
  });
  return response.data.offer;
};

// Payments
export const getMatchPayments = async (matchId: string): Promise<Payment[]> => {
  const response = await apiClient.get(`/matches/${matchId}/payments`);
  return response.data.payments || [];
};

export const createPaymentIntent = async (
  matchId: string,
  amount: number,
  milestoneId?: string
): Promise<{ clientSecret: string; paymentId: string }> => {
  const response = await apiClient.post(`/matches/${matchId}/payments/intent`, {
    amount,
    milestoneId,
  });
  return response.data;
};

export const confirmPayment = async (
  paymentId: string,
  paymentMethodId: string
): Promise<Payment> => {
  const response = await apiClient.post(`/payments/${paymentId}/confirm`, {
    paymentMethodId,
  });
  return response.data.payment;
};

export default {
  // Messages
  getMatchMessages,
  sendMessage,
  markMessageAsRead,

  // Milestones
  getMatchMilestones,
  createMilestone,
  updateMilestone,
  completeMilestone,

  // Price Offers
  getMatchOffers,
  createPriceOffer,
  respondToPriceOffer,

  // Payments
  getMatchPayments,
  createPaymentIntent,
  confirmPayment,
};
