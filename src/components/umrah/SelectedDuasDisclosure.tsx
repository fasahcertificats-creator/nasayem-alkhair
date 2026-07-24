"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { UMRAH_COMPANION_COPY } from "@/data/umrah-companion-copy";
import { ReligiousText } from "@/design-system";
import { cn } from "@/lib/utils";
import type { UmrahDuaItem } from "@/types";

interface SelectedDuasDisclosureProps {
  duas: UmrahDuaItem[];
}

function GeneralDuaCard({ dua }: { dua: UmrahDuaItem }) {
  const sourceId = useId();
  const classification = dua.sourceKind === "quran" ? "دعاء قرآني عام" : "دعاء نبوي عام";

  return (
    <article aria-describedby={sourceId} className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="border-gold/30 bg-[var(--nasayem-gold-050)] text-primary rounded-full border px-2.5 py-1 text-[11px] font-bold">
          {classification}
        </span>
        {dua.authenticityLabel ? (
          <span className="border-primary/15 bg-[var(--nasayem-green-050)] text-primary rounded-full border px-2.5 py-1 text-[11px] font-bold">
            {dua.authenticityLabel}
          </span>
        ) : null}
      </div>

      <ReligiousText
        className="shadow-none"
        kind={dua.sourceKind}
        showSourceMeta={false}
        title={dua.title}
      >
        {dua.text}
      </ReligiousText>

      <p
        className="border-border/70 text-muted-foreground border-t pt-2 text-[12px] leading-relaxed"
        id={sourceId}
      >
        <span className="font-semibold">{dua.sourceLabel}:</span> {dua.sourceReference}
      </p>
    </article>
  );
}

export function SelectedDuasDisclosure({ duas }: SelectedDuasDisclosureProps) {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="border-border rounded-[var(--radius-medium)] border bg-card">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-14 w-full items-center justify-between gap-3 rounded-[var(--radius-medium)] px-4 py-3 text-right focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="min-w-0 space-y-0.5">
          <span className="text-primary block text-sm leading-relaxed font-bold">
            {UMRAH_COMPANION_COPY.common.selectedDuasTitle}
          </span>
          <span className="text-muted-foreground block text-[12px] leading-relaxed">
            {UMRAH_COMPANION_COPY.common.selectedDuasSupport}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "text-gold size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className="border-border space-y-5 border-t px-4 pt-3 pb-4"
        hidden={!isOpen}
        id={panelId}
      >
        <p className="border-gold/25 bg-[var(--nasayem-gold-050)] text-primary rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed font-semibold">
          {UMRAH_COMPANION_COPY.common.generalDuaNotice}
        </p>
        <div className="divide-border space-y-5 divide-y">
          {duas.map((dua) => (
            <div className="pt-5 first:pt-0" key={dua.id}>
              <GeneralDuaCard dua={dua} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
