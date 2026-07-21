import {
  BookOpen,
  ChevronDown,
  CloudSun,
  Heart,
  Moon,
  ScrollText,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  type LucideIcon
} from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import {
  AzkarCategoryCard,
  IconBadge,
  IslamicPattern,
  PageHeading,
  SurfaceCard,
  spacing,
  typography
} from "@/design-system";
import type { AzkarCategory } from "@/types";
import Link from "next/link";

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
    icon: LucideIcon;
    title: string;
  }
> = {
  morning: {
    title: "أذكار الصباح",
    accent: "#5A96B8",
    icon: Sun
  },
  evening: {
    title: "أذكار المساء",
    accent: "#B86A72",
    icon: Moon
  },
  prayer: {
    title: "أذكار الصلاة",
    accent: "#B88F43",
    icon: Star
  },
  sleep: {
    title: "أذكار النوم",
    accent: "#8E75A8",
    icon: Moon
  },
  wakeup: {
    title: "أذكار الاستيقاظ",
    accent: "#B87A94",
    icon: Sunrise
  },
  "after-prayer": {
    title: "أذكار بعد الصلاة",
    accent: "#5C88B8",
    icon: ScrollText
  },
  "quran-duas": {
    title: "أدعية من القرآن",
    accent: "#7F998A",
    icon: BookOpen
  },
  "prophetic-duas": {
    title: "أدعية النبي صلى الله عليه وسلم",
    accent: "#A9853E",
    icon: Heart
  },
  "names-of-allah": {
    title: "أسماء الله الحسنى",
    accent: "#A45E67",
    icon: Sparkles
  },
  "comprehensive-duas": {
    title: "أدعية شاملة",
    accent: "#5F9A91",
    icon: CloudSun
  }
};

export default function AzkarPage() {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className="relative min-w-0 overflow-hidden rounded-[var(--radius-card)] px-2 py-1" aria-labelledby="azkar-heading">
        <IslamicPattern className="-top-6 end-1" opacity={0.04} size="medium" tone="gold" variant="header" />
        <PageHeading id="azkar-heading">الأذكار</PageHeading>
      </section>

      <section aria-label="أقسام الأذكار">
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-3.5">
          {categoryOrder.map((category) => {
            const metadata = categoryMetadata[category];

            return (
              <AzkarCategoryCard
                accent={metadata.accent}
                actionLabel="المزيد"
                href={ROUTES.azkarCategory(category)}
                icon={metadata.icon}
                key={category}
                title={metadata.title}
              />
            );
          })}
          <SurfaceCard
            className="col-span-2 p-3.5"
            decoration={
              <IslamicPattern
                className="-top-5 end-2"
                opacity={0.035}
                size="medium"
                tone="green"
                variant="corner"
              />
            }
            variant="muted"
          >
            <Link
              aria-label="فتح التسبيح"
              className="group relative flex min-h-[96px] min-w-0 items-center justify-between gap-4 rounded-[var(--radius-large)] no-underline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              href={ROUTES.tasbih}
            >
              <div className="flex min-w-0 items-center gap-3">
                <IconBadge tone="green">
                  <Sparkles aria-hidden="true" />
                </IconBadge>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-primary text-[17px] leading-relaxed font-bold">التسبيح</h2>
                  <p className="text-muted-foreground line-clamp-2 text-[13px] leading-relaxed">
                    عداد بسيط للذكر والاستغفار
                  </p>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-[13px] font-bold text-primary/75 transition group-hover:text-primary">
                <span>فتح التسبيح</span>
                <ChevronDown aria-hidden="true" className="size-3.5" />
              </span>
            </Link>
          </SurfaceCard>
        </div>
      </section>
    </main>
  );
}
