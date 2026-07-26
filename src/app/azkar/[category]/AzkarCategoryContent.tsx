"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { IslamicPattern, PageHeading, SurfaceCard } from "@/design-system";
import {
  getAzkarCategorySummary,
  loadAzkarProgress,
  resetAzkarCategory,
  saveAzkarProgress,
  setAzkarItemCount,
  touchAzkarCategory,
  type AzkarCatalog,
  type AzkarProgressState
} from "@/lib/azkar-progress";
import type { AzkarCategoryDefinition, AzkarItem } from "@/types";

import { AzkarReaderCard } from "../AzkarReaderCard";

interface AzkarCategoryContentProps {
  catalog: AzkarCatalog;
  category: AzkarCategoryDefinition;
  items: AzkarItem[];
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function formatNumber(value: number) {
  return arabicNumberFormatter.format(value);
}

function AzkarCategoryContentComponent({
  catalog,
  category,
  items
}: AzkarCategoryContentProps) {
  const [progressState, setProgressState] =
    useState<AzkarProgressState | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const progressStateRef = useRef<AzkarProgressState | null>(null);
  const isNamesOfAllah = category.id === "names-of-allah";

  useEffect(() => {
    const initializationTimer = window.setTimeout(() => {
      const result = loadAzkarProgress(catalog);
      const touchedState = touchAzkarCategory(
        result.state,
        category.id,
        catalog
      );

      progressStateRef.current = touchedState;
      setProgressState(touchedState);
      setStorageUnavailable(!result.storageAvailable);

      if (result.recovered) {
        setRecoveryMessage(
          "تمت استعادة الأذكار مع تجاهل بيانات تقدم غير صالحة."
        );
      }

      if (result.storageAvailable) {
        saveAzkarProgress(touchedState);
      }
    }, 0);

    return () => window.clearTimeout(initializationTimer);
  }, [catalog, category.id]);

  function commitProgress(nextState: AzkarProgressState) {
    progressStateRef.current = nextState;
    setProgressState(nextState);

    if (!saveAzkarProgress(nextState)) {
      setStorageUnavailable(true);
    }
  }

  function incrementItem(item: AzkarItem) {
    const currentState = progressStateRef.current;
    const currentCount =
      currentState?.categories[category.id]?.counts[item.id] ?? 0;

    if (!currentState || currentCount >= item.targetCount) {
      return;
    }

    const nextCount = Math.min(currentCount + 1, item.targetCount);
    const nextState = setAzkarItemCount(
      currentState,
      category.id,
      item.id,
      nextCount,
      catalog
    );
    commitProgress(nextState);

    if (nextCount === item.targetCount) {
      const nextSummary = getAzkarCategorySummary(
        nextState,
        category.id,
        catalog
      );
      setStatusMessage(
        nextSummary.isComplete
          ? `اكتمل قسم ${category.title}.`
          : "تم إتمام الذكر."
      );
    } else {
      setStatusMessage(
        `تم تسجيل ${formatNumber(nextCount)} من ${formatNumber(item.targetCount)}.`
      );
    }
  }

  function confirmReset() {
    const currentState = progressStateRef.current;

    if (!currentState) {
      return;
    }

    const resetState = resetAzkarCategory(currentState, category.id);
    const restartedState = touchAzkarCategory(
      resetState,
      category.id,
      catalog,
      items[0].id
    );
    commitProgress(restartedState);
    setShowResetConfirmation(false);
    setStatusMessage(`أُعيد قسم ${category.title} من البداية.`);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  if (items.length === 0) {
    return (
      <main
        className="space-y-5 overflow-x-hidden px-4 pt-4 pb-8 text-right sm:px-5"
        dir="rtl"
      >
        <CategoryHeader category={category} />
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 text-center shadow-soft">
          <p className="text-[14px] leading-[1.9] text-primary">
            لا توجد أذكار متاحة في هذا القسم حاليًا.
          </p>
          <Link
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-medium)] bg-primary px-4 py-2 text-sm font-bold text-primary-foreground no-underline"
            href={ROUTES.azkar}
          >
            العودة إلى الأذكار
          </Link>
        </section>
      </main>
    );
  }

  if (isNamesOfAllah) {
    return (
      <main
        className="space-y-5 overflow-x-hidden px-4 pt-4 pb-8 font-arabic-studio text-right sm:px-5"
        dir="rtl"
      >
        <CategoryHeader category={category} />
        <NamesOfAllahGrid items={items} />
      </main>
    );
  }

  if (!progressState) {
    return (
      <main
        className="space-y-5 overflow-x-hidden px-4 pt-4 pb-8 text-right sm:px-5"
        dir="rtl"
      >
        <CategoryHeader category={category} />
        <section
          aria-label="تحميل التقدم المحفوظ"
          className="min-h-64 animate-pulse rounded-[var(--radius-card)] border border-border bg-card p-5 motion-reduce:animate-none"
        >
          <p className="text-center text-[13px] text-muted-foreground">
            جارٍ تحميل التقدم المحفوظ…
          </p>
        </section>
      </main>
    );
  }

  const categoryProgress = progressState.categories[category.id];
  const summary = getAzkarCategorySummary(
    progressState,
    category.id,
    catalog
  );
  const overallPercent = Math.round(
    (summary.completedItems / summary.totalItems) * 100
  );

  return (
    <main
      className="space-y-5 overflow-x-hidden px-4 pt-4 pb-8 font-arabic-studio text-right sm:px-5"
      dir="rtl"
    >
      <CategoryHeader category={category} />

      {recoveryMessage ? (
        <p
          className="rounded-[var(--radius-medium)] border border-gold/25 bg-[var(--nasayem-gold-050)] px-3 py-2.5 text-[12px] leading-relaxed text-primary"
          aria-live="polite"
        >
          {recoveryMessage}
        </p>
      ) : null}

      {storageUnavailable ? (
        <p className="rounded-[var(--radius-medium)] border border-border bg-secondary px-3 py-2.5 text-[12px] leading-relaxed text-primary">
          تعذر حفظ التقدم على هذا الجهاز، ويمكن متابعة القراءة في هذه الجلسة.
        </p>
      ) : null}

      <section
        className="space-y-2.5 rounded-[var(--radius-medium)] border border-border bg-card p-3.5"
        aria-labelledby="category-progress-heading"
      >
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <h2
            className="text-[13px] font-bold text-primary"
            id="category-progress-heading"
          >
            تقدم القسم
          </h2>
          <p className="text-[12px] font-bold text-primary">
            {formatNumber(summary.completedItems)} من{" "}
            {formatNumber(summary.totalItems)}
          </p>
        </div>
        <div
          aria-label={`تقدم ${category.title}`}
          aria-valuemax={summary.totalItems}
          aria-valuemin={0}
          aria-valuenow={summary.completedItems}
          className="h-2 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
        >
          <span
            aria-hidden="true"
            className="block h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </section>

      {summary.isComplete ? (
        <section
          className="relative space-y-3 overflow-hidden rounded-[var(--radius-card)] border border-primary/20 bg-[var(--nasayem-green-050)] p-4"
          aria-labelledby="category-complete-heading"
        >
          <IslamicPattern
            className="-top-5 end-2"
            opacity={0.035}
            size="small"
            tone="green"
            variant="corner"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <h2
                className="text-[16px] font-bold text-primary"
                id="category-complete-heading"
              >
                تم إكمال {category.title}
              </h2>
              <p className="text-[13px] leading-[1.8] text-muted-foreground">
                أتممت {formatNumber(summary.completedItems)} من{" "}
                {formatNumber(summary.totalItems)} من أذكار هذا القسم.
              </p>
            </div>
          </div>
          <Link
            className="relative inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-medium)] bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground no-underline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            href={ROUTES.azkar}
          >
            العودة إلى أقسام الأذكار
          </Link>
        </section>
      ) : null}

      <section className="space-y-4" aria-label={category.title}>
        {items.map((item, index) => {
          const count = categoryProgress?.counts[item.id] ?? 0;
          const completed = count >= item.targetCount;

          return (
            <article
              className="min-w-0 space-y-3"
              id={`azkar-item-${item.id}`}
              key={item.id}
            >
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 px-1">
                <h2 className="text-[13px] font-bold text-primary">
                  الذكر {formatNumber(index + 1)} من{" "}
                  {formatNumber(items.length)}
                </h2>
                {completed ? (
                  <span className="inline-flex min-h-8 items-center gap-1 rounded-full border border-primary/15 bg-[var(--nasayem-green-050)] px-2.5 text-[11px] font-bold text-primary">
                    <Check aria-hidden="true" className="size-3.5" />
                    مكتمل
                  </span>
                ) : null}
              </div>

              <AzkarReaderCard
                count={count}
                item={item}
                onIncrement={() => incrementItem(item)}
              />
            </article>
          );
        })}
      </section>

      <section
        className="border-t border-border pt-4"
        aria-label="إعادة القسم"
      >
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-medium)] border border-border bg-card px-3 py-2 text-[12px] font-bold text-primary focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          onClick={() => setShowResetConfirmation(true)}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          إعادة الأذكار من البداية
        </button>

        {showResetConfirmation ? (
          <div
            aria-describedby="reset-description"
            aria-labelledby="reset-heading"
            className="mt-3 space-y-3 rounded-[var(--radius-medium)] border border-gold/30 bg-[var(--nasayem-gold-050)] p-3.5"
            role="alertdialog"
          >
            <h2 className="text-[14px] font-bold text-primary" id="reset-heading">
              تأكيد إعادة القسم
            </h2>
            <p
              className="text-[12px] leading-[1.8] text-muted-foreground"
              id="reset-description"
            >
              سيُحذف التقدم المحفوظ لقسم {category.title} فقط، وستبدأ من
              الذكر الأول.
            </p>
            <div className="grid grid-cols-2 gap-2 max-[259px]:grid-cols-1">
              <button
                className="min-h-11 rounded-[var(--radius-medium)] border border-border bg-card px-3 py-2 text-[12px] font-bold text-primary"
                onClick={() => setShowResetConfirmation(false)}
                type="button"
              >
                إلغاء
              </button>
              <button
                className="min-h-11 rounded-[var(--radius-medium)] bg-primary px-3 py-2 text-[12px] font-bold text-primary-foreground"
                onClick={confirmReset}
                type="button"
              >
                نعم، ابدأ من البداية
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <p aria-atomic="true" aria-live="polite" className="sr-only">
        {statusMessage}
      </p>
    </main>
  );
}

function NamesOfAllahGrid({ items }: { items: AzkarItem[] }) {
  return (
    <section aria-label="أسماء الله الحسنى">
      <ol className="grid min-w-0 grid-cols-2 gap-2.5 min-[380px]:grid-cols-3 max-[259px]:grid-cols-1">
        {items.map((item) => (
          <li className="min-w-0" key={item.id}>
            <SurfaceCard
              className="flex min-h-20 min-w-0 items-center justify-center px-3 py-4 text-center max-[259px]:min-h-16"
              variant="default"
            >
              <p className="min-w-0 break-words text-[19px] leading-[1.8] font-bold text-primary">
                {item.text}
              </p>
            </SurfaceCard>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CategoryHeader({
  category
}: {
  category: AzkarCategoryDefinition;
}) {
  return (
    <section
      className="relative min-w-0 space-y-3 overflow-hidden rounded-[var(--radius-card)] border border-border/70 bg-card p-4 shadow-soft"
      aria-labelledby="azkar-category-heading"
    >
      <IslamicPattern
        className="-top-5 end-2"
        opacity={0.04}
        size="medium"
        tone="gold"
        variant="header"
      />
      <Link
        aria-label={`العودة إلى الأذكار من ${category.title}`}
        className="relative inline-flex min-h-11 min-w-0 items-center gap-2 rounded-[var(--radius-medium)] px-1 text-[12px] font-bold text-primary no-underline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        href={ROUTES.azkar}
      >
        <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        <span className="min-w-0 break-words">العودة إلى الأذكار</span>
      </Link>
      <div className="relative space-y-2">
        <PageHeading id="azkar-category-heading">{category.title}</PageHeading>
        <p className="text-center text-[13px] leading-[1.9] text-muted-foreground">
          {category.description}
        </p>
      </div>
    </section>
  );
}

export const AzkarCategoryContent = memo(AzkarCategoryContentComponent);
