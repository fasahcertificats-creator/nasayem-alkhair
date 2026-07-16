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

      {item.authenticity ? (
        <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
          {item.authenticity}
        </p>
      ) : null}

      {hasCounter ? (
        <div className="flex flex-wrap items-center gap-2">
          <AppButton onClick={incrementCounter} tone="gold">
            {counter} / {item.count}
          </AppButton>
          <AppButton aria-label="إعادة ضبط العد" onClick={resetCounter} tone="outline">
            <RotateCcw aria-hidden="true" />
          </AppButton>
        </div>
      ) : null}
    </AppCard>
  );
}
