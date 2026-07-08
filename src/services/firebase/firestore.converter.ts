import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions
} from "firebase/firestore";

import type { FirestoreDocument } from "@/types/firestore";

export function createFirestoreConverter<
  TDocument extends FirestoreDocument
>(): FirestoreDataConverter<TDocument> {
  return {
    toFirestore(document: TDocument): DocumentData {
      const data = { ...document } as Partial<TDocument>;
      delete data.id;

      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TDocument {
      const data = snapshot.data(options);

      return {
        id: snapshot.id,
        ...data
      } as TDocument;
    }
  };
}
