export type Subject =
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "language"
  | "history"
  | "other";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  corrections?: Correction[];
}

export interface Correction {
  original: string;
  suggestion: string;
  explanation: string;
}

// Mirrors the JSON contract the ai-chat Edge Function validates on the way
// out. Keep this in sync with supabase/functions/_shared/validation.ts.
export interface AiChatResponse {
  reply: string;
  corrections: Correction[];
}

export interface StudyTopic {
  id: string;
  subject: Subject;
  title: string;
  masteryPercent: number;
  lastPracticedAt: string | null;
}

export interface UsageStatus {
  used: number;
  limit: number;
  resetsAt: string;
}

export interface WritingFeedback {
  overallFeedback: string;
  score: number;
  strengths: string[];
  corrections: Correction[];
}

export interface WritingSubmission {
  id: string;
  language: string;
  prompt: string | null;
  content: string;
  feedback: WritingFeedback;
  score: number | null;
  createdAt: string;
}
