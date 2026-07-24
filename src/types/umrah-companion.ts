export type ReligiousContentScope = "position-specific" | "general";

export type ReligiousSourceKind = "quran" | "hadith";

export type UmrahContext = "tawaf" | "sai";

export interface UmrahDuaItem {
  id: string;
  title: string;
  text: string;
  context: UmrahContext;
  scope: ReligiousContentScope;
  sourceKind: ReligiousSourceKind;
  sourceLabel: string;
  sourceReference: string;
  authenticityLabel?: string;
  userNotice?: string;
}
