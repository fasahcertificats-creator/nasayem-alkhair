import { collection, getDocs, orderBy, query, type DocumentData } from "firebase/firestore";

import fallbackUmrahContent from "../../../data/umrah_content.json";
import { safeFirestoreRead } from "../../lib/safe-firestore";
import { db } from "../firebase/firebaseClient";
import type { UmrahContent } from "../../types/umrah";

const UMRAH_CONTENT_COLLECTION = "umrah_content";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isValidUmrahContentData(data: DocumentData): data is Omit<UmrahContent, "id"> {
  return (
    isString(data.title) &&
    isString(data.stage) &&
    typeof data.order === "number" &&
    Number.isFinite(data.order) &&
    isString(data.text) &&
    isString(data.source) &&
    isString(data.authenticity) &&
    (data.notes === undefined || isString(data.notes))
  );
}

function logInvalidDocument(documentId: string, data: DocumentData): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.warn(`[Firestore] Ignoring invalid ${UMRAH_CONTENT_COLLECTION} document:`, {
    documentId,
    data
  });
}

function toUmrahContent(id: string, data: DocumentData): UmrahContent {
  return {
    id,
    title: data.title,
    stage: data.stage,
    order: data.order,
    text: data.text,
    source: data.source,
    authenticity: data.authenticity,
    ...(data.notes !== undefined ? { notes: data.notes } : {})
  };
}

function getDevelopmentFallbackUmrahContent(): UmrahContent[] {
  const content: UmrahContent[] = [];

  fallbackUmrahContent.forEach((data, index) => {
    if (!isValidUmrahContentData(data)) {
      logInvalidDocument(`local-fallback-${index}`, data);

      return;
    }

    content.push(toUmrahContent(data.id, data));
  });

  return content.sort((first, second) => first.order - second.order);
}

async function getFirestoreUmrahContent(): Promise<UmrahContent[]> {
  const umrahContentQuery = query(
    collection(db, UMRAH_CONTENT_COLLECTION),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(umrahContentQuery);
  const content: UmrahContent[] = [];

  snapshot.forEach((documentSnapshot) => {
    const data = documentSnapshot.data();

    if (!isValidUmrahContentData(data)) {
      logInvalidDocument(documentSnapshot.id, data);

      return;
    }

    content.push(toUmrahContent(documentSnapshot.id, data));
  });

  return content.sort((first, second) => first.order - second.order);
}

export async function getUmrahContent(): Promise<UmrahContent[]> {
  return safeFirestoreRead({
    collectionName: UMRAH_CONTENT_COLLECTION,
    fallbackData: getDevelopmentFallbackUmrahContent(),
    read: getFirestoreUmrahContent
  });
}
