"use client";

import {
  BriefcaseBusiness,
  Building2,
  Check,
  Clock,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  UsersRound
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import {
  buildTelephoneUrl,
  buildWhatsappUrl,
  OFFICE_DETAILS
} from "@/components/legal/legal-content";
import { IslamicPattern, SectionHeading } from "@/design-system";

type ServiceId = "umrah" | "family-visit" | "work-visa" | "transport";

type Service = {
  id: ServiceId;
  title: string;
  description: string;
  intro: string;
  points: string[];
  icon: typeof Plane;
};

const primaryWhatsappNumber = OFFICE_DETAILS.primaryPhone;
const secondaryWhatsappNumber = OFFICE_DETAILS.secondaryPhone;

const services: Service[] = [
  {
    id: "umrah",
    title: "برامج العمرة",
    description: "اختيار البرنامج وترتيب السكن والتنقل.",
    intro: "نساعدك في اختيار برنامج مناسب وترتيب تفاصيل الرحلة.",
    points: ["اختيار البرنامج المناسب", "تنسيق السكن والتنقل", "متابعة تفاصيل الرحلة"],
    icon: Plane
  },
  {
    id: "family-visit",
    title: "تأشيرات الزيارة العائلية",
    description: "توضيح المتطلبات ومتابعة تجهيز الطلب.",
    intro: "نوضح لك المتطلبات الأساسية ونساعدك في تجهيز الطلب.",
    points: ["توضيح المتطلبات الأساسية", "مراجعة البيانات قبل التقديم", "متابعة تجهيز الطلب"],
    icon: UsersRound
  },
  {
    id: "work-visa",
    title: "تأشيرات العمل",
    description: "مراجعة المتطلبات ومتابعة إجراءات التأشيرة.",
    intro: "نراجع المتطلبات ونوضح المستندات المطلوبة قبل المتابعة.",
    points: ["مراجعة متطلبات التأشيرة", "توضيح المستندات المطلوبة", "متابعة إجراءات الطلب"],
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
    icon: Plane
  }
];

const trustItems = [
  { label: "استشارة مجانية", icon: Check },
  { label: "وضوح المتطلبات", icon: FileText },
  { label: "متابعة حتى اكتمال الطلب", icon: Clock }
] as const;

function buildMessage(service: Service) {
  return `السلام عليكم، أود الاستفسار عن خدمة ${service.title}.`;
}

export default function ServicesPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>("umrah");
  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[0];

  return (
    <main
      className="w-full max-w-full min-w-0 space-y-5 px-4 pt-4 pb-8 text-right min-[390px]:px-5"
      dir="rtl"
    >
      <OfficeIdentityHero />

      <section className="min-w-0 space-y-3" aria-labelledby="available-services-heading">
        <SectionHeading
          id="available-services-heading"
          supportingText="اختر الخدمة المناسبة لعرض التفاصيل وتجهيز رسالة الاستشارة."
          title="الخدمات المتاحة"
        />
        <div
          aria-label="اختيار الخدمة"
          className="grid w-full min-w-0 grid-cols-1 gap-2.5 min-[330px]:grid-cols-2"
        >
          {services.map((service) => (
            <ServiceSelectorCard
              isSelected={service.id === selectedService.id}
              key={service.id}
              onSelect={() => setSelectedServiceId(service.id)}
              service={service}
            />
          ))}
        </div>
      </section>

      <SelectedServiceOverview service={selectedService} />
      <ConsultationCard service={selectedService} />
      <OfficeInformationPanel />
    </main>
  );
}

function OfficeIdentityHero() {
  return (
    <section
      aria-labelledby="services-heading"
      className="border-border relative min-w-0 overflow-hidden rounded-[24px] border bg-[var(--nasayem-surface)] px-4 py-4 text-center shadow-[var(--shadow-soft)] min-[390px]:px-5"
    >
      <IslamicPattern
        className="-start-5 end-auto -top-6"
        opacity={0.055}
        size="medium"
        tone="gold"
      />
      <div className="relative mx-auto max-w-[29rem] min-w-0 space-y-1.5">
        <p className="text-primary text-[13px] leading-6 font-semibold">
          مكتب نسائم الخير للسفريات والسياحة
        </p>
        <h1
          className="text-primary text-[1.65rem] leading-[1.4] font-extrabold"
          id="services-heading"
        >
          الخدمات
        </h1>
        <p className="text-[13px] leading-6 text-[#756757]">
          اختر الخدمة المناسبة وسنتابع معك تفاصيل الطلب.
        </p>
      </div>
    </section>
  );
}

function ServiceSelectorCard({
  isSelected,
  onSelect,
  service
}: {
  isSelected: boolean;
  onSelect: () => void;
  service: Service;
}) {
  const Icon = service.icon;

  return (
    <button
      aria-label={`${service.title}${isSelected ? "، الخدمة المختارة" : ""}`}
      aria-pressed={isSelected}
      className={`focus-visible:ring-gold focus-visible:ring-offset-background flex h-full min-h-[146px] w-full min-w-0 flex-col rounded-[19px] border p-3 text-right shadow-[var(--shadow-soft)] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        isSelected
          ? "border-primary bg-[var(--nasayem-green-050)]"
          : "border-border bg-[var(--nasayem-surface)] hover:border-[var(--nasayem-gold-200)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex w-full min-w-0 items-center justify-between gap-2">
        <span
          aria-hidden="true"
          className={`flex size-9 shrink-0 items-center justify-center rounded-[12px] ${
            isSelected
              ? "bg-primary text-white"
              : "bg-[var(--nasayem-gold-050)] text-[#87672e]"
          }`}
        >
          <Icon className="size-4.5" strokeWidth={1.7} />
        </span>
        {isSelected ? (
          <span className="text-primary inline-flex min-h-6 min-w-0 items-center gap-1 rounded-full bg-white/80 px-2 text-[10px] font-bold">
            <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.2} />
            <span>مختارة</span>
          </span>
        ) : null}
      </span>
      <span className="mt-2.5 flex min-w-0 flex-1 flex-col">
        <span className="text-primary block min-w-0 text-[12px] leading-[1.7] font-bold break-words min-[390px]:text-[13px]">
          {service.title}
        </span>
        <span className="mt-1 line-clamp-2 block min-w-0 text-[10px] leading-[1.7] break-words text-[#756757] min-[390px]:text-[11px]">
          {service.description}
        </span>
      </span>
    </button>
  );
}

function SelectedServiceOverview({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <section
      aria-labelledby="selected-service-heading"
      className="border-primary/15 relative min-w-0 overflow-hidden rounded-[22px] border bg-[var(--nasayem-green-050)] p-4"
    >
      <IslamicPattern
        className="-start-8 end-auto top-auto -bottom-8"
        opacity={0.045}
        size="large"
      />
      <div className="relative min-w-0">
        <div className="flex min-w-0 items-start gap-3">
          <IconTile tone="green">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </IconTile>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[11px] font-bold text-[#87672e]">الخدمة المختارة</p>
            <h2
              className="text-primary text-[17px] leading-7 font-bold break-words"
              id="selected-service-heading"
            >
              {service.title}
            </h2>
            <p className="text-[13px] leading-6 break-words text-[#756757]">{service.intro}</p>
          </div>
        </div>
        <ul className="border-primary/10 mt-3 min-w-0 space-y-2 border-t pt-3">
          {service.points.map((point) => (
            <li
              className="text-primary flex min-w-0 items-start gap-2 text-[13px] leading-6 font-medium"
              key={point}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[var(--nasayem-green-700)]">
                <Check aria-hidden="true" className="size-3" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1 break-words">{point}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-6 text-[#756757]">
          انتقل إلى الاستشارة لإرسال استفسارك عن هذه الخدمة.
        </p>
      </div>
    </section>
  );
}

function ConsultationCard({ service }: { service: Service }) {
  const message = buildMessage(service);

  return (
    <section
      aria-labelledby="consultation-heading"
      className="border-border min-w-0 space-y-3 rounded-[22px] border bg-[var(--nasayem-surface)] p-4 shadow-[var(--shadow-soft)]"
    >
      <SectionHeading
        id="consultation-heading"
        supportingText="سنفتح واتساب برسالة جاهزة عن الخدمة المختارة."
        title="ابدأ استشارتك"
      />
      <p className="border-border bg-secondary/55 text-primary min-w-0 rounded-xl border px-3 py-2 text-[12px] leading-6 font-semibold break-words">
        <span className="text-[#756757]">الخدمة المختارة: </span>
        {service.title}
      </p>
      <a
        aria-label={`الاستفسار عبر واتساب عن ${service.title}`}
        className="bg-primary text-primary-foreground focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-[15px] px-4 py-2.5 text-center text-sm font-bold transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={buildWhatsappUrl(primaryWhatsappNumber, message)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.7} />
        الاستفسار عبر واتساب
      </a>
    </section>
  );
}

function OfficeInformationPanel() {
  return (
    <section aria-labelledby="office-info-heading" className="min-w-0 space-y-3">
      <SectionHeading id="office-info-heading" title="معلومات المكتب" />
      <article className="border-gold/25 relative min-w-0 overflow-hidden rounded-[24px] border bg-[var(--nasayem-green-050)] p-4 shadow-[var(--shadow-card)]">
        <IslamicPattern
          className="-top-7 end-0"
          opacity={0.045}
          size="medium"
          tone="gold"
        />

        <header className="relative flex min-w-0 items-start gap-3 pb-4">
          <span
            aria-hidden="true"
            className="bg-primary flex size-11 shrink-0 items-center justify-center rounded-[15px] text-white"
          >
            <Building2 className="size-5.5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-primary text-[15px] leading-7 font-extrabold break-words">
              مكتب نسائم الخير للسفريات والسياحة
            </h3>
            <p className="mt-0.5 text-xs leading-6 break-words text-[#756757]">
              خدمات العمرة والتأشيرات والحجوزات
            </p>
          </div>
        </header>

        <div className="border-primary/10 relative divide-y divide-primary/10 border-y">
          <address className="flex min-w-0 items-start gap-3 py-3.5 not-italic max-[279px]:flex-col">
            <OfficeGroupIcon>
              <MapPin aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
            </OfficeGroupIcon>
            <div className="min-w-0 flex-1">
              <h3 className="text-[11px] leading-5 font-bold text-[#756757]">
                عنوان المكتب
              </h3>
              <p className="text-primary mt-0.5 text-[13px] leading-6 font-bold break-words">
                عدن - الشيخ عثمان - شارع عمر المختار
              </p>
              <p className="text-[12px] leading-6 break-words text-[#756757]">
                بجانب مدرسة الحصاد الأهلية
              </p>
            </div>
          </address>

          <section
            className="flex min-w-0 items-start gap-3 py-3.5 max-[279px]:flex-col"
            aria-labelledby="contact-heading"
          >
            <OfficeGroupIcon>
              <Phone aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
            </OfficeGroupIcon>
            <div className="min-w-0 flex-1">
              <h3 className="text-[11px] leading-5 font-bold text-[#756757]" id="contact-heading">
                أرقام التواصل
              </h3>
              <div className="mt-1.5 min-w-0 divide-y divide-primary/10">
                <ContactNumberRow
                  display="+967 77 436 0027"
                  phone={primaryWhatsappNumber}
                />
                <ContactNumberRow
                  display="+967 77 438 3736"
                  phone={secondaryWhatsappNumber}
                />
              </div>
            </div>
          </section>

          <section
            className="flex min-w-0 items-start gap-3 py-3.5 max-[279px]:flex-col"
            aria-labelledby="hours-heading"
          >
            <OfficeGroupIcon>
              <Clock aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
            </OfficeGroupIcon>
            <div className="min-w-0 flex-1">
              <h3 className="text-[11px] leading-5 font-bold text-[#756757]" id="hours-heading">
                أوقات العمل
              </h3>
              <p className="text-primary mt-0.5 text-[13px] leading-6 font-bold">
                السبت إلى الخميس
              </p>
              <p className="text-[12px] leading-6 text-[#756757]" dir="rtl">
                <span dir="ltr">9:00</span> صباحًا - <span dir="ltr">9:00</span> مساءً
              </p>
            </div>
          </section>
        </div>

        <ul
          aria-label="مبادئ خدمة المكتب"
          className="relative grid min-w-0 grid-cols-1 pt-3 min-[340px]:grid-cols-3"
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <li
                className={`flex min-w-0 items-center gap-2 py-1.5 min-[340px]:flex-col min-[340px]:px-1.5 min-[340px]:text-center ${
                  index > 0
                    ? "border-primary/10 border-t min-[340px]:border-t-0 min-[340px]:border-r"
                    : ""
                }`}
                key={item.label}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/80 text-[#87672e]">
                  <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                </span>
                <span className="text-primary min-w-0 text-[10px] leading-5 font-bold break-words">
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}

function ContactNumberRow({
  display,
  phone
}: {
  display: string;
  phone: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 py-2 max-[279px]:flex-col max-[279px]:items-stretch">
      <bdi
        className="text-primary shrink-0 whitespace-nowrap text-[13px] font-bold tabular-nums [unicode-bidi:isolate]"
        dir="ltr"
      >
        {display}
      </bdi>
      <span className="grid min-w-0 grid-cols-2 gap-1.5 max-[279px]:w-full max-[279px]:grid-cols-1 min-[280px]:shrink-0">
        <a
          aria-label={`الاتصال على الرقم ${display}`}
          className="border-primary/15 text-primary hover:bg-white focus-visible:ring-gold flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border bg-white/65 px-2 text-[11px] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
          href={buildTelephoneUrl(phone)}
        >
          <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          اتصال
        </a>
        <a
          aria-label={`مراسلة الرقم ${display} عبر واتساب`}
          className="border-primary/10 text-primary hover:border-primary/25 focus-visible:ring-gold flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border bg-white/65 px-2 text-[11px] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
          href={buildWhatsappUrl(phone)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          واتساب
        </a>
      </span>
    </div>
  );
}

function OfficeGroupIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-[11px] bg-[var(--nasayem-gold-050)] text-[#87672e]"
    >
      {children}
    </span>
  );
}

function IconTile({
  children,
  tone
}: {
  children: ReactNode;
  tone: "gold" | "green";
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center rounded-[14px] ${
        tone === "green"
          ? "bg-primary text-white"
          : "bg-[var(--nasayem-gold-050)] text-[#87672e]"
      }`}
    >
      {children}
    </span>
  );
}
