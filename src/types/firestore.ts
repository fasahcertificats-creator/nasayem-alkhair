import type { Auditable, EntityId } from "./common";

export type FirestoreId = EntityId;
export type FirestoreCollectionPath = string;
export type FirestoreDocumentPath = string;

export interface FirestoreDocument {
  id: FirestoreId;
}

export interface TimestampedFirestoreDocument extends FirestoreDocument, Auditable {}

export interface UserScopedFirestoreDocument extends FirestoreDocument {
  userId: FirestoreId;
}

export interface SoftDeletableFirestoreDocument extends FirestoreDocument {
  deletedAt: Date | null;
}

export interface FirestoreRepository<TDocument extends FirestoreDocument> {
  getById(id: FirestoreId): Promise<TDocument | null>;
  list(): Promise<TDocument[]>;
  create(document: TDocument): Promise<TDocument>;
  update(id: FirestoreId, document: Partial<TDocument>): Promise<TDocument>;
  delete(id: FirestoreId): Promise<void>;
}
