import assert from "node:assert/strict";

import {
  formatArabicInteger,
  formatArabicPrayerTime,
  formatArabicRemainingDuration,
  formatGregorianDate,
  formatHijriDate,
  formatHomeDateLine,
  getHomeGreeting,
  getMillisecondsUntilNextHomeRefresh,
  normalizeCityLabel,
  parseSafeTasbihCount,
  parseSafeTasbihTotal
} from "../src/lib/home-presentation";
import {
  calculatePrayerTimes,
  validatePrayerLocation
} from "../src/services/prayer/prayer-times.service";

const fixedDate = new Date(2026, 6, 24, 12, 0, 0);
const gregorian = formatGregorianDate(fixedDate);
const hijri = formatHijriDate(fixedDate);
const dateLine = formatHomeDateLine(fixedDate);

assert.match(gregorian, /يوليو/);
assert.match(gregorian, /٢٠٢٦/);
assert.doesNotMatch(gregorian, /هـ/);
assert.match(hijri, /هـ/);
assert.notEqual(gregorian, hijri);
assert.ok(dateLine.includes(gregorian));
assert.ok(dateLine.includes(hijri));

assert.notEqual(
  getHomeGreeting(new Date(2026, 6, 24, 11, 59)),
  getHomeGreeting(new Date(2026, 6, 24, 12, 0))
);
assert.ok(
  getMillisecondsUntilNextHomeRefresh(new Date(2026, 6, 24, 23, 59)) <= 61_000
);
assert.ok(
  getMillisecondsUntilNextHomeRefresh(new Date(2026, 11, 31, 23, 59, 59)) <= 2_000
);
assert.notEqual(
  formatGregorianDate(new Date(2026, 11, 31, 23, 59)),
  formatGregorianDate(new Date(2027, 0, 1, 0, 0))
);

const minute = 60_000;
assert.equal(formatArabicRemainingDuration(0), "متبقي أقل من دقيقة");
assert.equal(formatArabicRemainingDuration(minute), "متبقي دقيقة واحدة");
assert.equal(formatArabicRemainingDuration(2 * minute), "متبقي دقيقتان");
assert.equal(formatArabicRemainingDuration(5 * minute), "متبقي ٥ دقائق");
assert.equal(formatArabicRemainingDuration(11 * minute), "متبقي ١١ دقيقة");
assert.equal(formatArabicRemainingDuration(60 * minute), "متبقي ساعة واحدة");
assert.equal(formatArabicRemainingDuration(120 * minute), "متبقي ساعتان");
assert.equal(formatArabicRemainingDuration(185 * minute), "متبقي ٣ ساعات و٥ دقائق");
assert.equal(formatArabicRemainingDuration(-minute), "متبقي أقل من دقيقة");

assert.equal(normalizeCityLabel(" عدن، اليمن "), "عدن");
assert.equal(normalizeCityLabel("المدينة المنورة"), "المدينة المنورة");
assert.equal(normalizeCityLabel("إسطنبول — تركيا"), "إسطنبول");
assert.equal(normalizeCityLabel("Unknown"), null);
assert.equal(normalizeCityLabel("Near Sana'a"), null);
assert.equal(normalizeCityLabel("تم تحديد الموقع"), null);
assert.equal(normalizeCityLabel("15.3694, 44.1910"), null);

assert.equal(parseSafeTasbihCount(0), 0);
assert.equal(parseSafeTasbihCount(999), 999);
assert.equal(parseSafeTasbihCount(Number.NaN), 0);
assert.equal(parseSafeTasbihCount(Number.POSITIVE_INFINITY), 0);
assert.equal(parseSafeTasbihCount(-1), 0);
assert.equal(parseSafeTasbihCount("12"), 0);
assert.equal(parseSafeTasbihTotal({ first: 10, second: 5, bad: "4" }), 15);
assert.equal(parseSafeTasbihTotal("malformed"), 0);

assert.equal(formatArabicInteger(0), "٠");
assert.equal(formatArabicInteger(999), "٩٩٩");
assert.doesNotMatch(formatArabicInteger(999), /[0-9]/);
assert.doesNotMatch(formatArabicPrayerTime(fixedDate), /[0-9]|AM|PM/);

const storedLocation = validatePrayerLocation({
  latitude: 21.4225,
  longitude: 39.8262,
  acquiredAt: fixedDate.getTime(),
  cityLabel: "مكة المكرمة"
});
assert.equal(storedLocation?.cityLabel, "مكة المكرمة");

const prayerLocation = {
  latitude: 21.4225,
  longitude: 39.8262,
  acquiredAt: fixedDate.getTime(),
  cityLabel: "مكة المكرمة"
};
const sameDayCalculation = calculatePrayerTimes(prayerLocation, fixedDate);
const afterIsha = new Date(
  sameDayCalculation.rows.find((row) => row.id === "isha")!.time.getTime() + minute
);
const afterIshaCalculation = calculatePrayerTimes(prayerLocation, afterIsha);
assert.equal(afterIshaCalculation.nextPrayer.id, "fajr");
assert.ok(afterIshaCalculation.nextPrayer.time.getTime() > afterIsha.getTime());
assert.ok(afterIshaCalculation.remainingMs >= 0);

console.log("Home presentation verification: PASS");
