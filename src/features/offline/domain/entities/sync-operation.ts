import type { FirestoreDocument } from "@/types/firestore";

export type SyncOperationStatus = "pending" | "processing" | "failed";

export interface SyncOperation extends FirestoreDocument {
  collectionPath: string;
  documentId: string;
  status: SyncOperationStatus;
  attemptedAt: Date | null;
}
