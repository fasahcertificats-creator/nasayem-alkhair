const hijriDateFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-ca-islamic-umalqura-nu-arab",
  {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }
);

const gregorianDateFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-ca-gregory-nu-arab",
  {
    day: "numeric",
    month: "long",
    year: "numeric"
  }
);

const homeGreetingBoundaries = [5, 12, 17, 21] as const;
const arabicIntegerFormatter = new Intl.NumberFormat("ar-SA-u-nu-arab", {
  maximumFractionDigits: 0
});
const arabicPluralRules = new Intl.PluralRules("ar");
const arabicPrayerTimeFormatter = new Intl.DateTimeFormat("ar-SA-u-nu-arab", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});

const invalidCityLabelPattern =
  /^(?:unknown|undefined|null|near\b.*|غير معروف|مدينة غير معروفة|حسب موقعك الحالي|موقعك الحالي|تم تحديد الموقع|تعذر تحديد (?:اسم )?المدينة)$/i;
const coordinateLabelPattern =
  /(?:coordinates?|latitude|longitude|lat(?:itude)?\s*[:=]|lon(?:gitude)?\s*[:=]|[-+]?\d{1,3}(?:\.\d+)?\s*[,،]\s*[-+]?\d{1,3}(?:\.\d+)?)/i;

export function formatHijriDate(date: Date): string {
  return hijriDateFormatter.format(date);
}

export function formatGregorianDate(date: Date): string {
  return `${gregorianDateFormatter.format(date)} م`;
}

export function getArabicDateParts(date = new Date()) {
  return {
    gregorian: formatGregorianDate(date),
    hijri: formatHijriDate(date)
  };
}

export function formatHomeDateLine(date: Date): string {
  const { gregorian, hijri } = getArabicDateParts(date);

  return `${hijri} • ${gregorian}`;
}

export function formatArabicInteger(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;

  return arabicIntegerFormatter.format(safeValue);
}

export function parseSafeTasbihCount(value: unknown, maximum = 999999): number {
  if (
    !Number.isSafeInteger(value) ||
    typeof value !== "number" ||
    value < 0 ||
    !Number.isSafeInteger(maximum) ||
    maximum < 0
  ) {
    return 0;
  }

  return Math.min(value, maximum);
}

export function parseSafeTasbihTotal(value: unknown, maximum = 999999): number {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return 0;
  }

  return Object.values(value).reduce(
    (total, count) =>
      Math.min(maximum, total + parseSafeTasbihCount(count, maximum)),
    0
  );
}

export function formatArabicPrayerTime(date: Date): string {
  return arabicPrayerTimeFormatter.format(date).replace(/\s+/g, " ").trim();
}

function formatArabicDurationUnit(value: number, unit: "hour" | "minute"): string {
  const forms =
    unit === "hour"
      ? {
          zero: "ساعة",
          one: "ساعة واحدة",
          two: "ساعتان",
          few: "ساعات",
          many: "ساعة",
          other: "ساعة"
        }
      : {
          zero: "دقيقة",
          one: "دقيقة واحدة",
          two: "دقيقتان",
          few: "دقائق",
          many: "دقيقة",
          other: "دقيقة"
        };
  const pluralCategory = arabicPluralRules.select(value);

  if (pluralCategory === "one" || pluralCategory === "two") {
    return forms[pluralCategory];
  }

  return `${formatArabicInteger(value)} ${forms[pluralCategory]}`;
}

export function formatArabicRemainingDuration(durationMs: number): string {
  const safeDurationMs = Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0;
  const totalMinutes = Math.ceil(safeDurationMs / 60000);

  if (totalMinutes < 1) {
    return "متبقي أقل من دقيقة";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourLabel = hours > 0 ? formatArabicDurationUnit(hours, "hour") : "";
  const minuteLabel = minutes > 0 ? formatArabicDurationUnit(minutes, "minute") : "";

  if (!hourLabel) {
    return `متبقي ${minuteLabel}`;
  }

  if (!minuteLabel) {
    return `متبقي ${hourLabel}`;
  }

  return `متبقي ${hourLabel} و${minuteLabel}`;
}

export function normalizeCityLabel(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const compactLabel = value.trim().replace(/\s+/g, " ");

  if (
    !compactLabel ||
    compactLabel.length > 120 ||
    invalidCityLabelPattern.test(compactLabel) ||
    coordinateLabelPattern.test(compactLabel)
  ) {
    return null;
  }

  const [cityPart] = compactLabel.split(/\s*(?:،|,|\||—|–)\s*/, 1);
  const cityLabel = cityPart?.trim();

  if (!cityLabel || invalidCityLabelPattern.test(cityLabel) || coordinateLabelPattern.test(cityLabel)) {
    return null;
  }

  return cityLabel;
}

export function getPrayerLocationLabel(
  location: { cityLabel?: unknown } | null
): string | null {
  return normalizeCityLabel(location?.cityLabel);
}

export function getHomeGreeting(date: Date): string {
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return "صباح الخير، جعل الله يومك عامرا بذكره وطاعته.";
  }

  if (hours >= 12 && hours < 17) {
    return "نسأل الله أن يبارك لك فيما بقي من يومك.";
  }

  if (hours >= 17 && hours < 21) {
    return "مساء طيب، لا تنس وردك من الذكر والدعاء.";
  }

  return "اختم يومك بذكر الله، فالقلوب تطمئن بذكره.";
}

export function getMillisecondsUntilNextHomeRefresh(date: Date): number {
  const candidates = homeGreetingBoundaries
    .map((hours) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours))
    .filter((candidate) => candidate.getTime() > date.getTime());
  const nextMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const nextRefresh = Math.min(
    nextMidnight.getTime(),
    ...candidates.map((candidate) => candidate.getTime())
  );

  return Math.max(1000, nextRefresh - date.getTime() + 250);
}
