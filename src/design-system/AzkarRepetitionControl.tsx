"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AzkarRepetitionControlProps {
  actionLabel?: string;
  className?: string;
  count: number;
  onIncrement: () => void;
  target: number;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function formatCount(value: number) {
  return arabicNumberFormatter.format(value);
}

function getProgressPercent(count: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((count / target) * 100)));
}

function BeadProgress({
  count,
  target
}: Pick<AzkarRepetitionControlProps, "count" | "target">) {
  return (
    <div
      aria-label="تقدم التكرار"
      aria-valuemax={target}
      aria-valuemin={0}
      aria-valuenow={count}
      className="flex min-w-0 flex-wrap gap-1.5"
      role="progressbar"
    >
      {Array.from({ length: target }, (_, index) => {
        const beadNumber = index + 1;
        const isComplete = beadNumber <= count;

        return (
          <span
            aria-hidden="true"
            className={cn(
              "h-2 min-w-4 flex-1 rounded-full border transition-colors duration-200 motion-reduce:transition-none",
              isComplete
                ? "border-primary bg-primary"
                : "border-border bg-secondary"
            )}
            key={beadNumber}
          />
        );
      })}
    </div>
  );
}

function TrackProgress({
  count,
  target
}: Pick<AzkarRepetitionControlProps, "count" | "target">) {
  const percent = getProgressPercent(count, target);

  return (
    <div
      aria-label="تقدم التكرار"
      aria-valuemax={target}
      aria-valuemin={0}
      aria-valuenow={count}
      className="relative h-2.5 min-w-0 overflow-hidden rounded-full border border-border bg-secondary"
      role="progressbar"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 end-0 rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function AzkarRepetitionControl({
  actionLabel = "تسجيل التكرار",
  className,
  count,
  onIncrement,
  target
}: AzkarRepetitionControlProps) {
  const safeTarget = Number.isSafeInteger(target) && target > 0 ? target : 1;
  const safeCount =
    Number.isSafeInteger(count) && count >= 0
      ? Math.min(count, safeTarget)
      : 0;
  const completed = safeCount >= safeTarget;
  const countText = `${formatCount(safeCount)} من ${formatCount(safeTarget)}`;

  return (
    <section
      aria-label="التكرار"
      className={cn(
        "space-y-3 rounded-[var(--radius-medium)] border border-border bg-secondary/70 p-3",
        completed
          ? "border-primary/20 bg-[var(--nasayem-green-050)]"
          : null,
        className
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-primary">التكرار</p>
        <p className="text-sm font-bold text-primary">{countText}</p>
      </div>

      {completed ? (
        <div className="inline-flex min-h-8 w-fit items-center gap-1.5 rounded-full border border-primary/10 bg-white/80 px-2.5 py-1 text-xs font-bold text-primary">
          <Check aria-hidden="true" className="size-3.5" />
          تمّ إتمام الذكر
        </div>
      ) : null}

      {safeTarget <= 7 ? (
        <BeadProgress count={safeCount} target={safeTarget} />
      ) : (
        <TrackProgress count={safeCount} target={safeTarget} />
      )}

      <button
        aria-label={
          completed
            ? `اكتمل الذكر، العدد ${countText}`
            : `${actionLabel}، العدد الحالي ${countText}`
        }
        className="min-h-14 w-full rounded-[var(--radius-medium)] bg-primary px-4 py-3 text-[15px] font-bold text-primary-foreground transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[var(--nasayem-sage-600)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none motion-reduce:active:scale-100"
        disabled={completed}
        onClick={onIncrement}
        type="button"
      >
        {completed ? "تمّ إتمام الذكر" : actionLabel}
      </button>
    </section>
  );
}
