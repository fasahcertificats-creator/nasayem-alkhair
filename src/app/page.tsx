import Link from "next/link";
import { BookOpenText, Clock3, Footprints, Map, MoonStar } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import { getUmrahStages } from "@/services/content";

import { HomeProgressCard } from "./HomeProgressCard";

const quickAccessItems = [
  {
    title: "دليل العمرة",
    description: "خطوات الرحلة بهدوء وترتيب.",
    href: ROUTES.umrah,
    icon: Map
  },
  {
    title: "الأذكار",
    description: "مساحة يومية للذكر الموثق.",
    href: ROUTES.azkar,
    icon: BookOpenText
  },
  {
    title: "المواقيت",
    description: "قسم مهيأ لمواقيت الصلاة.",
    href: ROUTES.miqat,
    icon: Clock3
  },
  {
    title: "التقدم",
    description: "متابعة الرحلة اليومية.",
    href: ROUTES.progress,
    icon: Footprints
  }
] as const;

export default function HomePage() {
  const umrahStages = getUmrahStages();

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section aria-labelledby="home-greeting" className={spacing.stack.sm}>
        <div className={spacing.stack.xs}>
          <AppBadge tone="gold">نسائم الخير</AppBadge>
          <div className={spacing.stack.xs}>
            <h1
              className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
              id="home-greeting"
            >
              السلام عليكم
            </h1>
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              رفيق هادئ للذكر والعمرة، يجمع ما تحتاجه في مساحة قليلة وواضحة.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="daily-spiritual-heading" className={spacing.stack.sm}>
        <div className="flex items-center justify-between">
          <h2
            className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
            id="daily-spiritual-heading"
          >
            تذكير اليوم
          </h2>
          <AppBadge tone="ivory">قيد التوثيق</AppBadge>
        </div>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
          <div className={`flex items-center ${spacing.inline.sm}`}>
            <MoonStar aria-hidden="true" className={`${typography.tone.primary} size-5`} />
            <AppBadge tone="gold">صلة يومية</AppBadge>
          </div>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            مساحة مهيأة لآية أو ذكر موثق، تظهر هنا بعد اكتمال مراجعة المحتوى.
          </p>
        </AppCard>
      </section>

      <section aria-labelledby="prayer-heading" className={spacing.stack.sm} id="prayer-card">
        <div className="flex items-center justify-between">
          <h2
            className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
            id="prayer-heading"
          >
            الصلاة
          </h2>
          <AppBadge tone="ivory">لاحقاً</AppBadge>
        </div>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className={`grid grid-cols-2 ${spacing.inline.md}`}>
            <div className={spacing.stack.xs}>
              <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
                الصلاة القادمة
              </p>
              <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                غير محددة
              </p>
            </div>
            <div className={`${spacing.stack.xs} text-left`}>
              <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
                الوقت المتبقي
              </p>
              <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                --:--
              </p>
            </div>
          </div>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            سيتم ربط المواقيت لاحقاً دون حسابات مؤقتة.
          </p>
        </AppCard>
      </section>

      <HomeProgressCard stages={umrahStages} />

      <section className={spacing.stack.sm} aria-labelledby="quick-actions-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="quick-actions-heading"
        >
          وصول سريع
        </h2>
        <div className={`grid grid-cols-2 ${spacing.inline.sm}`}>
          {quickAccessItems.map((item) => {
            const Icon = item.icon;

            return (
              <AppCard className={`${spacing.inset.sm} ${spacing.stack.sm}`} key={item.title}>
                <Icon aria-hidden="true" className={`${typography.tone.primary} size-5`} />
                <div className={spacing.stack.xs}>
                  <p className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
                    {item.title}
                  </p>
                  <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
                    {item.description}
                  </p>
                </div>
                <AppButton asChild tone="ghost">
                  <Link href={item.href}>فتح</Link>
                </AppButton>
              </AppCard>
            );
          })}
        </div>
      </section>
    </main>
  );
}
