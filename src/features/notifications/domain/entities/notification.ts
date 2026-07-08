import type { FirestoreDocument } from "@/types/firestore";

export type NotificationChannel = "in-app" | "push" | "email";

export interface Notification extends FirestoreDocument {
  recipientId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  readAt: Date | null;
}
