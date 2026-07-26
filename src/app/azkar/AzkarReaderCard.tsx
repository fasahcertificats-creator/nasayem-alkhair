"use client";

import {
  AzkarRepetitionControl,
  AzkarSourceMeta,
  IslamicPattern,
  ReligiousText,
  SurfaceCard
} from "@/design-system";
import type { AzkarItem } from "@/types";

interface AzkarReaderCardProps {
  count: number;
  item: AzkarItem;
  onIncrement: () => void;
}

function getContentKind(item: AzkarItem) {
  if (item.categoryId === "quran-duas") {
    return "quran";
  }

  if (
    item.categoryId === "prophetic-duas" ||
    item.authenticity === "sahih" ||
    item.authenticity === "hasan"
  ) {
    return "hadith";
  }

  return "dua";
}

export function AzkarReaderCard({
  count,
  item,
  onIncrement
}: AzkarReaderCardProps) {
  const contentKind = getContentKind(item);
  const isReadingItem = item.displayMetadata?.mode === "reading";

  return (
    <SurfaceCard
      className="min-w-0 space-y-5 overflow-hidden p-4 max-[219px]:p-3 sm:p-5"
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
          className="[&_p]:text-[20px] [&_p]:leading-[2.05] max-[219px]:[&_p]:text-[18px]"
          kind={contentKind}
          showSourceMeta={false}
          source={item.source}
          sourceReference={item.sourceReference}
          title={item.title}
        >
          {item.text}
        </ReligiousText>
      </div>

      <AzkarSourceMeta
        authenticity={item.authenticity}
        kind={contentKind}
        source={item.source}
        sourceReference={item.sourceReference}
      />

      <AzkarRepetitionControl
        actionLabel={isReadingItem ? "تمت القراءة" : "تسجيل التكرار"}
        count={count}
        onIncrement={onIncrement}
        target={item.targetCount}
      />
    </SurfaceCard>
  );
}
