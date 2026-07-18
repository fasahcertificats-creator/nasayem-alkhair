"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppButton } from "@/design-system";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[RouteError]", error);
    }
  }, [error]);

  return (
    <main className="px-5 py-8 text-right" dir="rtl">
      <section className="rounded-[22px] border border-border bg-white p-5 shadow-soft">
        <div className="space-y-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-gold">
            <AlertCircle className="size-5" strokeWidth={1.7} />
          </div>
          <div className="space-y-2">
            <h1 className="text-heading text-primary">تعذر تحميل هذه الصفحة</h1>
            <p className="text-body-premium text-muted-foreground">
              يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AppButton onClick={reset}>إعادة المحاولة</AppButton>
            <AppButton asChild tone="outline">
              <Link href={ROUTES.home}>العودة للرئيسية</Link>
            </AppButton>
          </div>
        </div>
      </section>
    </main>
  );
}
