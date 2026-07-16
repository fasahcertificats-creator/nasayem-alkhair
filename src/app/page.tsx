import { getAzkarItems, getDuasByStageId, getUmrahStages } from "@/services/content";

import { HomeContent } from "./HomeContent";

export default function HomePage() {
  const travelItems = getAzkarItems("travel");
  const dailyReminder = travelItems[0];
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
      reminder={reminder}
      travelAzkarIds={travelItems.map((item) => item.id)}
      umrahStageCount={umrahStages.length}
    />
  );
}
