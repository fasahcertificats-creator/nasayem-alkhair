import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { CSSProperties } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { spacing, typography } from "@/design-system";
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
    accent: string;
    title: string;
  }
> = {
  morning: {
    title: "أذكار الصباح",
    accent: "var(--category-morning)"
  },
  evening: {
    title: "أذكار المساء",
    accent: "var(--category-evening)"
  },
  prayer: {
    title: "أذكار الصلاة",
    accent: "var(--category-prayer)"
  },
  sleep: {
    title: "أذكار النوم",
    accent: "var(--category-sleep)"
  },
  wakeup: {
    title: "أذكار الاستيقاظ",
    accent: "var(--category-wakeup)"
  },
  "after-prayer": {
    title: "أذكار بعد الصلاة",
    accent: "var(--category-after-prayer)"
  },
  "quran-duas": {
    title: "أدعية من القرآن",
    accent: "var(--category-quran-duas)"
  },
  "prophetic-duas": {
    title: "أدعية النبي صلى الله عليه وسلم",
    accent: "var(--category-prophetic-duas)"
  },
  "names-of-allah": {
    title: "أسماء الله الحسنى",
    accent: "var(--category-names-of-allah)"
  },
  "comprehensive-duas": {
    title: "أدعية شاملة",
    accent: "var(--category-comprehensive-duas)"
  }
};

export default function AzkarPage() {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="azkar-heading">
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="azkar-heading"
        >
          الأذكار
        </h1>
      </section>

      <section aria-label="أقسام الأذكار">
        <div className="grid grid-cols-2 gap-3 max-[330px]:grid-cols-1 sm:gap-3.5">
          {categoryOrder.map((category) => {
            const metadata = categoryMetadata[category];

            return (
              <Link
                aria-label={`عرض ${metadata.title}`}
                className="group flex min-h-[118px] flex-col items-center justify-center rounded-[22px] border border-border bg-white px-3 py-5 text-center shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--category-accent)] hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--category-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={ROUTES.azkarCategory(category)}
                key={category}
                style={{ "--category-accent": metadata.accent } as CSSProperties}
              >
                <span
                  className="max-w-full text-balance text-[15px] font-semibold leading-relaxed sm:text-base"
                  style={{ color: metadata.accent }}
                >
                  {metadata.title}
                </span>
                <span
                  className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-medium opacity-75 transition group-hover:opacity-100"
                  style={{ color: metadata.accent }}
                >
                  <span>المزيد</span>
                  <ChevronDown aria-hidden="true" className="size-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
