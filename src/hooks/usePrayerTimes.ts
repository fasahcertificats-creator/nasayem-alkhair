"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  calculatePrayerTimes,
  readStoredPrayerLocation,
  requestCurrentPosition,
  savePrayerLocation,
  type PrayerCalculationResult,
  type PrayerLocation
} from "@/services/prayer/prayer-times.service";

type PrayerLocationStatus = "loading" | "missing" | "ready" | "requesting" | "denied" | "error";

export interface PrayerTimesState {
  calculation: PrayerCalculationResult | null;
  errorMessage: string | null;
  isMounted: boolean;
  location: PrayerLocation | null;
  requestLocation: () => Promise<void>;
  status: PrayerLocationStatus;
}

const locationErrorMessage = "تعذر تحديد موقعك. يمكنك المحاولة مرة أخرى.";
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

    const intervalId = window.setInterval(() => setNow(new Date()), 30000);
    const onVisibilityChange = () => {
      if (!document.hidden) {
        setNow(new Date());
      }
    };

    window.addEventListener("focus", onVisibilityChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
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
      const nextLocation = await requestCurrentPosition();
      savePrayerLocation(nextLocation);
      setLocation(nextLocation);
      setStatus("ready");
      setNow(new Date());
    } catch {
      setStatus("denied");
      setErrorMessage(locationErrorMessage);
    }
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
    status: effectiveStatus
  };
}
