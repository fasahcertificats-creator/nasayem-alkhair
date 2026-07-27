import { ArrowRight, MessageCircle } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { IslamicPattern } from "@/design-system";

import { LEGAL_LAST_UPDATED } from "./legal-content";

export function LegalPage({
  children,
  description,
  title
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main
      className="w-full min-w-0 space-y-5 overflow-x-hidden px-4 pt-4 pb-8 text-right min-[390px]:px-5"
      dir="rtl"
    >
      <header className="border-border relative overflow-hidden rounded-[22px] border bg-[var(--nasayem-surface)] px-4 py-5 shadow-[var(--shadow-soft)]">
        <IslamicPattern
          className="-top-8 end-0"
          opacity={0.04}
          size="medium"
          tone="gold"
        />
        <div className="relative min-w-0 space-y-2">
          <Link
            className="text-primary focus-visible:ring-gold inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-xs font-bold focus-visible:ring-2 focus-visible:outline-none"
            href={"/more" as Route}
          >
            <ArrowRight aria-hidden="true" className="size-4" />
            العودة إلى المزيد
          </Link>
          <h1 className="text-primary text-[24px] leading-[1.6] font-extrabold break-words">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-[46rem] text-[14px] leading-7 break-words">
            {description}
          </p>
          <p className="text-muted-foreground text-[11px] font-semibold">
            آخر تحديث: {LEGAL_LAST_UPDATED}
          </p>
        </div>
      </header>

      <div className="space-y-4">{children}</div>

      <footer className="border-primary/10 bg-[var(--nasayem-green-050)] flex min-w-0 flex-col gap-3 rounded-[18px] border px-4 py-3 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
        <p className="text-primary min-w-0 text-xs leading-6 font-semibold">
          للاستفسار عن هذه الصفحة أو الإبلاغ عن ملاحظة، تواصل مع المكتب.
        </p>
        <Link
          className="bg-primary text-primary-foreground focus-visible:ring-gold inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold focus-visible:ring-2 focus-visible:outline-none"
          href={"/support" as Route}
        >
          <MessageCircle aria-hidden="true" className="size-4" />
          الدعم والتواصل
        </Link>
      </footer>
    </main>
  );
}

export function LegalSection({
  children,
  id,
  title
}: {
  children: ReactNode;
  id?: string;
  title: string;
}) {
  return (
    <section
      className="border-border min-w-0 space-y-2.5 rounded-[18px] border bg-white px-4 py-4 shadow-[var(--shadow-soft)]"
      id={id}
    >
      <h2 className="text-primary text-[17px] leading-7 font-bold break-words">
        {title}
      </h2>
      <div className="text-muted-foreground min-w-0 space-y-2 text-[13px] leading-7 break-words">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-1.5 pe-5 marker:text-[var(--nasayem-gold-500)]">
      {children}
    </ul>
  );
}

export function LegalNotice({ children }: { children: ReactNode }) {
  return (
    <div className="border-gold/30 bg-[var(--nasayem-gold-050)] text-primary rounded-xl border px-3 py-2.5 text-[12px] leading-6 font-semibold">
      {children}
    </div>
  );
}
