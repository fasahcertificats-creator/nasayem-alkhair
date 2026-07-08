import type { EntityId } from "./common";

export type AzkarCategory = "morning" | "evening" | "sleep" | "wakeup" | "travel";

export interface AzkarItem {
  id: EntityId;
  category: AzkarCategory;
  arabicText: string;
  translation: string;
  count: number;
  source: string;
  order: number;
}
