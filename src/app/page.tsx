import { getAzkarItems, getDuasByStageId, getUmrahStages } from "@/services/content";

import { HomeContent } from "./HomeContent";

export default function HomePage() {
  const morningItems = getAzkarItems("morning");
  const eveningItems = getAzkarItems("evening");
  const dailyReminder = morningItems[0] ?? eveningItems[0];
  const fallbackReminder = getDuasByStageId("travel")[0];
  const umrahStages = getUmrahStages();
  const reminder = dailyReminder
    ? {
        text: dailyReminder.arabicText,
        source: dailyReminder.source
      }
    : fallbackReminder
      ? {
          text: fallbackReminder.arabicText,
          source: fallbackReminder.sourceReference
        }
      : null;

  return (
    <HomeContent
      eveningAzkarIds={eveningItems.map((item) => item.id)}
      morningAzkarIds={morningItems.map((item) => item.id)}
      reminder={reminder}
      umrahStageCount={umrahStages.length}
    />
  );
}
