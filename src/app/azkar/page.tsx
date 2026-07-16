import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import { getAzkarCategories, getAzkarItems } from "@/services/content";
import type { AzkarCategory } from "@/types";

const categoryMetadata: Record<
  AzkarCategory,
  {
    description: string;
    title: string;
  }
> = {
  morning: {
    title: "أذكار الصباح",
    description: "بداية هادئة لليوم مع محتوى موثق."
  },
  evening: {
    title: "أذكار المساء",
    description: "ختام اليوم بقراءة مريحة ومنظمة."
  },
  sleep: {
    title: "أذكار النوم",
    description: "مساحة قراءة مهيأة قبل النوم."
  },
  wakeup: {
    title: "أذكار الاستيقاظ",
    description: "تهيئة لطيفة لبداية يوم جديد."
  },
  travel: {
    title: "أذكار السفر",
    description: "قسم مخصص للسفر والتنقل."
  }
};

export default function AzkarPage() {
  const contentCategories = getAzkarCategories();
  const categories = contentCategories.filter((category) => getAzkarItems(category).length > 0);

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="azkar-heading">
        <AppBadge tone="gold">ورد يومي</AppBadge>
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="azkar-heading"
        >
          الأذكار
        </h1>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="azkar-categories-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="azkar-categories-heading"
        >
          الأقسام
        </h2>

        {categories.length > 0 ? (
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
                      <AppBadge tone="ivory">{itemCount} عناصر</AppBadge>
                    </div>
                    <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                      {metadata.description}
                    </p>
                  </div>
                </div>

                <AppButton asChild tone="gold">
                  <Link href={ROUTES.azkarCategory(category)}>فتح القسم</Link>
                </AppButton>
              </AppCard>
            );
            })}
          </div>
        ) : (
          <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
            <BookOpenText aria-hidden="true" className={`${typography.tone.primary} size-5`} />
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              لا توجد أذكار معتمدة للعرض حالياً.
            </p>
          </AppCard>
        )}
      </section>
    </main>
  );
}
