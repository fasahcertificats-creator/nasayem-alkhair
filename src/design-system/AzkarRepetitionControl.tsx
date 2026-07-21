"use client";

import { Check, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AzkarRepetitionControlProps {
  className?: string;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  target: number;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar");

function formatCount(value: number) {
  return arabicNumberFormatter.format(value);
}

function getProgressPercent(count: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((count / target) * 100));
}

function BeadProgress({ count, target }: Pick<AzkarRepetitionControlProps, "count" | "target">) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: target }, (_, index) => {
        const beadNumber = index + 1;
        const isComplete = beadNumber <= count;
        const isCurrent = beadNumber === count + 1;

        return (
          <span
            className={cn(
              "h-2.5 min-w-5 flex-1 rounded-full border transition-colors duration-200",
              isComplete
                ? "border-primary bg-primary"
                : isCurrent
                  ? "border-gold bg-gold"
                  : "border-border bg-secondary"
            )}
            key={beadNumber}
          />
        );
      })}
    </div>
  );
}

function TrackProgress({ count, target }: Pick<AzkarRepetitionControlProps, "count" | "target">) {
  const percent = getProgressPercent(count, target);

  return (
    <div
      aria-hidden="true"
      className="relative h-2.5 min-w-0 overflow-hidden rounded-full border border-border bg-secondary"
    >
      <span
        className="absolute inset-y-0 end-0 rounded-full bg-primary transition-[width] duration-200"
        style={{ width: `${percent}%` }}
      />
      {percent > 0 && percent < 100 ? (
        <span
          className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-card bg-gold"
          style={{ insetInlineEnd: `calc(${percent}% - 0.375rem)` }}
        />
      ) : null}
    </div>
  );
}

export function AzkarRepetitionControl({
  className,
  count,
  onIncrement,
  onReset,
  target
}: AzkarRepetitionControlProps) {
  const completed = count >= target;
  const countText = `${formatCount(count)} من ${formatCount(target)}`;

  return (
    <section
      aria-label="التكرار"
      className={cn(
        "space-y-3 rounded-[var(--radius-large)] border border-border bg-secondary/70 p-3",
        completed ? "border-primary/20 bg-[var(--nasayem-green-050)]" : null,
        className
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="text-primary text-sm font-bold">التكرار</p>
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {completed ? "تمّ التكرار" : countText}
          </p>
        </div>
        {completed ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-primary">
            <Check aria-hidden="true" className="size-3.5" />
            تمّ
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-primary">
            {countText}
          </span>
        )}
      </div>

      {target <= 7 ? <BeadProgress count={count} target={target} /> : <TrackProgress count={count} target={target} />}

      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label={`تسجيل التكرار ${countText}`}
          className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-medium)] bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[var(--nasayem-sage-600)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          disabled={completed}
          onClick={onIncrement}
          type="button"
        >
          {completed ? "تمّ التكرار" : "تسجيل التكرار"}
        </button>
        <button
          aria-label="إعادة ضبط التكرار"
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-medium)] border border-border bg-card text-primary transition duration-200 hover:border-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          onClick={onReset}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      </div>
    </section>
  );
}
