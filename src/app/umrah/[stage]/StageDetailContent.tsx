"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { memo, useId, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import {
  AppButton,
  AppCard,
  IslamicPattern,
  PageHeading,
  ReligiousText,
  spacing,
  typography
} from "@/design-system";
import type { Dua, UmrahDuaItem, UmrahStage, UmrahStageContentSection } from "@/types";

import { UmrahRoundCompanion } from "@/components/umrah/UmrahRoundCompanion";
import { DuaBlock } from "../DuaBlock";
import { UmrahSourceMeta } from "../UmrahSourceMeta";

interface StageDetailContentProps {
  approvedDuas: Dua[];
  companionDuas: UmrahDuaItem[];
  stage: UmrahStage;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function splitBodyLines(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function StageSectionBody({ body }: { body: string }) {
  const lines = splitBodyLines(body);

  if (lines.length > 1 && lines.every((line) => line.startsWith("- "))) {
    return (
      <ul className={`${spacing.stack.xs} list-none space-y-2`}>
        {lines.map((line) => (
          <li className="text-muted-foreground flex gap-2 text-[14px] leading-relaxed" key={line}>
            <span aria-hidden="true" className="bg-gold mt-2 size-1.5 shrink-0 rounded-full" />
            <span>{line.slice(2)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={spacing.stack.xs}>
      {lines.map((line) => (
        <p className={`${typography.hierarchy.body} ${typography.tone.muted}`} key={line}>
          {line}
        </p>
      ))}
    </div>
  );
}

function SectionCard({ section }: { section: UmrahStageContentSection }) {
  if (section.kind === "quran") {
    return (
      <AppCard className={`${spacing.inset.md} ${spacing.stack.sm} border-gold/25 bg-[#fff8e8]`}>
        <ReligiousText
          kind="quran"
          showSourceMeta={false}
          title={section.titleAr}
        >
          {section.bodyAr}
        </ReligiousText>
        <UmrahSourceMeta displayReferenceAr={section.displayReferenceAr} />
      </AppCard>
    );
  }

  const isCaution = section.kind === "caution" || /تنبيه|لا /.test(section.titleAr);

  return (
    <AppCard
      className={`${spacing.inset.md} ${spacing.stack.sm} ${
        isCaution ? "border-gold/30 bg-[#fff8e8]/70" : "bg-secondary/65"
      }`}
    >
      <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {section.titleAr}
      </h2>
      <StageSectionBody body={section.bodyAr} />
      <UmrahSourceMeta displayReferenceAr={section.displayReferenceAr} />
    </AppCard>
  );
}

function DisclosureSectionCard({ section }: { section: UmrahStageContentSection }) {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-border shadow-card rounded-[var(--radius-card)] border bg-card">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="text-primary focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-right focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="text-[15px] leading-relaxed font-bold">{section.titleAr}</span>
        <ChevronDown
          aria-hidden="true"
          className={`text-gold size-4 shrink-0 transition duration-200 motion-reduce:transition-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`${spacing.stack.sm} border-border border-t px-4 pt-3 pb-4`}
        hidden={!isOpen}
        id={panelId}
      >
        <StageSectionBody body={section.bodyAr} />
        <UmrahSourceMeta displayReferenceAr={section.displayReferenceAr} />
      </div>
    </div>
  );
}

function getDisplayedSections(stage: UmrahStage) {
  return (stage.contentSections ?? []).filter(
    (section) => section.verificationStatus === "approved" && section.bodyAr.trim().length > 0
  );
}

function StageDetailContentComponent({
  approvedDuas,
  companionDuas,
  stage
}: StageDetailContentProps) {
  const sections = getDisplayedSections(stage);
  const disclosureSections = sections.filter((section) => /ماذا أفعل/.test(section.titleAr));
  const regularSections = sections.filter((section) => !disclosureSections.includes(section));

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic} pb-28`}
      dir="rtl"
    >
      <section
        className={`${spacing.stack.sm} relative min-w-0 overflow-hidden rounded-[var(--radius-card)]`}
        aria-labelledby="stage-heading"
      >
        <IslamicPattern className="-top-6 end-1" opacity={0.035} size="medium" tone="gold" variant="header" />
        <AppButton asChild tone="ghost">
          <Link href={ROUTES.umrah}>العودة إلى دليل العمرة</Link>
        </AppButton>
        <div className={spacing.stack.xs}>
          <p className="text-muted-foreground text-[12px] font-semibold">
            المرحلة {arabicNumberFormatter.format(stage.order)} من {arabicNumberFormatter.format(8)}
          </p>
          <PageHeading id="stage-heading">{stage.titleAr}</PageHeading>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>{stage.summary}</p>
        </div>
      </section>

      {regularSections.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="إرشادات المرحلة">
          {regularSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </section>
      ) : null}

      {approvedDuas.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="النصوص الثابتة في المرحلة">
          {approvedDuas.map((dua) => (
            <DuaBlock dua={dua} key={dua.id} />
          ))}
        </section>
      ) : null}

      {(stage.slug === "tawaf" || stage.slug === "sai") && companionDuas.length > 0 ? (
        <UmrahRoundCompanion context={stage.slug} duas={companionDuas} />
      ) : null}

      {disclosureSections.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="ماذا أفعل؟">
          {disclosureSections.map((section) => (
            <DisclosureSectionCard key={section.id} section={section} />
          ))}
        </section>
      ) : null}
    </main>
  );
}

export const StageDetailContent = memo(StageDetailContentComponent);
