"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  AlertCircle,
  BookMarked,
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Compass,
  MapPin,
  Moon,
  Sparkles,
  Sun
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PRAYER_METHOD_DESCRIPTION } from "@/services/prayer/prayer-times.service";

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
const maxTasbihCount = 999999;

function getGreeting() {
  const hours = new Date().getHours();

  if (hours >= 5 && hours < 12) {
    return "صباح الخير، جعل الله يومك عامرا بذكره وطاعته.";
  }

  if (hours >= 12 && hours < 17) {
    return "نسأل الله أن يبارك لك فيما بقي من يومك.";
  }

  if (hours >= 17 && hours < 21) {
    return "مساء طيب، لا تنس وردك من الذكر والدعاء.";
  }

  return "اختم يومك بذكر الله، فالقلوب تطمئن بذكره.";
}

function getArabicDateParts() {
  const now = new Date();
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);
  const gregorian = new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);

  return { gregorian, hijri };
}

function getMillisecondsUntilNextLocalMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return Math.max(1000, nextMidnight.getTime() - now.getTime() + 1500);
}

function readSavedTasbihTotal() {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const savedCounts = localStorage.getItem("nasayem_tasbih_counts");
    const parsed = savedCounts ? (JSON.parse(savedCounts) as unknown) : {};

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return 0;
    }

    return Object.values(parsed).reduce((sum, value) => {
      if (!Number.isInteger(value) || value < 0) {
        return sum;
      }

      return Math.min(maxTasbihCount, sum + Math.min(value, maxTasbihCount));
    }, 0);
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
  const [dateParts, setDateParts] = useState<{ gregorian: string; hijri: string } | null>(null);
  const [greeting, setGreeting] = useState("");
  const [tasbihCount, setTasbihCount] = useState(0);

  useEffect(() => {
    let active = true, timer = 0;
    function refresh() {
      setDateParts(getArabicDateParts());
      setGreeting(getGreeting());
      setTasbihCount(readSavedTasbihTotal());
    }
    function scheduleNext() {
      timer = window.setTimeout(() => {
        if (!active) return;
        refresh();
        scheduleNext();
      }, getMillisecondsUntilNextLocalMidnight());
    }
    refresh();
    scheduleNext();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="space-y-4 overflow-x-hidden px-5 pt-5 pb-12 text-right" dir="rtl">
      <section className="space-y-2 pt-1" aria-labelledby="home-greeting">
        <h1
          className="text-primary text-base leading-relaxed font-bold sm:text-lg"
          id="home-greeting"
        >
          {greeting || "نسائم الخير"}
        </h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5">
          <div className="border-border/40 bg-secondary shadow-soft flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-bold">
            <Calendar className="text-gold size-3" strokeWidth={1.7} />
            <span className="text-muted-foreground text-[11px]">
              {dateParts?.hijri || "التاريخ الهجري"}
            </span>
          </div>
          <span className="text-stone-300">|</span>
          <span className="text-[11px] font-medium text-stone-500">
            {dateParts?.gregorian || "التاريخ الميلادي"}
          </span>
        </div>
      </section>

      <PrayerCard prayerTimes={prayerTimes} />
      <DailyWorshipCard />
      <QuickAccess />
      <DailyReminder reminder={reminder} />
      <DailyWird wird={wird} />
      <TasbihSummary count={tasbihCount} />
    </main>
  );
}

function PrayerCard({ prayerTimes }: { prayerTimes: ReturnType<typeof usePrayerTimes> }) {
  const { calculation, errorMessage, requestLocation, status } = prayerTimes;
  const hasCalculatedData = Boolean(calculation);
  const isRequesting = status === "requesting";
  const message = isRequesting
    ? "جار حساب أوقات الصلاة..."
    : errorMessage || "حدد موقعك لعرض أوقات الصلاة بدقة";

  return (
    <section className="border-primary bg-primary shadow-card relative overflow-hidden rounded-2xl border p-4 text-white">
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-28 rounded-full bg-white/5" />
      <div className="bg-gold/10 pointer-events-none absolute -top-6 -right-6 size-16 rounded-full" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
            <Clock className="text-gold size-3" strokeWidth={1.7} />
            <span>{hasCalculatedData ? "الصلاة القادمة" : "أوقات الصلاة"}</span>
          </div>
          <h2 className="text-background text-[19px] leading-none font-extrabold">
            {calculation ? `صلاة ${calculation.nextPrayer.name}` : "حدد موقعك"}
          </h2>
          <p className="text-xs font-medium text-white/90">
            {calculation ? "حسب موقعك الحالي" : message}
          </p>
        </div>

        <div className="min-w-20 rounded-xl border border-white/5 bg-black/25 px-3 py-2 text-center">
          <p className="mb-0.5 text-[10px] font-bold text-white/70">
            {calculation ? "الأذان" : "الحالة"}
          </p>
          <p className="text-gold font-mono text-[18px] leading-none font-extrabold tracking-wider">
            {calculation ? calculation.nextPrayer.displayTime : "--:--"}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/85">
        <span className="flex items-center gap-1 text-[11px] font-medium">
          {calculation ? (
            <MapPin className="text-gold size-3" strokeWidth={1.7} />
          ) : (
            <AlertCircle className="text-gold size-3" strokeWidth={1.7} />
          )}
          {calculation
            ? calculation.dataFreshness === "stale"
              ? "موقع محفوظ يحتاج تحديثا"
              : "حسب موقعك الحالي"
            : message}
        </span>
        {calculation ? (
          <Link
            className="bg-gold hover:bg-gold/90 flex items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-bold text-white transition"
            href={ROUTES.prayerTimes}
          >
            <span>أوقات الصلاة</span>
            <ChevronLeft className="size-3" strokeWidth={1.7} />
          </Link>
        ) : (
          <button
            className="bg-gold hover:bg-gold/90 flex min-h-8 items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-bold text-white transition disabled:opacity-70"
            disabled={isRequesting}
            onClick={requestLocation}
            type="button"
          >
            <span>{isRequesting ? "جار التحديد" : "استخدام موقعي"}</span>
          </button>
        )}
      </div>
      {calculation ? (
        <p className="relative z-10 mt-2 text-[10px] font-medium text-white/65">
          {calculation.remainingLabel} - {PRAYER_METHOD_DESCRIPTION}
        </p>
      ) : null}
    </section>
  );
}

function DailyWorshipCard() {
  const items = [
    {
      icon: <Sun className="size-4" />,
      title: "أذكار الصباح",
      state: "لم يبدأ",
      tone: "text-gold"
    },
    {
      icon: <Moon className="size-4" />,
      title: "أذكار المساء",
      state: "لم يبدأ",
      tone: "text-primary"
    },
    {
      icon: <Sparkles className="size-4" />,
      title: "التسبيح اليومي",
      state: "لم يبدأ",
      tone: "text-gold"
    },
    {
      icon: <BookMarked className="size-4" />,
      title: "ورد اليوم",
      state: "لم يبدأ",
      tone: "text-emerald-700"
    }
  ];

  return (
    <section className="border-border shadow-soft space-y-3 rounded-2xl border bg-white p-4">
      <div className="border-secondary flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <BookMarked className="text-gold size-4" strokeWidth={1.7} />
          <h2 className="text-primary text-center text-xs font-bold">التقدم اليومي للعبادات</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div
            className="border-border/40 bg-background space-y-1 rounded-xl border p-2.5"
            key={item.title}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
              <span className="text-primary flex min-w-0 items-center gap-1.5">
                <span className={item.tone}>{item.icon}</span>
                <span className="truncate">{item.title}</span>
              </span>
              <span className="text-muted-foreground shrink-0 text-[10px]">{item.state}</span>
            </div>
            <div className="bg-border/30 h-1.5 w-full rounded-full">
              <div className="bg-gold h-full w-0 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickAccess() {
  return (
    <section className="space-y-1.5" aria-labelledby="quick-access-heading">
      <h2
        className="text-muted-foreground text-center text-[11px] font-bold tracking-wider uppercase"
        id="quick-access-heading"
      >
        الوصول السريع
      </h2>
      <div className="grid grid-cols-4 gap-2">
        <QuickAccessCard
          href={ROUTES.azkar}
          icon={<BookOpen className="size-4" />}
          label="الأذكار"
          tone="gold"
        />
        <QuickAccessCard
          href={ROUTES.azkarCategory("quran-duas")}
          icon={<BookMarked className="size-4" />}
          label="ورد اليوم"
          tone="green"
        />
        <QuickAccessCard
          href={ROUTES.prayerTimes}
          icon={<Clock className="size-4" />}
          label="أوقات الصلاة"
          tone="purple"
        />
        <QuickAccessCard
          href={ROUTES.umrah}
          icon={<Compass className="size-4" />}
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
      className="border-border shadow-soft hover:border-gold/40 hover:bg-background focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-[76px] flex-col items-center justify-center rounded-xl border bg-white p-2 text-center transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      href={href}
    >
      <div
        className={`shadow-soft mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg ${toneClassName}`}
      >
        {icon}
      </div>
      <span className="text-primary max-w-full text-[10px] leading-tight font-bold">{label}</span>
    </Link>
  );
}

function DailyReminder({ reminder }: { reminder: HomeReminder | null }) {
  if (!reminder) {
    return null;
  }

  return (
    <section
      className="border-border shadow-soft relative space-y-2.5 overflow-hidden rounded-2xl border bg-white p-4"
      aria-labelledby="daily-remembrance-heading"
    >
      <div className="bg-gold/5 pointer-events-none absolute top-0 left-0 size-16 rounded-br-full" />

      <div className="border-secondary flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <BookOpen className="text-gold size-4" strokeWidth={1.7} />
          <h2 className="text-primary text-center text-xs font-bold" id="daily-remembrance-heading">
            ذكر اليوم
          </h2>
        </div>
        <span className="bg-secondary text-gold rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase">
          موثق
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-primary py-0.5 text-center text-[14px] leading-loose font-semibold">
          {reminder.text}
        </p>
        <p className="text-muted-foreground text-left text-[10px]">
          {localizeSourceReference(reminder.source)}
          {reminder.authenticity ? ` - ${reminder.authenticity}` : ""}
        </p>
      </div>

      <div className="flex justify-end">
        <Link
          className="text-gold hover:text-primary flex items-center gap-0.5 text-[11px] font-bold"
          href={ROUTES.azkar}
        >
          <span>قراءة المزيد</span>
          <ChevronLeft className="size-3" strokeWidth={1.7} />
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
    <Link
      className="border-border bg-secondary/70 shadow-soft hover:bg-secondary focus-visible:ring-gold focus-visible:ring-offset-background block rounded-2xl border p-4 transition hover:border-emerald-700/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      href={ROUTES.azkarCategory("quran-duas")}
    >
      <section
        className="relative space-y-2.5 overflow-hidden"
        aria-labelledby="daily-wird-heading"
      >
        <div className="pointer-events-none absolute top-0 left-0 size-16 rounded-br-full bg-emerald-700/5" />

        <div className="border-border/50 flex items-center justify-between border-b pb-1.5">
          <div className="flex items-center gap-1.5">
            <BookMarked className="size-4 text-emerald-700" strokeWidth={1.7} />
            <h2 className="text-primary text-center text-xs font-bold" id="daily-wird-heading">
              ورد اليوم
            </h2>
          </div>
          <span className="rounded-md bg-white px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
            ورد مختصر
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-primary line-clamp-3 py-0.5 text-center font-serif text-[14px] leading-loose font-semibold">
            {wird.text}
          </p>
          <p className="text-muted-foreground text-left text-[10px]">
            {localizeSourceReference(wird.source)}
            {wird.authenticity ? ` - ${wird.authenticity}` : ""}
          </p>
        </div>

        <div className="flex justify-end">
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-700">
            <span>فتح الورد</span>
            <ChevronLeft className="size-3" strokeWidth={1.7} />
          </span>
        </div>
      </section>
    </Link>
  );
}

function TasbihSummary({ count }: { count: number }) {
  return (
    <section className="border-border/70 bg-secondary/60 flex items-center justify-between gap-4 rounded-2xl border p-3">
      <div className="flex items-center gap-2.5">
        <div className="shadow-soft flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--success-soft)] text-emerald-700">
          <Sparkles className="size-4.5" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-muted-foreground text-[10px] font-bold">التسبيح اليومي</h2>
          <p className="text-primary mt-0.5 text-sm leading-none font-extrabold">
            {tasbihPhrase} <span className="text-[10px] font-medium text-stone-400">({count})</span>
          </p>
        </div>
      </div>

      <Link
        className="border-border/50 text-gold shadow-soft hover:bg-background flex shrink-0 items-center gap-0.5 rounded-lg border bg-white px-2.5 py-1 text-[11px] font-bold transition"
        href={ROUTES.tasbih}
      >
        <span>ابدأ التسبيح</span>
        <ChevronLeft className="size-3" strokeWidth={1.7} />
      </Link>
    </section>
  );
}
  