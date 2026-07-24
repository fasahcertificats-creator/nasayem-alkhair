"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  BookMarked,
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Compass,
  Sparkles
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import {
  formatHomeDateLine,
  getHomeGreeting,
  getMillisecondsUntilNextHomeRefresh,
  parseSafeTasbihTotal
} from "@/lib/home-presentation";

import { NextPrayerHero } from "./prayer-times/NextPrayerHero";
import {
  formatArabicNumber,
  formatQuranSource,
  getArabicDateParts
} from "./prayer-times/prayer-presentation";

interface HomeReminder {
  authenticity?: string;
  source: string;
  text: string;
}

interface HomeContentProps {
  reminder: HomeReminder | null;
  wird: HomeReminder | null;
}

const tasbihPhrase = "سبحان الله";

function readSavedTasbihTotal() {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const savedCounts = localStorage.getItem("nasayem_tasbih_counts");
    const parsed = savedCounts ? (JSON.parse(savedCounts) as unknown) : {};

    return parseSafeTasbihTotal(parsed);
  } catch {
    return 0;
  }
}

function localizeSourceReference(source: string) {
  return source
    .replaceAll("Sahih Muslim", "صحيح مسلم")
    .replaceAll("Sahih al-Bukhari", "صحيح البخاري");
}

export function HomeContent({ reminder, wird }: HomeContentProps) {
  const prayerTimes = usePrayerTimes();
  const [localNow, setLocalNow] = useState<Date | null>(null);
  const [tasbihCount, setTasbihCount] = useState(0);
  const dateParts = localNow ? getArabicDateParts(localNow) : null;
  const greeting = localNow ? getHomeGreeting(localNow) : "نسائم الخير";

  useEffect(() => {
    let timer = 0;

    function refreshLocalNow() {
      const nextNow = new Date();

      window.clearTimeout(timer);
      setLocalNow(nextNow);
      setTasbihCount(readSavedTasbihTotal());
      timer = window.setTimeout(refreshLocalNow, getMillisecondsUntilNextHomeRefresh(nextNow));
    }

    function refreshWhenVisible() {
      if (!document.hidden) {
        refreshLocalNow();
      }
    }

    refreshLocalNow();
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  return (
    <main className="space-y-4 overflow-x-hidden px-5 pt-4 pb-8 text-right" dir="rtl">
      <section className="space-y-1.5" aria-labelledby="home-greeting">
        <h1
          className="text-primary text-[17px] leading-relaxed font-bold sm:text-lg"
          id="home-greeting"
        >
          {greeting}
        </h1>

        <div
          aria-label={localNow ? formatHomeDateLine(localNow) : "التاريخ الهجري والميلادي"}
          className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] leading-relaxed"
        >
          <Calendar aria-hidden="true" className="text-gold size-3.5 shrink-0" strokeWidth={1.7} />
          <span className="font-bold">{dateParts?.hijri || "التاريخ الهجري"}</span>
          <span aria-hidden="true" className="text-stone-300">
            •
          </span>
          <span className="font-medium text-stone-500">
            {dateParts?.gregorian || "التاريخ الميلادي"}
          </span>
        </div>
      </section>

      <NextPrayerHero prayerTimes={prayerTimes} />
      <QuickAccess />
      <DailyReminder reminder={reminder} />
      <DailyWird wird={wird} />
      <TasbihSummary count={tasbihCount} />
    </main>
  );
}

function QuickAccess() {
  return (
    <section className="space-y-2" aria-labelledby="quick-access-heading">
      <h2
        className="text-primary text-sm font-bold"
        id="quick-access-heading"
      >
        الوصول السريع
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 max-[279px]:grid-cols-1 max-[279px]:gap-2">
        <QuickAccessCard
          href={ROUTES.azkar}
          icon={<BookOpen aria-hidden="true" className="size-5" />}
          label="الأذكار"
          tone="gold"
        />
        <QuickAccessCard
          href={ROUTES.azkarCategory("quran-duas")}
          icon={<BookMarked aria-hidden="true" className="size-5" />}
          label="ورد اليوم"
          tone="green"
        />
        <QuickAccessCard
          href={ROUTES.prayerTimes}
          icon={<Clock aria-hidden="true" className="size-5" />}
          label="أوقات الصلاة"
          tone="purple"
        />
        <QuickAccessCard
          href={ROUTES.umrah}
          icon={<Compass aria-hidden="true" className="size-5" />}
          label="دليل العمرة"
          tone="blue"
        />
      </div>
    </section>
  );
}

function QuickAccessCard({
  href,
  icon,
  label,
  tone
}: {
  href: Route;
  icon: ReactNode;
  label: string;
  tone: "gold" | "green" | "purple" | "blue";
}) {
  const toneClassName = {
    gold: "bg-[var(--gold-soft)] text-gold",
    green: "bg-[var(--success-soft)] text-emerald-700",
    purple: "bg-[var(--purple-soft)] text-indigo-600",
    blue: "bg-[var(--blue-soft)] text-sky-600"
  }[tone];

  return (
    <Link
      aria-label={`الانتقال إلى ${label}`}
      className="border-border shadow-soft hover:border-gold/40 hover:bg-background focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-[88px] items-center gap-3 rounded-2xl border bg-white px-3 py-2.5 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:flex-col sm:justify-center sm:gap-1.5 sm:text-center max-[279px]:min-h-11 max-[279px]:gap-2.5 max-[279px]:px-2.5 max-[279px]:py-1.5"
      href={href}
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl max-[279px]:size-8 max-[279px]:rounded-lg ${toneClassName}`}
      >
        {icon}
      </div>
      <span className="text-primary min-w-0 text-[12px] leading-relaxed font-bold max-[279px]:flex-1 max-[279px]:overflow-visible max-[279px]:text-clip max-[279px]:whitespace-normal max-[279px]:break-words">
        {label}
      </span>
    </Link>
  );
}

function DailyReminder({ reminder }: { reminder: HomeReminder | null }) {
  if (!reminder) {
    return null;
  }

  return (
    <section
      className="border-border shadow-soft relative space-y-3 overflow-hidden rounded-[22px] border bg-white p-4"
      aria-labelledby="daily-remembrance-heading"
    >
      <div className="flex items-center gap-2">
        <span className="bg-gold/10 text-gold flex size-8 items-center justify-center rounded-xl">
          <BookOpen aria-hidden="true" className="size-4" strokeWidth={1.7} />
        </span>
        <h2 className="text-primary text-sm font-bold" id="daily-remembrance-heading">
          ذكر اليوم
        </h2>
      </div>

      <div className="space-y-2">
        <p className="text-primary text-center text-[15px] leading-[2.05] font-semibold">
          {reminder.text}
        </p>
        <p className="text-primary/75 border-border/60 border-t pt-2 text-start text-xs leading-relaxed">
          {localizeSourceReference(reminder.source)}
          {reminder.authenticity ? `، ${localizeSourceReference(reminder.authenticity)}` : ""}
        </p>
      </div>

      <div className="flex justify-start">
        <Link
          aria-label="قراءة المزيد من الأذكار"
          className="text-gold hover:text-primary focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-11 items-center gap-1 rounded-lg px-1 text-xs font-bold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          href={ROUTES.azkar}
        >
          <span>قراءة المزيد</span>
          <ChevronLeft aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
        </Link>
      </div>
    </section>
  );
}

function DailyWird({ wird }: { wird: HomeReminder | null }) {
  if (!wird) {
    return null;
  }

  return (
    <section
      className="border-border bg-secondary/70 shadow-soft relative space-y-3 overflow-hidden rounded-[22px] border p-4"
      aria-labelledby="daily-wird-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700">
            <BookMarked aria-hidden="true" className="size-4" strokeWidth={1.7} />
          </span>
          <h2 className="text-primary text-sm font-bold" id="daily-wird-heading">
            ورد اليوم
          </h2>
        </div>
        <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-emerald-700">
          ورد مختصر
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-primary text-center font-serif text-[17px] leading-[2.15] font-semibold">
          {wird.text}
        </p>
        <p className="text-primary/75 border-border/60 border-t pt-2 text-start text-xs leading-relaxed">
          {formatQuranSource(wird.source)}
        </p>
      </div>

      <div className="flex justify-start">
        <Link
          aria-label="فتح ورد اليوم"
          className="focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-11 items-center gap-1 rounded-lg px-1 text-xs font-bold text-emerald-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          href={ROUTES.azkarCategory("quran-duas")}
        >
          <span>فتح الورد</span>
          <ChevronLeft aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
        </Link>
      </div>
    </section>
  );
}

function TasbihSummary({ count }: { count: number }) {
  const formattedCount = formatArabicNumber(count);

  return (
    <section
      aria-label={`التسبيح اليومي، ${tasbihPhrase}، العدد ${formattedCount}`}
      className="border-border/70 bg-secondary/60 grid min-h-[78px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-[20px] border px-3 py-2.5 max-[279px]:grid-cols-1 max-[279px]:gap-2"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="shadow-soft flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--success-soft)] text-emerald-700">
          <Sparkles aria-hidden="true" className="size-4.5" strokeWidth={1.7} />
        </div>
        <div className="min-w-0">
          <h2 className="text-muted-foreground text-[10px] font-bold">التسبيح اليومي</h2>
          <p className="text-primary mt-0.5 break-words text-sm leading-relaxed font-extrabold">
            {tasbihPhrase}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 max-[279px]:w-full max-[279px]:justify-between">
        <div className="border-border/70 flex min-w-[3.5rem] items-baseline justify-center gap-1 rounded-lg border bg-white px-1.5 py-1">
          <span aria-hidden="true" className="text-muted-foreground text-[9px] font-medium">
            العدد
          </span>
          <bdi
            aria-label={`العدد ${formattedCount}`}
            className="text-primary whitespace-nowrap text-xl leading-none font-extrabold tabular-nums [unicode-bidi:isolate]"
            dir="ltr"
          >
            {formattedCount}
          </bdi>
        </div>
        <Link
          aria-label={`ابدأ التسبيح بذكر ${tasbihPhrase}، العدد الحالي ${formattedCount}`}
          className="border-border/50 text-gold shadow-soft hover:bg-background focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-11 shrink-0 items-center gap-0.5 rounded-xl border bg-white px-2.5 py-2 text-[11px] font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          href={ROUTES.tasbih}
        >
          <span>ابدأ</span>
          <ChevronLeft aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
        </Link>
      </div>
    </section>
  );
}
