import type { AzkarCategory, AzkarCategoryDefinition } from "@/types";

export const AZKAR_CATEGORY_DEFINITIONS = [
  {
    id: "morning",
    title: "أذكار الصباح",
    description: "أذكار ثابتة لبداية اليوم.",
    iconId: "sun",
    accent: "gold",
    decoration: "header"
  },
  {
    id: "evening",
    title: "أذكار المساء",
    description: "أذكار ثابتة لخاتمة اليوم.",
    iconId: "moon",
    accent: "green",
    decoration: "corner"
  },
  {
    id: "prayer",
    title: "أذكار الصلاة",
    description: "أذكار وأدعية ثابتة داخل الصلاة.",
    iconId: "star",
    accent: "gold",
    decoration: "corner"
  },
  {
    id: "sleep",
    title: "أذكار النوم",
    description: "أذكار ثابتة قبل النوم.",
    iconId: "bed",
    accent: "sage",
    decoration: "header"
  },
  {
    id: "wakeup",
    title: "أذكار الاستيقاظ",
    description: "أذكار ثابتة عند الاستيقاظ.",
    iconId: "sunrise",
    accent: "gold",
    decoration: "corner"
  },
  {
    id: "after-prayer",
    title: "أذكار بعد الصلاة",
    description: "أذكار ثابتة بعد السلام من الصلاة.",
    iconId: "scroll",
    accent: "green",
    decoration: "header"
  },
  {
    id: "quran-duas",
    title: "أدعية من القرآن",
    description: "أدعية قرآنية جامعة.",
    iconId: "book",
    accent: "sage",
    decoration: "corner"
  },
  {
    id: "prophetic-duas",
    title: "أدعية النبي صلى الله عليه وسلم",
    description: "أدعية نبوية صحيحة.",
    iconId: "heart",
    accent: "gold",
    decoration: "header"
  },
  {
    id: "names-of-allah",
    title: "أسماء الله الحسنى",
    description: "قراءة متأنية لأسماء الله الحسنى.",
    iconId: "sparkles",
    accent: "green",
    decoration: "corner"
  },
  {
    id: "comprehensive-duas",
    title: "أدعية شاملة",
    description: "أدعية جامعة ثابتة.",
    iconId: "cloud-sun",
    accent: "sage",
    decoration: "header"
  }
] as const satisfies readonly AzkarCategoryDefinition[];

const categoryDefinitionById = new Map<AzkarCategory, AzkarCategoryDefinition>(
  AZKAR_CATEGORY_DEFINITIONS.map((category) => [category.id, category])
);

export function getAzkarCategoryDefinition(categoryId: AzkarCategory) {
  return categoryDefinitionById.get(categoryId);
}
