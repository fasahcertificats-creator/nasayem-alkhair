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
  MapPin,
  Moon,
  Sparkles,
  Sun
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { ROUTES } from "@/constants/routes.constants";

interface HomeReminder {
  authenticity?: string;
  source: string;
  text: string;
}

interface HomeContentProps {
  reminder: HomeReminder | null;
  wird: HomeReminder | null;
}

const prayerRows = [
  { name: "الفجر", time: "05:08" },
  { name: "الظهر", time: "12:25" },
  { name: "العصر", time: "15:46" },
  { name: "المغرب", time: "18:58" },
  { name: "العشاء", time: "20:28" }
] as const;

const tasbihPhrase = "سبحان الله";

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

function localizeSourceReference(source: string) {
  return source
    .replaceAll("Sahih Muslim", "صحيح مسلم")
    .replaceAll("Sahih al-Bukhari", "صحيح البخاري");
}

export function HomeContent({ reminder, wird }: HomeContentProps) {
  const [dateParts] = useState(getArabicDateParts);
  const [greeting] = useState(getGreeting);
  const [tasbihCount] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    try {
      const savedCounts = localStorage.getItem("nasayem_tasbih_counts");
      const parsed = savedCounts ? (JSON.parse(savedCounts) as Record<string, number>) : {};
      return Object.values(parsed).reduce((sum, value) => sum + (Number(value) || 0), 0);
    } catch {
      return 0;
    }
  });

  return (
    <main className="space-y-4 overflow-x-hidden px-5 pb-12 pt-5 text-right" dir="rtl">
      <section className="space-y-2 pt-1" aria-labelledby="home-greeting">
        <h1 className="text-base font-bold leading-relaxed text-primary sm:text-lg" id="home-greeting">
          {greeting}
        </h1>

        <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary px-2 py-0.5 text-xs font-bold shadow-soft">
            <Calendar className="size-3 text-gold" strokeWidth={1.7} />
            <span className="text-[11px] text-muted-foreground">
              {dateParts.hijri || "التاريخ الهجري"}
            </span>
          </div>
          <span className="text-stone-300">|</span>
          <span className="text-[11px] font-medium text-stone-500">
            {dateParts.gregorian || "التاريخ الميلادي"}
          </span>
        </div>
      </section>

      <PrayerCard />
      <DailyWorshipCard />
      <QuickAccess />
      <DailyReminder reminder={reminder} />
      <DailyWird wird={wird} />
      <TasbihSummary count={tasbihCount} />
    </main>
  );
}

function PrayerCard() {
  const nextPrayer = prayerRows[1];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary bg-primary p-4 text-white shadow-card">
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-28 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -right-6 -top-6 size-16 rounded-full bg-gold/10" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
            <Clock className="size-3 text-gold" strokeWidth={1.7} />
            <span>الصلاة القادمة</span>
          </div>
          <h2 className="text-[19px] font-extrabold leading-none text-background">
            صلاة {nextPrayer.name}
          </h2>
          <p className="text-xs font-medium text-white/90">يعرض التطبيق أوقاتا محلية محفوظة.</p>
        </div>

        <div className="min-w-20 rounded-xl border border-white/5 bg-black/25 px-3 py-2 text-center">
          <p className="mb-0.5 text-[10px] font-bold text-white/70">الأذان</p>
          <p className="font-mono text-[18px] font-extrabold leading-none tracking-wider text-gold">
            {nextPrayer.time}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/85">
        <span className="flex items-center gap-1 text-[11px] font-medium">
          <MapPin className="size-3 text-gold" strokeWidth={1.7} />
          مكة المكرمة
        </span>
        <Link
          className="flex items-center gap-1 rounded-lg bg-gold px-3 py-1 text-[11px] font-bold text-white transition hover:bg-gold/90"
          href={ROUTES.prayerTimes}
        >
          <span>المواقيت</span>
          <ChevronLeft className="size-3" strokeWidth={1.7} />
        </Link>
      </div>
    </section>
  );
}

function DailyWorshipCard() {
  const items = [
    { icon: <Sun className="size-4" />, title: "أذكار الصباح", state: "لم يبدأ", tone: "text-gold" },
    { icon: <Moon className="size-4" />, title: "أذكار المساء", state: "لم يبدأ", tone: "text-primary" },
    { icon: <Sparkles className="size-4" />, title: "التسبيح اليومي", state: "لم يبدأ", tone: "text-gold" },
    { icon: <BookMarked className="size-4" />, title: "ورد اليوم", state: "لم يبدأ", tone: "text-emerald-700" }
  ];

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between border-b border-secondary pb-1.5">
        <div className="flex items-center gap-1.5">
          <BookMarked className="size-4 text-gold" strokeWidth={1.7} />
          <h2 className="text-xs font-bold text-primary">التقدم اليومي للعبادات</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div className="space-y-1 rounded-xl border border-border/40 bg-background p-2.5" key={item.title}>
            <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
              <span className="flex min-w-0 items-center gap-1.5 text-primary">
                <span className={item.tone}>{item.icon}</span>
                <span className="truncate">{item.title}</span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">{item.state}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border/30">
              <div className="h-full w-0 rounded-full bg-gold" />
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
      <h2 className="pr-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground" id="quick-access-heading">
        الوصول السريع
      </h2>
      <div className="grid grid-cols-4 gap-2">
        <QuickAccessCard href={ROUTES.azkar} icon={<BookOpen className="size-4" />} label="الأذكار" tone="gold" />
        <QuickAccessCard href={ROUTES.azkarCategory("quran-duas")} icon={<BookMarked className="size-4" />} label="ورد اليوم" tone="green" />
        <QuickAccessCard href={ROUTES.prayerTimes} icon={<Clock className="size-4" />} label="أوقات الصلاة" tone="purple" />
        <QuickAccessCard href={ROUTES.umrah} icon={<Compass className="size-4" />} label="دليل العمرة" tone="blue" />
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
      className="flex min-h-[76px] flex-col items-center justify-center rounded-xl border border-border bg-white p-2 text-center shadow-soft transition hover:border-gold/40 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={href}
    >
      <div className={`mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg shadow-soft ${toneClassName}`}>
        {icon}
      </div>
      <span className="max-w-full text-[10px] font-bold leading-tight text-primary">{label}</span>
    </Link>
  );
}

function DailyReminder({ reminder }: { reminder: HomeReminder | null }) {
  if (!reminder) {
    return null;
  }

  return (
    <section className="relative space-y-2.5 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-soft" aria-labelledby="daily-remembrance-heading">
      <div className="pointer-events-none absolute left-0 top-0 size-16 rounded-br-full bg-gold/5" />

      <div className="flex items-center justify-between border-b border-secondary pb-1.5">
        <div className="flex items-center gap-1.5">
          <BookOpen className="size-4 text-gold" strokeWidth={1.7} />
          <h2 className="text-xs font-bold text-primary" id="daily-remembrance-heading">
            ذكر اليوم
          </h2>
        </div>
        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
          موثق
        </span>
      </div>

      <div className="space-y-1">
        <p className="py-0.5 text-center text-[14px] font-semibold leading-loose text-primary">
          {reminder.text}
        </p>
        <p className="text-left text-[10px] text-muted-foreground">
          {localizeSourceReference(reminder.source)}
          {reminder.authenticity ? ` - ${reminder.authenticity}` : ""}
        </p>
      </div>

      <div className="flex justify-end">
        <Link className="flex items-center gap-0.5 text-[11px] font-bold text-gold hover:text-primary" href={ROUTES.azkar}>
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
      className="block rounded-2xl border border-border bg-secondary/70 p-4 shadow-soft transition hover:border-emerald-700/20 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={ROUTES.azkarCategory("quran-duas")}
    >
      <section className="relative space-y-2.5 overflow-hidden" aria-labelledby="daily-wird-heading">
        <div className="pointer-events-none absolute left-0 top-0 size-16 rounded-br-full bg-emerald-700/5" />

        <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
          <div className="flex items-center gap-1.5">
            <BookMarked className="size-4 text-emerald-700" strokeWidth={1.7} />
            <h2 className="text-xs font-bold text-primary" id="daily-wird-heading">
              ورد اليوم
            </h2>
          </div>
          <span className="rounded-md bg-white px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
            ورد مختصر
          </span>
        </div>

        <div className="space-y-1">
          <p className="line-clamp-3 py-0.5 text-center font-serif text-[14px] font-semibold leading-loose text-primary">
            {wird.text}
          </p>
          <p className="text-left text-[10px] text-muted-foreground">
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
    <section className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/60 p-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--success-soft)] text-emerald-700 shadow-soft">
          <Sparkles className="size-4.5" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-[10px] font-bold text-muted-foreground">التسبيح اليومي</h2>
          <p className="mt-0.5 text-sm font-extrabold leading-none text-primary">
            {tasbihPhrase} <span className="text-[10px] font-medium text-stone-400">({count})</span>
          </p>
        </div>
      </div>

      <Link
        className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border/50 bg-white px-2.5 py-1 text-[11px] font-bold text-gold shadow-soft transition hover:bg-background"
        href={ROUTES.tasbih}
      >
        <span>ابدأ التسبيح</span>
        <ChevronLeft className="size-3" strokeWidth={1.7} />
      </Link>
    </section>
  );
}
