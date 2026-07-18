import { AppCard, spacing, typography } from "@/design-system";
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
  return source
    .replaceAll("Sahih Muslim", "صحيح مسلم")
    .replaceAll("Sahih al-Bukhari", "صحيح البخاري")
    .replaceAll("Sunan Abi Dawud", "سنن أبي داود");
}

export function DuaBlock({ dua }: DuaBlockProps) {
  if (dua.verificationStatus !== "approved") {
    return null;
  }

  const isQuran = dua.sourceType === "Quran" || dua.authenticity === "Quran";

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {dua.titleAr}
      </h2>
      <p
        className={
          isQuran
            ? "font-serif text-xl leading-loose text-primary"
            : `${typography.hierarchy.subheading} ${typography.tone.primary}`
        }
      >
        {dua.arabicText}
      </p>
      {dua.contextAr ? (
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          {dua.contextAr}
        </p>
      ) : null}
      <div className={spacing.stack.xs}>
        {dua.sourceReference ? (
          <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
            المصدر: {localizeSourceReference(dua.sourceReference)}
          </p>
        ) : null}
        <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
          الدرجة: {authenticityLabel[dua.authenticity]}
        </p>
      </div>
    </AppCard>
  );
}
