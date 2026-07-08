"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";

import { AppBadge, AppButton, AppCard, colors, spacing, typography } from "@/design-system";
import { loadAppProgressState, type ProgressEntry } from "@/lib/app-state";

const totalSteps = 4;

function HomeProgressCardComponent() {
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
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
      <div className={`flex flex-wrap items-center justify-between ${spacing.inline.md}`}>
        <div className={spacing.stack.xs}>
          <AppBadge>التقدم</AppBadge>
          <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
            {isHydrated ? `اكتمل ${progressPercentage}%` : "جاري قراءة التقدم"}
          </h2>
        </div>
        <AppButton asChild tone="gold">
          <Link href="/progress">عرض التقدم</Link>
        </AppButton>
      </div>
      <div className={`h-2 overflow-hidden rounded-full ${colors.emerald.surfaceSoft}`}>
        <div
          className={`h-full rounded-full ${colors.gold.surface}`}
          style={{ width: `${isHydrated ? progressPercentage : 0}%` }}
        />
      </div>
      <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
        {isHydrated
          ? `${completedSteps} من ${totalSteps} خطوات مكتملة. الاستمرار الحالي: ${currentStreak} أيام.`
          : "يتم تحميل التقدم المحفوظ على الجهاز."}
      </p>
    </AppCard>
  );
}

export const HomeProgressCard = memo(HomeProgressCardComponent);
