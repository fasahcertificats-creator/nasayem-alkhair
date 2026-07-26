import type { ComponentType, CSSProperties, SVGProps } from "react";

import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/utils";

import { IconBadge } from "./IconBadge";
import { IslamicPattern } from "./IslamicPattern";

export interface AzkarCategoryCardProps {
  accent: "green" | "sage" | "gold";
  className?: string;
  completedItemCount?: number;
  description: string;
  href: Route;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isComplete?: boolean;
  itemCount: number;
  pattern: "corner" | "header";
  progressReady?: boolean;
  title: string;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

const accentColors = {
  green: "#23634b",
  sage: "#718b7b",
  gold: "#a9853e"
} as const;

function formatNumber(value: number) {
  return arabicNumberFormatter.format(value);
}

export function AzkarCategoryCard({
  accent,
  className,
  completedItemCount = 0,
  description,
  href,
  icon: Icon,
  isComplete = false,
  itemCount,
  pattern,
  progressReady = false,
  title
}: AzkarCategoryCardProps) {
  const hasProgress = completedItemCount > 0;
  const progressPercent =
    itemCount > 0 ? Math.round((completedItemCount / itemCount) * 100) : 0;
  const progressText = isComplete
    ? "مكتمل"
    : `${formatNumber(completedItemCount)} من ${formatNumber(itemCount)}`;
  const accessibleStatus = progressReady
    ? isComplete
      ? "مكتمل"
      : hasProgress
        ? `أُنجز ${progressText}`
        : "لم تبدأ بعد"
    : "";

  return (
    <Link
      aria-label={`${title}، ${formatNumber(itemCount)} من الأذكار${accessibleStatus ? `، ${accessibleStatus}` : ""}`}
      className={cn(
        "group relative box-border flex min-h-[208px] min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card p-4 text-right no-underline shadow-card transition duration-200 [text-decoration:none] hover:-translate-y-0.5 hover:border-[color:var(--category-accent)] hover:no-underline hover:shadow-card-elevated active:no-underline visited:no-underline focus-visible:no-underline focus-visible:ring-2 focus-visible:ring-[color:var(--category-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none max-[219px]:min-h-0 max-[219px]:p-3",
        isComplete ? "border-primary/25 bg-[var(--nasayem-green-050)]" : null,
        className
      )}
      href={href}
      style={
        {
          "--category-accent": accentColors[accent],
          "--category-accent-soft": `${accentColors[accent]}16`
        } as CSSProperties
      }
    >
      <IslamicPattern
        className={pattern === "header" ? "-top-5 end-1" : "end-2 top-2"}
        opacity={0.035}
        size="small"
        tone={accent === "gold" ? "gold" : "green"}
        variant={pattern}
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-4 end-0 w-1 rounded-s-full bg-[color:var(--category-accent)] opacity-75"
      />

      <div className="relative flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <IconBadge
            className="size-10 bg-[color:var(--category-accent-soft)] text-[color:var(--category-accent)]"
            tone="neutral"
          >
            <Icon aria-hidden="true" />
          </IconBadge>
          {isComplete ? (
            <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-primary/15 bg-white/80 px-2 text-[11px] font-bold text-primary">
              <Check aria-hidden="true" className="size-3.5" />
              مكتمل
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <h2 className="text-primary text-[16px] leading-[1.65] font-bold text-balance">
            {title}
          </h2>
          <p className="text-muted-foreground text-[12px] leading-[1.75]">
            {description}
          </p>
        </div>

        <div className="space-y-2 border-t border-border/70 pt-2.5">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-[11px] leading-relaxed">
            <span className="font-bold text-primary">
              {formatNumber(itemCount)} ذكر
            </span>
            {progressReady ? (
              <span className="font-semibold text-[color:var(--category-accent)]">
                {hasProgress || isComplete ? progressText : "لم تبدأ بعد"}
              </span>
            ) : null}
          </div>

          {progressReady && (hasProgress || isComplete) ? (
            <div
              aria-label={`تقدم ${title}`}
              aria-valuemax={itemCount}
              aria-valuemin={0}
              aria-valuenow={completedItemCount}
              className="h-1.5 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
            >
              <span
                aria-hidden="true"
                className="block h-full rounded-full bg-[color:var(--category-accent)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          ) : null}

          <span className="inline-flex min-h-11 items-center gap-1 text-[12px] font-bold text-[color:var(--category-accent)]">
            <span>{hasProgress && !isComplete ? "متابعة" : "فتح القسم"}</span>
            <ChevronLeft aria-hidden="true" className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
