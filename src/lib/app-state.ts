const DAILY_PROGRESS_KEY = "nasayem-alkhair:dailyProgress";
const HISTORY_LOG_KEY = "nasayem-alkhair:historyLog";
const LAST_RESET_KEY = "nasayem-alkhair:lastResetAt";
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ProgressEntry {
  stepId: string;
  completed: boolean;
  timestamp: number;
}

export interface HistoryEntry extends ProgressEntry {
  dayKey: string;
}

export interface StreakSummary {
  currentStreak: number;
  bestStreak: number;
}

export interface AppProgressState {
  dailyProgress: ProgressEntry[];
  historyLog: HistoryEntry[];
  streak: StreakSummary;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function getDayKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProgressEntry(value: unknown): value is ProgressEntry {
  return (
    isRecord(value) &&
    typeof value.stepId === "string" &&
    typeof value.completed === "boolean" &&
    typeof value.timestamp === "number" &&
    Number.isFinite(value.timestamp) &&
    value.timestamp > 0
  );
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  return (
    isRecord(value) &&
    isProgressEntry(value) &&
    typeof value.dayKey === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.dayKey)
  );
}

function readJson<TValue>(
  key: string,
  fallback: TValue,
  guard: (value: unknown) => value is TValue
): TValue {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    const parsedValue = JSON.parse(value);

    return guard(parsedValue) ? parsedValue : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<TValue>(key: string, value: TValue): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function readLastResetAt(): number {
  if (!canUseStorage()) {
    return Date.now();
  }

  const value = window.localStorage.getItem(LAST_RESET_KEY);
  const parsedValue = value ? Number(value) : NaN;

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : Date.now();
}

function writeLastResetAt(timestamp: number): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(LAST_RESET_KEY, String(timestamp));
}

function appendCompletedProgressToHistory(progress: ProgressEntry[]): void {
  const completedProgress = progress.filter((entry) => entry.completed);

  if (completedProgress.length === 0) {
    return;
  }

  const history = readJson<HistoryEntry[]>(
    HISTORY_LOG_KEY,
    [],
    (value): value is HistoryEntry[] => Array.isArray(value) && value.every(isHistoryEntry)
  );
  const nextHistory = [...history];

  for (const entry of completedProgress) {
    const dayKey = getDayKey(entry.timestamp);
    const alreadyLogged = nextHistory.some(
      (historyEntry) => historyEntry.dayKey === dayKey && historyEntry.stepId === entry.stepId
    );

    if (!alreadyLogged) {
      nextHistory.push({ ...entry, dayKey });
    }
  }

  writeJson(HISTORY_LOG_KEY, nextHistory);
}

export function resetDailyProgress(): void {
  const progress = readJson<ProgressEntry[]>(
    DAILY_PROGRESS_KEY,
    [],
    (value): value is ProgressEntry[] => Array.isArray(value) && value.every(isProgressEntry)
  );

  appendCompletedProgressToHistory(progress);
  writeJson<ProgressEntry[]>(DAILY_PROGRESS_KEY, []);
  writeLastResetAt(Date.now());
}

function ensureDailyProgressIsFresh(): void {
  if (!canUseStorage()) {
    return;
  }

  const lastResetAt = readLastResetAt();

  if (getDayKey(Date.now()) !== getDayKey(lastResetAt) || Date.now() - lastResetAt >= DAY_MS * 2) {
    resetDailyProgress();
    return;
  }

  if (!window.localStorage.getItem(LAST_RESET_KEY)) {
    writeLastResetAt(Date.now());
  }
}

export function loadProgress(): ProgressEntry[] {
  ensureDailyProgressIsFresh();

  return readJson<ProgressEntry[]>(
    DAILY_PROGRESS_KEY,
    [],
    (value): value is ProgressEntry[] => Array.isArray(value) && value.every(isProgressEntry)
  );
}

export function saveProgress(progress: ProgressEntry[]): void {
  ensureDailyProgressIsFresh();
  writeJson(DAILY_PROGRESS_KEY, progress.filter(isProgressEntry));
}

export function loadHistoryLog(): HistoryEntry[] {
  return readJson<HistoryEntry[]>(
    HISTORY_LOG_KEY,
    [],
    (value): value is HistoryEntry[] => Array.isArray(value) && value.every(isHistoryEntry)
  );
}

export function getStreak(): StreakSummary {
  const history = loadHistoryLog();
  const progress = loadProgress();
  const completedDayKeys = new Set<string>();

  for (const entry of history) {
    completedDayKeys.add(entry.dayKey);
  }

  for (const entry of progress) {
    if (entry.completed) {
      completedDayKeys.add(getDayKey(entry.timestamp));
    }
  }

  const sortedDayKeys = [...completedDayKeys].sort();
  let bestStreak = 0;
  let runningStreak = 0;
  let previousTime: number | null = null;

  for (const dayKey of sortedDayKeys) {
    const currentTime = new Date(`${dayKey}T00:00:00`).getTime();
    runningStreak =
      previousTime !== null && currentTime - previousTime === DAY_MS ? runningStreak + 1 : 1;
    bestStreak = Math.max(bestStreak, runningStreak);
    previousTime = currentTime;
  }

  const todayKey = getDayKey(Date.now());
  let currentStreak = 0;
  let cursorTime = new Date(`${todayKey}T00:00:00`).getTime();

  while (completedDayKeys.has(getDayKey(cursorTime))) {
    currentStreak += 1;
    cursorTime -= DAY_MS;
  }

  return {
    currentStreak,
    bestStreak
  };
}

export function loadAppProgressState(): AppProgressState {
  return {
    dailyProgress: loadProgress(),
    historyLog: loadHistoryLog(),
    streak: getStreak()
  };
}
