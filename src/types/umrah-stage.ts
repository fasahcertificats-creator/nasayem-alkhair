import type { EntityId } from "./common";
import type { ContentVerificationStatus } from "./dua";

export type UmrahStagePhase =
  | "preparation"
  | "travel"
  | "miqat"
  | "ihram"
  | "tawaf"
  | "sai"
  | "completion";

export interface UmrahStage {
  id: EntityId;
  slug: string;
  titleAr: string;
  titleEn: string;
  order: number;
  phase: UmrahStagePhase;
  summary: string;
  instructions: string[];
  duas: EntityId[];
  sources: string[];
  progressKey: string;
  verificationStatus: ContentVerificationStatus;
}
