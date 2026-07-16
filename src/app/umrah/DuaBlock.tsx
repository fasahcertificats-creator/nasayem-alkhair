import { AppBadge, AppCard, spacing, typography } from "@/design-system";
import type { Dua } from "@/types";

interface DuaBlockProps {
  dua: Dua;
}

const authenticityLabel = {
  Quran: "قرآن",
  sahih: "صحيح",
  hasan: "حسن",
  weak: "ضعيف",
  general: "عام",
  "needs-review": "بحاجة إلى مراجعة"
} as const;

function localizeSourceReference(source: string) {
  return source.replaceAll("Sahih Muslim", "صحيح مسلم").replaceAll("Sahih al-Bukhari", "صحيح البخاري");
}

export function DuaBlock({ dua }: DuaBlockProps) {
  if (dua.verificationStatus !== "approved") {
    return null;
  }

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <div className="flex items-center justify-between">
        <AppBadge tone="gold">{dua.titleAr}</AppBadge>
        <AppBadge tone="ivory">{authenticityLabel[dua.authenticity]}</AppBadge>
      </div>
      <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {dua.arabicText}
      </p>
      <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>{dua.contextAr}</p>
      <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
        {localizeSourceReference(dua.sourceReference)}
      </p>
    </AppCard>
  );
}
