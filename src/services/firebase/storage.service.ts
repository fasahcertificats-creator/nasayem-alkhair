import { getStorage, type FirebaseStorage } from "firebase/storage";

import { getFirebaseApp } from "./firebase.client";

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}
