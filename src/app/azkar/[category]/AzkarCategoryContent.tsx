import Link from "next/link";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppButton, spacing, typography } from "@/design-system";
import type { AzkarItem } from "@/types";

import { AzkarReaderCard } from "../AzkarReaderCard";

interface AzkarCategoryContentProps {
  description: string;
  items: AzkarItem[];
  title: string;
}

function AzkarCategoryContentComponent({
  description,
  items,
  title
}: AzkarCategoryContentProps) {
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

      <section className={spacing.stack.sm} aria-label={title}>
        {items.map((item) => (
          <AzkarReaderCard item={item} key={item.id} />
        ))}
      </section>
    </main>
  );
}

export const AzkarCategoryContent = memo(AzkarCategoryContentComponent);
