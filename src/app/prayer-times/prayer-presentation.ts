import type { PrayerLocation } from "@/services/prayer/prayer-times.service";

const locationFallbackLabel = "تم تحديد الموقع";

export function normalizeCityLabel(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const compactLabel = value.trim().replace(/\s+/g, " ");

  if (!compactLabel || compactLabel.length > 120) {
    return null;
  }

  const [cityPart] = compactLabel.split(/\s*(?:،|,|\||—|–)\s*/, 1);
  const cityLabel = cityPart?.trim();

  if (!cityLabel || /^(?:unknown|غير معروف|مدينة غير معروفة)$/i.test(cityLabel)) {
    return null;
  }

  return cityLabel;
}

export function getPrayerLocationLabel(location: PrayerLocation | null): string {
  return normalizeCityLabel(location?.cityLabel) ?? locationFallbackLabel;
}

export function getArabicDateParts(date = new Date()) {
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
  const gregorian = new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);

  return { gregorian, hijri };
}

export function formatArabicNumber(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

export function formatQuranSource(source: string) {
  const match = source.trim().match(/^(.+?)\s*-\s*(\d+)$/);

  if (!match) {
    return source;
  }

  const [, surah, verse] = match;
  return `سورة ${surah}، الآية ${formatArabicNumber(Number(verse))}`;
}
