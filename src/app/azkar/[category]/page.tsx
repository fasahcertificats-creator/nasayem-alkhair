import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes.constants";
import { getAzkarItems } from "@/services/content";

import { AzkarCategoryContent } from "./AzkarCategoryContent";

const categoryMetadata: Record<
  "travel",
  {
    description: string;
    title: string;
  }
> = {
  travel: {
    title: "أذكار السفر",
    description: "الأذكار المعتمدة المتاحة في هذا الإصدار للسفر والتنقل."
  }
};

const categories = ["travel"] as const;

interface AzkarCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return categories
    .filter((category) => getAzkarItems(category).length > 0)
    .map((category) => ({
      category
    }));
}

export default async function AzkarCategoryPage({ params }: AzkarCategoryPageProps) {
  const { category: categoryParam } = await params;

  if (!categories.includes(categoryParam as "travel")) {
    redirect(ROUTES.azkar);
  }

  const category = categoryParam as "travel";
  const metadata = categoryMetadata[category];
  const items = getAzkarItems(category);

  if (items.length === 0) {
    redirect(ROUTES.azkar);
  }

  return (
    <AzkarCategoryContent
      category={category}
      description={metadata.description}
      items={items}
      title={metadata.title}
    />
  );
}
