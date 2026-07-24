import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface SaiDirectionListProps {
  completedRoundCount: number;
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

const directions = Array.from({ length: 7 }, (_, index) => {
  const round = index + 1;
  const travelsToMarwah = round % 2 === 1;

  return {
    destination: travelsToMarwah ? "المروة" : "الصفا",
    origin: travelsToMarwah ? "الصفا" : "المروة",
    round
  };
});

export function getSaiDirection(round: number) {
  return directions.find((direction) => direction.round === round) ?? directions[0];
}

export function SaiDirectionList({ completedRoundCount }: SaiDirectionListProps) {
  return (
    <section aria-labelledby="sai-direction-list-title" className="space-y-2.5">
      <h3 className="text-primary text-sm font-bold" id="sai-direction-list-title">
        اتجاهات الأشواط السبعة
      </h3>
      <ol className="space-y-1.5">
        {directions.map(({ destination, origin, round }) => {
          const isCompleted = round <= completedRoundCount;
          const isActive = round === completedRoundCount + 1;
          const stateLabel = isCompleted ? "مكتمل" : isActive ? "حالي" : "قادم";
          const formattedRound = arabicNumberFormatter.format(round);

          return (
            <li
              aria-current={isActive ? "step" : undefined}
              aria-label={`الشوط ${formattedRound}: من ${origin} إلى ${destination}، ${stateLabel}`}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-[var(--radius-medium)] border px-3 py-2.5 text-sm",
                isCompleted && "border-primary/20 bg-[var(--nasayem-green-050)]",
                isActive && "border-gold bg-[var(--nasayem-gold-050)]",
                !isCompleted && !isActive && "border-border bg-card"
              )}
              key={round}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                {formattedRound}
              </span>
              <span
                aria-hidden="true"
                className="flex min-w-0 flex-1 flex-row-reverse items-center justify-center gap-2 font-semibold"
                dir="ltr"
              >
                <span dir="rtl">{origin}</span>
                <span className="text-gold" dir="ltr">
                  ←
                </span>
                <span dir="rtl">{destination}</span>
              </span>
              <span className="text-muted-foreground shrink-0 text-[11px] font-semibold">
                {isCompleted ? <Check aria-hidden="true" className="size-4 text-primary" /> : stateLabel}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
