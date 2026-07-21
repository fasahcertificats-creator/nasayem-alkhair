"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { AppButton, AppCard, ReligiousText, spacing } from "@/design-system";
import type { AzkarCategory, AzkarItem } from "@/types";

interface AzkarReaderCardProps {
  item: AzkarItem;
}

function getContentKind(category: AzkarCategory, item: AzkarItem) {
  if (category === "quran-duas") {
    return "quran";
  }

  if (
    category === "prophetic-duas" ||
    item.authenticity === "sahih" ||
    item.authenticity === "hasan"
  ) {
    return "hadith";
  }

  return "dua";
}

export function AzkarReaderCard({ item }: AzkarReaderCardProps) {
  const [counter, setCounter] = useState(0);
  const hasCounter = item.displayMode !== "reading" && item.count > 1;
  const contentKind = getContentKind(item.category, item);

  function incrementCounter() {
    setCounter((currentCounter) => Math.min(currentCounter + 1, item.count));
  }

  function resetCounter() {
    setCounter(0);
  }

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
      <ReligiousText
        authenticity={item.authenticity}
        kind={contentKind}
        source={item.source}
        sourceReference={item.sourceReference}
        title={item.title}
      >
        {item.arabicText}
      </ReligiousText>

      {hasCounter ? (
        <div className="flex flex-wrap items-center gap-2">
          <AppButton
            aria-label={`التكرار ${counter} من ${item.count}`}
            className="min-h-11 min-w-24"
            onClick={incrementCounter}
            tone="gold"
          >
            التكرار {counter} من {item.count}
          </AppButton>
          <AppButton aria-label="إعادة ضبط التكرار" onClick={resetCounter} tone="outline">
            <RotateCcw aria-hidden="true" />
          </AppButton>
        </div>
      ) : null}
    </AppCard>
  );
}
