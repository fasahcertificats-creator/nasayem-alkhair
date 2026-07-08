import type { Notification } from "../entities/notification";

export interface NotificationRepository {
  markAsRead(notificationId: string): Promise<void>;
  listForRecipient(recipientId: string): Promise<Notification[]>;
}
