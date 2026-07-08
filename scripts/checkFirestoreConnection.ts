import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

import nextEnv from "@next/env";
import { collection, getDocs, limit, query } from "firebase/firestore";

const { loadEnvConfig } = nextEnv;

const UMRAH_CONTENT_COLLECTION = "umrah_content";
const REQUIRED_FIREBASE_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
] as const;

function loadProjectEnvironment(projectRoot: string): void {
  const envFilePath = resolve(projectRoot, ".env.local");

  if (!existsSync(envFilePath)) {
    throw new Error(`Missing .env.local file at project root: ${envFilePath}`);
  }

  if (!statSync(envFilePath).isFile()) {
    throw new Error(`.env.local exists but is not a file: ${envFilePath}`);
  }

  const { parsedEnv = {} } = loadEnvConfig(projectRoot);
  const loadedVariableNames = Object.keys(parsedEnv).sort();

  console.log(`Loaded environment file: ${envFilePath}`);
  console.log("Loaded environment variable names:");

  if (loadedVariableNames.length === 0) {
    console.log("- none");
  } else {
    for (const variableName of loadedVariableNames) {
      console.log(`- ${variableName}`);
    }
  }
}

function validateFirebaseEnvironment(): void {
  for (const key of REQUIRED_FIREBASE_ENV_KEYS) {
    if (!process.env[key]) {
      throw new Error(`Missing or empty required Firebase environment variable: ${key}`);
    }
  }

  console.log("Firebase environment variable names verified:");

  for (const key of REQUIRED_FIREBASE_ENV_KEYS) {
    console.log(`- ${key}`);
  }
}

async function main(): Promise<void> {
  const projectRoot = resolve(process.cwd());

  loadProjectEnvironment(projectRoot);
  validateFirebaseEnvironment();

  const { db } = await import("../src/services/firebase/firebaseClient");
  const snapshot = await getDocs(query(collection(db, UMRAH_CONTENT_COLLECTION), limit(1)));
  const countSnapshot = await getDocs(collection(db, UMRAH_CONTENT_COLLECTION));
  const firstDocument = snapshot.docs.at(0);
  const firstTitle = firstDocument?.data().title;

  console.log(`Firestore collection: ${UMRAH_CONTENT_COLLECTION}`);
  console.log(`Documents found: ${countSnapshot.size}`);

  if (typeof firstTitle === "string") {
    console.log(`First document title: ${firstTitle}`);
  }
}

main().catch((error: unknown) => {
  console.error("Firestore connection check failed.");
  console.error(error);
  process.exitCode = 1;
});
