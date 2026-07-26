import type { EntityId } from "./common";

export const AZKAR_CATEGORY_IDS = [
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
] as const;

export type AzkarCategory = (typeof AZKAR_CATEGORY_IDS)[number];

export type AzkarIconId =
  | "sun"
  | "moon"
  | "star"
  | "bed"
  | "sunrise"
  | "scroll"
  | "book"
  | "heart"
  | "sparkles"
  | "cloud-sun";

export interface AzkarCategoryDefinition {
  id: AzkarCategory;
  title: string;
  description: string;
  iconId: AzkarIconId;
  accent: "green" | "sage" | "gold";
  decoration: "corner" | "header";
}

export interface AzkarItem {
  id: EntityId;
  categoryId: AzkarCategory;
  text: string;
  targetCount: number;
  source: string;
  note?: string;
  displayMetadata?: {
    authenticity?: string;
    mode: "counter" | "reading";
    sourceReference?: string;
    title?: string;
  };

  /** Backward-compatible source-data fields. */
  category: AzkarCategory;
  arabicText: string;
  authenticity?: string;
  displayMode?: "counter" | "reading";
  isSpecificallyPrescribed?: boolean;
  sourceReference?: string;
  title?: string;
  translation: string;
  count: number;
  verificationStatus?: "approved" | "draft" | "needs-review" | "rejected";
  order: number;
}
