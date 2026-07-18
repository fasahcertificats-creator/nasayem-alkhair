"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

const dhikrOptions = [
  "سبحان الله",
  "الحمد لله",
  "الله أكبر",
  "لا إله إلا الله",
  "أستغفر الله",
  "اللهم صل على النبي ﷺ"
] as const;

export default function TasbihPage() {
  const [selectedDhikr, setSelectedDhikr] = useState<string>(() => {
    if (typeof window === "undefined") {
      return dhikrOptions[0];
    }

    return localStorage.getItem("nasayem_tasbih_active_phrase") || dhikrOptions[0];
  });
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const savedCounts = localStorage.getItem("nasayem_tasbih_counts");
      return savedCounts ? (JSON.parse(savedCounts) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });

  function saveCounts(nextCounts: Record<string, number>) {
    setCounts(nextCounts);
    localStorage.setItem("nasayem_tasbih_counts", JSON.stringify(nextCounts));
  }

  function selectDhikr(dhikr: string) {
    setSelectedDhikr(dhikr);
    localStorage.setItem("nasayem_tasbih_active_phrase", dhikr);
  }

  function increment() {
    saveCounts({
      ...counts,
      [selectedDhikr]: (counts[selectedDhikr] || 0) + 1
    });
  }

  function reset() {
    saveCounts({
      ...counts,
      [selectedDhikr]: 0
    });
  }

  const currentCount = counts[selectedDhikr] || 0;
  const totalCount = Object.values(counts).reduce((sum, value) => sum + (Number(value) || 0), 0);

  return (
    <main className="space-y-4 px-5 pb-12 pt-5 text-right" dir="rtl">
      <section className="space-y-1.5" aria-labelledby="tasbih-heading">
        <h1 className="text-heading text-primary" id="tasbih-heading">
          التسبيح
        </h1>
        <p className="text-body-premium text-muted-foreground">
          صفحة هادئة للذكر والعد، بلا نظام إنجاز أو مزاحمة للقراءة.
        </p>
      </section>

      <section className="space-y-2 rounded-2xl border border-border bg-white p-4 shadow-soft" aria-label="اختيار الذكر">
        <h2 className="text-sm font-bold text-primary">اختر الذكر</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dhikrOptions.map((dhikr) => {
            const isSelected = dhikr === selectedDhikr;

            return (
              <button
                className={`min-h-11 shrink-0 rounded-xl border px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-secondary text-muted-foreground hover:text-primary"
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
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 text-center shadow-card">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 text-gold">
          <Sparkles className="size-4.5" strokeWidth={1.7} />
          <span className="text-base font-bold text-gold">{selectedDhikr}</span>
        </div>

        <div className="mx-auto mb-6 max-w-[280px] rounded-2xl border border-border bg-background py-7 shadow-inner">
          <p className="font-mono text-7xl font-extrabold tracking-wider text-primary">{currentCount}</p>
          <p className="mt-2 text-xs font-bold text-muted-foreground">عداد الذكر الحالي</p>
        </div>

        <button
          className="min-h-44 w-full rounded-[28px] border-8 border-background bg-primary text-white shadow-card transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={increment}
          type="button"
        >
          <span className="block text-lg font-extrabold">اضغط للتسبيح</span>
          <span className="mt-1 block text-xs text-white/70">لمسة واحدة تزيد العداد مرة واحدة</span>
        </button>

        <div className="mt-4 flex items-center justify-between gap-3 text-right">
          <div>
            <p className="text-xs font-bold text-muted-foreground">محفوظ اليوم</p>
            <p className="text-sm font-extrabold text-primary">{totalCount} تسبيحة</p>
          </div>
          <button
            className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-bold text-primary transition hover:bg-background"
            onClick={reset}
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
