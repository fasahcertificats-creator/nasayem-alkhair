import type { FirestoreDocument } from "@/types/firestore";

export type AssistantRole = "system" | "user" | "assistant";

export interface AssistantMessage extends FirestoreDocument {
  conversationId: string;
  role: AssistantRole;
  content: string;
}
