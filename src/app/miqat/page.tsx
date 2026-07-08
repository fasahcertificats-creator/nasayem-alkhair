import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";
import { AppBadge, AppButton, AppCard, spacing, typography } from "@/design-system";
import { getMiqatList } from "@/services/content";

import { MiqatCard } from "./MiqatCard";

export default function MiqatPage() {
  const miqatList = getMiqatList();

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic}`}
      dir="rtl"
    >
      <section className={spacing.stack.xs} aria-labelledby="miqat-heading">
        <AppBadge tone="gold">العمرة</AppBadge>
        <h1
          className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
          id="miqat-heading"
        >
          المواقيت
        </h1>
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
          المواضع التي يُحرم منها القادمون إلى مكة
        </p>
      </section>

      <section className={spacing.stack.sm} aria-labelledby="miqat-list-heading">
        <div className="flex items-center justify-between">
          <h2
            className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}
            id="miqat-list-heading"
          >
            قائمة المواقيت
          </h2>
          <AppBadge tone="ivory">مرحلة الإحرام</AppBadge>
        </div>

        {miqatList.length > 0 ? (
          <div className={spacing.stack.sm}>
            {miqatList.map((miqat) => (
              <MiqatCard key={miqat.id} miqat={miqat} />
            ))}
          </div>
        ) : (
          <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
            <AppBadge tone="ivory">قيد التوثيق</AppBadge>
            <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
              لم تتم إضافة بيانات المواقيت بعد. ستظهر هنا بعد اعتماد المحتوى.
            </p>
            <AppButton asChild tone="outline">
              <Link href={ROUTES.umrah}>العودة إلى دليل العمرة</Link>
            </AppButton>
          </AppCard>
        )}
      </section>
    </main>
  );
}
