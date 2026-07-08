"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import { loadProgress, saveProgress, type ProgressEntry } from "@/lib/app-state";
import type { Dua, UmrahStage } from "@/types";

import { DuaBlock } from "../DuaBlock";

interface StageDetailContentProps {
  approvedDuas: Dua[];
  stage: UmrahStage;
}

function StageDetailContentComponent({ approvedDuas, stage }: StageDetailContentProps) {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      setProgress(loadProgress());
      setIsHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const isCompleted = useMemo(
    () =>
      progress.some(
        (entry) => entry.completed && (entry.stepId === stage.id || entry.stepId === stage.slug)
      ),
    [progress, stage.id, stage.slug]
  );

  const toggleCompletion = useCallback(() => {
    setProgress((currentProgress) => {
      const existingEntry = currentProgress.find(
        (entry) => entry.stepId === stage.id || entry.stepId === stage.slug
      );
      const nextProgress = existingEntry
        ? currentProgress.map((entry) =>
            entry.stepId === existingEntry.stepId
              ? { ...entry, completed: !entry.completed, timestamp: Date.now() }
              : entry
          )
        : [...currentProgress, { stepId: stage.id, completed: true, timestamp: Date.now() }];

      saveProgress(nextProgress);

      return nextProgress;
    });
  }, [stage.id, stage.slug]);

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.sm} aria-labelledby="stage-heading">
        <AppButton asChild tone="ghost">
          <Link href={ROUTES.umrah}>العودة إلى دليل العمرة</Link>
        </AppButton>
        <div className={spacing.stack.xs}>
          <AppBadge tone={isCompleted ? "gold" : "ivory"}>
            {isCompleted ? "مرحلة مكتملة" : "مرحلة مفتوحة"}
          </AppBadge>
          <h1
            className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
            id="stage-heading"
          >
            {stage.titleAr}
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {stage.summary}
          </p>
        </div>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="instructions-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="instructions-heading"
        >
          الإرشادات
        </h2>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
          {stage.instructions.length > 0 ? (
            <ul className={spacing.stack.xs}>
              {stage.instructions.map((instruction) => (
                <li className={`${typography.hierarchy.body} ${typography.tone.muted}`} key={instruction}>
                  {instruction}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              سيتم إضافة الإرشادات بعد مراجعة المحتوى.
            </p>
          )}
        </AppCard>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="duas-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="duas-heading"
        >
          الأدعية المرتبطة
        </h2>
        {approvedDuas.length > 0 ? (
          <div className={spacing.stack.sm}>
            {approvedDuas.map((dua) => (
              <DuaBlock dua={dua} key={dua.id} />
            ))}
          </div>
        ) : (
          <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
            <AppBadge tone="ivory">قيد التوثيق</AppBadge>
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              لا توجد أدعية معتمدة للعرض حالياً.
            </p>
          </AppCard>
        )}
      </section>

      <section className={spacing.stack.sm} aria-labelledby="sources-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="sources-heading"
        >
          المصادر
        </h2>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
          {stage.sources.length > 0 ? (
            <ul className={spacing.stack.xs}>
              {stage.sources.map((source) => (
                <li className={`${typography.hierarchy.body} ${typography.tone.muted}`} key={source}>
                  {source}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              سيتم عرض المصادر بعد اعتماد المحتوى.
            </p>
          )}
        </AppCard>
      </section>

      <AppButton disabled={!isHydrated} onClick={toggleCompletion} tone={isCompleted ? "outline" : "gold"}>
        <CheckCircle2 aria-hidden="true" />
        {isCompleted ? "إلغاء اكتمال المرحلة" : "تحديد المرحلة كمكتملة"}
      </AppButton>
    </main>
  );
}

export const StageDetailContent = memo(StageDetailContentComponent);
