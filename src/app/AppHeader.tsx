import { UserRound } from "lucide-react";

import { AppBadge, AppButton, spacing, typography } from "@/design-system";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className={`flex items-center justify-between ${spacing.inset.sm}`}>
        <div className={spacing.stack.xs}>
          <AppBadge tone="ivory">رفيق العمرة</AppBadge>
          <div>
            <p
              className={`${typography.hierarchy.subheading} ${typography.tone.primary} ${typography.weight.bold}`}
            >
              نسائم الخير
            </p>
            <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
              سكينة وذكر وخطوات مطمئنة
            </p>
          </div>
        </div>

        <AppButton aria-label="الملف الشخصي" size="icon" tone="outline">
          <UserRound aria-hidden="true" />
        </AppButton>
      </div>
    </header>
  );
}
