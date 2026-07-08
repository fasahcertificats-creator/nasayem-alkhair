"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, colors, spacing, typography } from "@/design-system";
import { loadAppProgressState, type ProgressEntry } from "@/lib/app-state";
import type { UmrahStage } from "@/types";

interface HomeProgressCardProps {
  stages: UmrahStage[];
}

function HomeProgressCardComponent({ stages }: HomeProgressCardProps) {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      const appState = loadAppProgressState();
      setProgress(appState.dailyProgress);
      setCurrentStreak(appState.streak.currentStreak);
      setIsHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const completedSteps = useMemo(
    () => progress.filter((entry) => entry.completed).length,
    [progress]
  );
  const completedStepIds = useMemo(
    () => new Set(progress.filter((entry) => entry.completed).map((entry) => entry.stepId)),
    [progress]
  );
  const totalSteps = stages.length;
  const progressPercentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const currentStage =
    stages.find((stage) => !completedStepIds.has(stage.id) && !completedStepIds.has(stage.slug)) ??
    stages[0];

  return (
    <div className={spacing.stack.md}>
      <section className={spacing.stack.sm} aria-labelledby="umrah-companion-heading">
        <div className="flex items-center justify-between">
          <h2
            className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
            id="umrah-companion-heading"
          >
            مرافق العمرة
          </h2>
          <AppBadge tone="gold">{isHydrated ? `${progressPercentage}%` : "..."}</AppBadge>
        </div>

        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className={spacing.stack.xs}>
            <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
              المرحلة الحالية
            </p>
            <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
              {currentStage?.titleAr ?? "لم تبدأ الرحلة بعد"}
            </p>
          </div>

          <div className={`h-2 overflow-hidden rounded-full ${colors.emerald.surfaceSoft}`}>
            <div
              className={`h-full rounded-full ${colors.gold.surface}`}
              style={{ width: `${isHydrated ? progressPercentage : 0}%` }}
            />
          </div>

          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {isHydrated
              ? `${completedSteps} من ${totalSteps} مراحل مكتملة.`
              : "يتم تحميل تقدم الرحلة المحفوظ."}
          </p>

          <AppButton asChild tone="gold">
            <Link href={ROUTES.umrah}>متابعة الرحلة</Link>
          </AppButton>
        </AppCard>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="daily-progress-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="daily-progress-heading"
        >
          تقدم اليوم
        </h2>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className={`grid grid-cols-2 ${spacing.inline.sm}`}>
            <div className={spacing.stack.xs}>
              <AppBadge>الخطوات</AppBadge>
              <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                {isHydrated ? completedSteps : "--"}
              </p>
            </div>
            <div className={`${spacing.stack.xs} text-left`}>
              <AppBadge tone="ivory">الاستمرار</AppBadge>
              <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                {isHydrated ? currentStreak : "--"}
              </p>
            </div>
          </div>

          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {isHydrated
              ? `نسبة الرحلة الحالية ${progressPercentage}%.`
              : "يتم قراءة التقدم من الجهاز."}
          </p>

          <AppButton asChild tone="outline">
            <Link href={ROUTES.progress}>عرض التقدم</Link>
          </AppButton>
        </AppCard>
      </section>
    </div>
  );
}

export const HomeProgressCard = memo(HomeProgressCardComponent);
