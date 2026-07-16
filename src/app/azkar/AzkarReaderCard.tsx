"use client";

import { CheckCircle2 } from "lucide-react";

import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import type { AzkarItem } from "@/types";

interface AzkarReaderCardProps {
  isCompleted: boolean;
  item: AzkarItem;
  onToggle: (itemId: string) => void;
}

function localizeSourceReference(source: string) {
  return source
    .replaceAll("Sahih Muslim", "صحيح مسلم")
    .replaceAll("Sahih al-Bukhari", "صحيح البخاري")
    .replaceAll("Sunan Abi Dawud", "سنن أبي داود");
}

export function AzkarReaderCard({ isCompleted, item, onToggle }: AzkarReaderCardProps) {
  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
      <div className="flex items-center justify-between">
        <AppBadge tone={isCompleted ? "gold" : "ivory"}>
          {isCompleted ? "مكتمل" : "للقراءة"}
        </AppBadge>
        <AppBadge tone="ivory">{item.count} مرات</AppBadge>
      </div>

      <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {item.arabicText}
      </p>

      {item.translation ? (
        <div className={spacing.stack.xs}>
          <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>المعنى</p>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {item.translation}
          </p>
        </div>
      ) : null}

      {item.source ? (
        <div className={spacing.stack.xs}>
          <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>المصدر</p>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {localizeSourceReference(item.source)}
          </p>
        </div>
      ) : null}

      <AppButton onClick={() => onToggle(item.id)} tone={isCompleted ? "outline" : "gold"}>
        <CheckCircle2 aria-hidden="true" />
        {isCompleted ? "إلغاء الإكمال" : "تمت القراءة"}
      </AppButton>
    </AppCard>
  );
}
