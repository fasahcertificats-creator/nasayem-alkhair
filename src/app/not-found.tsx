import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, AppSection, spacing, typography } from "@/design-system";

export default function NotFoundPage() {
  return (
    <main>
      <AppSection spacing="lg">
        <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
          <AppBadge tone="ivory">404</AppBadge>
          <h1 className={`${typography.hierarchy.heading} ${typography.tone.primary}`}>
            الصفحة غير موجودة
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            هذا المسار غير متاح. يمكنك العودة إلى الرئيسية.
          </p>
          <AppButton asChild>
            <Link href={ROUTES.home}>العودة إلى الرئيسية</Link>
          </AppButton>
        </AppCard>
      </AppSection>
    </main>
  );
}
