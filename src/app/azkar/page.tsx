import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
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
          <Link
            aria-label="فتح التسبيح"
            className="group col-span-2 flex min-h-[118px] items-center justify-between gap-4 rounded-[22px] border border-border bg-secondary/80 px-4 py-4 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-emerald-700/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background max-[330px]:col-span-1"
            href={ROUTES.tasbih}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-emerald-700">
                <Sparkles aria-hidden="true" className="size-6" strokeWidth={1.7} />
              </div>
              <div className="min-w-0 space-y-1">
                <h2 className="text-base font-bold text-primary">التسبيح</h2>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  عداد بسيط للذكر والاستغفار
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-emerald-700">
              <span>فتح التسبيح</span>
              <ChevronDown aria-hidden="true" className="size-3" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
