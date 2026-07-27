import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import {
  BookOpenCheck,
  FileText,
  Headphones,
  Scale,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "المزيد",
  description: "روابط الخصوصية والشروط والمصادر والدعم في تطبيق نسائم الخير."
};

const legalLinks = [
  {
    href: "/privacy" as Route,
    label: "سياسة الخصوصية",
    description: "كيف يستخدم التطبيق البيانات والموقع والتخزين المحلي.",
    icon: ShieldCheck
  },
  {
    href: "/terms" as Route,
    label: "شروط الاستخدام",
    description: "الشروط العامة لاستخدام التطبيق وخدمات المكتب.",
    icon: FileText
  },
  {
    href: "/disclaimer" as Route,
    label: "إخلاء المسؤولية",
    description: "تنبيهات المواقيت والمحتوى الديني والسفر.",
    icon: Scale
  },
  {
    href: "/sources" as Route,
    label: "المصادر والمراجع",
    description: "مصادر المحتوى والحساب والبيانات الخارجية.",
    icon: BookOpenCheck
  },
  {
    href: "/support" as Route,
    label: "الدعم والتواصل",
    description: "إرسال ملاحظة أو التواصل مع مكتب نسائم الخير.",
    icon: Headphones
  }
] as const satisfies ReadonlyArray<{
  href: Route;
  label: string;
  description: string;
  icon: typeof ShieldCheck;
}>;

export default function MorePage() {
  return (
    <main
      className="w-full min-w-0 space-y-5 overflow-x-hidden px-4 pt-5 pb-8 text-right min-[390px]:px-5"
      dir="rtl"
    >
      <header className="space-y-1.5">
        <h1 className="text-primary text-[24px] leading-9 font-extrabold">المزيد</h1>
        <p className="text-muted-foreground text-sm leading-7">
          معلومات التطبيق وحقوق المستخدم ووسائل الدعم.
        </p>
      </header>

      <section
        aria-labelledby="legal-information-heading"
        className="border-border space-y-3 rounded-[22px] border bg-[var(--nasayem-surface)] p-4 shadow-[var(--shadow-soft)]"
      >
        <div>
          <h2
            className="text-primary text-[17px] leading-7 font-bold"
            id="legal-information-heading"
          >
            الخصوصية والمعلومات النظامية
          </h2>
          <p className="text-muted-foreground mt-1 text-xs leading-6">
            صفحات موجزة وشفافة عن تشغيل التطبيق ومصادره.
          </p>
        </div>

        <nav aria-label="الخصوصية والمعلومات النظامية">
          <ul className="divide-border overflow-hidden rounded-[16px] border bg-white divide-y">
            {legalLinks.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    className="focus-visible:ring-gold flex min-h-16 min-w-0 items-center gap-3 px-3 py-2.5 focus-visible:ring-2 focus-visible:outline-none"
                    href={item.href}
                  >
                    <span className="bg-[var(--nasayem-gold-050)] text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
                      <Icon aria-hidden="true" className="size-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-primary block text-sm leading-6 font-bold break-words">
                        {item.label}
                      </span>
                      <span className="text-muted-foreground block text-[11px] leading-5 break-words">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </section>
    </main>
  );
}
