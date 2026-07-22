import type { EntityId } from "./common";
import type {
  ContentVerificationStatus,
  ReligiousContentClassification,
  ReligiousEvidenceStatus
} from "./dua";

export type UmrahStagePhase =
  | "preparation"
  | "travel"
  | "ihram"
  | "tawaf"
  | "sai"
  | "completion";

export interface UmrahStageContentSection {
  id: EntityId;
  titleAr: string;
  bodyAr: string;
  verificationStatus: ContentVerificationStatus;
  sourceReference: string;
  displayReferenceAr?: string;
  evidenceStatus?: ReligiousEvidenceStatus;
  kind?: ReligiousContentClassification;
  ayahEnd?: number;
  ayahStart?: number;
  isExcerpt?: boolean;
  surahNameAr?: string;
  surahNumber?: number;
}

export interface UmrahStage {
  id: EntityId;
  slug: string;
  titleAr: string;
  titleEn: string;
  order: number;
  phase: UmrahStagePhase;
  summary: string;
  contentSections?: UmrahStageContentSection[];
  instructions: string[];
  duas: EntityId[];
  sources: string[];
  verificationStatus: ContentVerificationStatus;
}
