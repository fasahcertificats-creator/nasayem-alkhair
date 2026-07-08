import { getAuth, type Auth } from "firebase/auth";

import { getFirebaseApp } from "./firebase.client";

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}
