import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

import { getFirebaseConfig } from "./firebase.config";

let firebaseApp: FirebaseApp | undefined;
let firestoreDb: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());

  return firebaseApp;
}

export function getFirebaseDb(): Firestore {
  if (firestoreDb) {
    return firestoreDb;
  }

  firestoreDb = getFirestore(getFirebaseApp());

  return firestoreDb;
}

export const db = getFirebaseDb();
