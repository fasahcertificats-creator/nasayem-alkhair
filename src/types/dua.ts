import type { EntityId } from "./common";

export type DuaAuthenticity =
  | "Quran"
  | "sahih"
  | "hasan"
  | "weak"
  | "general"
  | "needs-review";

export type DuaSourceType = "" | "Quran" | "Hadith" | "Dua" | "Dhikr" | "Athar" | "Guidance";

export type ContentVerificationStatus = "draft" | "needs-review" | "approved" | "rejected";

export type ReligiousEvidenceStatus =
  | "verified-quran"
  | "sahih"
  | "hasan"
  | "verified-athar"
  | "reviewed-guidance"
  | "human-review-required";

export type ReligiousContentClassification =
  | "quran"
  | "hadith"
  | "dua"
  | "dhikr"
  | "athar"
  | "practical-guidance"
  | "caution"
  | "note";

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
  displayReferenceAr?: string;
  evidenceStatus?: ReligiousEvidenceStatus;
  gradingAuthorityAr?: string;
  instructionAr?: string;
  isExcerpt?: boolean;
  kind?: ReligiousContentClassification;
  ayahEnd?: number;
  ayahStart?: number;
  surahNameAr?: string;
  surahNumber?: number;
  timingAr?: string;
}
