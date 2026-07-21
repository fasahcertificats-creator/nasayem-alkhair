import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ReligiousContentKind = "quran" | "hadith" | "dua" | "explanation";

interface ReligiousTextProps {
  authenticity?: string;
  children: string;
  className?: string;
  kind: ReligiousContentKind;
  source?: string;
  sourceReference?: string;
  title?: ReactNode;
}

const quranPreludePatterns = ["أعوذ بالله من الشيطان الرجيم", "بسم الله الرحمن الرحيم"] as const;

const arabicMarksPattern = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

function normalizeArabicForMatch(value: string) {
  return value.replace(arabicMarksPattern, "");
}

function consumeMatchingPrelude(text: string, pattern: string) {
  const normalizedPattern = normalizeArabicForMatch(pattern);
  let normalizedCandidate = "";

  for (let index = 0; index < text.length; index += 1) {
    normalizedCandidate += normalizeArabicForMatch(text[index]);

    if (normalizedCandidate.length < normalizedPattern.length) {
      continue;
    }

    if (normalizedCandidate === normalizedPattern) {
      return {
        prelude: text.slice(0, index + 1).trim(),
        remainingText: text.slice(index + 1).trimStart()
      };
    }

    return null;
  }

  return null;
}

function splitQuranPrelude(text: string) {
  let remainingText = text.trimStart();
  const prelude: string[] = [];

  for (const pattern of quranPreludePatterns) {
    const match = consumeMatchingPrelude(remainingText, pattern);

    if (match) {
      prelude.push(match.prelude);
      remainingText = match.remainingText;
    }
  }

  return {
    prelude,
    verse: remainingText || text
  };
}

const authenticityDisplayLabels: Record<string, string> = {
  Quran: "قرآن",
  daif: "ضعيف",
  hasan: "حسن",
  sahih: "صحيح",
  weak: "ضعيف"
};

const localizedAuthenticityLabels = new Set(["قرآن", "صحيح", "حسن", "ضعيف"]);

function formatAuthenticityForDisplay(authenticity?: string) {
  const trimmedAuthenticity = authenticity?.trim();

  if (!trimmedAuthenticity) {
    return null;
  }

  if (Object.hasOwn(authenticityDisplayLabels, trimmedAuthenticity)) {
    return authenticityDisplayLabels[trimmedAuthenticity];
  }

  if (localizedAuthenticityLabels.has(trimmedAuthenticity)) {
    return trimmedAuthenticity;
  }

  return "يتطلب مراجعة علمية";
}

function isSafeExternalReference(sourceReference: string) {
  try {
    const url = new URL(sourceReference);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function SourceReference({
  label = "مرجع المصدر",
  sourceReference
}: {
  label?: string;
  sourceReference: string;
}) {
  if (isSafeExternalReference(sourceReference)) {
    return (
      <a
        className="text-gold hover:text-primary font-bold underline-offset-4 transition hover:underline"
        href={sourceReference}
        rel="noreferrer"
        target="_blank"
      >
        {label}
      </a>
    );
  }

  return <p>مرجع المصدر: {sourceReference}</p>;
}

function SourceMeta({
  authenticity,
  source,
  sourceReference
}: Pick<ReligiousTextProps, "authenticity" | "source" | "sourceReference">) {
  const sourceText = source?.trim();
  const sourceReferenceText = sourceReference?.trim();
  const authenticityLabel = formatAuthenticityForDisplay(authenticity);

  if (!sourceText && !sourceReferenceText && !authenticityLabel) {
    return null;
  }

  return (
    <div className="border-border/60 text-caption-premium text-muted-foreground space-y-1 border-t pt-3">
      {sourceText ? <p>المصدر: {sourceText}</p> : null}
      {sourceReferenceText ? (
        <SourceReference
          label={sourceText ? "رابط المرجع" : "مرجع المصدر"}
          sourceReference={sourceReferenceText}
        />
      ) : null}
      {authenticityLabel ? <p>الدرجة: {authenticityLabel}</p> : null}
    </div>
  );
}

export function ReligiousText({
  authenticity,
  children,
  className,
  kind,
  source,
  sourceReference,
  title
}: ReligiousTextProps) {
  if (kind === "quran") {
    const { prelude, verse } = splitQuranPrelude(children);

    return (
      <div
        className={cn(
          "border-gold/20 shadow-soft space-y-4 rounded-2xl border bg-[#fff8e8] p-4 text-center",
          className
        )}
      >
        {title ? <div className="text-primary text-sm font-bold">{title}</div> : null}
        {prelude.length > 0 ? (
          <div className="text-primary/85 space-y-3 text-center font-serif text-[18px] leading-loose">
            {prelude.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
        <p className="text-primary text-center font-serif text-[22px] leading-[2] font-bold whitespace-pre-line sm:text-[24px]">
          {verse}
        </p>
        <SourceMeta authenticity={authenticity} source={source} sourceReference={sourceReference} />
      </div>
    );
  }

  if (kind === "hadith") {
    return (
      <div
        className={cn(
          "space-y-3 rounded-2xl border border-emerald-700/10 bg-emerald-50/40 p-4",
          className
        )}
      >
        {title ? <h2 className="text-primary text-base font-bold">{title}</h2> : null}
        <p className="text-primary text-right text-[18px] leading-[1.9] font-semibold whitespace-pre-line sm:text-[20px]">
          {children}
        </p>
        <SourceMeta authenticity={authenticity} source={source} sourceReference={sourceReference} />
      </div>
    );
  }

  if (kind === "dua") {
    return (
      <div className={cn("space-y-3", className)}>
        {title ? <h2 className="text-primary text-base font-bold">{title}</h2> : null}
        <p className="text-primary text-right text-[17px] leading-[1.85] font-semibold whitespace-pre-line sm:text-[19px]">
          {children}
        </p>
        <SourceMeta authenticity={authenticity} source={source} sourceReference={sourceReference} />
      </div>
    );
  }

  return (
    <div className={cn("text-body-premium text-muted-foreground", className)}>
      {title ? <h2 className="text-primary mb-2 text-sm font-bold">{title}</h2> : null}
      <p className="text-right whitespace-pre-line">{children}</p>
    </div>
  );
}
