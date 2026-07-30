"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeading } from "@/design-system";

const dhikrOptions = [
  "سبحان الله",
  "الحمد لله",
  "الله أكبر",
  "لا إله إلا الله",
  "أستغفر الله",
  "الصلاة على النبي ﷺ"
] as const;

const tasbihCountsStorageKey = "nasayem_tasbih_counts";
const activePhraseStorageKey = "nasayem_tasbih_active_phrase";
const tasbihDayStorageKey = "nasayem_tasbih_day_key";
const maxTasbihCount = 999999;

function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isApprovedDhikr(value: unknown): value is (typeof dhikrOptions)[number] {
  return typeof value === "string" && dhikrOptions.includes(value as (typeof dhikrOptions)[number]);
}

function sanitizeCounts(value: unknown): Record<string, number> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }

  const nextCounts: Record<string, number> = {};

  for (const [key, count] of Object.entries(value)) {
    if (!isApprovedDhikr(key) || !Number.isInteger(count) || count < 0) {
      continue;
    }

    nextCounts[key] = Math.min(count, maxTasbihCount);
  }

  return nextCounts;
}

function readStoredCounts() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const currentDayKey = getLocalDayKey();
    const savedDayKey = localStorage.getItem(tasbihDayStorageKey);

    if (savedDayKey && savedDayKey !== currentDayKey) {
      localStorage.setItem(tasbihCountsStorageKey, JSON.stringify({}));
      localStorage.setItem(tasbihDayStorageKey, currentDayKey);
      return {};
    }

    if (!savedDayKey) {
      localStorage.setItem(tasbihDayStorageKey, currentDayKey);
    }

    const savedCounts = localStorage.getItem(tasbihCountsStorageKey);

    return sanitizeCounts(savedCounts ? JSON.parse(savedCounts) : {});
  } catch {
    return {};
  }
}

function readStoredPhrase() {
  if (typeof window === "undefined") {
    return dhikrOptions[0];
  }

  try {
    const storedPhrase = localStorage.getItem(activePhraseStorageKey);

    return isApprovedDhikr(storedPhrase) ? storedPhrase : dhikrOptions[0];
  } catch {
    return dhikrOptions[0];
  }
}

export default function TasbihPage() {
  const [selectedDhikr, setSelectedDhikr] = useState<string>(dhikrOptions[0]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSelectedDhikr(readStoredPhrase());
      setCounts(readStoredCounts());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function saveCounts(nextCounts: Record<string, number>) {
    const sanitizedCounts = sanitizeCounts(nextCounts);
    setCounts(sanitizedCounts);

    try {
      localStorage.setItem(tasbihDayStorageKey, getLocalDayKey());
      localStorage.setItem(
        tasbihCountsStorageKey,
        JSON.stringify(sanitizedCounts)
      );
    } catch {
      // The in-memory counter remains usable when storage is unavailable.
    }
  }

  function selectDhikr(dhikr: string) {
    if (!isApprovedDhikr(dhikr)) {
      return;
    }

    setSelectedDhikr(dhikr);

    try {
      localStorage.setItem(activePhraseStorageKey, dhikr);
    } catch {
      // The selected phrase remains usable for the current page session.
    }
  }

  function increment() {
    const currentCount = counts[selectedDhikr] || 0;

    saveCounts({
      ...counts,
      [selectedDhikr]: Math.min(currentCount + 1, maxTasbihCount)
    });
  }

  function resetAllTasbih() {
    if (window.confirm("هل تريد تصفير عدادات التسبيح فقط؟")) {
      saveCounts({});
    }
  }

  const currentCount = counts[selectedDhikr] || 0;
  const totalCount = Object.values(counts).reduce((sum, value) => sum + (Number(value) || 0), 0);

  return (
    <main className="space-y-4 px-5 pt-5 pb-12 text-right" dir="rtl">
      <section className="space-y-1.5" aria-labelledby="tasbih-heading">
        <PageHeading id="tasbih-heading">التسبيح</PageHeading>
        <p className="text-body-premium text-muted-foreground">اذكر الله بطمأنينة</p>
      </section>

      <section className="border-border shadow-card rounded-[22px] border bg-white p-5 text-center">
        <div className="border-border bg-secondary text-gold mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border px-4 py-2">
          <Sparkles className="size-4.5" strokeWidth={1.7} />
          <span className="text-gold text-base font-bold">{selectedDhikr}</span>
        </div>

        <div className="border-border bg-background mx-auto mb-5 max-w-[260px] rounded-2xl border py-6 shadow-inner">
          <p className="text-primary font-mono text-[64px] leading-none font-extrabold tracking-wider sm:text-[68px]">
            {currentCount.toLocaleString("ar-SA")}
          </p>
          <p className="text-muted-foreground mt-2 text-xs font-bold">عداد الذكر الحالي</p>
        </div>

        <button
          className="bg-primary focus-visible:ring-gold focus-visible:ring-offset-background min-h-[118px] w-full rounded-[22px] px-4 text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
          onClick={increment}
          type="button"
        >
          <span className="block text-lg font-extrabold">اضغط للتسبيح</span>
          <span className="mt-1 block text-xs text-white/70">لمسة واحدة تزيد العدد</span>
        </button>

        <div className="mt-5 space-y-2 text-right">
          <h2 className="text-primary text-sm font-bold">اختر الذكر</h2>
          <div className="grid grid-cols-2 gap-2">
            {dhikrOptions.map((dhikr) => {
              const isSelected = dhikr === selectedDhikr;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`focus-visible:ring-gold focus-visible:ring-offset-background min-h-12 rounded-xl border px-3 py-2 text-sm leading-relaxed font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-secondary text-primary hover:border-gold/40"
                  }`}
                  key={dhikr}
                  onClick={() => selectDhikr(dhikr)}
                  type="button"
                >
                  {dhikr}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-border mt-5 flex items-center justify-between gap-3 border-t pt-4 text-right">
          <div>
            <p className="text-muted-foreground text-xs font-bold">محفوظ اليوم</p>
            <p className="text-primary text-sm font-extrabold">
              {totalCount.toLocaleString("ar-SA")} تسبيحة
            </p>
          </div>
          <button
            className="border-border bg-secondary text-primary hover:bg-background focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={resetAllTasbih}
            type="button"
          >
            <RotateCcw className="size-4" strokeWidth={1.7} />
            تصفير
          </button>
        </div>
      </section>
    </main>
  );
}
