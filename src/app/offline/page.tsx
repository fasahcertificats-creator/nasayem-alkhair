import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  BookOpenText,
  Clock,
  Compass,
  Home,
  Sparkles,
  WifiOff
} from "lucide-react";

import { OfflineRetryButton } from "./OfflineRetryButton";

export const metadata: Metadata = {
  alternates: {
    canonical: "/offline"
  },
  title: "لا يوجد اتصال بالإنترنت",
  description:
    "صفحة احتياطية للوصول إلى محتوى نسائم الخير المتاح دون اتصال."
};

const offlineActions = [
  { href: "/" as Route, label: "الصفحة الرئيسية", icon: Home },
  { href: "/prayer-times" as Route, label: "أوقات الصلاة", icon: Clock },
  { href: "/azkar" as Route, label: "الأذكار", icon: BookOpenText },
  { href: "/tasbih" as Route, label: "التسبيح", icon: Sparkles },
  { href: "/umrah" as Route, label: "دليل العمرة", icon: Compass }
] as const;

export default function OfflinePage() {
  return (
    <main
      className="w-full min-w-0 space-y-5 overflow-x-hidden px-4 pt-5 pb-8 text-right min-[390px]:px-5"
      dir="rtl"
    >
      <header className="border-border space-y-3 rounded-[22px] border bg-[var(--nasayem-surface)] p-4 shadow-[var(--shadow-soft)]">
        <span className="bg-[var(--nasayem-gold-050)] text-gold flex size-10 items-center justify-center rounded-xl">
          <WifiOff aria-hidden="true" className="size-5" />
        </span>
        <div className="space-y-1.5">
          <h1 className="text-primary text-[22px] leading-9 font-extrabold">
            لا يوجد اتصال بالإنترنت
          </h1>
          <p className="text-muted-foreground text-sm leading-7">
            يمكنك استخدام المحتوى الذي سبق فتحه أو الذي جهزته للعمل دون إنترنت.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="offline-local-actions"
        className="space-y-3"
      >
        <div>
          <h2
            className="text-primary text-[17px] leading-7 font-bold"
            id="offline-local-actions"
          >
            المحتوى المتاح محليًا
          </h2>
          <p className="text-muted-foreground mt-1 text-xs leading-6">
            يعتمد توفر الصفحة على فتحها سابقًا أو إكمال تجهيز الحزمة.
          </p>
        </div>
        <ul className="grid min-w-0 gap-2 min-[360px]:grid-cols-2">
          {offlineActions.map((action) => {
            const Icon = action.icon;

            return (
              <li key={action.href}>
                <Link
                  className="border-border text-primary focus-visible:ring-gold flex min-h-12 min-w-0 items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-bold shadow-[var(--shadow-soft)] focus-visible:ring-2 focus-visible:outline-none"
                  href={action.href}
                >
                  <Icon
                    aria-hidden="true"
                    className="text-gold size-4 shrink-0"
                  />
                  <span className="min-w-0 break-words">{action.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <OfflineRetryButton />
    </main>
  );
}
