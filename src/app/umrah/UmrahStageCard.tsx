import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";
import { IconBadge, IslamicPattern } from "@/design-system";
import type { UmrahStage } from "@/types";

interface UmrahStageCardProps {
  isLast: boolean;
  stage: UmrahStage;
  stageNumber: string;
}

export function UmrahStageCard({ isLast, stage, stageNumber }: UmrahStageCardProps) {
  return (
    <div className="relative min-w-0">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="bg-border absolute top-16 bottom-[-1rem] right-[1.35rem] w-px"
        />
      ) : null}
      <Link
        aria-label={`عرض ${stage.titleAr}`}
        className="group border-border shadow-card hover:border-gold/60 hover:shadow-card-elevated focus-visible:ring-gold focus-visible:ring-offset-background relative block min-w-0 overflow-hidden rounded-[var(--radius-card)] border bg-card px-4 py-4 no-underline transition duration-200 hover:-translate-y-0.5 hover:no-underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        href={ROUTES.umrahStage(stage.slug)}
      >
        <IslamicPattern
          className="-top-8 end-3"
          opacity={0.035}
          size="small"
          tone="gold"
          variant="corner"
        />
        <div className="relative flex min-w-0 items-start gap-3">
          <IconBadge className="size-10 shrink-0 text-primary" tone="green">
            <span className="text-sm font-bold">{stageNumber}</span>
          </IconBadge>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="text-primary text-[16px] leading-relaxed font-bold no-underline">
              {stage.titleAr}
            </h2>
            <p className="text-muted-foreground line-clamp-2 text-[13px] leading-relaxed">
              {stage.summary}
            </p>
            <span className="text-gold group-hover:text-primary inline-flex items-center gap-1 text-xs font-bold transition">
              <span>المزيد</span>
              <ChevronDown aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
