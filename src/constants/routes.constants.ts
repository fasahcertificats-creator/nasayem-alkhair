import type { Route } from "next";

export const ROUTES = {
  home: "/" as Route,
  azkar: "/azkar" as Route,
  miqat: "/miqat" as Route,
  more: "/more" as Route,
  progress: "/progress" as Route,
  umrah: "/umrah" as Route,
  azkarCategory: (category: string) => `/azkar/${category}` as Route,
  umrahStage: (stage: string) => `/umrah/${stage}` as Route
} as const;
