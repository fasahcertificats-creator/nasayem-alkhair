"use client";

import {
  Bed,
  BookOpen,
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
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import {
  AzkarCategoryCard,
  IslamicPattern,
  PageHeading
} from "@/design-system";
import {
  getAzkarCategorySummary,
  loadAzkarProgress,
  subscribeToAzkarProgress,
  type AzkarCatalog,
  type AzkarProgressState
} from "@/lib/azkar-progress";
import type {
  AzkarCategoryDefinition,
  AzkarIconId
} from "@/types";

interface AzkarOverviewProps {
  catalog: AzkarCatalog;
  categories: AzkarCategoryDefinition[];
}

const iconById: Record<AzkarIconId, LucideIcon> = {
  sun: Sun,
  moon: Moon,
  star: Star,
  bed: Bed,
  sunrise: Sunrise,
  scroll: ScrollText,
  book: BookOpen,
  heart: Heart,
  sparkles: Sparkles,
  "cloud-sun": CloudSun
};

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function formatNumber(value: number) {
  return arabicNumberFormatter.format(value);
}

function getLastStartedCategory(
  state: AzkarProgressState,
  catalog: AzkarCatalog
) {
  return Object.values(state.categories)
    .filter((progress) => {
      if (!progress) {
        return false;
      }

      return getAzkarCategorySummary(state, progress.categoryId, catalog)
        .hasProgress;
    })
    .sort(
      (first, second) =>
        (second?.lastOpenedAt ?? 0) - (first?.lastOpenedAt ?? 0)
    )
    .at(0);
}

export function AzkarOverview({ catalog, categories }: AzkarOverviewProps) {
  const [progressState, setProgressState] =
    useState<AzkarProgressState | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState("");

  useEffect(() => {
    function refreshProgress(showRecoveryMessage = false) {
      const result = loadAzkarProgress(catalog);

      setProgressState(result.state);

      if (showRecoveryMessage && result.recovered) {
        setRecoveryMessage(
          "تمت استعادة الأذكار مع تجاهل بيانات تقدم غير صالحة."
        );
      }
    }

    refreshProgress(true);

    return subscribeToAzkarProgress(() => refreshProgress());
  }, [catalog]);

  const lastStartedCategory = useMemo(
    () =>
      progressState
        ? getLastStartedCategory(progressState, catalog)
        : undefined,
    [catalog, progressState]
  );
  const lastCategoryDefinition = lastStartedCategory
    ? categories.find(
        (category) => category.id === lastStartedCategory.categoryId
      )
    : undefined;
  const lastCategorySummary =
    progressState && lastStartedCategory
      ? getAzkarCategorySummary(
          progressState,
          lastStartedCategory.categoryId,
          catalog
        )
      : undefined;
  const startedCategoryCount = progressState
    ? categories.filter(
        (category) =>
          getAzkarCategorySummary(progressState, category.id, catalog)
            .hasProgress
      ).length
    : 0;
  const completedCategoryCount = progressState
    ? categories.filter(
        (category) =>
          getAzkarCategorySummary(progressState, category.id, catalog)
            .isComplete
      ).length
    : 0;

  return (
    <main
      className="space-y-5 overflow-x-hidden px-4 pt-4 pb-8 font-arabic-studio text-right sm:px-5"
      dir="rtl"
    >
      <section
        className="relative min-w-0 overflow-hidden rounded-[var(--radius-card)] border border-border/70 bg-card px-4 py-5 shadow-soft"
        aria-labelledby="azkar-heading"
      >
        <IslamicPattern
          className="-top-7 end-1"
          opacity={0.045}
          size="medium"
          tone="gold"
          variant="header"
        />
        <div className="relative space-y-2">
          <PageHeading id="azkar-heading">الأذكار</PageHeading>
          <p className="mx-auto max-w-md text-center text-[13px] leading-[1.9] text-muted-foreground">
            اقرأ أذكارك بهدوء، واحفظ تقدمك على هذا الجهاز لتعود إليه في أي وقت.
          </p>
        </div>
      </section>

      {recoveryMessage ? (
        <p
          className="rounded-[var(--radius-medium)] border border-gold/25 bg-[var(--nasayem-gold-050)] px-3 py-2.5 text-[12px] leading-relaxed text-primary"
          aria-live="polite"
        >
          {recoveryMessage}
        </p>
      ) : null}

      {lastCategoryDefinition && lastCategorySummary ? (
        <section
          className="relative overflow-hidden rounded-[var(--radius-card)] border border-primary/15 bg-[var(--nasayem-green-050)] p-4"
          aria-labelledby="continue-reading-heading"
        >
          <IslamicPattern
            className="-top-5 end-2"
            opacity={0.035}
            size="small"
            tone="green"
            variant="corner"
          />
          <div className="relative space-y-3">
            <div className="space-y-1">
              <h2
                className="text-[15px] font-bold text-primary"
                id="continue-reading-heading"
              >
                متابعة القراءة
              </h2>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {lastCategoryDefinition.title}
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-bold text-primary">
                {lastCategorySummary.isComplete
                  ? "مكتمل"
                  : `${formatNumber(lastCategorySummary.completedItems)} من ${formatNumber(lastCategorySummary.totalItems)}`}
              </p>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-medium)] bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground no-underline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                href={ROUTES.azkarCategory(lastCategoryDefinition.id)}
              >
                متابعة {lastCategoryDefinition.title}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {progressState && startedCategoryCount > 0 ? (
        <section
          className="flex min-w-0 flex-wrap items-center justify-between gap-2"
          aria-label="ملخص التقدم"
        >
          <h2 className="text-[15px] font-bold text-primary">تقدمك</h2>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            بدأت {formatNumber(startedCategoryCount)} من{" "}
            {formatNumber(categories.length)}
            {completedCategoryCount > 0
              ? `، وأكملت ${formatNumber(completedCategoryCount)}`
              : ""}
          </p>
        </section>
      ) : null}

      <section aria-labelledby="azkar-categories-heading">
        <h2 className="sr-only" id="azkar-categories-heading">
          أقسام الأذكار
        </h2>
        <div className="grid min-w-0 grid-cols-1 gap-3 min-[340px]:grid-cols-2 sm:gap-3.5">
          {categories.map((category) => {
            const summary = progressState
              ? getAzkarCategorySummary(progressState, category.id, catalog)
              : undefined;
            const Icon = iconById[category.iconId];

            return (
              <AzkarCategoryCard
                accent={category.accent}
                completedItemCount={summary?.completedItems}
                description={category.description}
                href={ROUTES.azkarCategory(category.id)}
                icon={Icon}
                isComplete={summary?.isComplete}
                itemCount={catalog[category.id].length}
                key={category.id}
                pattern={category.decoration}
                progressReady={Boolean(progressState)}
                title={category.title}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
