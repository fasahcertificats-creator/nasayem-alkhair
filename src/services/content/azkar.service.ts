import categoriesData from "../../../data/azkar/categories.json";
import itemsData from "../../../data/azkar/items.json";

import {
  AZKAR_CATEGORY_DEFINITIONS,
  getAzkarCategoryDefinition
} from "@/data/azkar-categories";
import { AZKAR_CATEGORY_IDS, type AzkarCategory, type AzkarItem } from "@/types";

const azkarCategories = new Set<AzkarCategory>(AZKAR_CATEGORY_IDS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAzkarCategory(value: unknown): value is AzkarCategory {
  return typeof value === "string" && azkarCategories.has(value as AzkarCategory);
}

interface RawAzkarItem {
  id: string;
  category: AzkarCategory;
  arabicText: string;
  authenticity?: string;
  displayMode?: "counter" | "reading";
  isSpecificallyPrescribed?: boolean;
  sourceReference?: string;
  title?: string;
  translation: string;
  count: number;
  source: string;
  verificationStatus?: "approved" | "draft" | "needs-review" | "rejected";
  order: number;
}

function isRawAzkarItem(value: unknown): value is RawAzkarItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isAzkarCategory(value.category) &&
    typeof value.arabicText === "string" &&
    typeof value.translation === "string" &&
    Number.isSafeInteger(value.count) &&
    (value.count as number) > 0 &&
    typeof value.source === "string" &&
    Number.isSafeInteger(value.order) &&
    (value.authenticity === undefined || typeof value.authenticity === "string") &&
    (value.sourceReference === undefined || typeof value.sourceReference === "string") &&
    (value.title === undefined || typeof value.title === "string") &&
    (value.displayMode === undefined ||
      value.displayMode === "counter" ||
      value.displayMode === "reading") &&
    (value.isSpecificallyPrescribed === undefined ||
      typeof value.isSpecificallyPrescribed === "boolean") &&
    (value.verificationStatus === undefined ||
      value.verificationStatus === "approved" ||
      value.verificationStatus === "draft" ||
      value.verificationStatus === "needs-review" ||
      value.verificationStatus === "rejected")
  );
}

function parseCollection<T>(data: unknown, guard: (value: unknown) => value is T): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(guard);
}

export function getAzkarCategories(): AzkarCategory[] {
  return parseCollection(categoriesData, isAzkarCategory);
}

export function getAzkarCategoryDefinitions() {
  const approvedCategoryIds = new Set(getAzkarCategories());

  return AZKAR_CATEGORY_DEFINITIONS.filter((category) =>
    approvedCategoryIds.has(category.id)
  );
}

export { getAzkarCategoryDefinition };

function normalizeAzkarItem(item: RawAzkarItem): AzkarItem {
  return {
    ...item,
    categoryId: item.category,
    text: item.arabicText,
    targetCount: item.count,
    displayMetadata: {
      authenticity: item.authenticity,
      mode: item.displayMode ?? "counter",
      sourceReference: item.sourceReference,
      title: item.title
    }
  };
}

export function getAllAzkarItems(): AzkarItem[] {
  return parseCollection(itemsData, isRawAzkarItem)
    .filter((item) => (item.verificationStatus ?? "approved") === "approved")
    .map(normalizeAzkarItem)
    .sort((first, second) => {
      const categoryDifference =
        AZKAR_CATEGORY_IDS.indexOf(first.categoryId) -
        AZKAR_CATEGORY_IDS.indexOf(second.categoryId);

      return categoryDifference || first.order - second.order;
    });
}

export function getAzkarItems(category: AzkarCategory): AzkarItem[] {
  return getAllAzkarItems().filter((item) => item.categoryId === category);
}

export function getAzkarCatalog() {
  return Object.fromEntries(
    getAzkarCategoryDefinitions().map((category) => [
      category.id,
      getAzkarItems(category.id).map(({ id, targetCount }) => ({
        id,
        targetCount
      }))
    ])
  ) as Record<AzkarCategory, Array<Pick<AzkarItem, "id" | "targetCount">>>;
}
