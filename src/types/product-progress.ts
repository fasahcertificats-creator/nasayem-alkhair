import type { EntityId } from "./common";
import type { AzkarCategory } from "./azkar";

export interface CompletedAzkarEntry {
  category: AzkarCategory;
  itemIds: EntityId[];
  completedAt: string;
}

export interface ProductProgress {
  completedStages: EntityId[];
  completedAzkar: CompletedAzkarEntry[];
  streak: number;
  lastCompletedDate: string | null;
}
