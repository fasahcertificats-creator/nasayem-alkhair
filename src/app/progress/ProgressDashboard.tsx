"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, colors, spacing, typography } from "@/design-system";
import { loadAppProgressState, type ProgressEntry } from "@/lib/app-state";

const journeySteps = [
  {
    id: "ihram",
    title: "Ihram"
  },
  {
    id: "tawaf",
    title: "Tawaf"
  },
  {
    id: "sai",
    title: "Sa'i"
  },
  {
    id: "hair",
    title: "Shaving/Cutting hair"
  }
] as const;

function ProgressDashboardComponent() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
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
      setBestStreak(appState.streak.bestStreak);
      setIsHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const completedStepIds = useMemo(
    () => new Set(progress.filter((entry) => entry.completed).map((entry) => entry.stepId)),
    [progress]
  );
  const completedSteps = journeySteps.filter((step) => completedStepIds.has(step.id));
  const upcomingSteps = journeySteps.filter((step) => !completedStepIds.has(step.id));
  const progressPercentage = Math.round((completedSteps.length / journeySteps.length) * 100);

  if (!isHydrated) {
    return (
      <div className={`grid ${spacing.inline.lg} lg:grid-cols-[0.8fr_1.2fr]`}>
        <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
          <AppBadge tone="ivory">Loading</AppBadge>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            Loading local progress.
          </p>
        </AppCard>
      </div>
    );
  }

  return (
    <div className={`grid ${spacing.inline.lg} lg:grid-cols-[0.8fr_1.2fr]`}>
      <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
        <AppBadge tone="gold">Daily Progress</AppBadge>
        <p className={`${typography.hierarchy.display} ${typography.tone.primary}`}>
          {progressPercentage}%
        </p>
        <div className={`h-3 overflow-hidden rounded-full ${colors.emerald.surfaceSoft}`}>
          <div
            className={`h-full rounded-full ${colors.gold.surface}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          {completedSteps.length === 0
            ? "No steps completed yet today."
            : `${completedSteps.length} of ${journeySteps.length} steps completed today.`}
        </p>
        <div className={`grid ${spacing.inline.sm} sm:grid-cols-2`}>
          <AppCard className={`${spacing.inset.sm} ${spacing.stack.xs}`}>
            <AppBadge>Current Streak</AppBadge>
            <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
              {currentStreak} days
            </p>
          </AppCard>
          <AppCard className={`${spacing.inset.sm} ${spacing.stack.xs}`}>
            <AppBadge tone="gold">Best Streak</AppBadge>
            <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
              {bestStreak} days
            </p>
          </AppCard>
        </div>
      </AppCard>

      <AppCard className={`${spacing.inset.lg} ${spacing.stack.lg}`}>
        <div className={spacing.stack.sm}>
          <AppBadge>Completed Steps</AppBadge>
          {completedSteps.length === 0 ? (
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              Complete a step from the Umrah guide to begin tracking progress.
            </p>
          ) : (
            completedSteps.map((step) => (
              <div
                className={`flex items-center justify-between rounded-full ${colors.emerald.surfaceSoft} ${spacing.inset.sm}`}
                key={step.id}
              >
                <span className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
                  {step.title}
                </span>
                <AppBadge tone="gold">Done</AppBadge>
              </div>
            ))
          )}
        </div>

        <div className={spacing.stack.sm}>
          <AppBadge tone="ivory">Remaining Steps</AppBadge>
          {upcomingSteps.map((step) => (
            <div
              className={`flex items-center justify-between rounded-full ${colors.ivory.surface} ${spacing.inset.sm}`}
              key={step.id}
            >
              <span className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                {step.title}
              </span>
              <AppBadge tone="ivory">Pending</AppBadge>
            </div>
          ))}
        </div>

        <AppButton asChild tone="outline">
          <Link href={ROUTES.umrah}>Continue Guide</Link>
        </AppButton>
      </AppCard>
    </div>
  );
}

export const ProgressDashboard = memo(ProgressDashboardComponent);
