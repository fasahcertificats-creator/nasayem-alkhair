import type { Route } from "next";

export const ROUTES = {
  home: "/" as Route,
  azkar: "/azkar" as Route,
  miqat: "/miqat" as Route,
  more: "/more" as Route,
  privacy: "/privacy" as Route,
  terms: "/terms" as Route,
  disclaimer: "/disclaimer" as Route,
  sources: "/sources" as Route,
  support: "/support" as Route,
  prayerTimes: "/prayer-times" as Route,
  progress: "/progress" as Route,
  services: "/services" as Route,
  tasbih: "/tasbih" as Route,
  umrah: "/umrah" as Route,
  azkarCategory: (category: string) => `/azkar/${category}` as Route,
  umrahStage: (stage: string) => `/umrah/${stage}` as Route
} as const;
