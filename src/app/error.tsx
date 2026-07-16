"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, AppSection, spacing, typography } from "@/design-system";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[RouteError]", error);
    }
  }, [error]);

  return (
    <main>
      <AppSection spacing="lg">
        <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
          <AppBadge tone="ivory">تعذر العرض</AppBadge>
          <h1 className={`${typography.hierarchy.heading} ${typography.tone.primary}`}>
            تعذر تحميل هذه الصفحة
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            بقية التطبيق ما زالت متاحة.
          </p>
          <div className={`flex flex-wrap ${spacing.inline.sm}`}>
            <AppButton onClick={reset}>إعادة المحاولة</AppButton>
            <AppButton asChild tone="outline">
              <Link href={ROUTES.home}>العودة إلى الرئيسية</Link>
            </AppButton>
          </div>
        </AppCard>
      </AppSection>
    </main>
  );
}
