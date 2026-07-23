"use client";

import {
  CloudSun,
  Clock,
  MapPin,
  Moon,
  RefreshCw,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppButton, PageHeading } from "@/design-system";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import {
  PRAYER_METHOD_DESCRIPTION,
  type PrayerId
} from "@/services/prayer/prayer-times.service";

import { NextPrayerHero } from "./NextPrayerHero";
import { getArabicDateParts, getPrayerLocationLabel } from "./prayer-presentation";

const prayerIcons: Record<PrayerId, LucideIcon> = {
  fajr: Sunrise,
  sunrise: Sun,
  dhuhr: CloudSun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon
};

function getMillisecondsUntilNextLocalMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return Math.max(1000, nextMidnight.getTime() - now.getTime() + 1500);
}

export default function PrayerTimesPage() {
  const prayerTimes = usePrayerTimes();
  const { calculation, location, requestLocation, status } = prayerTimes;
  const [dateParts, setDateParts] = useState<{ gregorian: string; hijri: string } | null>(null);
  const isRequesting = status === "requesting";

  useEffect(() => {
    let active = true;
    let timer = 0;

    function refreshDate() {
      setDateParts(getArabicDateParts());
    }

    function scheduleNextDate() {
      timer = window.setTimeout(() => {
        if (!active) {
          return;
        }

        refreshDate();
        scheduleNextDate();
      }, getMillisecondsUntilNextLocalMidnight());
    }

    refreshDate();
    scheduleNextDate();

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const locationHeading = calculation
    ? getPrayerLocationLabel(location)
    : status === "loading" || status === "requesting"
      ? "جارٍ تحديد المدينة..."
      : "فعّل موقعك لعرض المواقيت";

  return (
    <main className="space-y-4 overflow-x-hidden px-5 pt-4 pb-8 text-right" dir="rtl">
      <section className="space-y-2 text-center" aria-labelledby="prayer-times-heading">
        <PageHeading className="text-[21px]" id="prayer-times-heading">
          أوقات الصلاة
        </PageHeading>

        <div className="flex flex-col items-center gap-1">
          <p className="text-primary flex items-center gap-1.5 text-sm font-bold">
            <MapPin aria-hidden="true" className="text-gold size-4" strokeWidth={1.7} />
            <span>{locationHeading}</span>
          </p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {dateParts ? `${dateParts.hijri} • ${dateParts.gregorian}` : "تاريخ اليوم"}
          </p>
        </div>
      </section>

      <NextPrayerHero prayerTimes={prayerTimes} showLocation={false} variant="page" />

      {calculation ? (
        <>
          <section className="space-y-2.5" aria-label="مواقيت اليوم">
            {calculation.rows.map((prayer) => {
              const PrayerIcon = prayerIcons[prayer.id] ?? Clock;
              const isNext = prayer.id === calculation.nextPrayer.id;
              const isNextDayPrayer =
                isNext && prayer.time.getTime() !== calculation.nextPrayer.time.getTime();
              const displayTime = isNextDayPrayer
                ? calculation.nextPrayer.displayTime
                : prayer.displayTime;

              return (
                <div
                  className={`shadow-soft flex min-h-[68px] items-center justify-between rounded-2xl border px-3.5 py-3 ${
                    isNext
                      ? "border-gold bg-background ring-gold/15 ring-1"
                      : "border-border bg-white"
                  }`}
                  key={prayer.id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      aria-hidden="true"
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        isNext
                          ? "bg-gold/10 text-gold"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <PrayerIcon className="size-4.5" strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-primary text-[15px] font-bold">{prayer.name}</h2>
                      {isNext ? (
                        <p className="text-gold text-[10px] font-bold">
                          الصلاة القادمة{isNextDayPrayer ? " • فجر الغد" : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <span className="text-primary shrink-0 font-mono text-base font-extrabold">
                    {displayTime}
                  </span>
                </div>
              );
            })}
          </section>

          <AppButton
            aria-label="تحديث المدينة باستخدام موقعك"
            className="min-h-11 w-full"
            disabled={isRequesting}
            onClick={requestLocation}
            tone="outline"
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${isRequesting ? "animate-spin motion-reduce:animate-none" : ""}`}
              strokeWidth={1.7}
            />
            {isRequesting ? "جارٍ تحديد المدينة" : "تحديث المدينة"}
          </AppButton>

          <p className="text-muted-foreground text-center text-[11px] leading-relaxed font-medium">
            {PRAYER_METHOD_DESCRIPTION}
          </p>
        </>
      ) : null}
    </main>
  );
}
