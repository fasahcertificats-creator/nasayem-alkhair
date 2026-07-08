import type { FirestoreDocument } from "@/types/firestore";

export interface AuthUser extends FirestoreDocument {
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
}
