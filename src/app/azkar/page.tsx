import type { Metadata } from "next";

import { getAzkarCatalog, getAzkarCategoryDefinitions } from "@/services/content";

import { AzkarOverview } from "./AzkarOverview";

export const metadata: Metadata = {
  title: "الأذكار",
  description: "أذكار الصباح والمساء والصلاة والنوم وأدعية مختارة موثقة المصادر.",
  alternates: {
    canonical: "/azkar"
  }
};

export default function AzkarPage() {
  return (
    <AzkarOverview
      catalog={getAzkarCatalog()}
      categories={[...getAzkarCategoryDefinitions()]}
    />
  );
}
