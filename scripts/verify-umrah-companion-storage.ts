import assert from "node:assert/strict";

class MemorySessionStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const sessionStorage = new MemorySessionStorage();
const events = new EventTarget();
const fakeWindow = {
  addEventListener: events.addEventListener.bind(events),
  dispatchEvent: events.dispatchEvent.bind(events),
  removeEventListener: events.removeEventListener.bind(events),
  sessionStorage
};

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: fakeWindow
});

const { UMRAH_COMPANION_STORAGE_KEYS } = await import(
  "../src/data/umrah-companion-copy"
);
const {
  loadUmrahRoundProgress,
  repairMalformedUmrahRoundProgress,
  saveUmrahRoundProgress
} = await import("../src/lib/umrah-companion-storage");

assert.notEqual(
  UMRAH_COMPANION_STORAGE_KEYS.tawaf,
  UMRAH_COMPANION_STORAGE_KEYS.sai,
  "Tawaf and Sa'i must use independent keys"
);

assert.equal(loadUmrahRoundProgress("tawaf"), 0);
assert.equal(loadUmrahRoundProgress("sai"), 0);

saveUmrahRoundProgress("tawaf", 4);
saveUmrahRoundProgress("sai", 2);
assert.equal(loadUmrahRoundProgress("tawaf"), 4);
assert.equal(loadUmrahRoundProgress("sai"), 2);

for (const malformedValue of [
  "{",
  "null",
  JSON.stringify({ version: 1, completedRoundCount: Number.NaN }),
  JSON.stringify({ version: 1, completedRoundCount: -1 }),
  JSON.stringify({ version: 1, completedRoundCount: 8 }),
  JSON.stringify({ version: 2, completedRoundCount: 3 }),
  JSON.stringify({ version: 1, completedRoundCount: "3" })
]) {
  sessionStorage.setItem(UMRAH_COMPANION_STORAGE_KEYS.tawaf, malformedValue);
  assert.equal(loadUmrahRoundProgress("tawaf"), 0);
  repairMalformedUmrahRoundProgress("tawaf");
  assert.deepEqual(
    JSON.parse(sessionStorage.getItem(UMRAH_COMPANION_STORAGE_KEYS.tawaf) ?? ""),
    { version: 1, completedRoundCount: 0 }
  );
}

saveUmrahRoundProgress("tawaf", 7);
saveUmrahRoundProgress("tawaf", 8);
assert.equal(loadUmrahRoundProgress("tawaf"), 7);

saveUmrahRoundProgress("sai", 0);
saveUmrahRoundProgress("sai", -1);
assert.equal(loadUmrahRoundProgress("sai"), 0);

console.log("PASS: sessionStorage state is SSR-safe and versioned");
console.log("PASS: malformed, negative, NaN, and above-seven state resets safely");
console.log("PASS: Tawaf and Sa'i counters remain independent");
console.log("PASS: stored counts remain bounded from 0 through 7");
