"use client";

import {
  BriefcaseBusiness,
  Building2,
  Check,
  Clock,
  Copy,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  UsersRound
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type ServiceId = "umrah" | "family-visit" | "work-visa" | "transport";

type Service = {
  id: ServiceId;
  title: string;
  description: string;
  intro: string;
  points: string[];
  message: string;
  icon: typeof Plane;
};

const primaryWhatsappNumber = "967774360027";
const secondaryWhatsappNumber = "967774383736";

const services: Service[] = [
  {
    id: "umrah",
    title: "برامج العمرة",
    description: "اختيار البرنامج وترتيب السكن والتنقل.",
    intro: "نساعدك في اختيار برنامج مناسب وترتيب تفاصيل الرحلة.",
    points: ["اختيار البرنامج المناسب", "تنسيق السكن والتنقل", "متابعة تفاصيل الرحلة"],
    message:
      "السلام عليكم، أرغب في الاستفسار عن برامج العمرة المتاحة، والمواعيد والأسعار والخدمات المشمولة.",
    icon: Plane
  },
  {
    id: "family-visit",
    title: "تأشيرات الزيارة العائلية",
    description: "توضيح المتطلبات ومتابعة تجهيز الطلب.",
    intro: "نوضح لك المتطلبات الأساسية ونساعدك في تجهيز الطلب.",
    points: [
      "توضيح المتطلبات الأساسية",
      "مراجعة البيانات قبل التقديم",
      "متابعة تجهيز الطلب"
    ],
    message:
      "السلام عليكم، أرغب في الاستفسار عن تأشيرة الزيارة العائلية، والمتطلبات والإجراءات اللازمة.",
    icon: UsersRound
  },
  {
    id: "work-visa",
    title: "تأشيرات العمل",
    description: "مراجعة المتطلبات ومتابعة إجراءات التأشيرة.",
    intro: "نراجع المتطلبات ونوضح المستندات المطلوبة قبل المتابعة.",
    points: [
      "مراجعة متطلبات التأشيرة",
      "توضيح المستندات المطلوبة",
      "متابعة إجراءات الطلب"
    ],
    message:
      "السلام عليكم، أرغب في الاستفسار عن تأشيرات العمل، والمتطلبات والإجراءات المتاحة.",
    icon: BriefcaseBusiness
  },
  {
    id: "transport",
    title: "حجوزات الطيران والنقل البري",
    description: "حجوزات الطيران والباصات وخيارات السفر المناسبة.",
    intro: "نبحث عن خيارات السفر المناسبة ونوضح المواعيد والتفاصيل.",
    points: [
      "البحث عن خيارات السفر المناسبة",
      "حجوزات الطيران والباصات",
      "توضيح المواعيد والتفاصيل"
    ],
    message:
      "السلام عليكم، أرغب في الاستفسار عن حجوزات الطيران والنقل البري، والمواعيد والخيارات المتاحة.",
    icon: Plane
  }
];

function buildMessage(service: Service, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return service.message;
  }

  return `الاسم: ${trimmedName}\n${service.message}`;
}

function whatsappHref(phone: string, message?: string) {
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${encodedMessage}`;
}

export default function ServicesPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>("umrah");
  const [name, setName] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const selectedService = services.find((service) => service.id === selectedServiceId) ?? services[0];
  const preparedMessage = useMemo(
    () => buildMessage(selectedService, name),
    [name, selectedService]
  );

  async function copyMessage() {
    await navigator.clipboard.writeText(preparedMessage);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1600);
  }

  return (
    <main className="space-y-4 px-5 pb-12 pt-5 text-right" dir="rtl">
      <section className="space-y-2" aria-labelledby="services-heading">
        <span className="inline-flex w-fit rounded-md bg-secondary px-2 py-1 text-[10px] font-bold text-gold">
          استشارة مجانية
        </span>
        <h1 className="text-heading text-primary" id="services-heading">
          الخدمات
        </h1>
        <p className="text-body-premium text-muted-foreground">
          اختر الخدمة التي تحتاجها، وسنجهز لك رسالة استفسار مباشرة.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2.5" aria-label="اختيار الخدمة">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = service.id === selectedService.id;

          return (
            <button
              aria-pressed={isSelected}
              className={`min-h-[132px] rounded-[20px] border p-3 text-right shadow-soft transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isSelected
                  ? "border-primary bg-[var(--success-soft)]"
                  : "border-border bg-white hover:border-gold/40"
              }`}
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
                  <Icon className="size-4.5" strokeWidth={1.7} />
                </div>
                {isSelected ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-3" strokeWidth={2} />
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-sm font-bold leading-relaxed text-primary">{service.title}</h2>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="space-y-3 rounded-[22px] border border-border bg-white p-4 shadow-soft">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-primary">{selectedService.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{selectedService.intro}</p>
        </div>
        <ul className="space-y-2">
          {selectedService.points.map((point) => (
            <li className="flex items-center gap-2 text-sm font-medium text-primary" key={point}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-emerald-700">
                <Check className="size-3" strokeWidth={2} />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-[22px] border border-border bg-white p-4 shadow-soft" aria-labelledby="consultation-heading">
        <h2 className="text-base font-bold text-primary" id="consultation-heading">
          ابدأ استشارتك
        </h2>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-muted-foreground">الاسم - اختياري</span>
          <input
            className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-primary outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
            onChange={(event) => setName(event.target.value)}
            placeholder="اكتب اسمك إن رغبت"
            type="text"
            value={name}
          />
        </label>

        <a
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={whatsappHref(primaryWhatsappNumber, preparedMessage)}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle className="size-4.5" strokeWidth={1.7} />
          الاستفسار الآن عبر واتساب
        </a>

        <details className="rounded-xl border border-border bg-secondary/70">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-bold text-primary [&::-webkit-details-marker]:hidden">
            <span>معاينة الرسالة</span>
            <FileText className="size-4 text-gold" strokeWidth={1.7} />
          </summary>
          <div className="border-t border-border p-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-primary">{preparedMessage}</p>
          </div>
        </details>

        <button
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-bold text-primary transition hover:bg-background"
          onClick={copyMessage}
          type="button"
        >
          <Copy className="size-4" strokeWidth={1.7} />
          {isCopied ? "تم النسخ" : "نسخ الرسالة"}
        </button>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" aria-label="مزايا التواصل">
        {["استشارة مجانية", "تواصل باللغة العربية", "متابعة حتى اكتمال الطلب"].map((item) => (
          <div className="rounded-2xl border border-border bg-secondary/70 p-3 text-center shadow-soft" key={item}>
            <p className="text-xs font-bold text-primary">{item}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2.5" aria-labelledby="office-info-heading">
        <h2 className="text-base font-bold text-primary" id="office-info-heading">
          معلومات المكتب
        </h2>

        <OfficeInfoCard
          icon={<Building2 className="size-4.5" strokeWidth={1.7} />}
          title="اسم المكتب"
          content="مكتب نسائم الخير"
          subtitle="خدمات العمرة والتأشيرات والحجوزات"
        />
        <OfficeInfoCard
          icon={<MapPin className="size-4.5" strokeWidth={1.7} />}
          title="عنوان المكتب"
          content="عدن - الشيخ عثمان - شارع عمر المختار"
          subtitle="بجانب مدرسة الحصاد الأهلية"
        />
        <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <IconTile>
              <Phone className="size-4.5" strokeWidth={1.7} />
            </IconTile>
            <div className="min-w-0 flex-1 space-y-3">
              <h3 className="text-sm font-bold text-primary">أرقام التواصل</h3>
              <ContactRow display="+967 77 436 0027" phone={primaryWhatsappNumber} />
              <ContactRow display="+967 77 438 3736" phone={secondaryWhatsappNumber} />
            </div>
          </div>
        </div>
        <OfficeInfoCard
          icon={<Clock className="size-4.5" strokeWidth={1.7} />}
          title="أوقات العمل"
          content="السبت إلى الخميس"
          subtitle="9:00 صباحا - 9:00 مساء"
        />
      </section>

      <section className="rounded-2xl border border-border bg-secondary/70 p-4 text-center shadow-soft">
        <h2 className="text-sm font-bold text-primary">مكتب نسائم الخير</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          خدمات العمرة والتأشيرات والحجوزات
        </p>
      </section>
    </main>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
      {children}
    </div>
  );
}

function OfficeInfoCard({
  icon,
  title,
  content,
  subtitle
}: {
  icon: ReactNode;
  title: string;
  content: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <IconTile>{icon}</IconTile>
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-bold text-primary">{title}</h3>
          <p className="text-sm font-semibold text-primary">{content}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ display, phone }: { display: string; phone: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background p-2.5">
      <span className="font-mono text-sm font-bold text-primary" dir="ltr">
        {display}
      </span>
      <div className="flex items-center gap-1.5">
        <a
          aria-label={`اتصال ${display}`}
          className="rounded-lg border border-border bg-white px-2 py-1 text-[11px] font-bold text-primary"
          href={`tel:+${phone}`}
        >
          اتصال
        </a>
        <a
          aria-label={`واتساب ${display}`}
          className="rounded-lg bg-[var(--success-soft)] px-2 py-1 text-[11px] font-bold text-emerald-700"
          href={whatsappHref(phone)}
          rel="noreferrer"
          target="_blank"
        >
          واتساب
        </a>
      </div>
    </div>
  );
}
