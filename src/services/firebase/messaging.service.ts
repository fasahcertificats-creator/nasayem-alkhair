import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

import { getFirebaseApp } from "./firebase.client";

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getMessaging(getFirebaseApp());
}
