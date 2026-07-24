"use client";

import { ChevronDown, RotateCcw, Undo2 } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import { UMRAH_COMPANION_COPY } from "@/data/umrah-companion-copy";
import { cn } from "@/lib/utils";
import {
  loadUmrahRoundProgress,
  repairMalformedUmrahRoundProgress,
  saveUmrahRoundProgress,
  subscribeToUmrahRoundProgress
} from "@/lib/umrah-companion-storage";
import type { UmrahContext, UmrahDuaItem } from "@/types";

import { PersonalDuaPrompt } from "./PersonalDuaPrompt";
import { RoundProgressStepper } from "./RoundProgressStepper";
import { getSaiDirection, SaiDirectionList } from "./SaiDirectionList";
import { SelectedDuasDisclosure } from "./SelectedDuasDisclosure";

interface UmrahRoundCompanionProps {
  context: UmrahContext;
  duas: UmrahDuaItem[];
}

const arabicNumberFormatter = new Intl.NumberFormat("ar-u-nu-arab", {
  useGrouping: false
});

function CurrentRoundCard({
  context,
  currentRound,
  isIncrementLocked,
  onIncrement
}: {
  context: UmrahContext;
  currentRound: number;
  isIncrementLocked: boolean;
  onIncrement: () => void;
}) {
  const formattedRound = arabicNumberFormatter.format(currentRound);
  const formattedTotal = arabicNumberFormatter.format(7);
  const primaryLabel = currentRound === 7 ? "إتمام الشوط السابع" : "تمّ الشوط";

  return (
    <section
      aria-labelledby={`${context}-current-round-title`}
      className="border-gold/35 bg-[var(--nasayem-gold-050)] space-y-3 rounded-[var(--radius-medium)] border px-4 py-4"
    >
      <div className="space-y-1">
        <h3
          className="text-primary text-lg leading-relaxed font-bold"
          id={`${context}-current-round-title`}
        >
          الشوط {formattedRound} من {formattedTotal}
        </h3>
        {context === "sai" ? (
          <p className="text-primary text-[15px] leading-relaxed font-semibold">
            من {getSaiDirection(currentRound).origin} إلى{" "}
            {getSaiDirection(currentRound).destination}
          </p>
        ) : null}
      </div>

      {context === "tawaf" ? (
        <div className="text-muted-foreground space-y-2 text-[13px] leading-[1.85]">
          <p>{UMRAH_COMPANION_COPY.tawaf.currentRoundGuidance}</p>
          <p>{UMRAH_COMPANION_COPY.tawaf.blackStoneInstruction}</p>
          <p className="text-primary font-semibold">
            {UMRAH_COMPANION_COPY.tawaf.blackStoneReminder}
          </p>
          <p>{UMRAH_COMPANION_COPY.tawaf.directionReminder}</p>
          <p>{UMRAH_COMPANION_COPY.tawaf.otherPartsGuidance}</p>
          <p>{UMRAH_COMPANION_COPY.tawaf.personalRoundReminder}</p>
        </div>
      ) : (
        <div className="text-muted-foreground space-y-2 text-[13px] leading-[1.85]">
          <p>{UMRAH_COMPANION_COPY.sai.positionReminder}</p>
          <p>{UMRAH_COMPANION_COPY.sai.dhikrInstruction}</p>
          <p>{UMRAH_COMPANION_COPY.sai.pathReminder}</p>
        </div>
      )}

      <button
        aria-label={`${primaryLabel} في ${context === "tawaf" ? "الطواف" : "السعي"}`}
        className="focus-visible:ring-gold focus-visible:ring-offset-background min-h-12 w-full rounded-[var(--radius-medium)] bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[var(--nasayem-sage-600)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:active:scale-100"
        disabled={isIncrementLocked}
        onClick={onIncrement}
        type="button"
      >
        {primaryLabel}
      </button>
    </section>
  );
}

function CompletedCounterState({ context }: { context: UmrahContext }) {
  const copy = UMRAH_COMPANION_COPY[context];

  return (
    <section className="border-primary/20 bg-[var(--nasayem-green-050)] space-y-2 rounded-[var(--radius-medium)] border px-4 py-4">
      <h3 className="text-primary text-base font-bold">{copy.completedCounterText}</h3>
      <p className="text-muted-foreground text-[13px] leading-[1.8]">{copy.completionCaution}</p>
    </section>
  );
}

export function UmrahRoundCompanion({ context, duas }: UmrahRoundCompanionProps) {
  const panelId = useId();
  const [isIncrementLocked, setIsIncrementLocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
  const incrementLockRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToUmrahRoundProgress(context, onStoreChange),
    [context]
  );
  const getSnapshot = useCallback(() => loadUmrahRoundProgress(context), [context]);
  const completedRoundCount = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  const copy = UMRAH_COMPANION_COPY[context];
  const ritualLabel = context === "tawaf" ? "الطواف" : "السعي";
  const isComplete = completedRoundCount >= 7;
  const currentRound = Math.min(completedRoundCount + 1, 7);

  useEffect(() => {
    repairMalformedUmrahRoundProgress(context);

    return () => {
      if (unlockTimerRef.current !== null) {
        clearTimeout(unlockTimerRef.current);
      }
    };
  }, [context]);

  function updateRoundCount(nextRoundCount: number) {
    const safeRoundCount = Math.min(7, Math.max(0, nextRoundCount));
    saveUmrahRoundProgress(context, safeRoundCount);
  }

  function incrementRoundCount() {
    if (incrementLockRef.current || completedRoundCount >= 7) {
      return;
    }

    incrementLockRef.current = true;
    setIsIncrementLocked(true);
    updateRoundCount(completedRoundCount + 1);

    unlockTimerRef.current = setTimeout(() => {
      incrementLockRef.current = false;
      setIsIncrementLocked(false);
      unlockTimerRef.current = null;
    }, 350);
  }

  function undoLastRound() {
    if (completedRoundCount <= 0) {
      return;
    }

    setIsResetConfirmationOpen(false);
    updateRoundCount(completedRoundCount - 1);
  }

  function resetRoundCount() {
    setIsResetConfirmationOpen(false);
    updateRoundCount(0);
  }

  const liveProgressText = isComplete
    ? copy.completedCounterText
    : `الشوط الحالي ${arabicNumberFormatter.format(currentRound)} من ${arabicNumberFormatter.format(7)}`;

  return (
    <section className="border-border shadow-card overflow-hidden rounded-[var(--radius-card)] border bg-[var(--nasayem-surface)]">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-right focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="min-w-0 space-y-0.5">
          <span className="text-primary block text-[16px] leading-relaxed font-bold">
            {copy.title}
          </span>
          <span className="text-muted-foreground block text-[12px] leading-relaxed">
            {copy.support}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "text-gold size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className="border-border space-y-4 border-t bg-[var(--nasayem-surface-muted)]/35 px-4 pt-4 pb-5"
        hidden={!isOpen}
        id={panelId}
      >
        <div className="space-y-2">
          <p className="border-gold/25 bg-[var(--nasayem-gold-050)] text-primary rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed font-semibold">
            {UMRAH_COMPANION_COPY.common.generalDuaNotice}
          </p>
          <p className="text-muted-foreground text-[12px] leading-relaxed">
            {UMRAH_COMPANION_COPY.common.religiousNotice}
          </p>
          <p className="text-muted-foreground text-[12px] leading-relaxed">
            {UMRAH_COMPANION_COPY.common.counterNotice}
          </p>
        </div>

        <RoundProgressStepper completedRoundCount={completedRoundCount} context={context} />

        {context === "sai" ? (
          <SaiDirectionList completedRoundCount={completedRoundCount} />
        ) : null}

        {isComplete ? (
          <CompletedCounterState context={context} />
        ) : (
          <CurrentRoundCard
            context={context}
            currentRound={currentRound}
            isIncrementLocked={isIncrementLocked}
            onIncrement={incrementRoundCount}
          />
        )}

        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {liveProgressText}
        </p>

        <PersonalDuaPrompt />
        <SelectedDuasDisclosure duas={duas} />

        {completedRoundCount > 0 ? (
          <section aria-label={`تصحيح عداد ${ritualLabel}`} className="space-y-3 pt-1">
            <button
              aria-label={`التراجع عن آخر شوط في ${ritualLabel}`}
              className="border-border focus-visible:ring-gold focus-visible:ring-offset-background flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-medium)] border bg-card px-4 py-2 text-sm font-bold text-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={undoLastRound}
              type="button"
            >
              <Undo2 aria-hidden="true" className="size-4" />
              التراجع عن آخر شوط
            </button>

            <div className="border-border border-t pt-3">
              {isResetConfirmationOpen ? (
                <div
                  aria-label={`تأكيد إعادة عداد ${ritualLabel}`}
                  className="space-y-3"
                  role="group"
                >
                  <p className="text-primary text-[13px] leading-relaxed font-semibold">
                    سيعود العداد إلى الشوط الأول. هل تريد المتابعة؟
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="border-border focus-visible:ring-gold min-h-11 rounded-[var(--radius-medium)] border bg-card px-3 py-2 text-sm font-bold text-primary focus-visible:ring-2 focus-visible:outline-none"
                      onClick={() => setIsResetConfirmationOpen(false)}
                      type="button"
                    >
                      إلغاء
                    </button>
                    <button
                      className="focus-visible:ring-gold min-h-11 rounded-[var(--radius-medium)] bg-primary px-3 py-2 text-sm font-bold text-primary-foreground focus-visible:ring-2 focus-visible:outline-none"
                      onClick={resetRoundCount}
                      type="button"
                    >
                      إعادة العداد
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  aria-label={`بدء عداد ${ritualLabel} من جديد`}
                  className="text-muted-foreground focus-visible:ring-gold inline-flex min-h-11 items-center gap-2 rounded-lg px-2 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() => setIsResetConfirmationOpen(true)}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" className="size-3.5" />
                  بدء العد من جديد
                </button>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
