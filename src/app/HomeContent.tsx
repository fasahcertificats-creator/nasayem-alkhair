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
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { loadProgress, type ProgressEntry } from "@/lib/app-state";

const AZKAR_PROGRESS_KEY = "nasayem-alkhair:azkarProgress";

interface HomeReminder {
  source: string;
  text: string;
}

interface HomeContentProps {
  reminder: HomeReminder | null;
  travelAzkarIds: string[];
  umrahStageCount: number;
}

interface AzkarProgressState {
  completedItems?: Record<string, string>;
}

function readAzkarCompletedIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  const value = window.localStorage.getItem(AZKAR_PROGRESS_KEY);

  if (!value) {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(value) as AzkarProgressState;
    return new Set(Object.keys(parsed.completedItems ?? {}));
  } catch {
    return new Set<string>();
  }
}

function getGreeting() {
  const hours = new Date().getHours();

  if (hours >= 5 && hours < 12) {
    return "صباح الخير، جعل الله يومك عامراً بذكره وطاعته.";
  }

  if (hours >= 12 && hours < 17) {
    return "نسأل الله أن يبارك لك فيما بقي من يومك.";
  }

  if (hours >= 17 && hours < 21) {
    return "نسأل الله أن يجعل مساءك عامراً بالذكر والسكينة.";
  }

  return "اختم يومك بذكر الله، فإن القلوب تطمئن بذكره.";
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

function getStatus(done: number, total: number) {
  if (total === 0) {
    return "لا يوجد محتوى";
  }

  if (done === 0) {
    return "لم يبدأ";
  }

  if (done >= total) {
    return "مكتمل";
  }

  return `${done} من ${total}`;
}

function localizeSourceReference(source: string) {
  return source
    .replaceAll("Sahih Muslim", "صحيح مسلم")
    .replaceAll("Sahih al-Bukhari", "صحيح البخاري");
}

function progressWidth(done: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.min(100, Math.round((done / total) * 100))}%`;
}

export function HomeContent({
  reminder,
  travelAzkarIds,
  umrahStageCount
}: HomeContentProps) {
  const [dateParts, setDateParts] = useState({ gregorian: "", hijri: "" });
  const [greeting, setGreeting] = useState("السلام عليكم");
  const [completedAzkarIds, setCompletedAzkarIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      setDateParts(getArabicDateParts());
      setGreeting(getGreeting());
      setCompletedAzkarIds(readAzkarCompletedIds());
      setProgress(loadProgress());
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const progressStats = useMemo(() => {
    const travelDone = travelAzkarIds.filter((id) => completedAzkarIds.has(id)).length;
    const umrahDone = progress.filter((entry) => entry.completed).length;

    return {
      travelDone,
      umrahDone
    };
  }, [completedAzkarIds, progress, travelAzkarIds]);

  const progressTiles = [
    travelAzkarIds.length > 0
      ? {
          barClassName: "bg-gold",
          done: progressStats.travelDone,
          label: "أذكار السفر",
          status: getStatus(progressStats.travelDone, travelAzkarIds.length),
          total: travelAzkarIds.length
        }
      : null,
    umrahStageCount > 0
      ? {
          barClassName: "bg-emerald-600",
          done: progressStats.umrahDone,
          label: "دليل العمرة",
          status: getStatus(progressStats.umrahDone, umrahStageCount),
          total: umrahStageCount
        }
      : null
  ].filter((tile): tile is NonNullable<typeof tile> => tile !== null);

  return (
    <main className="space-y-4 overflow-x-hidden px-5 pb-12 pt-5 text-right" dir="rtl">
      <section className="space-y-2 pt-1" aria-labelledby="home-greeting">
        <h1
          className="text-base font-bold leading-relaxed text-primary sm:text-lg"
          id="home-greeting"
        >
          {greeting}
        </h1>

        <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary px-2 py-0.5 text-xs font-bold shadow-soft">
            <Calendar className="size-3 text-gold" />
            <span className="text-[11px] text-muted-foreground">
              {dateParts.hijri || "التاريخ الهجري"}
            </span>
          </div>
          <span className="text-stone-300">•</span>
          <span className="text-[11px] font-medium text-stone-500">
            {dateParts.gregorian || "التاريخ الميلادي"}
          </span>
        </div>
      </section>

      <Link
        aria-labelledby="daily-progress-heading"
        className="block cursor-pointer space-y-3 rounded-2xl border border-border bg-white p-4 shadow-soft transition hover:border-gold/30"
        href={ROUTES.progress}
      >
        <div className="flex items-center justify-between border-b border-secondary pb-1.5">
          <div className="flex items-center gap-1.5">
            <BookMarked className="size-4 text-gold" />
            <h2 className="text-xs font-bold text-primary" id="daily-progress-heading">
              تقدم العمرة وأذكار السفر
            </h2>
          </div>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-gold">
            <span>عرض التقدم</span>
            <ChevronLeft className="size-3" />
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {progressTiles.map((tile) => (
            <ProgressTile
              barClassName={tile.barClassName}
              done={tile.done}
              key={tile.label}
              label={tile.label}
              status={tile.status}
              total={tile.total}
            />
          ))}
        </div>
      </Link>

      <section className="space-y-1.5" aria-labelledby="quick-access-heading">
        <h2
          className="pr-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
          id="quick-access-heading"
        >
          الوصول السريع
        </h2>
        <div className="grid grid-cols-4 gap-2">
          <QuickAccessCard href={ROUTES.azkar} icon={<BookOpen className="size-4" />} label="أذكار السفر" />
          <QuickAccessCard
            href={ROUTES.progress}
            icon={<BookMarked className="size-4" />}
            label="تقدم العمرة"
            tone="emerald"
          />
          <QuickAccessCard
            href={ROUTES.miqat}
            icon={<Clock className="size-4" />}
            label="المواقيت الشرعية"
            tone="indigo"
          />
          <QuickAccessCard
            href={ROUTES.umrah}
            icon={<Compass className="size-4" />}
            label="دليل العمرة"
            tone="sky"
          />
        </div>
      </section>

      {reminder ? (
        <section
          className="relative space-y-2.5 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-soft"
          aria-labelledby="daily-remembrance-heading"
        >
          <div className="pointer-events-none absolute left-0 top-0 size-16 rounded-br-full bg-gold/5" />

          <div className="flex items-center justify-between border-b border-secondary pb-1.5">
            <div className="flex items-center gap-1.5">
              <BookOpen className="size-4 text-gold" />
              <h2 className="text-xs font-bold text-primary" id="daily-remembrance-heading">
                ذكر اليوم
              </h2>
            </div>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
              موثق
            </span>
          </div>

          <div className="space-y-1">
            <p className="py-0.5 text-center font-serif text-[12.5px] italic leading-relaxed text-stone-800">
              «{reminder.text}»
            </p>
            <p className="text-left text-[10px] italic text-stone-400">
              — {localizeSourceReference(reminder.source)}
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function ProgressTile({
  barClassName,
  done,
  label,
  status,
  total
}: {
  barClassName: string;
  done: number;
  label: string;
  status: string;
  total: number;
}) {
  return (
    <div className="space-y-1 rounded-xl border border-border/40 bg-background p-2.5">
      <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
        <span className="truncate text-primary">{label}</span>
        <span className="shrink-0 text-[10px] text-gold">{status}</span>
      </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/30">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClassName}`}
          style={{ width: progressWidth(done, total) }}
        />
      </div>
    </div>
  );
}

function QuickAccessCard({
  href,
  icon,
  label,
  tone = "amber"
}: {
  href: Route;
  icon: ReactNode;
  label: string;
  tone?: "amber" | "emerald" | "indigo" | "sky";
}) {
  const toneClassName = {
    amber: "bg-amber-50 text-gold",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    sky: "bg-sky-50 text-sky-600"
  }[tone];

  return (
    <Link
      className="flex min-h-[76px] flex-col items-center justify-center rounded-xl border border-border bg-white p-2 text-center shadow-soft transition hover:border-gold/40 hover:bg-background"
      href={href}
    >
      <div
        className={`mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg shadow-soft ${toneClassName}`}
      >
        {icon}
      </div>
      <span className="max-w-full text-[10px] font-bold leading-tight text-primary">{label}</span>
    </Link>
  );
}
