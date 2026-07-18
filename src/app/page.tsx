import { getAzkarItems } from "@/services/content";

import { HomeContent } from "./HomeContent";

export default function HomePage() {
  const dailyReminder =
    getAzkarItems("quran-duas")[0] ??
    getAzkarItems("prophetic-duas")[0] ??
    getAzkarItems("comprehensive-duas")[0];
  const reminder = dailyReminder
    ? {
        text: dailyReminder.arabicText,
        source: dailyReminder.source,
        authenticity: dailyReminder.authenticity
      }
    : null;

  return <HomeContent reminder={reminder} />;
}
