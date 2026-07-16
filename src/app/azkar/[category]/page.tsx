import { notFound } from "next/navigation";

import { getAzkarItems } from "@/services/content";
import type { AzkarCategory } from "@/types";

import { AzkarCategoryContent } from "./AzkarCategoryContent";

const categoryOrder = [
  "morning",
  "evening",
  "prayer",
  "sleep",
  "wakeup",
  "after-prayer",
  "quran-duas",
  "prophetic-duas",
  "names-of-allah",
  "comprehensive-duas"
] as const satisfies readonly AzkarCategory[];

const categoryMetadata: Record<
  AzkarCategory,
  {
    description: string;
    title: string;
  }
> = {
  morning: {
    title: "أذكار الصباح",
    description: "أذكار ثابتة لبداية اليوم."
  },
  evening: {
    title: "أذكار المساء",
    description: "أذكار ثابتة لخاتمة اليوم."
  },
  prayer: {
    title: "أذكار الصلاة",
    description: "أذكار وأدعية ثابتة داخل الصلاة."
  },
  sleep: {
    title: "أذكار النوم",
    description: "أذكار ثابتة قبل النوم."
  },
  wakeup: {
    title: "أذكار الاستيقاظ",
    description: "أذكار ثابتة عند الاستيقاظ."
  },
  "after-prayer": {
    title: "أذكار بعد الصلاة",
    description: "أذكار ثابتة بعد السلام من الصلاة."
  },
  "quran-duas": {
    title: "أدعية من القرآن",
    description: "أدعية قرآنية جامعة."
  },
  "prophetic-duas": {
    title: "أدعية النبي صلى الله عليه وسلم",
    description: "أدعية نبوية صحيحة."
  },
  "names-of-allah": {
    title: "أسماء الله الحسنى",
    description: "قراءة لأسماء ثابتة بلا عداد تكرار."
  },
  "comprehensive-duas": {
    title: "أدعية شاملة",
    description: "أدعية جامعة ثابتة."
  }
};

interface AzkarCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return categoryOrder.map((category) => ({
    category
  }));
}

export default async function AzkarCategoryPage({ params }: AzkarCategoryPageProps) {
  const { category: categoryParam } = await params;

  if (!categoryOrder.includes(categoryParam as AzkarCategory)) {
    notFound();
  }

  const category = categoryParam as AzkarCategory;
  const metadata = categoryMetadata[category];
  const items = getAzkarItems(category);

  return (
    <AzkarCategoryContent
      description={metadata.description}
      items={items}
      title={metadata.title}
    />
  );
}
