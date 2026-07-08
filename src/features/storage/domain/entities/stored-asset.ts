import type { FirestoreDocument } from "@/types/firestore";

export interface StoredAsset extends FirestoreDocument {
  ownerId: string;
  path: string;
  contentType: string;
  sizeBytes: number;
}
