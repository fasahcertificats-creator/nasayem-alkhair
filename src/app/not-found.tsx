import Link from "next/link";
import { SearchX } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { AppButton } from "@/design-system";

export default function NotFoundPage() {
  return (
    <main className="px-5 py-8 text-right" dir="rtl">
      <section className="rounded-[22px] border border-border bg-white p-5 shadow-soft">
        <div className="space-y-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-gold">
            <SearchX className="size-5" strokeWidth={1.7} />
          </div>
          <div className="space-y-2">
            <h1 className="text-heading text-primary">الصفحة غير موجودة</h1>
            <p className="text-body-premium text-muted-foreground">
              هذا المسار غير متاح. يمكنك العودة إلى الصفحة الرئيسية.
            </p>
          </div>
          <AppButton asChild>
            <Link href={ROUTES.home}>العودة للرئيسية</Link>
          </AppButton>
        </div>
      </section>
    </main>
  );
}
