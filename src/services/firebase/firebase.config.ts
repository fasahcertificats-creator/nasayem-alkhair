import type { FirebaseOptions } from "firebase/app";

import { env } from "../../lib/env";

function getRequiredFirebaseEnv(name: keyof FirebaseOptions, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing Firebase environment variable for ${name}.`);
  }

  return value;
}

export function getFirebaseConfig(): FirebaseOptions {
  return {
    apiKey: getRequiredFirebaseEnv("apiKey", env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: getRequiredFirebaseEnv("authDomain", env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: getRequiredFirebaseEnv("projectId", env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: getRequiredFirebaseEnv("storageBucket", env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: getRequiredFirebaseEnv(
      "messagingSenderId",
      env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: getRequiredFirebaseEnv("appId", env.NEXT_PUBLIC_FIREBASE_APP_ID),
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
}
