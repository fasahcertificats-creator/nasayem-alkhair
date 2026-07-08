import { BookOpenCheck, Info, Settings } from "lucide-react";

import { AppBadge, AppCard, spacing, typography } from "@/design-system";

const moreSections = [
  {
    title: "الإعدادات",
    description: "خيارات التطبيق ستضاف في مرحلة لاحقة.",
    icon: Settings
  },
  {
    title: "المصادر",
    description: "مساحة مخصصة لمراجع المحتوى المعتمد.",
    icon: BookOpenCheck
  },
  {
    title: "عن التطبيق",
    description: "معلومات نسائم الخير وتفاصيله المستقبلية.",
    icon: Info
  }
] as const;

export default function MorePage() {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="more-heading">
        <AppBadge tone="gold">نسائم الخير</AppBadge>
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="more-heading"
        >
          المزيد
        </h1>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          مساحة هادئة للأقسام المساندة للتطبيق.
        </p>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="more-sections-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="more-sections-heading"
        >
          أقسام مستقبلية
        </h2>

        <div className={spacing.stack.sm}>
          {moreSections.map((section) => {
            const Icon = section.icon;

            return (
              <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`} key={section.title}>
                <div className={`flex items-start ${spacing.inline.sm}`}>
                  <Icon
                    aria-hidden="true"
                    className={`${typography.tone.primary} mt-1 size-5 shrink-0`}
                  />
                  <div className={spacing.stack.xs}>
                    <h3 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                      {section.title}
                    </h3>
                    <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>
      </section>
    </main>
  );
}
