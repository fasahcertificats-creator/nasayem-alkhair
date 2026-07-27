"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { buildWhatsappUrl, OFFICE_DETAILS } from "./legal-content";

const supportCategories = [
  "خطأ في نص أو مصدر",
  "مشكلة في أوقات الصلاة",
  "مدينة أو محافظة غير موجودة",
  "مشكلة فنية في التطبيق",
  "استفسار عن خدمة المكتب",
  "طلب متعلق بالخصوصية"
] as const;

export function SupportContact() {
  const [category, setCategory] = useState<(typeof supportCategories)[number]>(
    supportCategories[0]
  );
  const message = `السلام عليكم، لدي ملاحظة بخصوص التطبيق:\n${category}`;

  return (
    <section className="space-y-3" aria-labelledby="support-category-heading">
      <h2 className="text-primary text-[17px] leading-7 font-bold" id="support-category-heading">
        نوع الملاحظة
      </h2>
      <div className="grid gap-2 min-[360px]:grid-cols-2" role="radiogroup">
        {supportCategories.map((item) => (
          <button
            aria-checked={category === item}
            className={`focus-visible:ring-gold min-h-11 min-w-0 rounded-xl border px-3 py-2 text-right text-xs leading-6 font-bold break-words focus-visible:ring-2 focus-visible:outline-none ${
              category === item
                ? "border-primary bg-[var(--nasayem-green-050)] text-primary"
                : "border-border bg-white text-muted-foreground"
            }`}
            key={item}
            onClick={() => setCategory(item)}
            role="radio"
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <a
        aria-label={`فتح واتساب لإرسال ملاحظة: ${category}`}
        className="bg-primary text-primary-foreground focus-visible:ring-gold inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
        href={buildWhatsappUrl(OFFICE_DETAILS.primaryPhone, message)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden="true" className="size-5" />
        فتح واتساب للدعم
      </a>
    </section>
  );
}
