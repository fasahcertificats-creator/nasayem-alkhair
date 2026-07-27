import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { buildWhatsappUrl, OFFICE_DETAILS } from "./legal-content";

export function OfficeContactDetails({ whatsappMessage }: { whatsappMessage?: string }) {
  return (
    <div className="border-primary/10 bg-[var(--nasayem-green-050)] min-w-0 space-y-3 rounded-[16px] border p-3.5">
      <h3 className="text-primary text-sm leading-7 font-bold break-words">
        {OFFICE_DETAILS.name}
      </h3>

      <address className="text-muted-foreground flex min-w-0 items-start gap-2 text-xs leading-6 not-italic">
        <MapPin aria-hidden="true" className="text-gold mt-1 size-4 shrink-0" />
        <span className="min-w-0 break-words">
          {OFFICE_DETAILS.addressLine1}
          <br />
          {OFFICE_DETAILS.addressLine2}
        </span>
      </address>

      <div className="text-muted-foreground flex min-w-0 items-start gap-2 text-xs leading-6">
        <Clock aria-hidden="true" className="text-gold mt-1 size-4 shrink-0" />
        <span>
          {OFFICE_DETAILS.workingDays}
          <br />
          {OFFICE_DETAILS.workingHours}
        </span>
      </div>

      <div className="grid min-w-0 gap-2 min-[360px]:grid-cols-2">
        <PhoneActions
          display={OFFICE_DETAILS.primaryPhoneDisplay}
          phone={OFFICE_DETAILS.primaryPhone}
          whatsappMessage={whatsappMessage}
        />
        <PhoneActions
          display={OFFICE_DETAILS.secondaryPhoneDisplay}
          phone={OFFICE_DETAILS.secondaryPhone}
          whatsappMessage={whatsappMessage}
        />
      </div>
    </div>
  );
}

function PhoneActions({
  display,
  phone,
  whatsappMessage
}: {
  display: string;
  phone: string;
  whatsappMessage?: string;
}) {
  return (
    <div className="border-border min-w-0 space-y-2 rounded-xl border bg-white p-2.5">
      <bdi
        className="text-primary block whitespace-nowrap text-center text-[13px] font-bold tabular-nums"
        dir="ltr"
      >
        {display}
      </bdi>
      <div className="grid grid-cols-2 gap-1.5 max-[279px]:grid-cols-1">
        <a
          aria-label={`الاتصال بالمكتب على الرقم ${display}`}
          className="border-primary/15 text-primary focus-visible:ring-gold inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-bold focus-visible:ring-2 focus-visible:outline-none"
          href={`tel:+${phone}`}
        >
          <Phone aria-hidden="true" className="size-3.5" />
          اتصال
        </a>
        <a
          aria-label={`مراسلة المكتب عبر واتساب على الرقم ${display}`}
          className="bg-primary text-primary-foreground focus-visible:ring-gold inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-bold focus-visible:ring-2 focus-visible:outline-none"
          href={buildWhatsappUrl(phone, whatsappMessage)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden="true" className="size-3.5" />
          واتساب
        </a>
      </div>
    </div>
  );
}
