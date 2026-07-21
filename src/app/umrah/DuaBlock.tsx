import { AppCard, ReligiousText, spacing } from "@/design-system";
import type { Dua } from "@/types";

interface DuaBlockProps {
  dua: Dua;
}

export function DuaBlock({ dua }: DuaBlockProps) {
  if (dua.verificationStatus !== "approved") {
    return null;
  }

  const kind =
    dua.sourceType === "Quran" || dua.authenticity === "Quran"
      ? "quran"
      : dua.sourceType === "Hadith" || dua.authenticity === "sahih" || dua.authenticity === "hasan"
        ? "hadith"
        : "dua";

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <ReligiousText
        authenticity={dua.authenticity}
        kind={kind}
        source={dua.source}
        sourceReference={dua.sourceReference}
        title={dua.titleAr}
      >
        {dua.arabicText}
      </ReligiousText>
      {dua.contextAr ? (
        <p className="text-body-premium text-muted-foreground">{dua.contextAr}</p>
      ) : null}
    </AppCard>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                 