export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PayRange {
  min: number;
  max: number;
}

export interface Problem {
  id?: string;
  title?: string;
  description: string;
  fellowField: string;
  type: string[];
  skills: string[];
  candidatesQualification: string;
  niceToHaves?: string;
  payRange: PayRange;
  // Legacy fields for backwards compatibility
  category?: string;
  priority?: "high" | "medium" | "low";
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
