import Link from "next/link";
import { BookOpenText, MoonStar } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";

export default function HomePage() {
  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section aria-labelledby="home-greeting" className={spacing.stack.sm}>
        <div className={spacing.stack.xs}>
          <h1
            className={`font-arabic-studio ${typography.hierarchy.heading} ${typography.tone.primary} font-semibold`}
            id="home-greeting"
          >
            السلام عليكم
          </h1>
        </div>
      </section>

      <section aria-labelledby="daily-spiritual-heading" className={spacing.stack.sm}>
        <div className="flex items-center justify-between">
          <h2
            className={`font-arabic-studio ${typography.hierarchy.subheading} ${typography.tone.primary} font-semibold`}
            id="daily-spiritual-heading"
          >
            تذكير اليوم
          </h2>
          <AppBadge tone="ivory">قيد التوثيق</AppBadge>
        </div>
        <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
          <div className={`flex items-center ${spacing.inline.sm}`}>
            <MoonStar aria-hidden="true" className={`${typography.tone.primary} size-5`} />
            <AppBadge tone="gold">تذكير اليوم</AppBadge>
          </div>
          <p
            className={`font-arabic-studio ${typography.hierarchy.body} ${typography.tone.primary} font-medium`}
          >
            تذكير اليوم
          </p>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            سيُضاف هنا ورد يومي موثق من القرآن والسنة
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

      <section className={spacing.stack.sm} aria-labelledby="azkar-heading">
        <h2
          className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
          id="azkar-heading"
        >
          الأذكار
        </h2>
        <AppCard className={`${spacing.inset.sm} ${spacing.stack.sm}`}>
          <BookOpenText aria-hidden="true" className={`${typography.tone.primary} size-5`} />
          <div className={spacing.stack.xs}>
            <p className={`${typography.hierarchy.body} ${typography.tone.primary}`}>
              أذكار اليوم
            </p>
            <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
              انتقل إلى صفحة الأذكار اليومية.
            </p>
          </div>
          <AppButton asChild tone="ghost">
            <Link href={ROUTES.azkar}>فتح الأذكار</Link>
          </AppButton>
        </AppCard>
      </section>
    </main>
  );
}
