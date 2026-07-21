"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppButton, AppCard, PageHeading, spacing, typography } from "@/design-system";
import type { Dua, UmrahStage, UmrahStageContentSection } from "@/types";

import { DuaBlock } from "../DuaBlock";

interface StageDetailContentProps {
  approvedDuas: Dua[];
  stage: UmrahStage;
}

function localizeSourceReference(source: string) {
  return source
    .replaceAll("Sahih Muslim", "صحيح مسلم")
    .replaceAll("Sahih al-Bukhari", "صحيح البخاري")
    .replaceAll("Sunan Abi Dawud", "سنن أبي داود");
}

function isReligiousReference(source: string) {
  return /القرآن|صحيح|سنن|البخاري|مسلم|أبي داود/.test(source);
}

function getDisplayedSections(stage: UmrahStage) {
  return (stage.contentSections ?? []).filter(
    (section) => section.verificationStatus === "approved" && section.bodyAr.trim().length > 0
  );
}

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
      <ul className={`${spacing.stack.xs} list-disc pr-5`}>
        {lines.map((line) => (
          <li className={`${typography.hierarchy.body} ${typography.tone.muted}`} key={line}>
            {line.slice(2)}
          </li>
        ))}
      </ul>
    );
  }

  if (lines.length > 1 && lines.every((line) => /^\d+\.\s/.test(line))) {
    return (
      <ol className={`${spacing.stack.xs} list-decimal pr-5`}>
        {lines.map((line) => (
          <li className={`${typography.hierarchy.body} ${typography.tone.muted}`} key={line}>
            {line.replace(/^\d+\.\s/, "")}
          </li>
        ))}
      </ol>
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

function SectionReference({ source }: { source: string }) {
  const trimmedSource = source.trim();

  if (!trimmedSource) {
    return null;
  }

  const label = isReligiousReference(trimmedSource) ? "المصدر" : "التصنيف";

  return (
    <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
      {label}: {localizeSourceReference(trimmedSource)}
    </p>
  );
}

function PrimarySectionCard({ section }: { section: UmrahStageContentSection }) {
  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {section.titleAr}
      </h2>
      <StageSectionBody body={section.bodyAr} />
      <SectionReference source={section.sourceReference} />
    </AppCard>
  );
}

function DisclosureSectionCard({ section }: { section: UmrahStageContentSection }) {
  return (
    <details className="group border-border shadow-soft open:shadow-card rounded-lg border bg-white transition duration-200">
      <summary className="text-primary focus-visible:ring-gold focus-visible:ring-offset-background flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        <span className="text-base leading-relaxed font-bold">{section.titleAr}</span>
        <ChevronDown
          aria-hidden="true"
          className="text-gold size-4 shrink-0 transition duration-200 group-open:rotate-180"
        />
      </summary>
      <div className={`${spacing.stack.sm} border-border border-t px-4 pt-3 pb-4`}>
        <StageSectionBody body={section.bodyAr} />
        <SectionReference source={section.sourceReference} />
      </div>
    </details>
  );
}

function getPrimarySections(
  approvedDuas: Dua[],
  sections: UmrahStageContentSection[],
  stage: UmrahStage
) {
  if (stage.slug === "ihram") {
    return sections.filter((section) => section.id === "ihram-intention-clarification");
  }

  if (approvedDuas.length === 0 && sections.length > 0) {
    return [sections[0]];
  }

  return [];
}

function StageDetailContentComponent({ approvedDuas, stage }: StageDetailContentProps) {
  const sections = getDisplayedSections(stage);
  const primarySections = getPrimarySections(approvedDuas, sections, stage);
  const primarySectionIds = new Set(primarySections.map((section) => section.id));
  const disclosureSections = sections.filter((section) => !primarySectionIds.has(section.id));

  return (
    <main
      className={`${spacing.inset.sm} ${spacing.stack.md} ${typography.fontFamily.arabic} ${typography.direction.arabic} pb-24`}
      dir="rtl"
    >
      <section className={spacing.stack.sm} aria-labelledby="stage-heading">
        <AppButton asChild tone="ghost">
          <Link href={ROUTES.umrah}>العودة إلى دليل العمرة</Link>
        </AppButton>
        <div className={spacing.stack.xs}>
          <PageHeading id="stage-heading">{stage.titleAr}</PageHeading>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>{stage.summary}</p>
        </div>
      </section>

      {primarySections.map((section) => (
        <PrimarySectionCard key={section.id} section={section} />
      ))}

      {approvedDuas.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="الأذكار والأدعية الثابتة">
          {approvedDuas.map((dua) => (
            <DuaBlock dua={dua} key={dua.id} />
          ))}
        </section>
      ) : null}

      {disclosureSections.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="تفاصيل المرحلة">
          {disclosureSections.map((section) => (
            <DisclosureSectionCard key={section.id} section={section} />
          ))}
        </section>
      ) : null}
    </main>
  );
}

export const StageDetailContent = memo(StageDetailContentComponent);
