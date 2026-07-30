import { AZKAR_CATEGORY_IDS, type AzkarCategory, type AzkarItem } from "@/types";

export const AZKAR_PROGRESS_STORAGE_KEY = "nasayem-alkhair:azkarProgress:v2";
export const AZKAR_LEGACY_COUNTERS_STORAGE_KEY =
  "nasayem-alkhair:azkarRepetitionCounts";
export const AZKAR_PROGRESS_EVENT = "nasayem-alkhair:azkarProgressChanged";
export const AZKAR_PROGRESS_VERSION = 2 as const;
const AZKAR_TIMESTAMP_MAX_FUTURE_MS = 24 * 60 * 60 * 1000;

export type AzkarCatalog = Record<
  AzkarCategory,
  Array<Pick<AzkarItem, "id" | "targetCount">>
>;

export interface AzkarCategoryProgress {
  categoryId: AzkarCategory;
  currentItemId: string;
  counts: Record<string, number>;
  lastOpenedAt: number;
  completed: boolean;
}

export interface AzkarProgressState {
  version: typeof AZKAR_PROGRESS_VERSION;
  categories: Partial<Record<AzkarCategory, AzkarCategoryProgress>>;
  lastCategoryId?: AzkarCategory;
}

export interface AzkarProgressLoadResult {
  state: AzkarProgressState;
  recovered: boolean;
  migrated: boolean;
  storageAvailable: boolean;
}

export interface AzkarCategorySummary {
  completedItems: number;
  currentItemId: string;
  hasProgress: boolean;
  isComplete: boolean;
  totalItems: number;
}

interface SanitizeResult {
  state: AzkarProgressState;
  recovered: boolean;
  migrated: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidAzkarTimestamp(value: unknown): value is number {
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isSafeInteger(value) &&
    value > 0
  ) {
    return value <= Date.now() + AZKAR_TIMESTAMP_MAX_FUTURE_MS;
  }

  return false;
}

function isCategoryId(value: unknown): value is AzkarCategory {
  return (
    typeof value === "string" &&
    AZKAR_CATEGORY_IDS.includes(value as AzkarCategory)
  );
}

export function createEmptyAzkarProgress(): AzkarProgressState {
  return {
    version: AZKAR_PROGRESS_VERSION,
    categories: {}
  };
}

function getCategoryItems(catalog: AzkarCatalog, categoryId: AzkarCategory) {
  return catalog[categoryId] ?? [];
}

function isItemComplete(
  counts: Record<string, number>,
  item: Pick<AzkarItem, "id" | "targetCount">
) {
  return (counts[item.id] ?? 0) >= item.targetCount;
}

function deriveCurrentItemId(
  requestedItemId: unknown,
  counts: Record<string, number>,
  items: Array<Pick<AzkarItem, "id" | "targetCount">>
) {
  const requestedItem =
    typeof requestedItemId === "string"
      ? items.find((item) => item.id === requestedItemId)
      : undefined;

  if (requestedItem && !isItemComplete(counts, requestedItem)) {
    return requestedItem.id;
  }

  return (
    items.find((item) => !isItemComplete(counts, item))?.id ??
    requestedItem?.id ??
    items.at(-1)?.id ??
    ""
  );
}

function sanitizeCounts(
  rawCounts: unknown,
  items: Array<Pick<AzkarItem, "id" | "targetCount">>
) {
  const counts: Record<string, number> = {};
  let recovered = false;
  const itemById = new Map(items.map((item) => [item.id, item]));

  if (!isRecord(rawCounts)) {
    return {
      counts,
      recovered: rawCounts !== undefined
    };
  }

  for (const [itemId, rawCount] of Object.entries(rawCounts)) {
    const item = itemById.get(itemId);

    if (!item) {
      recovered = true;
      continue;
    }

    if (
      typeof rawCount !== "number" ||
      !Number.isSafeInteger(rawCount) ||
      rawCount < 0
    ) {
      recovered = true;
      continue;
    }

    const count = Math.min(rawCount, item.targetCount);

    if (count !== rawCount) {
      recovered = true;
    }

    if (count > 0) {
      counts[itemId] = count;
    }
  }

  return { counts, recovered };
}

function mergeCounts(
  first: Record<string, number>,
  second: Record<string, number>
) {
  const merged = { ...first };

  for (const [itemId, count] of Object.entries(second)) {
    merged[itemId] = Math.max(merged[itemId] ?? 0, count);
  }

  return merged;
}

function sanitizeCategoryRecord(
  rawRecord: unknown,
  categoryId: AzkarCategory,
  catalog: AzkarCatalog
) {
  const items = getCategoryItems(catalog, categoryId);
  const record = isRecord(rawRecord) ? rawRecord : {};
  const { counts, recovered: countsRecovered } = sanitizeCounts(record.counts, items);
  const rawLastOpenedAt = record.lastOpenedAt;
  const lastOpenedAt = isValidAzkarTimestamp(rawLastOpenedAt)
    ? rawLastOpenedAt
    : 0;
  const currentItemId = deriveCurrentItemId(record.currentItemId, counts, items);
  const completed =
    items.length > 0 && items.every((item) => isItemComplete(counts, item));

  return {
    progress: {
      categoryId,
      currentItemId,
      counts,
      lastOpenedAt,
      completed
    } satisfies AzkarCategoryProgress,
    recovered:
      !isRecord(rawRecord) ||
      countsRecovered ||
      (rawLastOpenedAt !== undefined && lastOpenedAt !== rawLastOpenedAt) ||
      (record.currentItemId !== undefined &&
        record.currentItemId !== currentItemId) ||
      (record.categoryId !== undefined && record.categoryId !== categoryId) ||
      (record.completed !== undefined && record.completed !== completed)
  };
}

function addCategoryRecord(
  state: AzkarProgressState,
  rawRecord: unknown,
  categoryId: AzkarCategory,
  catalog: AzkarCatalog
) {
  const result = sanitizeCategoryRecord(rawRecord, categoryId, catalog);
  const existing = state.categories[categoryId];

  if (!existing) {
    state.categories[categoryId] = result.progress;
    return result.recovered;
  }

  const items = getCategoryItems(catalog, categoryId);
  const counts = mergeCounts(existing.counts, result.progress.counts);
  const useIncomingPosition =
    result.progress.lastOpenedAt >= existing.lastOpenedAt;
  const currentItemId = deriveCurrentItemId(
    useIncomingPosition
      ? result.progress.currentItemId
      : existing.currentItemId,
    counts,
    items
  );

  state.categories[categoryId] = {
    categoryId,
    currentItemId,
    counts,
    lastOpenedAt: Math.max(existing.lastOpenedAt, result.progress.lastOpenedAt),
    completed:
      items.length > 0 && items.every((item) => isItemComplete(counts, item))
  };

  return true;
}

function migrateLegacyCounters(
  rawValue: unknown,
  catalog: AzkarCatalog
): SanitizeResult {
  const state = createEmptyAzkarProgress();
  let recovered = !isRecord(rawValue);
  const legacyCounts = isRecord(rawValue) ? rawValue : {};

  for (const categoryId of AZKAR_CATEGORY_IDS) {
    const items = getCategoryItems(catalog, categoryId);
    const categoryCounts: Record<string, unknown> = {};

    for (const item of items) {
      if (Object.hasOwn(legacyCounts, item.id)) {
        categoryCounts[item.id] = legacyCounts[item.id];
      }
    }

    if (Object.keys(categoryCounts).length === 0) {
      continue;
    }

    const result = sanitizeCategoryRecord(
      {
        categoryId,
        counts: categoryCounts,
        lastOpenedAt: 0
      },
      categoryId,
      catalog
    );

    state.categories[categoryId] = result.progress;
    recovered ||= result.recovered;
  }

  return {
    state,
    recovered,
    migrated: true
  };
}

export function sanitizeAzkarProgress(
  rawValue: unknown,
  catalog: AzkarCatalog
): SanitizeResult {
  if (!isRecord(rawValue)) {
    return {
      state: createEmptyAzkarProgress(),
      recovered: rawValue !== undefined && rawValue !== null,
      migrated: false
    };
  }

  if (!Object.hasOwn(rawValue, "version") && !Object.hasOwn(rawValue, "categories")) {
    return migrateLegacyCounters(rawValue, catalog);
  }

  const state = createEmptyAzkarProgress();
  let recovered = rawValue.version !== AZKAR_PROGRESS_VERSION;
  const migrated = rawValue.version !== AZKAR_PROGRESS_VERSION;
  const rawCategories = rawValue.categories;

  if (Array.isArray(rawCategories)) {
    for (const rawRecord of rawCategories) {
      if (!isRecord(rawRecord) || !isCategoryId(rawRecord.categoryId)) {
        recovered = true;
        continue;
      }

      recovered =
        addCategoryRecord(
          state,
          rawRecord,
          rawRecord.categoryId,
          catalog
        ) || recovered;
    }
  } else if (isRecord(rawCategories)) {
    for (const [rawCategoryId, rawRecord] of Object.entries(rawCategories)) {
      if (!isCategoryId(rawCategoryId)) {
        recovered = true;
        continue;
      }

      recovered =
        addCategoryRecord(state, rawRecord, rawCategoryId, catalog) || recovered;
    }
  } else if (rawCategories !== undefined) {
    recovered = true;
  }

  const requestedLastCategoryId = rawValue.lastCategoryId;
  const mostRecentCategory = Object.values(state.categories)
    .filter((category): category is AzkarCategoryProgress => Boolean(category))
    .sort((first, second) => second.lastOpenedAt - first.lastOpenedAt)
    .at(0)?.categoryId;

  if (
    isCategoryId(requestedLastCategoryId) &&
    state.categories[requestedLastCategoryId]
  ) {
    state.lastCategoryId = requestedLastCategoryId;
  } else if (mostRecentCategory) {
    state.lastCategoryId = mostRecentCategory;
    recovered ||= requestedLastCategoryId !== undefined;
  } else {
    recovered ||= requestedLastCategoryId !== undefined;
  }

  return { state, recovered, migrated };
}

function getBrowserStorage(storage?: Storage) {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emitProgressChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AZKAR_PROGRESS_EVENT));
  }
}

export function saveAzkarProgress(
  state: AzkarProgressState,
  storage?: Storage,
  emit = true
) {
  const targetStorage = getBrowserStorage(storage);

  if (!targetStorage) {
    return false;
  }

  try {
    targetStorage.setItem(AZKAR_PROGRESS_STORAGE_KEY, JSON.stringify(state));

    if (emit) {
      emitProgressChange();
    }

    return true;
  } catch {
    return false;
  }
}

export function loadAzkarProgress(
  catalog: AzkarCatalog,
  storage?: Storage
): AzkarProgressLoadResult {
  const targetStorage = getBrowserStorage(storage);

  if (!targetStorage) {
    return {
      state: createEmptyAzkarProgress(),
      recovered: false,
      migrated: false,
      storageAvailable: false
    };
  }

  let recovered = false;

  try {
    const storedValue = targetStorage.getItem(AZKAR_PROGRESS_STORAGE_KEY);

    if (storedValue) {
      let parsedValue: unknown;

      try {
        parsedValue = JSON.parse(storedValue);
      } catch {
        parsedValue = undefined;
        recovered = true;
      }

      if (parsedValue !== undefined) {
        const result = sanitizeAzkarProgress(parsedValue, catalog);

        if (result.recovered || result.migrated) {
          saveAzkarProgress(result.state, targetStorage, false);
        }

        return {
          ...result,
          storageAvailable: true
        };
      }
    }

    const legacyValue = targetStorage.getItem(
      AZKAR_LEGACY_COUNTERS_STORAGE_KEY
    );

    if (legacyValue) {
      try {
        const result = migrateLegacyCounters(JSON.parse(legacyValue), catalog);
        saveAzkarProgress(result.state, targetStorage, false);

        return {
          ...result,
          recovered: recovered || result.recovered,
          storageAvailable: true
        };
      } catch {
        recovered = true;
      }
    }
  } catch {
    return {
      state: createEmptyAzkarProgress(),
      recovered: true,
      migrated: false,
      storageAvailable: false
    };
  }

  const state = createEmptyAzkarProgress();

  if (recovered) {
    saveAzkarProgress(state, targetStorage, false);
  }

  return {
    state,
    recovered,
    migrated: false,
    storageAvailable: true
  };
}

export function subscribeToAzkarProgress(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(AZKAR_PROGRESS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AZKAR_PROGRESS_EVENT, callback);
  };
}

export function getAzkarCategorySummary(
  state: AzkarProgressState,
  categoryId: AzkarCategory,
  catalog: AzkarCatalog
): AzkarCategorySummary {
  const items = getCategoryItems(catalog, categoryId);
  const progress = state.categories[categoryId];
  const counts = progress?.counts ?? {};
  const completedItems = items.filter((item) =>
    isItemComplete(counts, item)
  ).length;

  return {
    completedItems,
    currentItemId: deriveCurrentItemId(
      progress?.currentItemId,
      counts,
      items
    ),
    hasProgress: Object.values(counts).some((count) => count > 0),
    isComplete: items.length > 0 && completedItems === items.length,
    totalItems: items.length
  };
}

export function touchAzkarCategory(
  state: AzkarProgressState,
  categoryId: AzkarCategory,
  catalog: AzkarCatalog,
  requestedItemId?: string,
  now = Date.now()
): AzkarProgressState {
  const items = getCategoryItems(catalog, categoryId);
  const previous = state.categories[categoryId];
  const counts = previous?.counts ?? {};
  const currentItemId = deriveCurrentItemId(
    requestedItemId ?? previous?.currentItemId,
    counts,
    items
  );

  return {
    ...state,
    categories: {
      ...state.categories,
      [categoryId]: {
        categoryId,
        currentItemId,
        counts,
        lastOpenedAt: isValidAzkarTimestamp(now) ? now : 0,
        completed:
          items.length > 0 && items.every((item) => isItemComplete(counts, item))
      }
    },
    lastCategoryId: categoryId
  };
}

export function setAzkarItemCount(
  state: AzkarProgressState,
  categoryId: AzkarCategory,
  itemId: string,
  nextCount: number,
  catalog: AzkarCatalog,
  now = Date.now()
) {
  const items = getCategoryItems(catalog, categoryId);
  const item = items.find((candidate) => candidate.id === itemId);

  if (
    !item ||
    typeof nextCount !== "number" ||
    !Number.isSafeInteger(nextCount)
  ) {
    return state;
  }

  const touched = touchAzkarCategory(
    state,
    categoryId,
    catalog,
    itemId,
    now
  );
  const previous = touched.categories[categoryId];

  if (!previous) {
    return state;
  }

  const boundedCount = Math.min(Math.max(0, nextCount), item.targetCount);
  const counts = { ...previous.counts };

  if (boundedCount === 0) {
    delete counts[itemId];
  } else {
    counts[itemId] = boundedCount;
  }

  return {
    ...touched,
    categories: {
      ...touched.categories,
      [categoryId]: {
        ...previous,
        counts,
        completed:
          items.length > 0 &&
          items.every((candidate) => isItemComplete(counts, candidate))
      }
    }
  };
}

export function resetAzkarCategory(
  state: AzkarProgressState,
  categoryId: AzkarCategory
) {
  const categories = { ...state.categories };
  delete categories[categoryId];
  const remainingCategories = Object.values(categories)
    .filter((category): category is AzkarCategoryProgress => Boolean(category))
    .sort((first, second) => second.lastOpenedAt - first.lastOpenedAt);

  return {
    ...state,
    categories,
    lastCategoryId: remainingCategories.at(0)?.categoryId
  };
}
