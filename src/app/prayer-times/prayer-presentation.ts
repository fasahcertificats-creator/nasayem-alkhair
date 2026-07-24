import {
  formatArabicInteger,
  getPrayerLocationLabel as getReliablePrayerLocationLabel
} from "@/lib/home-presentation";

export {
  formatArabicInteger as formatArabicNumber,
  formatArabicPrayerTime,
  formatArabicRemainingDuration,
  formatGregorianDate,
  formatHijriDate,
  formatHomeDateLine,
  getArabicDateParts,
  normalizeCityLabel
} from "@/lib/home-presentation";

export { getReliablePrayerLocationLabel };

export function getPrayerLocationLabel(
  location: { cityLabel?: unknown } | null
): string {
  return getReliablePrayerLocationLabel(location) ?? "تعذر تحديد اسم المدينة";
}

export function formatQuranSource(source: string) {
  const match = source.trim().match(/^(.+?)\s*-\s*(\d+)$/);

  if (!match) {
    return source;
  }

  const [, surah, verse] = match;
  return `سورة ${surah}، الآية ${formatArabicInteger(Number(verse))}`;
}
