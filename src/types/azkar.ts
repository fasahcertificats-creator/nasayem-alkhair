import type { EntityId } from "./common";

export type AzkarCategory =
  | "morning"
  | "evening"
  | "prayer"
  | "sleep"
  | "wakeup"
  | "after-prayer"
  | "quran-duas"
  | "prophetic-duas"
  | "names-of-allah"
  | "comprehensive-duas";

export interface AzkarItem {
  id: EntityId;
  category: AzkarCategory;
  arabicText: string;
  authenticity?: string;
  displayMode?: "counter" | "reading";
  isSpecificallyPrescribed?: boolean;
  translation: string;
  count: number;
  source: string;
  verificationStatus?: "approved" | "draft" | "needs-review" | "rejected";
  order: number;
}
