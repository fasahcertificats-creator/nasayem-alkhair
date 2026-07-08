import Link from "next/link";

import { AppBadge, AppButton, AppCard, AppSection, spacing, typography } from "@/design-system";

import { HomeProgressCard } from "./HomeProgressCard";

const quickAccessItems = [
  {
    title: "Umrah Guide",
    description: "Follow each step with calm, structured guidance.",
    href: "/umrah"
  },
  {
    title: "Azkar",
    description: "Morning, evening, and travel remembrances.",
    href: "/azkar"
  },
  {
    title: "Progress",
    description: "Track your journey through the core steps.",
    href: "/progress"
  },
  {
    title: "Settings",
    description: "Preferences and app options for later phases.",
    href: "/"
  }
] as const;

export default function HomePage() {
  return (
    <main>
      <AppSection spacing="lg">
        <div className={`grid items-center ${spacing.inline.lg} lg:grid-cols-[1.2fr_0.8fr]`}>
          <div className={spacing.stack.lg}>
            <AppBadge tone="gold">Nasayem Alkhair</AppBadge>
            <div className={spacing.stack.md}>
              <h1 className={`${typography.hierarchy.display} ${typography.tone.primary}`}>
                A calm companion for your Umrah journey
              </h1>
              <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                Move through each stage with clarity, remembrance, and a peaceful sense of progress.
              </p>
            </div>
            <div className={`flex flex-wrap ${spacing.inline.sm}`}>
              <AppButton asChild>
                <Link href="/umrah">Open Umrah Guide</Link>
              </AppButton>
              <AppButton asChild tone="outline">
                <Link href="/azkar">Read Azkar</Link>
              </AppButton>
            </div>
          </div>

          <AppCard className={`${spacing.inset.lg} ${spacing.stack.md}`}>
            <AppBadge>Today</AppBadge>
            <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
              Begin with intention, continue with ease.
            </p>
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              A steady journey is built one mindful step at a time.
            </p>
          </AppCard>
        </div>
      </AppSection>

      <AppSection
        description="A short reminder for focus before continuing."
        heading="Daily Reminder"
        spacing="sm"
      >
        <AppCard className={`${spacing.inset.lg} ${spacing.stack.sm}`}>
          <AppBadge tone="gold">Reminder</AppBadge>
          <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
            Actions are guided by intentions.
          </p>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            Renew your intention before every stage and keep the journey gentle.
          </p>
        </AppCard>
      </AppSection>

      <AppSection heading="Journey Progress" spacing="sm">
        <HomeProgressCard />
      </AppSection>

      <AppSection heading="Quick Access" spacing="md">
        <div className={`grid ${spacing.inline.md} md:grid-cols-2 lg:grid-cols-4`}>
          {quickAccessItems.map((item) => (
            <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`} key={item.title}>
              <AppBadge tone="gold">{item.title}</AppBadge>
              <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                {item.description}
              </p>
              <AppButton asChild tone="ghost">
                <Link href={item.href}>Open</Link>
              </AppButton>
            </AppCard>
          ))}
        </div>
      </AppSection>
    </main>
  );
}
