import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";

export default function AzkarCategoryNotFound() {
  return (
    <main
      className="space-y-4 overflow-x-hidden px-4 pt-6 pb-8 text-center sm:px-5"
      dir="rtl"
    >
      <section className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-soft">
        <h1 className="text-[18px] leading-relaxed font-bold text-primary">
          تعذر العثور على قسم الأذكار المطلوب.
        </h1>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-medium)] bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground no-underline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          href={ROUTES.azkar}
        >
          <ArrowRight aria-hidden="true" className="size-4" />
          العودة إلى الأذكار
        </Link>
      </section>
    </main>
  );
}
