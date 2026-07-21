import type { ReligiousContentKind } from "./ReligiousText";

export interface AzkarSourceMetaProps {
  authenticity?: string;
  kind: ReligiousContentKind;
  source?: string;
  sourceReference?: string;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

const authenticityLabels: Record<string, string> = {
  hasan: "حسن",
  sahih: "صحيح",
  "hasan-li-ghayrihi": "حسن لغيره",
  "sahih-li-ghayrihi": "صحيح لغيره"
};

const omittedSourceValues = new Set([
  "",
  "unknown",
  "no source data",
  "not available",
  "unavailable",
  "غير معروف",
  "غير متوفر",
  "المصدر غير معروف"
]);

function formatArabicNumber(value: string) {
  return arabicNumberFormatter.format(Number(value));
}

function normalizeSource(source?: string) {
  const sourceText = source?.trim() ?? "";

  return omittedSourceValues.has(sourceText.toLowerCase()) ? "" : sourceText;
}

function formatQuranSource(source: string) {
  if (!source) {
    return "";
  }

  const sourceParts = source.split("-").map((part) => part.trim()).filter(Boolean);
  const referenceText =
    sourceParts.length >= 2 && /^\d+$/.test(sourceParts.at(-1) ?? "")
      ? `${sourceParts.at(-2)} ${sourceParts.at(-1)}`
      : sourceParts.at(-1) ?? source;
  const verseRangeMatch = /^(.+?)\s+(\d+)\s*[-–]\s*(\d+)$/.exec(referenceText);

  if (verseRangeMatch) {
    const [, surah, startVerse, endVerse] = verseRangeMatch;

    return `سورة ${surah.trim()}، الآيتان ${formatArabicNumber(startVerse)}–${formatArabicNumber(endVerse)}`;
  }

  const verseMatch = /^(.+?)\s+(\d+)$/.exec(referenceText);

  if (verseMatch) {
    const [, surah, verse] = verseMatch;

    return `سورة ${surah.trim()}، الآية ${formatArabicNumber(verse)}`;
  }

  return `سورة ${referenceText}`;
}

function getAuthenticityLabel(authenticity?: string) {
  if (!authenticity) {
    return "";
  }

  return authenticityLabels[authenticity.trim().toLowerCase()] ?? "";
}

export function AzkarSourceMeta({
  authenticity,
  kind,
  source
}: AzkarSourceMetaProps) {
  const sourceText = normalizeSource(source);
  const displayedSource = kind === "quran" ? formatQuranSource(sourceText) : sourceText;
  const authenticityLabel = kind === "quran" ? "" : getAuthenticityLabel(authenticity);

  if (!displayedSource && !authenticityLabel) {
    return null;
  }

  return (
    <div className="border-border/70 text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-t pt-3 text-[12px] leading-relaxed">
      {displayedSource ? <p className="min-w-0 flex-1">{displayedSource}</p> : null}
      {authenticityLabel ? (
        <span className="rounded-full border border-primary/15 bg-[var(--nasayem-green-050)] px-2 py-0.5 text-[11px] font-semibold text-primary">
          {authenticityLabel}
        </span>
      ) : null}
    </div>
  );
}
