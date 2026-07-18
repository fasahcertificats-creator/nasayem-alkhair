"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { AppButton, AppCard, spacing, typography } from "@/design-system";
import type { AzkarItem } from "@/types";

interface AzkarReaderCardProps {
  item: AzkarItem;
}

export function AzkarReaderCard({ item }: AzkarReaderCardProps) {
  const [counter, setCounter] = useState(0);
  const hasCounter = item.displayMode !== "reading" && item.count > 1;

  function incrementCounter() {
    setCounter((currentCounter) => Math.min(currentCounter + 1, item.count));
  }

  function resetCounter() {
    setCounter(0);
  }

  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
      {item.title ? (
        <h2 className={`${typography.hierarchy.body} font-bold ${typography.tone.primary}`}>
          {item.title}
        </h2>
      ) : null}

      <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {item.arabicText}
      </p>

      {item.source ? (
        <div className={spacing.stack.xs}>
          <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>المصدر</p>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {item.source}
          </p>
        </div>
      ) : null}

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
