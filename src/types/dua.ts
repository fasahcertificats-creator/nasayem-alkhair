import type { EntityId } from "./common";

export type DuaAuthenticity =
  | "Quran"
  | "sahih"
  | "hasan"
  | "weak"
  | "general"
  | "needs-review";

export type DuaSourceType = "" | "Quran" | "Hadith";

export type ContentVerificationStatus = "draft" | "needs-review" | "approved" | "rejected";

export interface Dua {
  id: EntityId;
  stageId: EntityId;
  titleAr: string;
  arabicText: string;
  contextAr: string;
  sourceType: DuaSourceType;
  sourceReference: string;
  sourceCollection: string;
  sourceNumber: string;
  authenticity: DuaAuthenticity;
  verificationStatus: ContentVerificationStatus;
  order: number;
  titleEn?: string;
  translation?: string;
  transliteration?: string;
  source?: string;
}
