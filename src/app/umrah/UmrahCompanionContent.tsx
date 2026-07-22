"use client";

import { memo } from "react";

import { IslamicPattern, PageHeading, spacing, typography } from "@/design-system";
import type { UmrahStage } from "@/types";

import { UmrahStageCard } from "./UmrahStageCard";

interface UmrahCompanionContentProps {
  stages: UmrahStage[];
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function UmrahCompanionContentComponent({ stages }: UmrahCompanionContentProps) {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section
        className={`${spacing.stack.xs} relative min-w-0 overflow-hidden rounded-[var(--radius-card)] px-2 py-1`}
        aria-labelledby="umrah-page-heading"
      >
        <IslamicPattern className="-top-6 end-1" opacity={0.04} size="medium" tone="gold" variant="header" />
        <PageHeading id="umrah-page-heading">دليل العمرة</PageHeading>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          رحلة هادئة لخطوات العمرة وما ثبت فيها من ذكر ودعاء وإرشاد عملي.
        </p>
      </section>

      <section aria-label="مراحل العمرة">
        <div className={`${spacing.stack.sm} relative min-w-0 pb-24`}>
          {stages.map((stage, index) => (
            <UmrahStageCard
              isLast={index === stages.length - 1}
              key={stage.id}
              stage={stage}
              stageNumber={arabicNumberFormatter.format(index + 1)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export const UmrahCompanionContent = memo(UmrahCompanionContentComponent);
