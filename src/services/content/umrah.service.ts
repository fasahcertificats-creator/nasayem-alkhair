import duasData from "../../../data/umrah/duas.json";
import stagesData from "../../../data/umrah/stages.json";

import type {
  ContentVerificationStatus,
  Dua,
  DuaAuthenticity,
  DuaSourceType,
  UmrahStage,
  UmrahStagePhase
} from "@/types";

const umrahStagePhases = new Set<UmrahStagePhase>([
  "preparation",
  "travel",
  "miqat",
  "ihram",
  "tawaf",
  "sai",
  "completion"
]);

const duaAuthenticityValues = new Set<DuaAuthenticity>([
  "Quran",
  "sahih",
  "hasan",
  "weak",
  "general",
  "needs-review"
]);

const duaSourceTypes = new Set<DuaSourceType>(["", "Quran", "Hadith"]);

const verificationStatusValues = new Set<ContentVerificationStatus>([
  "draft",
  "needs-review",
  "approved",
  "rejected"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isDua(value: unknown): value is Dua {
  if (!isRecord(value)) {
    return false;
  }

  const hasRequiredFields =
    typeof value.id === "string" &&
    typeof value.titleAr === "string" &&
    typeof value.titleEn === "string" &&
    typeof value.arabicText === "string" &&
    typeof value.translation === "string" &&
    typeof value.context === "string" &&
    typeof value.stageId === "string" &&
    typeof value.order === "number" &&
    typeof value.authenticity === "string" &&
    duaAuthenticityValues.has(value.authenticity as DuaAuthenticity);

  const hasValidOptionalFields =
    (value.transliteration === undefined || typeof value.transliteration === "string") &&
    (value.source === undefined || typeof value.source === "string") &&
    (value.sourceReference === undefined || typeof value.sourceReference === "string") &&
    (value.sourceCollection === undefined || typeof value.sourceCollection === "string") &&
    (value.sourceNumber === undefined || typeof value.sourceNumber === "string") &&
    (value.verificationStatus === undefined ||
      value.verificationStatus === "draft" ||
      value.verificationStatus === "needs-review" ||
      value.verificationStatus === "approved" ||
      value.verificationStatus === "rejected") &&
    (value.sourceType === undefined ||
      (typeof value.sourceType === "string" && duaSourceTypes.has(value.sourceType as DuaSourceType)));

  return hasRequiredFields && hasValidOptionalFields;
}

function isUmrahStage(value: unknown): value is UmrahStage {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.titleAr === "string" &&
    typeof value.titleEn === "string" &&
    typeof value.order === "number" &&
    typeof value.phase === "string" &&
    umrahStagePhases.has(value.phase as UmrahStagePhase) &&
    typeof value.summary === "string" &&
    isStringArray(value.instructions) &&
    isStringArray(value.duas) &&
    isStringArray(value.sources) &&
    typeof value.progressKey === "string" &&
    typeof value.verificationStatus === "string" &&
    verificationStatusValues.has(value.verificationStatus as ContentVerificationStatus)
  );
}

function parseCollection<T>(data: unknown, guard: (value: unknown) => value is T): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(guard);
}

export function getUmrahStages(): UmrahStage[] {
  return parseCollection(stagesData, isUmrahStage).sort((first, second) => first.order - second.order);
}

export function getUmrahStageById(id: string): UmrahStage | undefined {
  return getUmrahStages().find((stage) => stage.id === id);
}

export function getDuasByStageId(stageId: string): Dua[] {
  return parseCollection(duasData, isDua)
    .filter((dua) => dua.stageId === stageId)
    .sort((first, second) => first.order - second.order);
}
