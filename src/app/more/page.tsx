import {
  BookOpenCheck,
  Calculator,
  Info,
  LocateFixed,
  Scale,
  ShieldCheck
} from "lucide-react";

const settingRows = [
  {
    title: "عن التطبيق",
    description: "نسائم الخير دليل عربي مختصر للأذكار والعمرة.",
    icon: Info
  },
  {
    title: "مصادر المحتوى",
    description: "تعرض المصادر داخل صفحات القراءة حيث يلزم.",
    icon: BookOpenCheck
  },
  {
    title: "طريقة حساب الصلاة",
    description: "تستخدم الصفحة الحالية عرضا محليا بسيطا عند عدم توفر الحساب الحي.",
    icon: Calculator
  },
  {
    title: "تحديث الموقع",
    description: "يتطلب إذن المستخدم عند تفعيل الربط بالموقع.",
    icon: LocateFixed
  },
  {
    title: "سياسة الخصوصية",
    description: "يحفظ التطبيق بعض العدادات محليا على جهازك.",
    icon: ShieldCheck
  },
  {
    title: "إصدار التطبيق",
    description: "نسخة إنتاجية متوافقة مع الويب والتحويل المستقبلي للجوال.",
    icon: Scale
  }
] as const;

export default function MorePage() {
  return (
    <main className="space-y-4 px-5 pb-12 pt-5 text-right" dir="rtl">
      <section className="space-y-1.5" aria-labelledby="more-heading">
        <h1 className="text-heading text-primary" id="more-heading">
          المزيد
        </h1>
        <p className="text-body-premium text-muted-foreground">
          إعدادات ومعلومات مختصرة عن التطبيق والمحتوى.
        </p>
      </section>

      <section className="space-y-2.5" aria-label="إعدادات التطبيق">
        {settingRows.map((row) => {
          const Icon = row.icon;

          return (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-soft" key={row.title}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
                  <Icon className="size-4.5" strokeWidth={1.7} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-primary">{row.title}</h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">{row.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
