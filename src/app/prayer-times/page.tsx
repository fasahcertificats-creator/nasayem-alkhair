"use client";

import {
  AlertCircle,
  CheckCircle2,
  CloudSun,
  Clock,
  LocateFixed,
  MapPin,
  Moon,
  RefreshCw,
  Search,
  Sun,
  Sunrise,
  Sunset,
  X,
  type LucideIcon
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getPrayerGovernorates,
  getYemenGovernorateChildren,
  SAUDI_PRAYER_REGIONS,
  searchPrayerCities,
  type PrayerCity
} from "@/data/prayer-cities";
import { AppButton, PageHeading } from "@/design-system";
import { usePrayerTimes, type PrayerLocationStatus } from "@/hooks/usePrayerTimes";
import { cn } from "@/lib/utils";
import {
  type PrayerId,
  type PrayerLocation
} from "@/services/prayer/prayer-times.service";

import { NextPrayerHero } from "./NextPrayerHero";
import {
  getArabicDateParts,
  getReliablePrayerLocationLabel
} from "./prayer-presentation";

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

function formatLastUpdated(location: PrayerLocation): string {
  const date = new Date(location.updatedAt ?? location.acquiredAt);
  const timeFormatterOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    ...(location.timezone ? { timeZone: location.timezone } : {})
  };

  try {
    const time = new Intl.DateTimeFormat(
      "ar-SA-u-nu-arab",
      timeFormatterOptions
    ).format(date);
    const day = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-arab", {
      day: "numeric",
      month: "short",
      ...(location.timezone ? { timeZone: location.timezone } : {})
    }).format(date);

    return `${day}، ${time}`;
  } catch {
    return new Intl.DateTimeFormat("ar-SA-u-nu-arab", {
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "2-digit",
      month: "short"
    }).format(date);
  }
}

function getLocationStateTitle(status: PrayerLocationStatus): string | null {
  if (status === "denied") {
    return "تعذر الوصول إلى الموقع.";
  }

  if (status === "offline") {
    return "تعذر تحديث موقعك الآن لعدم توفر الاتصال.";
  }

  if (status === "unavailable" || status === "error") {
    return "تعذر تحديد موقعك الآن.";
  }

  return null;
}

export default function PrayerTimesPage() {
  const prayerTimes = usePrayerTimes();
  const {
    calculation,
    errorMessage,
    location,
    requestLocation,
    selectManualCity,
    status
  } = prayerTimes;
  const [dateParts, setDateParts] = useState<{ gregorian: string; hijri: string } | null>(
    null
  );
  const [isManualSelectorOpen, setIsManualSelectorOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const isRequesting = status === "requesting";
  const cityLabel = getReliablePrayerLocationLabel(location);
  const locationStateTitle = getLocationStateTitle(status);

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

  function chooseManualCity(city: PrayerCity) {
    selectManualCity(city);
    setCityQuery("");
    setIsManualSelectorOpen(false);
  }

  return (
    <main className="space-y-4 overflow-x-hidden px-5 pt-4 pb-8 text-right" dir="rtl">
      <section className="space-y-1.5 text-center" aria-labelledby="prayer-times-heading">
        <PageHeading className="text-[21px]" id="prayer-times-heading">
          أوقات الصلاة
        </PageHeading>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          {dateParts ? `${dateParts.hijri} — ${dateParts.gregorian}` : "تاريخ اليوم"}
        </p>
      </section>

      <CurrentCityControl
        cityLabel={cityLabel}
        location={location}
        onChangeCity={() => setIsManualSelectorOpen(true)}
      />

      <Link
        className="text-primary focus-visible:ring-gold inline-flex min-h-11 items-center rounded-lg px-1 text-xs font-bold underline decoration-gold/60 underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
        href={"/privacy#location" as Route}
      >
        كيف نستخدم موقعك؟
      </Link>

      {isManualSelectorOpen ? (
        <ManualCitySelector
          onClose={() => setIsManualSelectorOpen(false)}
          onSelect={chooseManualCity}
          query={cityQuery}
          setQuery={setCityQuery}
        />
      ) : null}

      {locationStateTitle && calculation ? (
        <section
          aria-live="polite"
          className="border-gold/30 bg-gold/5 space-y-2 rounded-2xl border px-3.5 py-3"
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              aria-hidden="true"
              className="text-gold mt-0.5 size-4 shrink-0"
              strokeWidth={1.7}
            />
            <div className="min-w-0">
              <h2 className="text-primary text-sm leading-relaxed font-bold">
                {locationStateTitle}
              </h2>
              {errorMessage ? (
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </div>
          <button
            className="text-gold focus-visible:ring-gold min-h-11 rounded-lg px-2 text-xs font-bold underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setIsManualSelectorOpen(true)}
            type="button"
          >
            اختيار المدينة يدويًا
          </button>
        </section>
      ) : null}

      <NextPrayerHero
        onManualSelect={() => setIsManualSelectorOpen(true)}
        prayerTimes={prayerTimes}
        showLocation={false}
        variant="page"
      />

      {calculation ? (
        <>
          <PrayerList calculation={calculation} />

          <section className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2" aria-label="إجراءات الموقع">
            <AppButton
              aria-label="تحديث موقعي"
              className="min-h-11 w-full"
              disabled={isRequesting}
              onClick={requestLocation}
              tone="outline"
            >
              <RefreshCw
                aria-hidden="true"
                className={cn(
                  "size-4",
                  isRequesting && "animate-spin motion-reduce:animate-none"
                )}
                strokeWidth={1.7}
              />
              {isRequesting ? "جارٍ تحديد موقعك..." : "تحديث موقعي"}
            </AppButton>
            <AppButton
              aria-label="اختيار المدينة يدويًا"
              className="min-h-11 w-full"
              onClick={() => setIsManualSelectorOpen(true)}
              tone="outline"
            >
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.7} />
              اختيار المدينة يدويًا
            </AppButton>
          </section>
        </>
      ) : null}

      {location ? <LastUpdated location={location} /> : null}
    </main>
  );
}

function CurrentCityControl({
  cityLabel,
  location,
  onChangeCity
}: {
  cityLabel: string | null;
  location: PrayerLocation | null;
  onChangeCity: () => void;
}) {
  const displayedCity = cityLabel
    ? cityLabel
    : location
      ? "تعذر تحديد اسم المدينة"
      : "لم تُختر مدينة بعد";
  const sourceLabel =
    location?.selectionSource === "manual" ? "اختيار يدوي" : "موقعي الحالي";

  return (
    <section
      aria-labelledby="current-city-heading"
      className="border-border shadow-soft rounded-[20px] border bg-white p-3.5"
    >
      <div className="flex items-center justify-between gap-3 max-[279px]:flex-col max-[279px]:items-stretch">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="bg-gold/10 text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
            <MapPin aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <p className="text-muted-foreground text-[10px] font-bold">المدينة الحالية</p>
            <h2
              className="text-primary break-words text-sm leading-relaxed font-extrabold"
              id="current-city-heading"
            >
              {displayedCity}
            </h2>
            {location ? (
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium">
                {sourceLabel}
              </p>
            ) : null}
          </div>
        </div>
        <button
          className="border-border text-gold focus-visible:ring-gold min-h-11 shrink-0 rounded-xl border px-3 py-2 text-xs font-bold focus-visible:ring-2 focus-visible:outline-none"
          onClick={onChangeCity}
          type="button"
        >
          تغيير المدينة
        </button>
      </div>
      {location && !cityLabel ? (
        <p className="text-muted-foreground mt-2 border-t pt-2 text-xs leading-relaxed">
          المواقيت محسوبة من موقع صالح. اختر المدينة يدويًا لإظهار اسم موثوق.
        </p>
      ) : null}
    </section>
  );
}

function ManualCitySelector({
  onClose,
  onSelect,
  query,
  setQuery
}: {
  onClose: () => void;
  onSelect: (city: PrayerCity) => void;
  query: string;
  setQuery: (query: string) => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [countryCode, setCountryCode] = useState<"" | "SA" | "YE" | "OTHER">("");
  const [regionCode, setRegionCode] = useState("");
  const [governorateCode, setGovernorateCode] = useState("");
  const hierarchyCities = useMemo(() => {
    if (countryCode === "SA" && regionCode) {
      return getPrayerGovernorates("SA", regionCode);
    }

    if (countryCode === "YE") {
      const governorates = getPrayerGovernorates("YE");
      if (!governorateCode) {
        return governorates;
      }

      const selectedGovernorate = governorates.find(
        (city) => city.governorateCode === governorateCode
      );
      return [
        ...(selectedGovernorate ? [selectedGovernorate] : []),
        ...getYemenGovernorateChildren(governorateCode)
      ];
    }

    if (countryCode === "OTHER") {
      return searchPrayerCities("").filter(
        (city) => city.countryCode !== "SA" && city.countryCode !== "YE"
      );
    }

    return [];
  }, [countryCode, governorateCode, regionCode]);
  const cities = useMemo(
    () => (query.trim() ? searchPrayerCities(query).slice(0, 80) : hierarchyCities),
    [hierarchyCities, query]
  );

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="manual-city-heading"
      className="border-primary/15 bg-secondary/60 shadow-soft space-y-3 rounded-[20px] border p-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-primary text-sm font-extrabold" id="manual-city-heading">
            اختيار المدينة يدويًا
          </h2>
          <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
            يعمل البحث والحساب دون اتصال بالإنترنت.
          </p>
        </div>
        <button
          aria-label="إغلاق اختيار المدينة"
          className="border-border text-muted-foreground focus-visible:ring-gold flex size-11 shrink-0 items-center justify-center rounded-xl border bg-white focus-visible:ring-2 focus-visible:outline-none"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.7} />
        </button>
      </div>

      <label className="relative block" htmlFor="manual-city-search">
        <span className="sr-only">ابحث باسم المدينة أو الدولة</span>
        <Search
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
          strokeWidth={1.7}
        />
        <input
          autoComplete="off"
          className="border-border text-primary placeholder:text-muted-foreground focus:border-gold focus:ring-gold/20 h-11 w-full rounded-xl border bg-white pr-10 pl-3 text-sm outline-none focus:ring-2"
          id="manual-city-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث باسم المدينة أو الدولة"
          ref={searchInputRef}
          type="search"
          value={query}
        />
      </label>

      <div className="grid gap-2">
        <label className="space-y-1 text-xs font-bold text-primary">
          <span>اختر الدولة</span>
          <select
            className="border-border focus:border-gold focus:ring-gold/20 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2"
            onChange={(event) => {
              setCountryCode(event.target.value as typeof countryCode);
              setRegionCode("");
              setGovernorateCode("");
              setQuery("");
            }}
            value={countryCode}
          >
            <option value="">اختر الدولة</option>
            <option value="SA">السعودية</option>
            <option value="YE">اليمن</option>
            <option value="OTHER">دول أخرى</option>
          </select>
        </label>

        {countryCode === "SA" ? (
          <label className="space-y-1 text-xs font-bold text-primary">
            <span>اختر المنطقة</span>
            <select
              className="border-border focus:border-gold focus:ring-gold/20 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2"
              onChange={(event) => setRegionCode(event.target.value)}
              value={regionCode}
            >
              <option value="">اختر المنطقة</option>
              {SAUDI_PRAYER_REGIONS.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {countryCode === "YE" ? (
          <label className="space-y-1 text-xs font-bold text-primary">
            <span>اختر المحافظة</span>
            <select
              className="border-border focus:border-gold focus:ring-gold/20 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2"
              onChange={(event) => setGovernorateCode(event.target.value)}
              value={governorateCode}
            >
              <option value="">اختر المحافظة</option>
              {getPrayerGovernorates("YE").map((governorate) => (
                <option key={governorate.id} value={governorate.governorateCode}>
                  {governorate.cityName}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="max-h-72 overflow-y-auto overscroll-contain rounded-xl" tabIndex={-1}>
        {cities.length ? (
          <ul className="space-y-1.5" aria-label="نتائج المواقع">
            {cities.map((city) => (
              <li key={city.id}>
                <button
                  aria-label={`اختيار ${city.cityName}، ${city.parentLabel ?? city.countryName}`}
                  className="border-border hover:border-gold/40 focus-visible:ring-gold flex min-h-11 w-full items-start justify-between gap-3 rounded-xl border bg-white px-3 py-2 text-right focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() => onSelect(city)}
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="text-primary block break-words text-sm font-bold">
                      {city.cityName}
                    </span>
                    {city.parentLabel ? (
                      <span className="text-muted-foreground mt-0.5 block break-words text-[10px]">
                        {city.parentLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted-foreground shrink-0 text-[11px] font-medium">
                    {city.countryName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p
            aria-live="polite"
            className="text-muted-foreground rounded-xl border border-dashed bg-white px-3 py-5 text-center text-sm"
          >
            {query.trim()
              ? "لا يوجد موقع مطابق. جرّب اسم المحافظة أو المديرية أو المدينة."
              : countryCode === "SA"
                ? "اختر المنطقة لعرض جميع محافظاتها."
                : countryCode
                  ? "اختر محافظة أو ابحث عن موقع."
                  : "اختر الدولة أو استخدم البحث الشامل."}
          </p>
        )}
      </div>
    </section>
  );
}

function PrayerList({
  calculation
}: {
  calculation: NonNullable<ReturnType<typeof usePrayerTimes>["calculation"]>;
}) {
  return (
    <section className="space-y-2" aria-labelledby="today-prayer-times-heading">
      <h2 className="text-primary text-sm font-extrabold" id="today-prayer-times-heading">
        مواقيت اليوم
      </h2>
      <div className="border-border divide-border overflow-hidden rounded-[20px] border bg-white shadow-soft divide-y">
        {calculation.rows.map((prayer) => {
          const PrayerIcon = prayerIcons[prayer.id] ?? Clock;
          const isCurrent = prayer.id === calculation.currentPrayerId;
          const isNext = prayer.id === calculation.nextPrayer.id;
          const isNextDayPrayer =
            isNext && prayer.time.getTime() !== calculation.nextPrayer.time.getTime();
          const displayTime = isNextDayPrayer
            ? calculation.nextPrayer.displayTime
            : prayer.displayTime;
          const statusLabel = isNext
            ? `الصلاة القادمة${isNextDayPrayer ? " — فجر الغد" : ""}`
            : isCurrent
              ? "الصلاة الحالية"
              : prayer.id === "sunrise"
                ? "وقت الشروق"
                : null;

          return (
            <div
              className={cn(
                "flex min-h-16 flex-wrap items-center gap-2.5 px-3 py-2.5",
                isNext && "bg-gold/5",
                isCurrent && !isNext && "bg-[var(--nasayem-green-050)]",
                prayer.id === "sunrise" && "bg-secondary/45"
              )}
              key={prayer.id}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl",
                  isNext
                    ? "bg-gold/10 text-gold"
                    : isCurrent
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                )}
              >
                <PrayerIcon className="size-4" strokeWidth={1.7} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-primary text-sm font-bold">{prayer.name}</h3>
                {statusLabel ? (
                  <p
                    className={cn(
                      "mt-0.5 flex items-center gap-1 text-[10px] leading-relaxed font-bold",
                      isNext ? "text-gold" : "text-primary/70"
                    )}
                  >
                    {isNext || isCurrent ? (
                      <CheckCircle2 aria-hidden="true" className="size-3 shrink-0" />
                    ) : null}
                    {statusLabel}
                  </p>
                ) : null}
              </div>
              <bdi
                aria-label={`${prayer.name} ${displayTime}`}
                className="text-primary shrink-0 whitespace-nowrap text-base font-extrabold [unicode-bidi:isolate] max-[279px]:w-full max-[279px]:pe-10 max-[279px]:text-start"
                dir="ltr"
              >
                {displayTime}
              </bdi>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LastUpdated({ location }: { location: PrayerLocation }) {
  const sourceLabel =
    location.selectionSource === "manual"
      ? "تم اختيار المدينة يدويًا"
      : "تم التحديث من موقعك";

  return (
    <section
      aria-label="معلومات آخر تحديث"
      className="text-muted-foreground flex items-start gap-2 px-1 text-[11px] leading-relaxed"
    >
      <LocateFixed aria-hidden="true" className="text-gold mt-0.5 size-3.5 shrink-0" strokeWidth={1.7} />
      <div>
        <p className="font-bold">آخر تحديث: {formatLastUpdated(location)}</p>
        <p>{sourceLabel}</p>
      </div>
    </section>
  );
}
