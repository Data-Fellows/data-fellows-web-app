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
  match: string;
  title: string;
  date: string; // Backend uses 'date' not 'dueDate'
  pending: boolean;
  inProgress: boolean;
  completed: boolean;
  createdAt?: string;
}

// Price negotiation types
export interface PriceOffer {
  _id: string;
  applicant: string; // user ID
  employer: string; // user ID
  match: string; // match ID
  price: number; // Backend uses 'price' not 'amount'
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  match: {
    _id: string;
    applicant: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    employer: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    problem: {
      fellowField: string;
    };
  };
  price: number; // Backend uses 'price' not 'amount'
  status: "paid" | "pending" | "failed";
  stripeSession: any;
  transferId?: string;
  createdAt: string;
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
  const response = await apiClient.get(`/matches/get-milestones/${matchId}`);
  return response.data.milestones || [];
};

export const createMilestone = async (
  matchId: string,
  milestone: {
    title: string;
    description: string;
    dueDate: string;
    amount: number;
  }
): Promise<Milestone> => {
  const response = await apiClient.post(
    `/matches/matches/create-milestone/${matchId}`,
    {
      title: milestone.title,
      date: milestone.dueDate, // Backend expects 'date' not 'dueDate'
    }
  );
  return response.data.problem; // Backend returns 'problem' field
};

export const updateMilestone = async (
  milestoneId: string,
  updates: { inProgress?: boolean; completed?: boolean }
): Promise<Milestone> => {
  const response = await apiClient.put(
    `/matches/update-milestone/${milestoneId}`,
    updates
  );
  return response.data.data;
};

export const deleteMilestone = async (milestoneId: string): Promise<void> => {
  await apiClient.delete(`/matches/delete-milestone/${milestoneId}`);
};

// Price Offers
export const getMatchOffers = async (
  matchId: string
): Promise<PriceOffer[]> => {
  try {
    const response = await apiClient.get(`/payment/get-negotiation/${matchId}`);
    return response.data.negotiation ? [response.data.negotiation] : [];
  } catch (error: any) {
    // If no negotiation exists, return empty array instead of throwing error
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("No negotiation associated")
    ) {
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};

export const createPriceOffer = async (
  matchId: string,
  amount: number,
  message?: string
): Promise<PriceOffer> => {
  const response = await apiClient.post(`/payment/negotiate/${matchId}`, {
    price: amount, // Backend expects 'price' not 'amount'
  });
  return response.data.negotiation;
};

export const respondToPriceOffer = async (
  matchId: string,
  accepted: boolean
): Promise<PriceOffer> => {
  const response = await apiClient.put(
    `/payment/update-negotiation/${matchId}`,
    {
      accepted,
    }
  );
  return response.data.negotiation;
};

// Payments
export const getMatchPayments = async (matchId: string): Promise<Payment[]> => {
  const response = await apiClient.get(`/payment/get-payments`);
  // Filter payments by matchId on frontend since backend returns all user payments
  return (
    response.data.payments?.filter(
      (payment: any) => payment.match._id === matchId
    ) || []
  );
};

export const createPaymentIntent = async (
  matchId: string
): Promise<{ sessionUrl: string }> => {
  const response = await apiClient.post(`/payment/make-payment/${matchId}`);
  return { sessionUrl: response.data.sessionUrl };
};

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  const response = await apiClient.get(`/payment/get-payment/${paymentId}`);
  return response.data.payment;
};

export const sendMoneyToApplicant = async (
  paymentId: string
): Promise<{ payoutId: string }> => {
  const response = await apiClient.post(`/payment/send-money/${paymentId}`);
  return { payoutId: response.data.payoutId };
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
  deleteMilestone,

  // Price Offers
  getMatchOffers,
  createPriceOffer,
  respondToPriceOffer,

  // Payments
  getMatchPayments,
  createPaymentIntent,
  getPaymentById,
  sendMoneyToApplicant,
};
