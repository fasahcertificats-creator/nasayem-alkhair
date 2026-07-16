import categoriesData from "../../../data/azkar/categories.json";
import itemsData from "../../../data/azkar/items.json";

import type { AzkarCategory, AzkarItem } from "@/types";

const azkarCategories = new Set<AzkarCategory>([
  "morning",
  "evening",
  "prayer",
  "sleep",
  "wakeup",
  "after-prayer",
  "quran-duas",
  "prophetic-duas",
  "names-of-allah",
  "comprehensive-duas"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAzkarCategory(value: unknown): value is AzkarCategory {
  return typeof value === "string" && azkarCategories.has(value as AzkarCategory);
}

function isAzkarItem(value: unknown): value is AzkarItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isAzkarCategory(value.category) &&
    typeof value.arabicText === "string" &&
    typeof value.translation === "string" &&
    typeof value.count === "number" &&
    typeof value.source === "string" &&
    typeof value.order === "number" &&
    (value.authenticity === undefined || typeof value.authenticity === "string") &&
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

export function getAzkarItems(category: AzkarCategory): AzkarItem[] {
  return parseCollection(itemsData, isAzkarItem)
    .filter((item) => item.category === category && (item.verificationStatus ?? "approved") === "approved")
    .sort((first, second) => first.order - second.order);
}
