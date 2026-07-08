import type { AssistantMessage } from "../entities/assistant-message";

export interface AssistantRepository {
  createMessage(message: AssistantMessage): Promise<AssistantMessage>;
  listConversationMessages(conversationId: string): Promise<AssistantMessage[]>;
}
