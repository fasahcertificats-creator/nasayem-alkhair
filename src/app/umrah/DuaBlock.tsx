import { AppBadge, AppCard, spacing, typography } from "@/design-system";
import type { Dua } from "@/types";

interface DuaBlockProps {
  dua: Dua;
}

export function DuaBlock({ dua }: DuaBlockProps) {
  if (dua.verificationStatus !== "approved") {
    return null;
  }

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <div className="flex items-center justify-between">
        <AppBadge tone="gold">{dua.titleAr}</AppBadge>
        <AppBadge tone="ivory">{dua.authenticity}</AppBadge>
      </div>
      <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {dua.arabicText}
      </p>
      <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>{dua.translation}</p>
      <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
        {dua.sourceReference ?? dua.source}
      </p>
    </AppCard>
  );
}
