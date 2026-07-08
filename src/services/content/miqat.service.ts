import miqatData from "../../../data/miqat/miqat.json";

import type { Miqat } from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isMiqat(value: unknown): value is Miqat {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.nameAr === "string" &&
    typeof value.nameEn === "string" &&
    typeof value.description === "string" &&
    typeof value.region === "string" &&
    isStringArray(value.rules)
  );
}

function parseCollection<T>(data: unknown, guard: (value: unknown) => value is T): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(guard);
}

export function getMiqatList(): Miqat[] {
  return parseCollection(miqatData, isMiqat);
}
