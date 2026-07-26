"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PrayerCity } from "@/data/prayer-cities";
import {
  calculatePrayerTimes,
  createManualPrayerLocation,
  readStoredPrayerLocation,
  requestGeolocatedPrayerLocation,
  savePrayerLocation,
  type PrayerCalculationResult,
  type PrayerLocation,
  PrayerLocationRequestError
} from "@/services/prayer/prayer-times.service";

export type PrayerLocationStatus =
  | "loading"
  | "missing"
  | "ready"
  | "requesting"
  | "denied"
  | "offline"
  | "unavailable"
  | "error";

export interface PrayerTimesState {
  calculation: PrayerCalculationResult | null;
  errorMessage: string | null;
  isMounted: boolean;
  location: PrayerLocation | null;
  requestLocation: () => Promise<void>;
  selectManualCity: (city: PrayerCity) => void;
  status: PrayerLocationStatus;
}

const permissionDeniedMessage =
  "اسمح بالوصول من إعدادات الجهاز أو اختر المدينة يدويًا.";
const locationUnavailableMessage =
  "حاول مرة أخرى أو اختر المدينة يدويًا.";
const offlineMessage =
  "تعذر تحديث موقعك الآن لعدم توفر الاتصال.";
const calculationErrorMessage = "تعذر تحديث أوقات الصلاة الآن.";

export function usePrayerTimes(): PrayerTimesState {
  const [isMounted, setIsMounted] = useState(false);
  const [location, setLocation] = useState<PrayerLocation | null>(null);
  const [status, setStatus] = useState<PrayerLocationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedLocation = readStoredPrayerLocation();
      setIsMounted(true);
      setLocation(storedLocation);
      setStatus(storedLocation ? "ready" : "missing");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    let timer = 0;

    function refreshAndSchedule() {
      const nextNow = new Date();
      const millisecondsToNextMinute =
        60000 - (nextNow.getSeconds() * 1000 + nextNow.getMilliseconds()) + 250;

      window.clearTimeout(timer);
      setNow(nextNow);
      timer = window.setTimeout(refreshAndSchedule, millisecondsToNextMinute);
    }

    const onVisibilityChange = () => {
      if (!document.hidden) {
        refreshAndSchedule();
      }
    };

    refreshAndSchedule();
    window.addEventListener("focus", onVisibilityChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", onVisibilityChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isMounted]);

  const calculation = useMemo(() => {
    if (!location) {
      return null;
    }

    try {
      return calculatePrayerTimes(location, now);
    } catch {
      return null;
    }
  }, [location, now]);

  const requestLocation = useCallback(async () => {
    setStatus("requesting");
    setErrorMessage(null);

    try {
      const nextLocation = await requestGeolocatedPrayerLocation();
      savePrayerLocation(nextLocation);
      setLocation(nextLocation);
      setStatus("ready");
      setNow(new Date());
    } catch (error) {
      const permissionDenied =
        error instanceof PrayerLocationRequestError && error.reason === "permission-denied";
      const offline =
        error instanceof PrayerLocationRequestError && error.reason === "offline";

      setStatus(permissionDenied ? "denied" : offline ? "offline" : "unavailable");
      setErrorMessage(
        permissionDenied
          ? permissionDeniedMessage
          : offline
            ? offlineMessage
            : locationUnavailableMessage
      );
    }
  }, []);

  const selectManualCity = useCallback((city: PrayerCity) => {
    const nextLocation = createManualPrayerLocation(city);

    savePrayerLocation(nextLocation);
    setErrorMessage(null);
    setLocation(nextLocation);
    setStatus("ready");
    setNow(new Date());
  }, []);

  const hasCalculationError = Boolean(location && !calculation && status === "ready");
  const effectiveStatus = hasCalculationError ? "error" : status;
  const effectiveErrorMessage = hasCalculationError ? calculationErrorMessage : errorMessage;

  return {
    calculation,
    errorMessage: effectiveErrorMessage,
    isMounted,
    location,
    requestLocation,
    selectManualCity,
    status: effectiveStatus
  };
}
