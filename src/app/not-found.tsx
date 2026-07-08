import Link from "next/link";

import { AppBadge, AppButton, AppCard, AppSection, spacing, typography } from "@/design-system";

export default function NotFoundPage() {
  return (
    <main>
      <AppSection spacing="lg">
        <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
          <AppBadge tone="ivory">404</AppBadge>
          <h1 className={`${typography.hierarchy.heading} ${typography.tone.primary}`}>
            Page not found
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            This path is not available. Return home to continue your journey.
          </p>
          <AppButton asChild>
            <Link href="/">Go Home</Link>
          </AppButton>
        </AppCard>
      </AppSection>
    </main>
  );
}
