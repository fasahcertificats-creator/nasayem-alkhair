import { AppCard, ReligiousText, spacing } from "@/design-system";
import type { Dua } from "@/types";

import { UmrahSourceMeta } from "./UmrahSourceMeta";

interface DuaBlockProps {
  dua: Dua;
}

function getReligiousTextKind(dua: Dua) {
  if (dua.kind === "quran" || dua.sourceType === "Quran" || dua.authenticity === "Quran") {
    return "quran";
  }

  if (dua.kind === "hadith" || dua.sourceType === "Hadith") {
    return "hadith";
  }

  return "dua";
}

function getCardTone(dua: Dua) {
  if (dua.kind === "quran") {
    return "border-gold/25 bg-[#fff8e8]";
  }

  if (dua.kind === "hadith") {
    return "border-primary/10 bg-[var(--nasayem-green-050)]";
  }

  return "border-border bg-card";
}

export function DuaBlock({ dua }: DuaBlockProps) {
  if (dua.verificationStatus !== "approved") {
    return null;
  }

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm} ${getCardTone(dua)}`}>
      {dua.timingAr ? (
        <p className="text-muted-foreground text-[12px] leading-relaxed">{dua.timingAr}</p>
      ) : null}
      <ReligiousText
        authenticity={dua.authenticity}
        kind={getReligiousTextKind(dua)}
        showSourceMeta={false}
        source={dua.source}
        sourceReference={dua.sourceReference}
        title={dua.titleAr}
      >
        {dua.arabicText}
      </ReligiousText>
      {dua.instructionAr ? (
        <p className="text-muted-foreground text-[13px] leading-relaxed">{dua.instructionAr}</p>
      ) : null}
      {dua.contextAr ? (
        <p className="text-muted-foreground text-[13px] leading-relaxed">{dua.contextAr}</p>
      ) : null}
      <UmrahSourceMeta displayReferenceAr={dua.displayReferenceAr} />
    </AppCard>
  );
}
