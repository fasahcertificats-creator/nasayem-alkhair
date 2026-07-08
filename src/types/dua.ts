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
  titleAr: string;
  titleEn: string;
  arabicText: string;
  translation: string;
  transliteration?: string;
  context: string;
  source?: string;
  sourceType?: DuaSourceType;
  sourceReference?: string;
  sourceCollection?: string;
  sourceNumber?: string;
  authenticity: DuaAuthenticity;
  verificationStatus?: ContentVerificationStatus;
  stageId: EntityId;
  order: number;
}
