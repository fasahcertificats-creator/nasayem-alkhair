"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { PageHeading, spacing, typography } from "@/design-system";
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
        <PageHeading id="umrah-page-heading">دليل العمرة</PageHeading>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          قراءة هادئة لمراحل العمرة وما ثبت فيها من ذكر ودعاء.
        </p>
      </section>

      <section aria-label="مراحل العمرة">
        <div className={spacing.stack.sm}>
          {stages.map((stage, index) => (
            <Link
              aria-label={`عرض ${stage.titleAr}`}
              className="group border-border shadow-soft hover:border-gold/60 hover:shadow-card focus-visible:ring-gold focus-visible:ring-offset-background block rounded-lg border bg-white px-4 py-4 transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              href={ROUTES.umrahStage(stage.slug)}
              key={stage.id}
            >
              <div className="flex items-start gap-3">
                <span className="bg-secondary text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-primary text-base leading-relaxed font-bold">
                    {stage.titleAr}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {stage.summary}
                  </p>
                  <span className="text-gold group-hover:text-primary inline-flex items-center gap-1 text-xs font-bold transition">
                    <span>المزيد</span>
                    <ChevronDown aria-hidden="true" className="size-3.5" />
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
