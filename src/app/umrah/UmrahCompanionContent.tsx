"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { spacing, typography } from "@/design-system";
import type { UmrahStage } from "@/types";

interface UmrahCompanionContentProps {
  stages: UmrahStage[];
}

function UmrahCompanionContentComponent({ stages }: UmrahCompanionContentProps) {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="umrah-page-heading">
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="umrah-page-heading"
        >
          دليل العمرة
        </h1>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          قراءة هادئة لمراحل العمرة وما ثبت فيها من ذكر ودعاء.
        </p>
      </section>

      <section aria-label="مراحل العمرة">
        <div className={spacing.stack.sm}>
          {stages.map((stage, index) => (
            <Link
              aria-label={`فتح مرحلة ${stage.titleAr}`}
              className="group block rounded-lg border border-border bg-white px-4 py-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={ROUTES.umrahStage(stage.slug)}
              key={stage.id}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-base font-bold leading-relaxed text-primary">
                    {stage.titleAr}
                  </h2>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {stage.summary}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-gold transition group-hover:text-primary">
                    <span>المزيد</span>
                    <ChevronLeft aria-hidden="true" className="size-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export const UmrahCompanionContent = memo(UmrahCompanionContentComponent);
