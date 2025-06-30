export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Problem {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  solutions?: string[];
  tags?: string[];
}

export interface ConversationState {
  messages: Message[];
  problems: Problem[];
  conversationStage:
    | "introduction"
    | "exploration"
    | "confirmation"
    | "conclusion"
    | "results";
  isProcessing: boolean;
  isListening: boolean;
  hasEnoughInfo: boolean;
  pendingAudio?: string;
  sessionStarted: boolean;
}

export interface StructuredData {
  categories: any[];
  problems: any[];
  businessData: any;
  skills: any[];
}
