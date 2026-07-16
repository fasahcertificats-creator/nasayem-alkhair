import { AppBadge, AppCard, AppSection, spacing, typography } from "@/design-system";

interface PageLoadingStateProps {
  label?: string;
}

export function PageLoadingState({ label = "جاري التحميل" }: PageLoadingStateProps) {
  return (
    <AppSection spacing="lg">
      <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
        <AppBadge tone="ivory">{label}</AppBadge>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          يتم تجهيز العرض.
        </p>
      </AppCard>
    </AppSection>
  );
}
