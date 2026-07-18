"use client";

import Link from "next/link";
import { memo } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { AppButton, AppCard, spacing, typography } from "@/design-system";
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

function localizeDisplayText(text: string) {
  return text
    .replaceAll("Start", "البداية")
    .replaceAll("Safa", "الصفا")
    .replaceAll("Marwah", "المروة")
    .replaceAll("Finish", "النهاية")
    .replaceAll("→", "←");
}

function isReligiousReference(source: string) {
  return /القرآن|صحيح|سنن|البخاري|مسلم|أبو داود/.test(source);
}

function sectionRank(section: UmrahStageContentSection) {
  if (isReligiousReference(section.sourceReference)) {
    return 0;
  }

  if (/لا يثبت|لا يوجد|تنبيه/.test(section.titleAr + section.bodyAr)) {
    return 1;
  }

  return 2;
}

function getDisplayedSections(stage: UmrahStage) {
  const sections = (stage.contentSections ?? []).filter(
    (section) => section.verificationStatus === "approved" && section.bodyAr.trim().length > 0
  );

  if (stage.slug === "ihram") {
    return sections;
  }

  return [...sections].sort((first, second) => sectionRank(first) - sectionRank(second));
}

function StageSectionBody({ body }: { body: string }) {
  const lines = body
    .split(/\r?\n/)
    .map((line) => localizeDisplayText(line.trim()))
    .filter(Boolean);

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

function StageSectionCard({ section }: { section: UmrahStageContentSection }) {
  return (
    <AppCard className={`${spacing.inset.md} ${spacing.stack.sm}`}>
      <h2 className={`${typography.hierarchy.subheading} ${typography.tone.primary}`}>
        {section.titleAr}
      </h2>
      <StageSectionBody body={section.bodyAr} />
      {section.sourceReference.trim().length > 0 ? (
        <p className={`${typography.hierarchy.caption} ${typography.tone.muted}`}>
          المصدر: {localizeSourceReference(section.sourceReference)}
        </p>
      ) : null}
    </AppCard>
  );
}

function StageDetailContentComponent({ approvedDuas, stage }: StageDetailContentProps) {
  const sections = getDisplayedSections(stage);
  const intentionSection =
    stage.slug === "ihram"
      ? sections.find((section) => section.id === "ihram-intention-clarification")
      : undefined;
  const remainingSections =
    stage.slug === "ihram"
      ? sections.filter((section) => section.id !== "ihram-intention-clarification")
      : sections;

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
          <h1
            className={`${typography.hierarchy.heading} ${typography.tone.primary}`}
            id="stage-heading"
          >
            {stage.titleAr}
          </h1>
          <p className={`${typography.hierarchy.body} ${typography.tone.muted}`}>
            {stage.summary}
          </p>
        </div>
      </section>

      {intentionSection ? <StageSectionCard section={intentionSection} /> : null}

      {approvedDuas.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="الأذكار والأدعية الثابتة">
          {approvedDuas.map((dua) => (
            <DuaBlock dua={dua} key={dua.id} />
          ))}
        </section>
      ) : null}

      {remainingSections.length > 0 ? (
        <section className={spacing.stack.sm} aria-label="تفاصيل المرحلة">
          {remainingSections.map((section) => (
            <StageSectionCard key={section.id} section={section} />
          ))}
        </section>
      ) : null}
    </main>
  );
}

export const StageDetailContent = memo(StageDetailContentComponent);
