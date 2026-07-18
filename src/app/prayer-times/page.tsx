import { Clock, MapPin, RefreshCw } from "lucide-react";

const prayers = [
  { id: "fajr", name: "الفجر", time: "05:08" },
  { id: "dhuhr", name: "الظهر", time: "12:25" },
  { id: "asr", name: "العصر", time: "15:46" },
  { id: "maghrib", name: "المغرب", time: "18:58" },
  { id: "isha", name: "العشاء", time: "20:28" }
] as const;

export default function PrayerTimesPage() {
  const nextPrayer = prayers[1];

  return (
    <main className="space-y-4 px-5 pb-12 pt-5 text-right" dir="rtl">
      <section className="space-y-1.5" aria-labelledby="prayer-times-heading">
        <h1 className="text-heading text-primary" id="prayer-times-heading">
          أوقات الصلاة
        </h1>
        <p className="text-body-premium text-muted-foreground">
          عرض هادئ لأوقات اليوم حسب البيانات المحلية المتاحة.
        </p>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-primary bg-primary p-5 text-white shadow-card">
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-28 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-8 -top-8 size-20 rounded-full bg-gold/10" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/80">
                <Clock className="size-3.5 text-gold" strokeWidth={1.7} />
                الصلاة القادمة
              </span>
              <h2 className="text-[22px] font-extrabold leading-tight text-background">
                صلاة {nextPrayer.name}
              </h2>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-center">
              <p className="text-[10px] font-bold text-white/70">الأذان</p>
              <p className="font-mono text-2xl font-extrabold text-gold">{nextPrayer.time}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/85">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-gold" strokeWidth={1.7} />
              مكة المكرمة
            </span>
            <span>اليوم</span>
          </div>
        </div>
      </section>

      <section className="space-y-2.5" aria-label="مواقيت اليوم">
        {prayers.map((prayer) => {
          const isNext = prayer.id === nextPrayer.id;

          return (
            <div
              className={`flex items-center justify-between rounded-2xl border p-3.5 shadow-soft ${
                isNext
                  ? "border-gold bg-background ring-1 ring-gold/20"
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
                  <h2 className="text-base font-bold text-primary">{prayer.name}</h2>
                  {isNext ? (
                    <p className="text-[10px] font-bold text-gold">الصلاة القادمة</p>
                  ) : null}
                </div>
              </div>
              <span className="font-mono text-base font-extrabold text-primary">{prayer.time}</span>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
            <RefreshCw className="size-4.5" strokeWidth={1.7} />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-primary">تحديث الموقع</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              يمكن ربط تحديث الموقع لاحقا عند توفر إذن المستخدم. لا تعرض هذه الصفحة قيما تقنية أو غير مؤكدة.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
