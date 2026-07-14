import { AppBadge, AppCard, spacing, typography } from "@/design-system";
import type { Miqat } from "@/types";

interface MiqatCardProps {
  miqat: Miqat;
}

export function MiqatCard({ miqat }: MiqatCardProps) {
  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <div className="flex items-center justify-between">
        <AppBadge tone="gold">الإحرام</AppBadge>
        <AppBadge tone="ivory">{miqat.region}</AppBadge>
      </div>

      <div className={spacing.stack.xs}>
        <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
          {miqat.nameAr}
        </h2>
        <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
          {miqat.nameEn}
        </p>
      </div>

      <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
        {miqat.descriptionAr}
      </p>

      <div className={spacing.stack.xs}>
        <h3 className={`${typography.hierarchy.caption} ${typography.tone.primary}`}>
          الحكم المختصر
        </h3>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          {miqat.rulesAr}
        </p>
      </div>

      <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
        {miqat.sourceReference}
      </p>
    </AppCard>
  );
}
