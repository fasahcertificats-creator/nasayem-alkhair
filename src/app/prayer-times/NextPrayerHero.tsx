"use client";

import { AlertCircle, ChevronLeft, Clock, LoaderCircle, MapPin } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";
import type { PrayerTimesState } from "@/hooks/usePrayerTimes";
import { cn } from "@/lib/utils";

import { getPrayerLocationLabel } from "./prayer-presentation";

interface NextPrayerHeroProps {
  className?: string;
  prayerTimes: PrayerTimesState;
  showLocation?: boolean;
  variant?: "home" | "page";
}

const actionClassName =
  "focus-visible:ring-gold focus-visible:ring-offset-primary inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-65";

export function NextPrayerHero({
  className,
  prayerTimes,
  showLocation = true,
  variant = "home"
}: NextPrayerHeroProps) {
  const { calculation, errorMessage, location, requestLocation, status } = prayerTimes;
  const isLoading = status === "loading" || status === "requesting";

  return (
    <section
      aria-label="ملخص الصلاة القادمة"
      className={cn(
        "border-primary bg-primary shadow-card relative min-h-[168px] overflow-hidden rounded-[22px] border px-4 py-4 text-white",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 -left-12 size-32 rounded-full bg-white/[0.045]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-8 size-24 rotate-12 rounded-[30px] bg-emerald-200/[0.055]"
      />

      {calculation ? (
        <div className="relative z-10 flex min-h-[134px] flex-col">
          {showLocation ? (
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white/80">
              <MapPin aria-hidden="true" className="text-gold size-3.5" strokeWidth={1.7} />
              <span>{getPrayerLocationLabel(location)}</span>
            </p>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white/65">الصلاة القادمة</p>
              <h2 className="text-background mt-0.5 text-[22px] leading-tight font-extrabold">
                صلاة {calculation.nextPrayer.name}
              </h2>
            </div>
            <p className="text-gold shrink-0 font-mono text-[24px] leading-none font-extrabold">
              {calculation.nextPrayer.displayTime}
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-3">
            <p className="min-w-0 text-[11px] leading-relaxed font-semibold text-white/80">
              {calculation.remainingLabel}
            </p>
            {variant === "home" ? (
              <Link
                aria-label="عرض جميع أوقات الصلاة"
                className="focus-visible:ring-gold focus-visible:ring-offset-primary flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                href={ROUTES.prayerTimes}
              >
                <span>عرض جميع المواقيت</span>
                <ChevronLeft aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <PrayerLocationState
          errorMessage={errorMessage}
          isLoading={isLoading}
          onRequestLocation={requestLocation}
          status={status}
          variant={variant}
        />
      )}
    </section>
  );
}

function PrayerLocationState({
  errorMessage,
  isLoading,
  onRequestLocation,
  status,
  variant
}: {
  errorMessage: string | null;
  isLoading: boolean;
  onRequestLocation: () => Promise<void>;
  status: PrayerTimesState["status"];
  variant: "home" | "page";
}) {
  if (isLoading) {
    return (
      <div
        aria-live="polite"
        className="relative z-10 flex min-h-[134px] items-center justify-center gap-2 text-center"
      >
        <LoaderCircle
          aria-hidden="true"
          className="text-gold size-5 animate-spin motion-reduce:animate-none"
          strokeWidth={1.7}
        />
        <p className="text-sm font-bold text-white/90">جارٍ تحديد المدينة...</p>
      </div>
    );
  }

  const denied = status === "denied";
  const unavailable = status === "unavailable" || status === "error";
  const title = denied
    ? "تعذر الوصول إلى الموقع"
    : unavailable
      ? "تعذر تحديد المدينة الآن"
      : "فعّل موقعك لعرض أوقات الصلاة";
  const supportingText = denied
    ? "اسمح بالوصول إلى الموقع من إعدادات المتصفح، ثم أعد المحاولة."
    : unavailable
      ? "تحقق من الاتصال أو خدمات الموقع، ثم حاول مرة أخرى."
      : "نستخدم موقعك لحساب المواقيت بدقة.";
  const actionLabel = denied || unavailable ? "إعادة المحاولة" : "استخدام موقعي";

  return (
    <div
      aria-live={denied || unavailable ? "assertive" : "polite"}
      className="relative z-10 flex min-h-[134px] flex-col justify-center"
      role={denied || unavailable ? "alert" : undefined}
    >
      <div className="flex items-start gap-2.5">
        {denied || unavailable ? (
          <AlertCircle aria-hidden="true" className="text-gold mt-0.5 size-5 shrink-0" strokeWidth={1.7} />
        ) : (
          <MapPin aria-hidden="true" className="text-gold mt-0.5 size-5 shrink-0" strokeWidth={1.7} />
        )}
        <div className="min-w-0">
          {variant === "home" || denied || unavailable ? (
            <h2 className="text-background text-base leading-relaxed font-extrabold">{title}</h2>
          ) : null}
          <p className="mt-1 text-xs leading-relaxed font-medium text-white/75">
            {errorMessage || supportingText}
          </p>
        </div>
      </div>

      <button
        aria-label={actionLabel}
        className={cn(actionClassName, "mt-3 self-start")}
        disabled={isLoading}
        onClick={onRequestLocation}
        type="button"
      >
        <Clock aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
        {actionLabel}
      </button>
    </div>
  );
}
