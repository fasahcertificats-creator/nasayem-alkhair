const FIRESTORE_TIMEOUT_MS = 8000;

interface SafeFirestoreReadOptions<TData> {
  collectionName: string;
  fallbackData: TData;
  read: () => Promise<TData>;
}

function createTimeout(collectionName: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Firestore read for "${collectionName}" exceeded ${FIRESTORE_TIMEOUT_MS}ms.`)
      );
    }, FIRESTORE_TIMEOUT_MS);
  });
}

function warnInDevelopment(collectionName: string, error: unknown): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const reason = error instanceof Error ? error.message : "Unknown Firestore error.";

  console.warn(`[Firestore] Using local fallback data for "${collectionName}". Reason: ${reason}`);
}

export async function safeFirestoreRead<TData>({
  collectionName,
  fallbackData,
  read
}: SafeFirestoreReadOptions<TData>): Promise<TData> {
  try {
    return await Promise.race([read(), createTimeout(collectionName)]);
  } catch (error) {
    warnInDevelopment(collectionName, error);

    return fallbackData;
  }
}
