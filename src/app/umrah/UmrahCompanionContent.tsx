"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, colors, spacing, typography } from "@/design-system";
import { loadProgress, type ProgressEntry } from "@/lib/app-state";
import type { UmrahStage } from "@/types";

interface UmrahCompanionContentProps {
  stages: UmrahStage[];
}

function getStageStatus(stage: UmrahStage, currentStageId: string | undefined, completedIds: Set<string>) {
  if (completedIds.has(stage.id) || completedIds.has(stage.slug)) {
    return {
      label: "مكتملة",
      tone: "gold" as const
    };
  }

  if (stage.id === currentStageId) {
    return {
      label: "الحالية",
      tone: "emerald" as const
    };
  }

  return {
    label: "قادمة",
    tone: "ivory" as const
  };
}

function UmrahCompanionContentComponent({ stages }: UmrahCompanionContentProps) {
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

  const completedIds = useMemo(
    () => new Set(progress.filter((entry) => entry.completed).map((entry) => entry.stepId)),
    [progress]
  );
  const completedStages = stages.filter(
    (stage) => completedIds.has(stage.id) || completedIds.has(stage.slug)
  );
  const currentStage =
    stages.find((stage) => !completedIds.has(stage.id) && !completedIds.has(stage.slug)) ??
    stages[0];
  const progressPercentage =
    stages.length > 0 ? Math.round((completedStages.length / stages.length) * 100) : 0;

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="umrah-page-heading">
        <AppBadge tone="gold">رحلة العمرة</AppBadge>
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="umrah-page-heading"
        >
          دليل العمرة
        </h1>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          رحلتك خطوة بخطوة مع الأدعية الموثقة
        </p>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="journey-progress-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="journey-progress-heading"
        >
          تقدم الرحلة
        </h2>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className={`grid grid-cols-2 ${spacing.inline.sm}`}>
            <div className={spacing.stack.xs}>
              <AppBadge>المرحلة الحالية</AppBadge>
              <p className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
                {currentStage?.titleAr ?? "لم تبدأ الرحلة بعد"}
              </p>
            </div>
            <div className={`${spacing.stack.xs} text-left`}>
              <AppBadge tone="ivory">المكتملة</AppBadge>
              <p className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
                {isHydrated ? `${completedStages.length} من ${stages.length}` : "--"}
              </p>
            </div>
          </div>

          <div className={`h-2 overflow-hidden rounded-full ${colors.emerald.surfaceSoft}`}>
            <div
              className={`h-full rounded-full ${colors.gold.surface}`}
              style={{ width: `${isHydrated ? progressPercentage : 0}%` }}
            />
          </div>

          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {isHydrated ? `اكتمل ${progressPercentage}% من الرحلة.` : "يتم قراءة التقدم المحفوظ."}
          </p>
        </AppCard>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="journey-timeline-heading">
        <div className="flex items-center justify-between">
          <h2
            className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
            id="journey-timeline-heading"
          >
            مسار العمرة
          </h2>
          <AppBadge tone="ivory">تصفح حر</AppBadge>
        </div>

        <div className={spacing.stack.sm}>
          {stages.map((stage, index) => {
            const status = getStageStatus(stage, currentStage?.id, completedIds);

            return (
              <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`} key={stage.id}>
                <div className={`flex items-start ${spacing.inline.sm}`}>
                  <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full ${colors.emerald.surfaceSoft} ${typography.tone.primary} ${typography.weight.bold}`}
                  >
                    {index + 1}
                  </span>
                  <div className={`${spacing.stack.xs} min-w-0 flex-1`}>
                    <div className={`flex items-center justify-between ${spacing.inline.sm}`}>
                      <h3 className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
                        {stage.titleAr}
                      </h3>
                      <AppBadge tone={status.tone}>{status.label}</AppBadge>
                    </div>
                    <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
                      {stage.summary}
                    </p>
                  </div>
                </div>

                <AppButton asChild tone="ghost">
                  <Link href={ROUTES.umrahStage(stage.slug)}>
                    <Compass aria-hidden="true" />
                    فتح المرحلة
                  </Link>
                </AppButton>
              </AppCard>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export const UmrahCompanionContent = memo(UmrahCompanionContentComponent);
