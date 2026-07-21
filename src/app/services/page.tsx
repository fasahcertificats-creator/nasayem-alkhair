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

import { PageHeading } from "@/design-system";

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
    points: ["توضيح المتطلبات الأساسية", "مراجعة البيانات قبل التقديم", "متابعة تجهيز الطلب"],
    message:
      "السلام عليكم، أرغب في الاستفسار عن تأشيرة الزيارة العائلية، والمتطلبات والإجراءات اللازمة.",
    icon: UsersRound
  },
  {
    id: "work-visa",
    title: "تأشيرات العمل",
    description: "مراجعة المتطلبات ومتابعة إجراءات التأشيرة.",
    intro: "نراجع المتطلبات ونوضح المستندات المطلوبة قبل المتابعة.",
    points: ["مراجعة متطلبات التأشيرة", "توضيح المستندات المطلوبة", "متابعة إجراءات الطلب"],
    message: "السلام عليكم، أرغب في الاستفسار عن تأشيرات العمل، والمتطلبات والإجراءات المتاحة.",
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

const trustItems = [
  { label: "استشارة مجانية", icon: Check },
  { label: "وضوح المتطلبات", icon: FileText },
  { label: "متابعة حتى اكتمال الطلب", icon: Clock }
] as const;

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
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[0];
  const preparedMessage = useMemo(
    () => buildMessage(selectedService, name),
    [name, selectedService]
  );

  async function copyMessage() {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(preparedMessage);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = preparedMessage;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error("copy-failed");
        }
      }

      setCopyState("success");
    } catch {
      setCopyState("error");
    } finally {
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  return (
    <main className="space-y-4 px-5 pt-5 pb-12 text-right" dir="rtl">
      <section className="space-y-2" aria-labelledby="services-heading">
        <span className="bg-secondary text-gold inline-flex w-fit rounded-md px-2 py-1 text-[10px] font-bold">
          استشارة مجانية
        </span>
        <PageHeading id="services-heading">الخدمات</PageHeading>
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
              className={`shadow-soft focus-visible:ring-gold focus-visible:ring-offset-background min-h-[132px] rounded-[20px] border p-3 text-right transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                isSelected
                  ? "border-primary bg-[var(--success-soft)]"
                  : "border-border hover:border-gold/40 bg-white"
              }`}
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="bg-secondary text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-4.5" strokeWidth={1.7} />
                </div>
                {isSelected ? (
                  <span className="bg-primary flex size-5 shrink-0 items-center justify-center rounded-full text-white">
                    <Check className="size-3" strokeWidth={2} />
                  </span>
                ) : null}
              </div>
              <h2 className="text-primary mt-3 text-sm leading-relaxed font-bold">
                {service.title}
              </h2>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                {service.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="border-border shadow-soft space-y-3 rounded-[22px] border bg-white p-4">
        <div className="space-y-1">
          <h2 className="text-primary text-base font-bold">{selectedService.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{selectedService.intro}</p>
        </div>
        <ul className="space-y-2">
          {selectedService.points.map((point) => (
            <li className="text-primary flex items-center gap-2 text-sm font-medium" key={point}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-emerald-700">
                <Check className="size-3" strokeWidth={2} />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="border-border shadow-soft space-y-3 rounded-[22px] border bg-white p-4"
        aria-labelledby="consultation-heading"
      >
        <h2 className="text-primary text-base font-bold" id="consultation-heading">
          ابدأ استشارتك
        </h2>
        <label className="block space-y-1.5">
          <span className="text-muted-foreground text-xs font-bold">الاسم - اختياري</span>
          <input
            className="border-border bg-background text-primary focus:border-gold focus:ring-gold/20 min-h-11 w-full rounded-xl border px-3 py-2 text-sm font-medium transition outline-none focus:ring-2"
            onChange={(event) => setName(event.target.value)}
            placeholder="اكتب اسمك إن رغبت"
            type="text"
            value={name}
          />
        </label>

        <a
          className="bg-primary hover:bg-primary/95 focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          href={whatsappHref(primaryWhatsappNumber, preparedMessage)}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle className="size-4.5" strokeWidth={1.7} />
          الاستفسار الآن عبر واتساب
        </a>

        <details className="border-border bg-secondary/70 rounded-xl border">
          <summary className="text-primary flex min-h-11 cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-bold [&::-webkit-details-marker]:hidden">
            <span>معاينة الرسالة</span>
            <FileText className="text-gold size-4" strokeWidth={1.7} />
          </summary>
          <div className="border-border border-t p-3">
            <p className="text-primary text-sm leading-relaxed whitespace-pre-line">
              {preparedMessage}
            </p>
          </div>
        </details>

        <button
          className="border-border bg-secondary text-primary hover:bg-background flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition"
          onClick={copyMessage}
          type="button"
        >
          <Copy className="size-4" strokeWidth={1.7} />
          {copyState === "success" ? "تم النسخ" : "نسخ الرسالة"}
        </button>
        {copyState === "error" ? (
          <p className="text-muted-foreground text-center text-xs font-bold">
            تعذر النسخ تلقائيا. يمكنك نسخ الرسالة من المعاينة.
          </p>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" aria-label="مزايا التواصل">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="border-border bg-secondary/70 shadow-soft flex items-center justify-center gap-2 rounded-2xl border p-3 text-center"
              key={item.label}
            >
              <Icon className="text-gold size-3.5" strokeWidth={1.7} />
              <p className="text-primary text-xs font-bold">{item.label}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-2.5" aria-labelledby="office-info-heading">
        <h2 className="text-primary text-base font-bold" id="office-info-heading">
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
        <div className="border-border shadow-soft rounded-2xl border bg-white p-4">
          <div className="flex items-start gap-3">
            <IconTile>
              <Phone className="size-4.5" strokeWidth={1.7} />
            </IconTile>
            <div className="min-w-0 flex-1 space-y-3">
              <h3 className="text-primary text-sm font-bold">أرقام التواصل</h3>
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

      <section className="border-border bg-secondary/70 shadow-soft rounded-2xl border p-4 text-center">
        <h2 className="text-primary text-sm font-bold">مكتب نسائم الخير</h2>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          خدمات العمرة والتأشيرات والحجوزات
        </p>
      </section>
    </main>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <div className="bg-secondary text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
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
    <div className="border-border shadow-soft rounded-2xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <IconTile>{icon}</IconTile>
        <div className="min-w-0 space-y-1">
          <h3 className="text-primary text-sm font-bold">{title}</h3>
          <p className="text-primary text-sm font-semibold">{content}</p>
          <p className="text-muted-foreground text-xs leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ display, phone }: { display: string; phone: string }) {
  return (
    <div className="border-border bg-background flex flex-wrap items-center justify-between gap-2 rounded-xl border p-2.5">
      <span className="text-primary font-mono text-sm font-bold whitespace-nowrap" dir="ltr">
        {display}
      </span>
      <div className="flex items-center gap-1.5">
        <a
          aria-label={`اتصال ${display}`}
          className="border-border text-primary rounded-lg border bg-white px-2 py-1 text-[11px] font-bold"
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
