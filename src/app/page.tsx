import { getAzkarItems } from "@/services/content";

import { HomeContent } from "./HomeContent";

export default function HomePage() {
  const quranDuas = getAzkarItems("quran-duas");
  const propheticDuas = getAzkarItems("prophetic-duas");
  const comprehensiveDuas = getAzkarItems("comprehensive-duas");
  const dailyReminder = propheticDuas[0] ?? comprehensiveDuas[0] ?? quranDuas[0];
  const dailyWird = quranDuas.find((item) => item.id !== dailyReminder?.id) ?? quranDuas[0];
  const reminder = dailyReminder
    ? {
        text: dailyReminder.arabicText,
        source: dailyReminder.source,
        authenticity: dailyReminder.authenticity
      }
    : null;

  const wird = dailyWird
    ? {
        text: dailyWird.arabicText,
        source: dailyWird.source,
        authenticity: dailyWird.authenticity
      }
    : null;

  return <HomeContent reminder={reminder} wird={wird} />;
}
