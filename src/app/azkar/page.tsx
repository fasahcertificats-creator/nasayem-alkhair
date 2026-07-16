import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import { getAzkarCategories, getAzkarItems } from "@/services/content";

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

export default function AzkarPage() {
  const contentCategories = getAzkarCategories();
  const categories = contentCategories.filter(
    (category): category is "travel" =>
      category === "travel" && getAzkarItems(category).length > 0
  );

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="azkar-heading">
        <AppBadge tone="gold">السفر</AppBadge>
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="azkar-heading"
        >
          أذكار السفر
        </h1>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="azkar-categories-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="azkar-categories-heading"
        >
          القسم المتاح
        </h2>

        <div className={spacing.stack.sm}>
          {categories.map((category) => {
            const metadata = categoryMetadata[category];
            const itemCount = getAzkarItems(category).length;

            return (
              <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`} key={category}>
                <div className={`flex items-start ${spacing.inline.sm}`}>
                  <BookOpenText
                    aria-hidden="true"
                    className={`${typography.tone.primary} mt-1 size-5 shrink-0`}
                  />
                  <div className={`${spacing.stack.xs} min-w-0 flex-1`}>
                    <div className={`flex items-center justify-between ${spacing.inline.sm}`}>
                      <h3 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                        {metadata.title}
                      </h3>
                      <AppBadge tone="ivory">{itemCount} ذكر</AppBadge>
                    </div>
                    <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                      {metadata.description}
                    </p>
                  </div>
                </div>

                <AppButton asChild tone="gold">
                  <Link href={ROUTES.azkarCategory(category)}>فتح أذكار السفر</Link>
                </AppButton>
              </AppCard>
            );
          })}
        </div>
      </section>
    </main>
  );
}
