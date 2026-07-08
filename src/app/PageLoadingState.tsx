import { AppBadge, AppCard, AppSection, spacing, typography } from "@/design-system";

interface PageLoadingStateProps {
  label?: string;
}

export function PageLoadingState({ label = "Loading" }: PageLoadingStateProps) {
  return (
    <AppSection spacing="lg">
      <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
        <AppBadge tone="ivory">{label}</AppBadge>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          Preparing a stable view.
        </p>
      </AppCard>
    </AppSection>
  );
}
