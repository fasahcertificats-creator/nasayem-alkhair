"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
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
  const totalSteps = stages.length;
  const progressPercentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
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
  );
}

export const HomeProgressCard = memo(HomeProgressCardComponent);
