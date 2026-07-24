import { UMRAH_COMPANION_STORAGE_KEYS } from "@/data/umrah-companion-copy";
import type { UmrahContext } from "@/types";

const STORAGE_VERSION = 1;
const MIN_ROUND_COUNT = 0;
const MAX_ROUND_COUNT = 7;
const STORAGE_EVENT_PREFIX = "nasayem-alkhair:umrah-round-progress-changed";

interface StoredRoundProgress {
  version: number;
  completedRoundCount: number;
}

function canUseSessionStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function isValidRoundCount(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    Number.isFinite(value) &&
    value >= MIN_ROUND_COUNT &&
    value <= MAX_ROUND_COUNT
  );
}

function isStoredRoundProgress(value: unknown): value is StoredRoundProgress {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return candidate.version === STORAGE_VERSION && isValidRoundCount(candidate.completedRoundCount);
}

function writeProgress(context: UmrahContext, completedRoundCount: number) {
  if (!canUseSessionStorage() || !isValidRoundCount(completedRoundCount)) {
    return;
  }

  const value: StoredRoundProgress = {
    version: STORAGE_VERSION,
    completedRoundCount
  };

  window.sessionStorage.setItem(UMRAH_COMPANION_STORAGE_KEYS[context], JSON.stringify(value));
  window.dispatchEvent(new Event(`${STORAGE_EVENT_PREFIX}:${context}`));
}

export function loadUmrahRoundProgress(context: UmrahContext) {
  if (!canUseSessionStorage()) {
    return MIN_ROUND_COUNT;
  }

  try {
    const rawValue = window.sessionStorage.getItem(UMRAH_COMPANION_STORAGE_KEYS[context]);

    if (rawValue === null) {
      return MIN_ROUND_COUNT;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (isStoredRoundProgress(parsedValue)) {
      return parsedValue.completedRoundCount;
    }
  } catch {
    // Malformed session state is intentionally replaced with a safe zero value.
  }

  return MIN_ROUND_COUNT;
}

export function saveUmrahRoundProgress(context: UmrahContext, completedRoundCount: number) {
  writeProgress(context, completedRoundCount);
}

export function repairMalformedUmrahRoundProgress(context: UmrahContext) {
  if (!canUseSessionStorage()) {
    return;
  }

  const rawValue = window.sessionStorage.getItem(UMRAH_COMPANION_STORAGE_KEYS[context]);

  if (rawValue === null) {
    return;
  }

  try {
    if (isStoredRoundProgress(JSON.parse(rawValue) as unknown)) {
      return;
    }
  } catch {
    // The invalid value is replaced below.
  }

  writeProgress(context, MIN_ROUND_COUNT);
}

export function subscribeToUmrahRoundProgress(
  context: UmrahContext,
  onStoreChange: () => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const eventName = `${STORAGE_EVENT_PREFIX}:${context}`;
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(eventName, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(eventName, onStoreChange);
  };
}
