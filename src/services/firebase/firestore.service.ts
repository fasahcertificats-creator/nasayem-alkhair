import type { Firestore } from "firebase/firestore";

import { getFirebaseDb } from "./firebaseClient";

export function getFirebaseFirestore(): Firestore {
  return getFirebaseDb();
}
