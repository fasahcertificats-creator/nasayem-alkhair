import type { EntityId } from "../common";

export type KnowledgeSourceType = "" | "Quran" | "Hadith" | "ScholarlyReference";

export interface KnowledgeSource {
  id: EntityId;
  sourceType: KnowledgeSourceType;
  sourceReference: string;
  collection: string;
  number: string;
  surah: string;
  ayah: string;
  volume: string;
  page: string;
  narrator: string;
  authenticity: string;
  scholarNotes: string;
}
