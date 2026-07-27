export const NASAYEM_LOCAL_STORAGE_KEYS = [
  "nasayem_prayer_location",
  "nasayem-alkhair:azkarProgress:v2",
  "nasayem-alkhair:azkarRepetitionCounts",
  "nasayem_tasbih_counts",
  "nasayem_tasbih_active_phrase",
  "nasayem_tasbih_day_key",
  "nasayem-alkhair:dailyProgress",
  "nasayem-alkhair:historyLog",
  "nasayem-alkhair:lastResetAt",
  "nasayem_prayer_calculation_settings",
  "nasayem_prayer_calculation_method",
  "nasayem_prayer_madhab",
  "nasayem_prayer_method_override"
] as const;

export const NASAYEM_SESSION_STORAGE_KEYS = [
  "nasayem-alkhair:umrah:tawaf-round:v1",
  "nasayem-alkhair:umrah:sai-round:v1"
] as const;

export const NASAYEM_LOCAL_DATA_CLEARED_EVENT =
  "nasayem-alkhair:local-data-cleared";

export function clearNasayemDeviceData(): void {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of NASAYEM_LOCAL_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }

  for (const key of NASAYEM_SESSION_STORAGE_KEYS) {
    window.sessionStorage.removeItem(key);
  }

  window.dispatchEvent(new Event(NASAYEM_LOCAL_DATA_CLEARED_EVENT));
  window.dispatchEvent(new Event("nasayem-alkhair:azkarProgressChanged"));
  window.dispatchEvent(
    new Event("nasayem-alkhair:umrah-round-progress-changed:tawaf")
  );
  window.dispatchEvent(
    new Event("nasayem-alkhair:umrah-round-progress-changed:sai")
  );
}
