import {
  CalculationMethod,
  Coordinates,
  PrayerTimes
} from "adhan";

import {
  findNearestPrayerCity,
  type PrayerCity
} from "@/data/prayer-cities";
import {
  formatArabicPrayerTime,
  formatArabicRemainingDuration,
  normalizeCityLabel
} from "@/lib/home-presentation";

export const PRAYER_LOCATION_STORAGE_KEY = "nasayem_prayer_location";

const LOCATION_STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000;
const REVERSE_GEOCODING_ENDPOINT = "https://nominatim.openstreetmap.org/reverse";

export type PrayerId = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerSelectionSource = "geolocation" | "manual";

export interface PrayerLocation {
  acquiredAt: number;
  cityLabel?: string;
  countryCode?: string;
  countryLabel?: string;
  latitude: number;
  longitude: number;
  selectionSource?: PrayerSelectionSource;
  timezone?: string;
  updatedAt?: number;
}

export interface PrayerTimeRow {
  id: PrayerId;
  name: string;
  time: Date;
  displayTime: string;
}

export interface PrayerCalculationResult {
  calculationDate: string;
  coordinates: PrayerLocation;
  currentPrayerId: PrayerId | null;
  dataFreshness: "fresh" | "stale";
  nextPrayer: PrayerTimeRow;
  remainingLabel: string;
  remainingMs: number;
  rows: PrayerTimeRow[];
  sunrise: PrayerTimeRow;
}

export type PrayerLocationRequestErrorReason =
  | "permission-denied"
  | "offline"
  | "unavailable"
  | "timeout";

export class PrayerLocationRequestError extends Error {
  constructor(public readonly reason: PrayerLocationRequestErrorReason) {
    super(reason);
    this.name = "PrayerLocationRequestError";
  }
}

const prayerNames: Record<PrayerId, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidTimestamp(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function normalizeCountryCode(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim().toUpperCase();

  return /^[A-Z]{2}$/.test(normalizedValue) ? normalizedValue : undefined;
}

function normalizeShortLabel(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim().replace(/\s+/g, " ");

  return normalizedValue && normalizedValue.length <= 120 ? normalizedValue : undefined;
}

export function isValidTimezone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim() || value.length > 80) {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function isValidLatitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -180 && value <= 180;
}

export function validatePrayerLocation(value: unknown): PrayerLocation | null {
  if (!isRecord(value)) {
    return null;
  }

  const legacyTimestamp = isValidTimestamp(value.acquiredAt) ? value.acquiredAt : null;
  const updatedAt = isValidTimestamp(value.updatedAt) ? value.updatedAt : legacyTimestamp;

  if (
    !isValidLatitude(value.latitude) ||
    !isValidLongitude(value.longitude) ||
    !updatedAt
  ) {
    return null;
  }

  const cityLabel = normalizeCityLabel(value.cityLabel) ?? undefined;
  const hasInvalidCityLabel =
    Object.prototype.hasOwnProperty.call(value, "cityLabel") &&
    value.cityLabel !== undefined &&
    value.cityLabel !== null &&
    !cityLabel;

  if (hasInvalidCityLabel) {
    return null;
  }

  const countryCode = normalizeCountryCode(value.countryCode);
  const countryLabel = normalizeShortLabel(value.countryLabel);
  const timezone = isValidTimezone(value.timezone) ? value.timezone : undefined;
  const selectionSource: PrayerSelectionSource =
    value.selectionSource === "manual" ? "manual" : "geolocation";

  return {
    acquiredAt: legacyTimestamp ?? updatedAt,
    latitude: value.latitude,
    longitude: value.longitude,
    selectionSource,
    updatedAt,
    ...(cityLabel ? { cityLabel } : {}),
    ...(countryCode ? { countryCode } : {}),
    ...(countryLabel ? { countryLabel } : {}),
    ...(timezone ? { timezone } : {})
  };
}

export function readStoredPrayerLocation(): PrayerLocation | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(PRAYER_LOCATION_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return validatePrayerLocation(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

export function savePrayerLocation(location: PrayerLocation): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PRAYER_LOCATION_STORAGE_KEY, JSON.stringify(location));
}

export function createManualPrayerLocation(city: PrayerCity): PrayerLocation {
  const updatedAt = Date.now();

  return {
    acquiredAt: updatedAt,
    cityLabel: city.cityName,
    countryCode: city.countryCode,
    countryLabel: city.countryName,
    latitude: city.latitude,
    longitude: city.longitude,
    selectionSource: "manual",
    timezone: city.timezone,
    updatedAt
  };
}

export function getLocalDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCalculationDate(now: Date, timezone?: string): Date {
  if (!timezone) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      day: "numeric",
      month: "numeric",
      timeZone: timezone,
      year: "numeric"
    }).formatToParts(now);
    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)])
    );

    if (values.year && values.month && values.day) {
      return new Date(values.year, values.month - 1, values.day);
    }
  } catch {
    // Fall back to the device-local calendar date.
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function buildRows(prayerTimes: PrayerTimes, timezone?: string): PrayerTimeRow[] {
  const rows: Array<Omit<PrayerTimeRow, "displayTime">> = [
    { id: "fajr", name: prayerNames.fajr, time: prayerTimes.fajr },
    { id: "sunrise", name: prayerNames.sunrise, time: prayerTimes.sunrise },
    { id: "dhuhr", name: prayerNames.dhuhr, time: prayerTimes.dhuhr },
    { id: "asr", name: prayerNames.asr, time: prayerTimes.asr },
    { id: "maghrib", name: prayerNames.maghrib, time: prayerTimes.maghrib },
    { id: "isha", name: prayerNames.isha, time: prayerTimes.isha }
  ];

  return rows.map((row) => ({
    ...row,
    displayTime: formatArabicPrayerTime(row.time, timezone)
  }));
}

export function calculatePrayerTimes(
  location: PrayerLocation,
  now = new Date()
): PrayerCalculationResult {
  const coordinates = new Coordinates(location.latitude, location.longitude);
  const parameters = CalculationMethod.MuslimWorldLeague();

  const today = getCalculationDate(now, location.timezone);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const todayTimes = new PrayerTimes(coordinates, today, parameters);
  const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, parameters);
  const rows = buildRows(todayTimes, location.timezone);
  const displayedRows = rows.filter((row) => row.id !== "sunrise");
  const tomorrowFajr = buildRows(tomorrowTimes, location.timezone).find(
    (row) => row.id === "fajr"
  );
  const nextPrayer =
    displayedRows.find((row) => row.time.getTime() > now.getTime()) ??
    tomorrowFajr ??
    displayedRows[0];
  const currentPrayerId =
    [...displayedRows]
      .reverse()
      .find((row) => row.time.getTime() <= now.getTime())?.id ?? null;
  const remainingMs = Math.max(0, nextPrayer.time.getTime() - now.getTime());

  return {
    calculationDate: getLocalDayKey(today),
    coordinates: location,
    currentPrayerId,
    dataFreshness:
      Date.now() - (location.updatedAt ?? location.acquiredAt) > LOCATION_STALE_AFTER_MS
        ? "stale"
        : "fresh",
    nextPrayer,
    remainingLabel: formatArabicRemainingDuration(remainingMs),
    remainingMs,
    rows,
    sunrise: rows.find((row) => row.id === "sunrise") ?? rows[0]
  };
}

export interface PrayerCoordinates {
  latitude: number;
  longitude: number;
}

interface ReverseGeocodingResult {
  cityLabel?: string;
  countryCode?: string;
  countryLabel?: string;
  timezone?: string;
}

function requestCurrentPosition(): Promise<PrayerCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new PrayerLocationRequestError("unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (
          !isValidLatitude(position.coords.latitude) ||
          !isValidLongitude(position.coords.longitude)
        ) {
          reject(new Error("invalid-coordinates"));
          return;
        }

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new PrayerLocationRequestError("permission-denied"));
          return;
        }

        if (error.code === error.TIMEOUT) {
          reject(new PrayerLocationRequestError("timeout"));
          return;
        }

        reject(new PrayerLocationRequestError("unavailable"));
      },
      {
        enableHighAccuracy: false,
        maximumAge: 10 * 60 * 1000,
        timeout: 15000
      }
    );
  });
}

async function reverseGeocodePrayerLocation(
  coordinates: PrayerCoordinates
): Promise<ReverseGeocodingResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  try {
    const url = new URL(REVERSE_GEOCODING_ENDPOINT);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(coordinates.latitude));
    url.searchParams.set("lon", String(coordinates.longitude));
    url.searchParams.set("zoom", "10");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "ar");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });

    if (!response.ok) {
      return {};
    }

    const payload = (await response.json()) as unknown;

    if (!isRecord(payload) || !isRecord(payload.address)) {
      return {};
    }

    const address = payload.address;
    const cityLabel =
      normalizeCityLabel(address.city) ??
      normalizeCityLabel(address.town) ??
      normalizeCityLabel(address.village) ??
      normalizeCityLabel(address.municipality) ??
      normalizeCityLabel(address.state_district) ??
      normalizeCityLabel(address.state) ??
      undefined;
    const countryCode = normalizeCountryCode(address.country_code);
    const countryLabel = normalizeShortLabel(address.country);
    const nearestCity = findNearestPrayerCity(
      coordinates.latitude,
      coordinates.longitude,
      countryCode
    );

    return {
      ...(cityLabel ? { cityLabel } : {}),
      ...(countryCode ? { countryCode } : {}),
      ...(countryLabel ? { countryLabel } : {}),
      ...(nearestCity ? { timezone: nearestCity.timezone } : {})
    };
  } catch {
    return {};
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function requestGeolocatedPrayerLocation(): Promise<PrayerLocation> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new PrayerLocationRequestError("offline");
  }

  const coordinates = await requestCurrentPosition();
  const resolvedLocation = await reverseGeocodePrayerLocation(coordinates);
  const updatedAt = Date.now();
  const location = validatePrayerLocation({
    ...coordinates,
    ...resolvedLocation,
    acquiredAt: updatedAt,
    selectionSource: "geolocation",
    updatedAt
  });

  if (!location) {
    throw new PrayerLocationRequestError("unavailable");
  }

  return location;
}
