import { notFound } from "next/navigation";

import { getAzkarItems } from "@/services/content";
import type { AzkarCategory } from "@/types";

import { AzkarCategoryContent } from "./AzkarCategoryContent";

const categoryMetadata: Record<
  AzkarCategory,
  {
    description: string;
    title: string;
  }
> = {
  morning: {
    title: "أذكار الصباح",
    description: "قراءة صباحية هادئة ومهيأة للمحتوى الموثق."
  },
  evening: {
    title: "أذكار المساء",
    description: "مساحة مسائية للذكر والمراجعة اليومية."
  },
  sleep: {
    title: "أذكار النوم",
    description: "قراءة مريحة قبل النوم."
  },
  wakeup: {
    title: "أذكار الاستيقاظ",
    description: "بداية يومية لطيفة بعد الاستيقاظ."
  },
  travel: {
    title: "أذكار السفر",
    description: "قسم مخصص لأذكار السفر والتنقل."
  }
};

const categories = Object.keys(categoryMetadata) as AzkarCategory[];

interface AzkarCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({
    category
  }));
}

export default async function AzkarCategoryPage({ params }: AzkarCategoryPageProps) {
  const { category: categoryParam } = await params;

  if (!categories.includes(categoryParam as AzkarCategory)) {
    notFound();
  }

  const category = categoryParam as AzkarCategory;
  const metadata = categoryMetadata[category];
  const items = getAzkarItems(category);

  return (
    <AzkarCategoryContent
      category={category}
      description={metadata.description}
      items={items}
      title={metadata.title}
    />
  );
}
