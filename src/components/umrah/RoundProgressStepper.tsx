import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UmrahContext } from "@/types";

interface RoundProgressStepperProps {
  completedRoundCount: number;
  context: UmrahContext;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function getStepState(round: number, completedRoundCount: number) {
  if (round <= completedRoundCount) {
    return "completed";
  }

  if (round === completedRoundCount + 1) {
    return "active";
  }

  return "upcoming";
}

export function RoundProgressStepper({
  completedRoundCount,
  context
}: RoundProgressStepperProps) {
  const activeRound = Math.min(completedRoundCount + 1, 7);
  const ritualLabel = context === "tawaf" ? "الطواف" : "السعي";

  return (
    <section aria-label={`تقدم أشواط ${ritualLabel}`} className="space-y-2.5">
      {completedRoundCount < 7 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-primary text-sm font-bold">الشوط الحالي</p>
          <p className="text-muted-foreground text-xs font-semibold">
            الشوط {arabicNumberFormatter.format(activeRound)} من {arabicNumberFormatter.format(7)}
          </p>
        </div>
      ) : (
        <p className="text-primary text-sm font-bold">اكتملت خطوات العداد السبع</p>
      )}

      <ol className="grid min-w-0 grid-cols-7 gap-1" aria-label="الأشواط السبعة">
        {Array.from({ length: 7 }, (_, index) => {
          const round = index + 1;
          const state = getStepState(round, completedRoundCount);
          const formattedRound = arabicNumberFormatter.format(round);
          const stateLabel =
            state === "completed" ? "مكتمل" : state === "active" ? "حالي" : "قادم";

          return (
            <li
              aria-current={state === "active" ? "step" : undefined}
              aria-label={`الشوط ${formattedRound}: ${stateLabel}`}
              className={cn(
                "relative flex aspect-square min-h-8 min-w-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-200 motion-reduce:transition-none",
                state === "completed" &&
                  "border-primary bg-[var(--nasayem-green-050)] text-primary",
                state === "active" && "border-gold bg-[var(--nasayem-gold-050)] text-primary",
                state === "upcoming" && "border-border bg-card text-muted-foreground"
              )}
              key={round}
            >
              <span>{formattedRound}</span>
              {state === "completed" ? (
                <Check
                  aria-hidden="true"
                  className="absolute -top-1 -end-0.5 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground"
                  strokeWidth={3}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
