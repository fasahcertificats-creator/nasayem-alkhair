"use client";

import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
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

import { IslamicPattern, SectionHeading } from "@/design-system";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    <main
      className="w-full max-w-full min-w-0 space-y-6 px-4 pt-4 pb-4 text-right min-[390px]:px-5"
      dir="rtl"
    >
      <div className="space-y-3">
        <OfficeIdentityHero />
        <OfficePrimaryActions />
      </div>

      <section className="min-w-0 space-y-3" aria-labelledby="available-services-heading">
        <SectionHeading
          id="available-services-heading"
          supportingText="اختر الخدمة المناسبة لعرض التفاصيل وتجهيز رسالة الاستشارة."
          title="الخدمات المتاحة"
        />
        <div
          className="grid w-full min-w-0 auto-rows-fr grid-cols-2 gap-2.5"
          aria-label="اختيار الخدمة"
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

      <ConsultationComposer
        copyState={copyState}
        isPreviewOpen={isPreviewOpen}
        message={preparedMessage}
        name={name}
        onCopy={copyMessage}
        onNameChange={setName}
        onPreviewToggle={() => setIsPreviewOpen((current) => !current)}
        service={selectedService}
      />

      <OfficeServicePrinciples />
      <OfficeInformationPanel />
      <OfficeSignature />
    </main>
  );
}

function OfficeIdentityHero() {
  return (
    <section
      aria-labelledby="services-heading"
      className="border-border relative min-w-0 overflow-hidden rounded-[26px] border bg-[var(--nasayem-surface)] px-4 py-5 shadow-[var(--shadow-card)] min-[390px]:px-5"
    >
      <IslamicPattern
        className="-start-7 end-auto -top-7"
        opacity={0.075}
        size="large"
        tone="gold"
      />
      <div className="relative min-w-0 space-y-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <p className="text-primary min-w-0 flex-1 text-[11px] leading-5 font-bold">
            مكتب نسائم الخير للسفريات والسياحة
          </p>
          <span className="border-gold/25 inline-flex shrink-0 items-center gap-1.5 rounded-full border bg-[var(--nasayem-gold-050)] px-2.5 py-1 text-[10px] font-bold text-[#87672e]">
            <Check aria-hidden="true" className="size-3" strokeWidth={2} />
            استشارة مجانية
          </span>
        </div>
        <div className="min-w-0 space-y-2">
          <h1
            className="text-primary max-w-[22rem] text-[1.55rem] leading-[1.45] font-extrabold"
            id="services-heading"
          >
            خدمات السفر والعمرة
          </h1>
          <p className="max-w-[28rem] text-sm leading-7 text-[#756757]">
            اختر الخدمة التي تحتاجها، وسنجهز لك رسالة استفسار مباشرة.
          </p>
        </div>
        <div aria-hidden="true" className="flex items-center gap-2 pt-0.5">
          <span className="bg-gold h-px w-8" />
          <span className="bg-gold/35 h-px w-14" />
        </div>
      </div>
    </section>
  );
}

function OfficePrimaryActions() {
  return (
    <div
      className="grid min-w-0 grid-cols-1 gap-2 min-[400px]:grid-cols-[1.3fr_.9fr]"
      aria-label="التواصل المباشر مع المكتب"
    >
      <a
        aria-label="استشارة عبر واتساب مع مكتب نسائم الخير"
        className="bg-primary text-primary-foreground focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-[52px] min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={whatsappHref(primaryWhatsappNumber)}
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.7} />
        استشارة عبر واتساب
      </a>
      <a
        aria-label="الاتصال بمكتب نسائم الخير"
        className="border-border text-primary focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl border bg-[var(--nasayem-surface)] px-3 py-3 text-sm font-bold transition-colors hover:border-[var(--nasayem-border-strong)] hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={`tel:+${primaryWhatsappNumber}`}
      >
        <Phone aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
        اتصال بالمكتب
      </a>
    </div>
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
      aria-pressed={isSelected}
      className={`focus-visible:ring-gold focus-visible:ring-offset-background flex h-full min-h-[176px] w-full min-w-0 flex-col rounded-[21px] border p-3.5 text-right shadow-[var(--shadow-soft)] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        isSelected
          ? "border-primary bg-[var(--nasayem-green-050)]"
          : "border-border bg-[var(--nasayem-surface)] hover:border-[var(--nasayem-gold-200)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex w-full min-w-0 items-center justify-between gap-2">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-[14px] ${isSelected ? "bg-primary text-white" : "bg-[var(--nasayem-gold-050)] text-[#87672e]"}`}
        >
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
        </span>
        {isSelected ? (
          <span className="text-primary inline-flex min-h-6 min-w-0 items-center gap-1 rounded-full bg-white/80 px-2 text-[10px] font-bold">
            <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.2} />
            <span>مختارة</span>
          </span>
        ) : null}
      </span>
      <span className="mt-3 flex min-w-0 flex-1 flex-col">
        <span className="text-primary block min-w-0 text-[13px] leading-[1.75] font-bold break-words min-[390px]:text-sm">
          {service.title}
        </span>
        <span className="mt-1.5 block min-w-0 text-[11px] leading-[1.75] break-words text-[#756757] min-[390px]:text-xs">
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
      className="border-primary/15 relative min-w-0 overflow-hidden rounded-[24px] border bg-[var(--nasayem-green-050)] p-4 min-[390px]:p-5"
    >
      <IslamicPattern
        className="-start-8 end-auto top-auto -bottom-8"
        opacity={0.05}
        size="large"
      />
      <div className="relative min-w-0">
        <div className="flex min-w-0 items-start gap-3">
          <IconTile tone="green">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </IconTile>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[11px] font-bold text-[#87672e]">الخدمة المختارة</p>
            <h2
              className="text-primary text-lg leading-8 font-bold break-words"
              id="selected-service-heading"
            >
              {service.title}
            </h2>
            <p className="text-sm leading-7 break-words text-[#756757]">{service.intro}</p>
          </div>
        </div>
        <ul className="border-primary/10 mt-4 min-w-0 space-y-2.5 border-t pt-4">
          {service.points.map((point) => (
            <li
              className="text-primary flex min-w-0 items-start gap-2.5 text-sm leading-6 font-medium"
              key={point}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[var(--nasayem-green-700)]">
                <Check aria-hidden="true" className="size-3" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1 break-words">{point}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-6 text-[#756757]">جهّز رسالة الاستشارة أدناه.</p>
      </div>
    </section>
  );
}

function ConsultationComposer({
  copyState,
  isPreviewOpen,
  message,
  name,
  onCopy,
  onNameChange,
  onPreviewToggle,
  service
}: {
  copyState: "idle" | "success" | "error";
  isPreviewOpen: boolean;
  message: string;
  name: string;
  onCopy: () => void;
  onNameChange: (name: string) => void;
  onPreviewToggle: () => void;
  service: Service;
}) {
  return (
    <section
      aria-labelledby="consultation-heading"
      className="border-border min-w-0 space-y-4 rounded-[24px] border bg-[var(--nasayem-surface)] p-4 shadow-[var(--shadow-card)] min-[390px]:p-5"
    >
      <SectionHeading
        id="consultation-heading"
        supportingText="سنجهز الرسالة بالخدمة المختارة، ويمكنك إضافة اسمك إن رغبت."
        title="ابدأ استشارتك"
      />

      <div className="border-border bg-secondary/65 flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2.5">
        <IconTile className="size-9 rounded-xl" tone="gold">
          <FileText aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-[#756757]">الخدمة المختارة</p>
          <p className="text-primary mt-0.5 text-sm leading-6 font-bold break-words">
            {service.title}
          </p>
        </div>
      </div>

      <div className="min-w-0 space-y-1.5">
        <label className="text-primary block text-xs font-bold" htmlFor="consultation-name">
          الاسم — اختياري
        </label>
        <input
          className="border-border bg-background text-primary focus:border-primary focus:ring-primary/15 min-h-12 w-full max-w-full rounded-[14px] border px-3.5 py-2.5 text-sm font-medium transition outline-none placeholder:text-[#756757] focus:ring-3"
          dir="rtl"
          id="consultation-name"
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="اكتب اسمك إن رغبت"
          type="text"
          value={name}
        />
      </div>

      <a
        aria-label={`الاستفسار الآن عبر واتساب عن ${service.title}`}
        className="bg-primary text-primary-foreground focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-[52px] w-full min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-bold transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href={whatsappHref(primaryWhatsappNumber, message)}
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.7} />
        الاستفسار الآن عبر واتساب
      </a>

      <div className="grid min-w-0 grid-cols-2 gap-2">
        <button
          aria-controls="consultation-message-preview"
          aria-expanded={isPreviewOpen}
          className="border-border bg-secondary/70 text-primary hover:bg-secondary focus-visible:ring-gold flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={onPreviewToggle}
          type="button"
        >
          <FileText aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.7} />
          <span className="min-w-0">معاينة الرسالة</span>
          <ChevronDown
            aria-hidden="true"
            className={`size-3.5 shrink-0 transition-transform ${isPreviewOpen ? "rotate-180" : ""}`}
            strokeWidth={1.7}
          />
        </button>
        <button
          className="border-border bg-secondary/70 text-primary hover:bg-secondary focus-visible:ring-gold flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={onCopy}
          type="button"
        >
          <Copy aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.7} />
          <span className="min-w-0">نسخ الرسالة</span>
        </button>
      </div>

      {isPreviewOpen ? (
        <div
          className="border-border bg-background min-w-0 rounded-2xl border p-3.5"
          id="consultation-message-preview"
        >
          <p
            className="text-primary max-w-full text-sm leading-7 break-words whitespace-pre-line"
            dir="rtl"
          >
            {message}
          </p>
        </div>
      ) : null}

      <p
        aria-live="polite"
        className="min-h-5 text-center text-xs leading-5 font-bold text-[#756757]"
        role="status"
      >
        {copyState === "success"
          ? "تم نسخ الرسالة"
          : copyState === "error"
            ? "تعذر النسخ تلقائيا. يمكنك نسخ الرسالة من المعاينة."
            : ""}
      </p>
    </section>
  );
}

function OfficeServicePrinciples() {
  return (
    <section aria-labelledby="service-principles-heading" className="min-w-0 space-y-3">
      <SectionHeading id="service-principles-heading" title="مبادئ خدمة المكتب" />
      <div className="border-border grid min-w-0 grid-cols-1 overflow-hidden rounded-[22px] border bg-[var(--nasayem-surface)] min-[430px]:grid-cols-3">
        {trustItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              className={`flex min-w-0 items-center gap-3 px-4 py-3.5 min-[430px]:flex-col min-[430px]:justify-center min-[430px]:gap-2 min-[430px]:px-2 min-[430px]:text-center ${
                index > 0
                  ? "border-border border-t min-[430px]:border-t-0 min-[430px]:border-r"
                  : ""
              }`}
              key={item.label}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--nasayem-gold-050)] text-[#87672e]">
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.7} />
              </span>
              <p className="text-primary min-w-0 text-xs leading-6 font-bold break-words">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function OfficeInformationPanel() {
  return (
    <section aria-labelledby="office-info-heading" className="min-w-0 space-y-3">
      <SectionHeading id="office-info-heading" title="معلومات المكتب" />
      <div className="border-border min-w-0 overflow-hidden rounded-[24px] border bg-[var(--nasayem-surface)] shadow-[var(--shadow-soft)]">
        <OfficeInformationRow
          icon={<Building2 aria-hidden="true" className="size-5" strokeWidth={1.7} />}
          label="اسم المكتب"
        >
          <p className="text-primary text-sm leading-7 font-bold break-words">
            مكتب نسائم الخير للسفريات والسياحة
          </p>
          <p className="mt-0.5 text-xs leading-6 break-words text-[#756757]">
            خدمات العمرة والتأشيرات والحجوزات
          </p>
        </OfficeInformationRow>

        <OfficeInformationRow
          icon={<MapPin aria-hidden="true" className="size-5" strokeWidth={1.7} />}
          label="عنوان المكتب"
        >
          <p className="text-primary text-sm leading-7 font-semibold break-words">
            عدن - الشيخ عثمان - شارع عمر المختار
          </p>
          <p className="mt-0.5 text-xs leading-6 break-words text-[#756757]">
            بجانب مدرسة الحصاد الأهلية
          </p>
        </OfficeInformationRow>

        <OfficeInformationRow
          icon={<Phone aria-hidden="true" className="size-5" strokeWidth={1.7} />}
          label="أرقام التواصل"
        >
          <div className="mt-2 min-w-0 space-y-2">
            <ContactNumberRow
              display="+967 77 436 0027"
              ordinal="الأول"
              phone={primaryWhatsappNumber}
            />
            <ContactNumberRow
              display="+967 77 438 3736"
              ordinal="الثاني"
              phone={secondaryWhatsappNumber}
            />
          </div>
        </OfficeInformationRow>

        <OfficeInformationRow
          icon={<Clock aria-hidden="true" className="size-5" strokeWidth={1.7} />}
          label="أوقات العمل"
          last
        >
          <p className="text-primary text-sm leading-7 font-bold">السبت إلى الخميس</p>
          <p className="mt-0.5 text-xs leading-6 text-[#756757]" dir="rtl">
            <span dir="ltr">9:00</span> صباحا - <span dir="ltr">9:00</span> مساء
          </p>
        </OfficeInformationRow>
      </div>
    </section>
  );
}

function OfficeInformationRow({
  children,
  icon,
  label,
  last = false
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
  last?: boolean;
}) {
  return (
    <div className={`flex min-w-0 items-start gap-3 p-4 ${last ? "" : "border-border border-b"}`}>
      <IconTile tone="gold">{icon}</IconTile>
      <div className="min-w-0 flex-1">
        <h3 className="text-[11px] leading-5 font-bold text-[#756757]">{label}</h3>
        <div className="mt-0.5 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function ContactNumberRow({
  display,
  ordinal,
  phone
}: {
  display: string;
  ordinal: "الأول" | "الثاني";
  phone: string;
}) {
  return (
    <div className="border-border bg-background flex min-w-0 flex-col gap-2 rounded-[14px] border p-2.5 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
      <span
        className="text-primary min-w-0 font-mono text-sm font-bold whitespace-nowrap"
        dir="ltr"
      >
        {display}
      </span>
      <span className="grid min-w-0 grid-cols-2 gap-1.5 min-[400px]:shrink-0">
        <a
          aria-label={`الاتصال بالرقم ${ordinal}`}
          className="border-border text-primary hover:bg-secondary focus-visible:ring-gold flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border bg-white px-2.5 text-[11px] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
          href={`tel:+${phone}`}
        >
          <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          اتصال
        </a>
        <a
          aria-label={`مراسلة الرقم ${ordinal} عبر واتساب`}
          className="text-primary border-primary/10 hover:border-primary/25 focus-visible:ring-gold flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border bg-[var(--nasayem-green-050)] px-2.5 text-[11px] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
          href={whatsappHref(phone)}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          واتساب
        </a>
      </span>
    </div>
  );
}

function OfficeSignature() {
  return (
    <section
      className="border-border relative min-w-0 overflow-hidden border-t py-5 text-center"
      aria-label="توقيع المكتب"
    >
      <IslamicPattern
        className="top-auto -bottom-9 left-1/2 -translate-x-1/2"
        opacity={0.035}
        size="medium"
        tone="gold"
      />
      <div className="relative min-w-0">
        <h2 className="text-primary text-sm font-bold">مكتب نسائم الخير</h2>
        <p className="mt-1 text-xs leading-6 break-words text-[#756757]">
          خدمات العمرة والتأشيرات والحجوزات
        </p>
      </div>
    </section>
  );
}

function IconTile({
  children,
  className = "",
  tone
}: {
  children: ReactNode;
  className?: string;
  tone: "gold" | "green";
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center rounded-[14px] ${
        tone === "green" ? "bg-primary text-white" : "bg-[var(--nasayem-gold-050)] text-[#87672e]"
      } ${className}`}
    >
      {children}
    </span>
  );
}
