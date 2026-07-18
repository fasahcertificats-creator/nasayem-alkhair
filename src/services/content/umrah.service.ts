import duasData from "../../../data/umrah/duas.json";
import stagesData from "../../../data/umrah/stages.json";

import type {
  ContentVerificationStatus,
  Dua,
  DuaAuthenticity,
  DuaSourceType,
  UmrahStage,
  UmrahStageContentSection,
  UmrahStagePhase
} from "@/types";

const umrahStagePhases = new Set<UmrahStagePhase>([
  "preparation",
  "travel",
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

function isUmrahStageContentSection(value: unknown): value is UmrahStageContentSection {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.titleAr === "string" &&
    typeof value.bodyAr === "string" &&
    typeof value.verificationStatus === "string" &&
    verificationStatusValues.has(value.verificationStatus as ContentVerificationStatus) &&
    typeof value.sourceReference === "string"
  );
}

function isDua(value: unknown): value is Dua {
  if (!isRecord(value)) {
    return false;
  }

  const hasRequiredFields =
    typeof value.id === "string" &&
    typeof value.titleAr === "string" &&
    typeof value.arabicText === "string" &&
    typeof value.contextAr === "string" &&
    typeof value.stageId === "string" &&
    typeof value.order === "number" &&
    typeof value.sourceType === "string" &&
    duaSourceTypes.has(value.sourceType as DuaSourceType) &&
    typeof value.sourceReference === "string" &&
    typeof value.sourceCollection === "string" &&
    typeof value.sourceNumber === "string" &&
    typeof value.authenticity === "string" &&
    duaAuthenticityValues.has(value.authenticity as DuaAuthenticity) &&
    typeof value.verificationStatus === "string" &&
    verificationStatusValues.has(value.verificationStatus as ContentVerificationStatus);

  const hasValidOptionalFields =
    (value.titleEn === undefined || typeof value.titleEn === "string") &&
    (value.translation === undefined || typeof value.translation === "string") &&
    (value.transliteration === undefined || typeof value.transliteration === "string") &&
    (value.source === undefined || typeof value.source === "string");

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
    (value.contentSections === undefined ||
      (Array.isArray(value.contentSections) &&
        value.contentSections.every(isUmrahStageContentSection))) &&
    isStringArray(value.instructions) &&
    isStringArray(value.duas) &&
    isStringArray(value.sources) &&
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

function getAllDuas(): Dua[] {
  return parseCollection(duasData, isDua).sort((first, second) => first.order - second.order);
}

function getAllDuasByStageId(stageId: string): Dua[] {
  const stage = getUmrahStages().find((item) => item.slug === stageId || item.id === stageId);
  const stageDuaIds = new Set(stage?.duas ?? []);

  return parseCollection(duasData, isDua)
    .filter((dua) => dua.stageId === stageId || stageDuaIds.has(dua.id))
    .sort((first, second) => first.order - second.order);
}

export function getUmrahStages(): UmrahStage[] {
  return parseCollection(stagesData, isUmrahStage).sort((first, second) => first.order - second.order);
}

export function getUmrahStageById(id: string): UmrahStage | undefined {
  return getUmrahStages().find((stage) => stage.id === id);
}

export function getDuasByStageId(stageId: string): Dua[] {
  return getAllDuasByStageId(stageId).filter((dua) => dua.verificationStatus === "approved");
}

export function getDuaById(id: string): Dua | undefined {
  return getAllDuas().find((dua) => dua.id === id && dua.verificationStatus === "approved");
}
