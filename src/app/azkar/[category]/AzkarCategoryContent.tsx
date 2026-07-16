"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, colors, spacing, typography } from "@/design-system";
import type { AzkarCategory, AzkarItem } from "@/types";

import { AzkarReaderCard } from "../AzkarReaderCard";

const AZKAR_PROGRESS_KEY = "nasayem-alkhair:azkarProgress";

interface AzkarCategoryContentProps {
  category: AzkarCategory;
  description: string;
  items: AzkarItem[];
  title: string;
}

interface AzkarProgressState {
  completedCategories: Record<string, string>;
  completedItems: Record<string, string>;
}

const emptyProgressState: AzkarProgressState = {
  completedCategories: {},
  completedItems: {}
};

function readAzkarProgress(): AzkarProgressState {
  if (typeof window === "undefined") {
    return emptyProgressState;
  }

  const value = window.localStorage.getItem(AZKAR_PROGRESS_KEY);

  if (!value) {
    return emptyProgressState;
  }

  try {
    return JSON.parse(value) as AzkarProgressState;
  } catch {
    return emptyProgressState;
  }
}

function writeAzkarProgress(progress: AzkarProgressState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AZKAR_PROGRESS_KEY, JSON.stringify(progress));
}

function AzkarCategoryContentComponent({
  category,
  description,
  items,
  title
}: AzkarCategoryContentProps) {
  const [progress, setProgress] = useState<AzkarProgressState>(emptyProgressState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      setProgress(readAzkarProgress());
      setIsHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const completedItemIds = useMemo(() => new Set(Object.keys(progress.completedItems)), [progress]);
  const completedItems = items.filter((item) => completedItemIds.has(item.id));
  const progressPercentage =
    items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0;
  const isCategoryCompleted = Boolean(progress.completedCategories[category]);

  const toggleItem = useCallback((itemId: string) => {
    setProgress((currentProgress) => {
      const nextCompletedItems = { ...currentProgress.completedItems };

      if (nextCompletedItems[itemId]) {
        delete nextCompletedItems[itemId];
      } else {
        nextCompletedItems[itemId] = new Date().toISOString();
      }

      const nextProgress = {
        ...currentProgress,
        completedItems: nextCompletedItems
      };

      writeAzkarProgress(nextProgress);

      return nextProgress;
    });
  }, []);

  const toggleCategorySession = useCallback(() => {
    setProgress((currentProgress) => {
      const nextCompletedCategories = { ...currentProgress.completedCategories };

      if (nextCompletedCategories[category]) {
        delete nextCompletedCategories[category];
      } else {
        nextCompletedCategories[category] = new Date().toISOString();
      }

      const nextProgress = {
        ...currentProgress,
        completedCategories: nextCompletedCategories
      };

      writeAzkarProgress(nextProgress);

      return nextProgress;
    });
  }, [category]);

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.sm} aria-labelledby="azkar-category-heading">
        <AppButton asChild tone="ghost">
          <Link href={ROUTES.azkar}>العودة إلى أذكار السفر</Link>
        </AppButton>
        <div className={spacing.stack.xs}>
          <AppBadge tone={isCategoryCompleted ? "gold" : "ivory"}>
            {isCategoryCompleted ? "جلسة مكتملة" : "جلسة قراءة"}
          </AppBadge>
          <h1
            className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
            id="azkar-category-heading"
          >
            {title}
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>{description}</p>
        </div>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="azkar-progress-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="azkar-progress-heading"
        >
          تقدم القراءة
        </h2>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className="flex items-center justify-between">
            <AppBadge tone="gold">{isHydrated ? `${progressPercentage}%` : "..."}</AppBadge>
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              {isHydrated ? `${completedItems.length} من ${items.length}` : "يتم التحميل"}
            </p>
          </div>
          <div className={`h-2 overflow-hidden rounded-full ${colors.emerald.surfaceSoft}`}>
            <div
              className={`h-full rounded-full ${colors.gold.surface}`}
              style={{ width: `${isHydrated ? progressPercentage : 0}%` }}
            />
          </div>
          <AppButton
            disabled={!isHydrated}
            onClick={toggleCategorySession}
            tone={isCategoryCompleted ? "outline" : "gold"}
          >
            <CheckCircle2 aria-hidden="true" />
            {isCategoryCompleted ? "إلغاء إكمال الجلسة" : "إكمال جلسة القسم"}
          </AppButton>
        </AppCard>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="azkar-items-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="azkar-items-heading"
        >
          القراءة
        </h2>

        <div className={spacing.stack.sm}>
          {items.map((item) => (
            <AzkarReaderCard
              isCompleted={completedItemIds.has(item.id)}
              item={item}
              key={item.id}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export const AzkarCategoryContent = memo(AzkarCategoryContentComponent);
