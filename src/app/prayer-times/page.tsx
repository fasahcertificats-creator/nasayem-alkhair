"use client";

import { AlertCircle, Clock, MapPin, RefreshCw } from "lucide-react";

import { AppButton, PageHeading } from "@/design-system";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PRAYER_METHOD_DESCRIPTION } from "@/services/prayer/prayer-times.service";

export default function PrayerTimesPage() {
  const { calculation, errorMessage, requestLocation, status } = usePrayerTimes();
  const isRequesting = status === "requesting";
  const hasCalculatedData = Boolean(calculation);
  const message = isRequesting
    ? "جار حساب أوقات الصلاة..."
    : errorMessage || "حدد موقعك لعرض أوقات الصلاة بدقة";

  return (
    <main className="space-y-4 px-5 pt-5 pb-12 text-right" dir="rtl">
      <section className="space-y-1.5 text-center" aria-labelledby="prayer-times-heading">
        <PageHeading id="prayer-times-heading">أوقات الصلاة</PageHeading>
        <p className="text-body-premium text-muted-foreground">
          {hasCalculatedData ? "حسب موقعك الحالي" : "حدد موقعك لعرض أوقات الصلاة بدقة"}
        </p>
      </section>

      <section className="border-primary bg-primary shadow-card relative overflow-hidden rounded-2xl border p-5 text-white">
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-28 rounded-full bg-white/5" />
        <div className="bg-gold/10 pointer-events-none absolute -top-8 -right-8 size-20 rounded-full" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/80">
                <Clock className="text-gold size-3.5" strokeWidth={1.7} />
                {hasCalculatedData ? "الصلاة القادمة" : "أوقات الصلاة"}
              </span>
              <h2 className="text-background text-[22px] leading-tight font-extrabold">
                {calculation ? `صلاة ${calculation.nextPrayer.name}` : "حدد موقعك"}
              </h2>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-center">
              <p className="text-[10px] font-bold text-white/70">
                {calculation ? "الأذان" : "الحالة"}
              </p>
              <p className="text-gold font-mono text-2xl font-extrabold">
                {calculation ? calculation.nextPrayer.displayTime : "--:--"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/85">
            <span className="flex items-center gap-1">
              {calculation ? (
                <MapPin className="text-gold size-3.5" strokeWidth={1.7} />
              ) : (
                <AlertCircle className="text-gold size-3.5" strokeWidth={1.7} />
              )}
              {calculation
                ? calculation.dataFreshness === "stale"
                  ? "موقع محفوظ يحتاج تحديثا"
                  : "حسب موقعك الحالي"
                : message}
            </span>
            {calculation ? <span>{calculation.remainingLabel}</span> : null}
          </div>
        </div>
      </section>

      {calculation ? (
        <>
          <section className="space-y-2.5" aria-label="مواقيت اليوم">
            {calculation.rows
              .filter((prayer) => prayer.id !== "sunrise")
              .map((prayer) => {
                const isNext = prayer.id === calculation.nextPrayer.id;

                return (
                  <div
                    className={`shadow-soft flex items-center justify-between rounded-2xl border p-3.5 ${
                      isNext
                        ? "border-gold bg-background ring-gold/20 ring-1"
                        : "border-border bg-white"
                    }`}
                    key={prayer.id}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-9 items-center justify-center rounded-xl ${
                          isNext ? "bg-gold/10 text-gold" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Clock className="size-4.5" strokeWidth={1.7} />
                      </div>
                      <div>
                        <h2 className="text-primary text-base font-bold">{prayer.name}</h2>
                        {isNext ? (
                          <p className="text-gold text-[10px] font-bold">الصلاة القادمة</p>
                        ) : null}
                      </div>
                    </div>
                    <span className="text-primary font-mono text-base font-extrabold">
                      {prayer.displayTime}
                    </span>
                  </div>
                );
              })}
          </section>

          <section className="border-border shadow-soft rounded-2xl border bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="bg-secondary text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
                <RefreshCw className="size-4.5" strokeWidth={1.7} />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-primary text-center text-sm font-bold">تحديث الموقع</h2>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {calculation.dataFreshness === "stale"
                    ? "تم حفظ موقعك سابقا. يمكنك تحديثه عند الحاجة."
                    : "يتم حساب أوقات الصلاة محليا من موقعك المحفوظ على هذا الجهاز."}
                </p>
                <p className="text-muted-foreground text-xs font-bold">
                  {PRAYER_METHOD_DESCRIPTION}
                </p>
                <AppButton className="min-h-11 w-full" onClick={requestLocation} tone="outline">
                  {isRequesting ? "جار التحديد" : "تحديث الموقع"}
                </AppButton>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="border-border shadow-soft rounded-2xl border bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="bg-secondary text-gold flex size-9 shrink-0 items-center justify-center rounded-xl">
              <MapPin className="size-4.5" strokeWidth={1.7} />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <h2 className="text-primary text-center text-sm font-bold">حدد موقعك</h2>
              <p className="text-muted-foreground text-xs leading-relaxed">{message}</p>
              <AppButton
                className="min-h-11 w-full"
                disabled={isRequesting}
                onClick={requestLocation}
              >
                {isRequesting ? "جار التحديد" : "استخدام موقعي"}
              </AppButton>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
