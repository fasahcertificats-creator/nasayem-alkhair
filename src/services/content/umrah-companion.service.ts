import companionDuasData from "../../../data/umrah/companion-duas.json";

import type {
  ReligiousContentScope,
  ReligiousSourceKind,
  UmrahContext,
  UmrahDuaItem
} from "@/types";

const contexts = new Set<UmrahContext>(["tawaf", "sai"]);
const scopes = new Set<ReligiousContentScope>(["position-specific", "general"]);
const sourceKinds = new Set<ReligiousSourceKind>(["quran", "hadith"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUmrahDuaItem(value: unknown): value is UmrahDuaItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.text === "string" &&
    typeof value.context === "string" &&
    contexts.has(value.context as UmrahContext) &&
    typeof value.scope === "string" &&
    scopes.has(value.scope as ReligiousContentScope) &&
    typeof value.sourceKind === "string" &&
    sourceKinds.has(value.sourceKind as ReligiousSourceKind) &&
    typeof value.sourceLabel === "string" &&
    typeof value.sourceReference === "string" &&
    (value.authenticityLabel === undefined || typeof value.authenticityLabel === "string") &&
    (value.userNotice === undefined || typeof value.userNotice === "string")
  );
}

const approvedCompanionDuas = Array.isArray(companionDuasData)
  ? companionDuasData.filter(isUmrahDuaItem)
  : [];

export function getUmrahCompanionDuas(context: UmrahContext): UmrahDuaItem[] {
  return approvedCompanionDuas.filter(
    (item) => item.context === context && item.scope === "general"
  );
}
