import Image from "next/image";
import { BookOpenCheck, Info } from "lucide-react";

import { AppCard, spacing, typography } from "@/design-system";

const moreSections = [
  {
    title: "المصادر",
    description: "يعتمد محتوى العمرة والمواقيت على المصادر المذكورة داخل كل صفحة.",
    icon: BookOpenCheck
  },
  {
    title: "عن التطبيق",
    description: "نسائم الخير دليل عربي مختصر للعمرة وأذكار السفر والمواقيت، مع عرض المحتوى المعتمد فقط.",
    icon: Info
  }
] as const;

export default function MorePage() {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={`${spacing.stack.sm} text-center`} aria-labelledby="more-heading">
        <Image
          alt="نسائم الخير"
          className="mx-auto h-24 w-auto"
          height={1254}
          src="/nasayem-logo.png"
          width={1254}
        />
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="more-heading"
        >
          المزيد
        </h1>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="more-sections-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="more-sections-heading"
        >
          معلومات التطبيق
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
