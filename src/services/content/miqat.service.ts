import miqatData from "../../../data/miqat/miqat.json";

import type { ContentVerificationStatus, Miqat } from "@/types";

const verificationStatusValues = new Set<ContentVerificationStatus>([
  "draft",
  "needs-review",
  "approved",
  "rejected"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMiqat(value: unknown): value is Miqat {
  if (!isRecord(value)) {
    return false;
  }

  const hasRequiredFields =
    typeof value.id === "string" &&
    typeof value.nameAr === "string" &&
    typeof value.nameEn === "string" &&
    typeof value.region === "string" &&
    typeof value.descriptionAr === "string" &&
    typeof value.rulesAr === "string" &&
    typeof value.relatedStageId === "string" &&
    typeof value.verificationStatus === "string" &&
    verificationStatusValues.has(value.verificationStatus as ContentVerificationStatus) &&
    typeof value.sourceReference === "string";

  const hasValidOptionalFields =
    (value.description === undefined || typeof value.description === "string") &&
    (value.rules === undefined ||
      (Array.isArray(value.rules) && value.rules.every((item) => typeof item === "string")));

  return hasRequiredFields && hasValidOptionalFields;
}

function parseCollection<T>(data: unknown, guard: (value: unknown) => value is T): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(guard);
}

export function getMiqatList(): Miqat[] {
  return parseCollection(miqatData, isMiqat).filter(
    (miqat) => miqat.verificationStatus === "approved"
  );
}
