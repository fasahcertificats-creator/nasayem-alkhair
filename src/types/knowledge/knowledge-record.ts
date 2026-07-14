import type { EntityId } from "../common";
import type { ContentVerificationStatus } from "../dua";

export type KnowledgeRecordType =
  | "quran"
  | "hadith"
  | "dua"
  | "dhikr"
  | "guidance"
  | "juristic-information"
  | "common-mistake"
  | "reminder";

export type KnowledgeAuthenticity =
  | "Quran"
  | "sahih"
  | "hasan"
  | "thabit"
  | "general"
  | "needs-review";

export interface KnowledgeRecord {
  id: EntityId;
  type: KnowledgeRecordType;
  titleAr: string;
  arabicText: string;
  translation: string;
  transliteration: string;
  summaryAr: string;
  contextAr: string;
  sourceId: EntityId;
  verificationStatus: ContentVerificationStatus;
  authenticity: KnowledgeAuthenticity;
  order: number;
  tags: string[];
  topics: string[];
  searchKeywords: string[];
  createdAt: string;
  updatedAt: string;
}
