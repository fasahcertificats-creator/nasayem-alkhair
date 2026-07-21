import Link from "next/link";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import {
  AppButton,
  IslamicPattern,
  PageHeading,
  SurfaceCard,
  spacing,
  typography
} from "@/design-system";
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
      <section className={`${spacing.stack.sm} relative min-w-0 overflow-hidden rounded-[var(--radius-card)]`} aria-labelledby="azkar-category-heading">
        <IslamicPattern className="-top-5 end-2" opacity={0.035} size="medium" tone="gold" variant="header" />
        <AppButton asChild tone="ghost">
          <Link href={ROUTES.azkar}>العودة إلى الأذكار</Link>
        </AppButton>
        <div className={`${spacing.stack.xs} relative`}>
          <PageHeading id="azkar-category-heading">{title}</PageHeading>
          {description ? (
            <p className={`${typography.hierarchy.body} ${typography.tone.muted} text-center`}>
              {description}
            </p>
          ) : null}
        </div>
      </section>

      <section className={isNamesOfAllah ? "" : spacing.stack.sm} aria-label={title}>
        {isNamesOfAllah ? (
          <div className="grid min-w-0 grid-cols-2 gap-2 pb-24 sm:grid-cols-3">
            {items.map((item) => (
              <SurfaceCard className="px-3 py-4 text-center" key={item.id} variant="default">
                <p className="text-primary text-lg leading-relaxed font-bold">{item.arabicText}</p>
              </SurfaceCard>
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
