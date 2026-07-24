import generatedPrayerLocations from "./prayer-locations.generated.json";

export type PrayerLocationLevel = "city" | "district" | "governorate";

export interface PrayerCity {
  administrativeClass?: string;
  aliases?: readonly string[];
  cityName: string;
  coordinateSource?: string;
  countryCode: string;
  countryName: string;
  governorateCode?: string;
  governorateName?: string;
  id: string;
  latitude: number;
  level?: PrayerLocationLevel;
  longitude: number;
  officialCode?: string;
  parentLabel?: string;
  regionCode?: string;
  regionName?: string;
  timezone: string;
}

const LEGACY_PRAYER_CITIES: readonly PrayerCity[] = [
  { id: "ye-sanaa", cityName: "صنعاء", countryName: "اليمن", countryCode: "YE", latitude: 15.3694, longitude: 44.191, timezone: "Asia/Aden" },
  { id: "ye-aden", cityName: "عدن", countryName: "اليمن", countryCode: "YE", latitude: 12.7855, longitude: 45.0187, timezone: "Asia/Aden" },
  { id: "ye-taiz", cityName: "تعز", countryName: "اليمن", countryCode: "YE", latitude: 13.5789, longitude: 44.0219, timezone: "Asia/Aden" },
  { id: "ye-hodeidah", cityName: "الحديدة", countryName: "اليمن", countryCode: "YE", latitude: 14.7979, longitude: 42.9545, timezone: "Asia/Aden" },
  { id: "ye-mukalla", cityName: "المكلا", countryName: "اليمن", countryCode: "YE", latitude: 14.5425, longitude: 49.1242, timezone: "Asia/Aden" },
  { id: "ye-ibb", cityName: "إب", countryName: "اليمن", countryCode: "YE", latitude: 13.9667, longitude: 44.1833, timezone: "Asia/Aden" },
  { id: "ye-marib", cityName: "مأرب", countryName: "اليمن", countryCode: "YE", latitude: 15.4625, longitude: 45.325, timezone: "Asia/Aden" },
  { id: "sa-makkah", cityName: "مكة المكرمة", countryName: "السعودية", countryCode: "SA", latitude: 21.4225, longitude: 39.8262, timezone: "Asia/Riyadh" },
  { id: "sa-madinah", cityName: "المدينة المنورة", countryName: "السعودية", countryCode: "SA", latitude: 24.4672, longitude: 39.6111, timezone: "Asia/Riyadh" },
  { id: "sa-riyadh", cityName: "الرياض", countryName: "السعودية", countryCode: "SA", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh" },
  { id: "sa-jeddah", cityName: "جدة", countryName: "السعودية", countryCode: "SA", latitude: 21.4858, longitude: 39.1925, timezone: "Asia/Riyadh" },
  { id: "sa-dammam", cityName: "الدمام", countryName: "السعودية", countryCode: "SA", latitude: 26.4207, longitude: 50.0888, timezone: "Asia/Riyadh" },
  { id: "sa-abha", cityName: "أبها", countryName: "السعودية", countryCode: "SA", latitude: 18.2164, longitude: 42.5053, timezone: "Asia/Riyadh" },
  { id: "sa-tabuk", cityName: "تبوك", countryName: "السعودية", countryCode: "SA", latitude: 28.3838, longitude: 36.555, timezone: "Asia/Riyadh" },
  { id: "ae-abu-dhabi", cityName: "أبوظبي", countryName: "الإمارات", countryCode: "AE", latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai" },
  { id: "ae-dubai", cityName: "دبي", countryName: "الإمارات", countryCode: "AE", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai" },
  { id: "ae-sharjah", cityName: "الشارقة", countryName: "الإمارات", countryCode: "AE", latitude: 25.3463, longitude: 55.4209, timezone: "Asia/Dubai" },
  { id: "ae-al-ain", cityName: "العين", countryName: "الإمارات", countryCode: "AE", latitude: 24.1302, longitude: 55.8023, timezone: "Asia/Dubai" },
  { id: "om-muscat", cityName: "مسقط", countryName: "عُمان", countryCode: "OM", latitude: 23.588, longitude: 58.3829, timezone: "Asia/Muscat" },
  { id: "om-salalah", cityName: "صلالة", countryName: "عُمان", countryCode: "OM", latitude: 17.0194, longitude: 54.0897, timezone: "Asia/Muscat" },
  { id: "om-sohar", cityName: "صحار", countryName: "عُمان", countryCode: "OM", latitude: 24.3475, longitude: 56.7094, timezone: "Asia/Muscat" },
  { id: "om-nizwa", cityName: "نزوى", countryName: "عُمان", countryCode: "OM", latitude: 22.9333, longitude: 57.5333, timezone: "Asia/Muscat" },
  { id: "qa-doha", cityName: "الدوحة", countryName: "قطر", countryCode: "QA", latitude: 25.2854, longitude: 51.531, timezone: "Asia/Qatar" },
  { id: "kw-kuwait", cityName: "مدينة الكويت", countryName: "الكويت", countryCode: "KW", latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait" },
  { id: "bh-manama", cityName: "المنامة", countryName: "البحرين", countryCode: "BH", latitude: 26.2235, longitude: 50.5876, timezone: "Asia/Bahrain" },
  { id: "iq-baghdad", cityName: "بغداد", countryName: "العراق", countryCode: "IQ", latitude: 33.3152, longitude: 44.3661, timezone: "Asia/Baghdad" },
  { id: "iq-basra", cityName: "البصرة", countryName: "العراق", countryCode: "IQ", latitude: 30.5085, longitude: 47.7804, timezone: "Asia/Baghdad" },
  { id: "iq-mosul", cityName: "الموصل", countryName: "العراق", countryCode: "IQ", latitude: 36.3489, longitude: 43.1577, timezone: "Asia/Baghdad" },
  { id: "iq-erbil", cityName: "أربيل", countryName: "العراق", countryCode: "IQ", latitude: 36.1911, longitude: 44.0092, timezone: "Asia/Baghdad" },
  { id: "iq-najaf", cityName: "النجف", countryName: "العراق", countryCode: "IQ", latitude: 31.9892, longitude: 44.3291, timezone: "Asia/Baghdad" },
  { id: "jo-amman", cityName: "عمّان", countryName: "الأردن", countryCode: "JO", latitude: 31.9539, longitude: 35.9106, timezone: "Asia/Amman" },
  { id: "jo-zarqa", cityName: "الزرقاء", countryName: "الأردن", countryCode: "JO", latitude: 32.0728, longitude: 36.088, timezone: "Asia/Amman" },
  { id: "jo-irbid", cityName: "إربد", countryName: "الأردن", countryCode: "JO", latitude: 32.5568, longitude: 35.8469, timezone: "Asia/Amman" },
  { id: "eg-cairo", cityName: "القاهرة", countryName: "مصر", countryCode: "EG", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo" },
  { id: "eg-alexandria", cityName: "الإسكندرية", countryName: "مصر", countryCode: "EG", latitude: 31.2001, longitude: 29.9187, timezone: "Africa/Cairo" },
  { id: "eg-giza", cityName: "الجيزة", countryName: "مصر", countryCode: "EG", latitude: 30.0131, longitude: 31.2089, timezone: "Africa/Cairo" },
  { id: "eg-mansoura", cityName: "المنصورة", countryName: "مصر", countryCode: "EG", latitude: 31.0409, longitude: 31.3785, timezone: "Africa/Cairo" },
  { id: "eg-luxor", cityName: "الأقصر", countryName: "مصر", countryCode: "EG", latitude: 25.6872, longitude: 32.6396, timezone: "Africa/Cairo" },
  { id: "eg-aswan", cityName: "أسوان", countryName: "مصر", countryCode: "EG", latitude: 24.0889, longitude: 32.8998, timezone: "Africa/Cairo" },
  { id: "tr-istanbul", cityName: "إسطنبول", countryName: "تركيا", countryCode: "TR", latitude: 41.0082, longitude: 28.9784, timezone: "Europe/Istanbul" },
  { id: "tr-ankara", cityName: "أنقرة", countryName: "تركيا", countryCode: "TR", latitude: 39.9334, longitude: 32.8597, timezone: "Europe/Istanbul" },
  { id: "tr-izmir", cityName: "إزمير", countryName: "تركيا", countryCode: "TR", latitude: 38.4237, longitude: 27.1428, timezone: "Europe/Istanbul" },
  { id: "tr-bursa", cityName: "بورصة", countryName: "تركيا", countryCode: "TR", latitude: 40.195, longitude: 29.06, timezone: "Europe/Istanbul" },
  { id: "my-kuala-lumpur", cityName: "كوالالمبور", countryName: "ماليزيا", countryCode: "MY", latitude: 3.139, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur" },
  { id: "my-putrajaya", cityName: "بوتراجايا", countryName: "ماليزيا", countryCode: "MY", latitude: 2.9264, longitude: 101.6964, timezone: "Asia/Kuala_Lumpur" },
  { id: "my-penang", cityName: "جورج تاون", countryName: "ماليزيا", countryCode: "MY", latitude: 5.4141, longitude: 100.3288, timezone: "Asia/Kuala_Lumpur" },
  { id: "my-johor", cityName: "جوهور باهرو", countryName: "ماليزيا", countryCode: "MY", latitude: 1.4927, longitude: 103.7414, timezone: "Asia/Kuala_Lumpur" },
  { id: "cn-beijing", cityName: "بكين", countryName: "الصين", countryCode: "CN", latitude: 39.9042, longitude: 116.4074, timezone: "Asia/Shanghai" },
  { id: "cn-shanghai", cityName: "شنغهاي", countryName: "الصين", countryCode: "CN", latitude: 31.2304, longitude: 121.4737, timezone: "Asia/Shanghai" },
  { id: "cn-guangzhou", cityName: "قوانغتشو", countryName: "الصين", countryCode: "CN", latitude: 23.1291, longitude: 113.2644, timezone: "Asia/Shanghai" },
  { id: "cn-shenzhen", cityName: "شنتشن", countryName: "الصين", countryCode: "CN", latitude: 22.5431, longitude: 114.0579, timezone: "Asia/Shanghai" },
  { id: "cn-xian", cityName: "شيآن", countryName: "الصين", countryCode: "CN", latitude: 34.3416, longitude: 108.9398, timezone: "Asia/Shanghai" },
  { id: "cn-urumqi", cityName: "أورومتشي", countryName: "الصين", countryCode: "CN", latitude: 43.8256, longitude: 87.6168, timezone: "Asia/Shanghai" },
  { id: "ma-rabat", cityName: "الرباط", countryName: "المغرب", countryCode: "MA", latitude: 34.0209, longitude: -6.8416, timezone: "Africa/Casablanca" },
  { id: "ma-casablanca", cityName: "الدار البيضاء", countryName: "المغرب", countryCode: "MA", latitude: 33.5731, longitude: -7.5898, timezone: "Africa/Casablanca" },
  { id: "dz-algiers", cityName: "الجزائر", countryName: "الجزائر", countryCode: "DZ", latitude: 36.7538, longitude: 3.0588, timezone: "Africa/Algiers" },
  { id: "dz-oran", cityName: "وهران", countryName: "الجزائر", countryCode: "DZ", latitude: 35.6971, longitude: -0.6308, timezone: "Africa/Algiers" },
  { id: "tn-tunis", cityName: "تونس", countryName: "تونس", countryCode: "TN", latitude: 36.8065, longitude: 10.1815, timezone: "Africa/Tunis" },
  { id: "sd-khartoum", cityName: "الخرطوم", countryName: "السودان", countryCode: "SD", latitude: 15.5007, longitude: 32.5599, timezone: "Africa/Khartoum" },
  { id: "sy-damascus", cityName: "دمشق", countryName: "سوريا", countryCode: "SY", latitude: 33.5138, longitude: 36.2765, timezone: "Asia/Damascus" },
  { id: "lb-beirut", cityName: "بيروت", countryName: "لبنان", countryCode: "LB", latitude: 33.8938, longitude: 35.5018, timezone: "Asia/Beirut" },
  { id: "id-jakarta", cityName: "جاكرتا", countryName: "إندونيسيا", countryCode: "ID", latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta" },
  { id: "pk-karachi", cityName: "كراتشي", countryName: "باكستان", countryCode: "PK", latitude: 24.8607, longitude: 67.0011, timezone: "Asia/Karachi" },
  { id: "pk-lahore", cityName: "لاهور", countryName: "باكستان", countryCode: "PK", latitude: 31.5204, longitude: 74.3587, timezone: "Asia/Karachi" }
];

const primaryMarketLocations =
  generatedPrayerLocations.locations as readonly PrayerCity[];

export const PRAYER_CITIES: readonly PrayerCity[] = [
  ...primaryMarketLocations,
  ...LEGACY_PRAYER_CITIES.filter(
    (city) => city.countryCode !== "SA" && city.countryCode !== "YE"
  )
];

export const SAUDI_PRAYER_REGIONS = Object.values(
  primaryMarketLocations
    .filter((city) => city.countryCode === "SA" && city.regionCode && city.regionName)
    .reduce<Record<string, { code: string; name: string }>>((regions, city) => {
      regions[city.regionCode!] = {
        code: city.regionCode!,
        name: city.regionName!
      };
      return regions;
    }, {})
).sort((left, right) => left.code.localeCompare(right.code));

export function getPrayerGovernorates(
  countryCode: "SA" | "YE",
  regionCode?: string
): readonly PrayerCity[] {
  return primaryMarketLocations.filter(
    (city) =>
      city.countryCode === countryCode &&
      city.level === "governorate" &&
      (!regionCode || city.regionCode === regionCode)
  );
}

export function getYemenGovernorateChildren(
  governorateCode: string
): readonly PrayerCity[] {
  return primaryMarketLocations.filter(
    (city) =>
      city.countryCode === "YE" &&
      city.governorateCode === governorateCode &&
      city.level !== "governorate"
  );
}

export function normalizePrayerCitySearch(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLocaleLowerCase("ar")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const searchableCities = PRAYER_CITIES.map((city) => ({
  city,
  searchText: normalizePrayerCitySearch(
    [
      city.cityName,
      city.countryName,
      city.countryCode,
      city.regionName,
      city.governorateName,
      city.parentLabel,
      ...(city.aliases ?? [])
    ].filter(Boolean).join(" ")
  )
}));

export function searchPrayerCities(query: string): readonly PrayerCity[] {
  const normalizedQuery = normalizePrayerCitySearch(query);

  if (!normalizedQuery) {
    return PRAYER_CITIES;
  }

  const terms = normalizedQuery.split(" ").filter(Boolean);

  return searchableCities
    .filter(({ searchText }) => terms.every((term) => searchText.includes(term)))
    .map(({ city }) => city);
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceInKilometers(
  latitude: number,
  longitude: number,
  city: PrayerCity
) {
  const earthRadius = 6371;
  const latitudeDelta = toRadians(city.latitude - latitude);
  const longitudeDelta = toRadians(city.longitude - longitude);
  const originLatitude = toRadians(latitude);
  const cityLatitude = toRadians(city.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(cityLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function findNearestPrayerCity(
  latitude: number,
  longitude: number,
  countryCode?: string
): PrayerCity | null {
  const normalizedCountryCode = countryCode?.trim().toUpperCase();
  const candidates = normalizedCountryCode
    ? PRAYER_CITIES.filter((city) => city.countryCode === normalizedCountryCode)
    : PRAYER_CITIES;
  const nearest = candidates.reduce<{ city: PrayerCity; distance: number } | null>(
    (current, city) => {
      const distance = getDistanceInKilometers(latitude, longitude, city);

      return !current || distance < current.distance ? { city, distance } : current;
    },
    null
  );

  if (!nearest || (!normalizedCountryCode && nearest.distance > 250)) {
    return null;
  }

  return nearest.city;
}
