"use client";

import { useState } from "react";

import {
  AzkarRepetitionControl,
  IslamicPattern,
  ReligiousSourceMeta,
  ReligiousText,
  SurfaceCard,
  spacing
} from "@/design-system";
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
    <SurfaceCard
      className={`${spacing.inset.md} ${spacing.stack.md}`}
      decoration={
        contentKind === "quran" ? null : (
          <IslamicPattern
            className="-top-4 end-2"
            opacity={0.035}
            size="small"
            tone="green"
            variant="corner"
          />
        )
      }
      variant="default"
    >
      <div className="relative min-w-0">
        <ReligiousText
          authenticity={item.authenticity}
          kind={contentKind}
          showSourceMeta={false}
          source={item.source}
          sourceReference={item.sourceReference}
          title={item.title}
        >
          {item.arabicText}
        </ReligiousText>
      </div>

      <ReligiousSourceMeta
        authenticity={item.authenticity}
        source={item.source}
        sourceReference={item.sourceReference}
      />

      {hasCounter ? (
        <AzkarRepetitionControl
          count={counter}
          onIncrement={incrementCounter}
          onReset={resetCounter}
          target={item.count}
        />
      ) : null}
    </SurfaceCard>
  );
}
