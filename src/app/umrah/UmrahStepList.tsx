"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { AppBadge, AppButton, AppCard, colors, spacing, typography } from "@/design-system";
import { loadProgress, saveProgress, type ProgressEntry } from "@/lib/app-state";
import type { UmrahContent } from "@/types/umrah";

interface TimelineStep {
  id: string;
  title: string;
  stage: string;
}

interface UmrahStepListProps {
  content: UmrahContent[];
  steps: readonly TimelineStep[];
}

function UmrahStepListComponent({ content, steps }: UmrahStepListProps) {
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

  const completedStepIds = useMemo(
    () => new Set(progress.filter((entry) => entry.completed).map((entry) => entry.stepId)),
    [progress]
  );

  const toggleStep = useCallback((stepId: string): void => {
    setProgress((currentProgress) => {
      const existingEntry = currentProgress.find((entry) => entry.stepId === stepId);
      const nextProgress = existingEntry
        ? currentProgress.map((entry) =>
            entry.stepId === stepId
              ? { ...entry, completed: !entry.completed, timestamp: Date.now() }
              : entry
          )
        : [...currentProgress, { stepId, completed: true, timestamp: Date.now() }];

      saveProgress(nextProgress);

      return nextProgress;
    });
  }, []);

  if (!isHydrated) {
    return (
      <div className={spacing.stack.lg}>
        {steps.map((step) => (
          <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`} key={step.id}>
            <AppBadge tone="ivory">Loading</AppBadge>
            <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
              {step.title}
            </p>
          </AppCard>
        ))}
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <AppCard className={`${spacing.inset.lg} ${spacing.stack.sm}`}>
        <AppBadge tone="ivory">Empty</AppBadge>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          No Umrah steps are available yet.
        </p>
      </AppCard>
    );
  }

  return (
    <div className={spacing.stack.lg}>
      {steps.map((step, index) => {
        const contentItem = content.find(
          (item) => item.title.toLowerCase() === step.title.toLowerCase()
        );
        const isCompleted = completedStepIds.has(step.id);

        return (
          <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`} key={step.id}>
            <div className={`flex flex-wrap items-center justify-between ${spacing.inline.md}`}>
              <div className={`flex items-center ${spacing.inline.sm}`}>
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-full ${isCompleted ? colors.gold.surface : colors.emerald.surface} ${isCompleted ? colors.gold.foreground : colors.emerald.foreground} ${typography.weight.bold}`}
                >
                  {index + 1}
                </span>
                <div className={spacing.stack.xs}>
                  <AppBadge tone={contentItem ? "gold" : "ivory"}>{step.stage}</AppBadge>
                  <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                    {step.title}
                  </h2>
                </div>
              </div>
              <AppBadge tone={isCompleted ? "gold" : "emerald"}>
                {isCompleted ? "Completed" : "Pending"}
              </AppBadge>
            </div>
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              {contentItem?.text ??
                "This step is part of the Umrah timeline and will use Firestore content when available."}
            </p>
            <AppButton tone={isCompleted ? "outline" : "gold"} onClick={() => toggleStep(step.id)}>
              {isCompleted ? "Mark as Pending" : "Mark as Completed"}
            </AppButton>
          </AppCard>
        );
      })}
    </div>
  );
}

export const UmrahStepList = memo(UmrahStepListComponent);
