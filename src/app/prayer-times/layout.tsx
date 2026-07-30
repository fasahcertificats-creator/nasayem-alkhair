import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "أوقات الصلاة",
  description: "حساب أوقات الصلاة حسب الموقع أو المدينة المختارة في تطبيق نسائم الخير.",
  alternates: {
    canonical: "/prayer-times"
  }
};

export default function PrayerTimesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
