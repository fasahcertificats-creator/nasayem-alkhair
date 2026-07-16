import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import { getAzkarItems } from "@/services/content";
import type { AzkarCategory } from "@/types";

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

export default function AzkarPage() {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="azkar-heading">
        <AppBadge tone="gold">ورد المسلم</AppBadge>
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

        <div className={spacing.stack.sm}>
          {categoryOrder.map((category) => {
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
                  <Link href={ROUTES.azkarCategory(category)}>فتح القسم</Link>
                </AppButton>
              </AppCard>
            );
          })}
        </div>
      </section>
    </main>
  );
}
