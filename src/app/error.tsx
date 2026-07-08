"use client";

import Link from "next/link";
import { useEffect } from "react";

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
          <AppBadge tone="ivory">Safe fallback</AppBadge>
          <h1 className={`${typography.hierarchy.heading} ${typography.tone.primary}`}>
            This view could not load
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            The rest of the app is still available.
          </p>
          <div className={`flex flex-wrap ${spacing.inline.sm}`}>
            <AppButton onClick={reset}>Retry</AppButton>
            <AppButton asChild tone="outline">
              <Link href="/">Go Home</Link>
            </AppButton>
          </div>
        </AppCard>
      </AppSection>
    </main>
  );
}
