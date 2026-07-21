"use client";

import { useSyncExternalStore } from "react";

import {
  AzkarRepetitionControl,
  AzkarSourceMeta,
  IslamicPattern,
  ReligiousText,
  SurfaceCard,
  spacing
} from "@/design-system";
import type { AzkarCategory, AzkarItem } from "@/types";

interface AzkarReaderCardProps {
  item: AzkarItem;
}

const azkarRepetitionStorageKey = "nasayem-alkhair:azkarRepetitionCounts";
const azkarRepetitionStorageEvent = "nasayem-alkhair:azkarRepetitionCountsChanged";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStoredCounters() {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(azkarRepetitionStorageKey) ?? "{}");

    return typeof parsedValue === "object" && parsedValue !== null && !Array.isArray(parsedValue)
      ? (parsedValue as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function readStoredCounter(itemId: string, target: number) {
  const storedValue = readStoredCounters()[itemId];

  return typeof storedValue === "number" && Number.isFinite(storedValue)
    ? Math.min(Math.max(0, storedValue), target)
    : 0;
}

function writeStoredCounter(itemId: string, count: number) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    azkarRepetitionStorageKey,
    JSON.stringify({
      ...readStoredCounters(),
      [itemId]: count
    })
  );
}

function emitCounterChange() {
  window.dispatchEvent(new Event(azkarRepetitionStorageEvent));
}

function subscribeToCounterChanges(callback: () => void) {
  if (!canUseStorage()) {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(azkarRepetitionStorageEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(azkarRepetitionStorageEvent, callback);
  };
}

function getContentKind(category: AzkarCategory, item: AzkarItem) {
  if (category === "quran-duas") {
    return "quran";
  }

  if (
    category === "prophetic-duas" ||
    item.authenticity === "sahih" ||
    item.authenticity === "hasan"
  ) {
    return "hadith";
  }

  return "dua";
}

export function AzkarReaderCard({ item }: AzkarReaderCardProps) {
  const hasCounter = item.displayMode !== "reading" && item.count >= 1;
  const contentKind = getContentKind(item.category, item);
  const counter = useSyncExternalStore(
    subscribeToCounterChanges,
    () => (hasCounter ? readStoredCounter(item.id, item.count) : 0),
    () => 0
  );

  function updateCounter(nextCounter: number) {
    writeStoredCounter(item.id, nextCounter);
    emitCounterChange();
  }

  function incrementCounter() {
    updateCounter(Math.min(counter + 1, item.count));
  }

  function resetCounter() {
    updateCounter(0);
  }

  return (
    <SurfaceCard
      className={`${spacing.inset.md} ${spacing.stack.md}`}
      decoration={
        contentKind === "quran" ? null : (
          <IslamicPattern
            className="-top-4 end-2"
            opacity={0.035}
            size="small"
            tone="green"
            variant="corner"
          />
        )
      }
      variant="default"
    >
      <div className="relative min-w-0">
        <ReligiousText
          authenticity={item.authenticity}
          kind={contentKind}
          showSourceMeta={false}
          source={item.source}
          sourceReference={item.sourceReference}
          title={item.title}
        >
          {item.arabicText}
        </ReligiousText>
      </div>

      <AzkarSourceMeta
        authenticity={item.authenticity}
        kind={contentKind}
        source={item.source}
        sourceReference={item.sourceReference}
      />

      {hasCounter ? (
        <AzkarRepetitionControl
          count={counter}
          onIncrement={incrementCounter}
          onReset={resetCounter}
          target={item.count}
        />
      ) : null}
    </SurfaceCard>
  );
}
