"use client";

import { AppBadge, AppButton, AppCard, AppSection, spacing, typography } from "@/design-system";

const azkarCategories = [
  {
    title: "Morning Azkar",
    description: "Begin the day with remembrance, gratitude, and protection."
  },
  {
    title: "Evening Azkar",
    description: "Close the day with calm reflection and steady remembrance."
  },
  {
    title: "Travel Azkar",
    description: "Supplications for movement, arrival, and safe return."
  }
] as const;

export default function AzkarPageContent() {
  return (
    <main>
      <AppSection
        description="Organized remembrance categories for quiet daily use."
        heading="Azkar"
        spacing="lg"
      >
        <div className={spacing.stack.lg}>
          {azkarCategories.map((category) => (
            <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`} key={category.title}>
              <AppBadge tone="gold">{category.title}</AppBadge>
              <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                {category.title}
              </h2>
              <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                {category.description}
              </p>
              <AppButton tone="outline">Open Category</AppButton>
            </AppCard>
          ))}
        </div>
      </AppSection>
    </main>
  );
}
