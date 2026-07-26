import type { Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ROUTES } from "@/constants/routes.constants";
import {
  getAzkarCatalog,
  getAzkarCategories,
  getAzkarCategoryDefinition,
  getAzkarItems
} from "@/services/content";
import type { AzkarCategory } from "@/types";

import { AzkarCategoryContent } from "./AzkarCategoryContent";

const oldCategoryRedirects: Record<string, Route> = {
  after_prayer: ROUTES.azkarCategory("after-prayer"),
  post_prayer: ROUTES.azkarCategory("after-prayer"),
  "post-prayer": ROUTES.azkarCategory("after-prayer"),
  sleeping: ROUTES.azkarCategory("sleep"),
  waking_up: ROUTES.azkarCategory("wakeup"),
  "waking-up": ROUTES.azkarCategory("wakeup"),
  quran: ROUTES.azkarCategory("quran-duas"),
  quran_duas: ROUTES.azkarCategory("quran-duas"),
  prophetic_duas: ROUTES.azkarCategory("prophetic-duas"),
  allah_names: ROUTES.azkarCategory("names-of-allah"),
  names_of_allah: ROUTES.azkarCategory("names-of-allah")
};

interface AzkarCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return getAzkarCategories().map((category) => ({
    category
  }));
}

export default async function AzkarCategoryPage({
  params
}: AzkarCategoryPageProps) {
  const { category: categoryParam } = await params;
  const redirectTarget = oldCategoryRedirects[categoryParam];

  if (redirectTarget) {
    permanentRedirect(redirectTarget);
  }

  if (!getAzkarCategories().includes(categoryParam as AzkarCategory)) {
    notFound();
  }

  const categoryId = categoryParam as AzkarCategory;
  const category = getAzkarCategoryDefinition(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <AzkarCategoryContent
      catalog={getAzkarCatalog()}
      category={category}
      items={getAzkarItems(categoryId)}
    />
  );
}
