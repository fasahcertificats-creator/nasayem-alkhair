import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";

export const PRAYER_LOCATION_STORAGE_KEY = "nasayem_prayer_location";
export const PRAYER_METHOD_LABEL = "رابطة العالم الإسلامي";
export const PRAYER_METHOD_DESCRIPTION = "طريقة الحساب: رابطة العالم الإسلامي";

const LOCATION_STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000;

export type PrayerId = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerLocation {
  latitude: number;
  longitude: number;
  acquiredAt: number;
  cityLabel?: string;
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
  dataFreshness: "fresh" | "stale";
  method: "MuslimWorldLeague";
  methodLabel: string;
  nextPrayer: PrayerTimeRow;
  remainingLabel: string;
  remainingMs: number;
  rows: PrayerTimeRow[];
  sunrise: PrayerTimeRow;
}

export type PrayerLocationRequestErrorReason =
  | "permission-denied"
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

  if (
    !isValidLatitude(value.latitude) ||
    !isValidLongitude(value.longitude) ||
    typeof value.acquiredAt !== "number" ||
    !Number.isFinite(value.acquiredAt) ||
    value.acquiredAt <= 0
  ) {
    return null;
  }

  const cityLabel =
    typeof value.cityLabel === "string" && value.cityLabel.trim()
      ? value.cityLabel.trim().slice(0, 120)
      : undefined;

  return {
    latitude: value.latitude,
    longitude: value.longitude,
    acquiredAt: value.acquiredAt,
    ...(cityLabel ? { cityLabel } : {})
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

export function getLocalDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatPrayerTime(date: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatRemainingDuration(durationMs: number): string {
  const safeDurationMs = Math.max(0, durationMs);
  const totalMinutes = Math.ceil(safeDurationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `متبق ${minutes} دقيقة`;
  }

  if (minutes === 0) {
    return `متبق ${hours} ساعة`;
  }

  return `متبق ${hours} ساعة و ${minutes} دقيقة`;
}

function buildRows(prayerTimes: PrayerTimes): PrayerTimeRow[] {
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
    displayTime: formatPrayerTime(row.time)
  }));
}

export function calculatePrayerTimes(
  location: PrayerLocation,
  now = new Date()
): PrayerCalculationResult {
  const coordinates = new Coordinates(location.latitude, location.longitude);
  const parameters = CalculationMethod.MuslimWorldLeague();
  parameters.madhab = Madhab.Shafi;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const todayTimes = new PrayerTimes(coordinates, today, parameters);
  const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, parameters);
  const rows = buildRows(todayTimes);
  const displayedRows = rows.filter((row) => row.id !== "sunrise");
  const tomorrowFajr = buildRows(tomorrowTimes).find((row) => row.id === "fajr");
  const nextPrayer =
    displayedRows.find((row) => row.time.getTime() > now.getTime()) ??
    tomorrowFajr ??
    displayedRows[0];
  const remainingMs = Math.max(0, nextPrayer.time.getTime() - now.getTime());

  return {
    calculationDate: getLocalDayKey(today),
    coordinates: location,
    dataFreshness: Date.now() - location.acquiredAt > LOCATION_STALE_AFTER_MS ? "stale" : "fresh",
    method: "MuslimWorldLeague",
    methodLabel: PRAYER_METHOD_LABEL,
    nextPrayer,
    remainingLabel: formatRemainingDuration(remainingMs),
    remainingMs,
    rows,
    sunrise: rows.find((row) => row.id === "sunrise") ?? rows[0]
  };
}

export function requestCurrentPosition(): Promise<PrayerLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new PrayerLocationRequestError("unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = validatePrayerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          acquiredAt: Date.now()
        });

        if (!location) {
          reject(new Error("invalid-coordinates"));
          return;
        }

        resolve(location);
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
