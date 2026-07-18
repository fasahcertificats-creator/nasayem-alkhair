import Link from "next/link";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppButton, spacing, typography } from "@/design-system";
import type { AzkarCategory, AzkarItem } from "@/types";

import { AzkarReaderCard } from "../AzkarReaderCard";

interface AzkarCategoryContentProps {
  category: AzkarCategory;
  description: string;
  items: AzkarItem[];
  title: string;
}

function AzkarCategoryContentComponent({
  category,
  description,
  items,
  title
}: AzkarCategoryContentProps) {
  const isNamesOfAllah = category === "names-of-allah";

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.sm} aria-labelledby="azkar-category-heading">
        <AppButton asChild tone="ghost">
          <Link href={ROUTES.azkar}>العودة إلى الأذكار</Link>
        </AppButton>
        <div className={spacing.stack.xs}>
          <h1
            className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
            id="azkar-category-heading"
          >
            {title}
          </h1>
          {description ? (
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              {description}
            </p>
          ) : null}
        </div>
      </section>

      <section className={isNamesOfAllah ? "" : spacing.stack.sm} aria-label={title}>
        {isNamesOfAllah ? (
          <div className="grid grid-cols-2 gap-2 pb-24 sm:grid-cols-3">
            {items.map((item) => (
              <div
                className="rounded-2xl border border-border bg-white px-3 py-4 text-center shadow-soft"
                key={item.id}
              >
                <p className="text-lg font-bold leading-relaxed text-primary">{item.arabicText}</p>
              </div>
            ))}
          </div>
        ) : (
          items.map((item) => <AzkarReaderCard item={item} key={item.id} />)
        )}
      </section>
    </main>
  );
}

export const AzkarCategoryContent = memo(AzkarCategoryContentComponent);
