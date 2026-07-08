import Link from "next/link";
import { BookOpenText, Clock3, Footprints, Map, Sparkles } from "lucide-react";

import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";

import { HomeProgressCard } from "./HomeProgressCard";

const quickAccessItems = [
  {
    title: "دليل العمرة",
    description: "خطوات منظمة قبل الرحلة وأثناءها.",
    href: "/umrah",
    icon: Map
  },
  {
    title: "الأذكار",
    description: "ورد يومي قريب وسهل المتابعة.",
    href: "/azkar",
    icon: BookOpenText
  },
  {
    title: "المواقيت",
    description: "تذكير مبدئي بالصلاة القادمة.",
    href: "/#prayer-card",
    icon: Clock3
  },
  {
    title: "التقدم",
    description: "تابع رحلتك خطوة بخطوة.",
    href: "/progress",
    icon: Footprints
  }
] as const;

export default function HomePage() {
  return (
    <main className={`${spacing.inset.sm} ${spacing.stack.md}`} dir="rtl">
      <section className={spacing.stack.md} aria-labelledby="home-greeting">
        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className={spacing.stack.sm}>
            <AppBadge tone="gold">الرئيسية</AppBadge>
            <div className={spacing.stack.xs}>
              <h1
                className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
                id="home-greeting"
              >
                السلام عليكم
              </h1>
              <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
                نسائم الخير رفيق هادئ يعينك على الذكر، والاستعداد للعمرة، ومتابعة رحلتك بروح
                مطمئنة.
              </p>
            </div>
          </div>
          <AppButton asChild tone="gold">
            <Link href="/umrah">ابدأ من دليل العمرة</Link>
          </AppButton>
        </AppCard>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="prayer-heading" id="prayer-card">
        <div className="flex items-center justify-between">
          <h2
            className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
            id="prayer-heading"
          >
            الصلاة القادمة
          </h2>
          <AppBadge tone="ivory">مبدئي</AppBadge>
        </div>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.md}`}>
          <div className={`flex items-center justify-between ${spacing.inline.md}`}>
            <div className={spacing.stack.xs}>
              <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
                الصلاة التالية
              </p>
              <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                العصر
              </p>
            </div>
            <div className="text-left">
              <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>الوقت</p>
              <p className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
                --:--
              </p>
            </div>
          </div>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            الموقع الحالي: مكة المكرمة، المملكة العربية السعودية
          </p>
        </AppCard>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="daily-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="daily-heading"
        >
          تذكير اليوم
        </h2>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
          <div className={`flex items-center ${spacing.inline.sm}`}>
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <AppBadge tone="gold">ذكر</AppBadge>
          </div>
          <p className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
            اجعل نيتك حاضرة، وخذ من يومك لحظة هادئة للذكر والدعاء.
          </p>
        </AppCard>
      </section>

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
                <Icon aria-hidden="true" className="size-5 text-primary" />
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

      <section className={spacing.stack.sm} aria-labelledby="progress-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="progress-heading"
        >
          تقدم الرحلة
        </h2>
        <HomeProgressCard />
      </section>
    </main>
  );
}
