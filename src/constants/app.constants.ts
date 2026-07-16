import type { AppLocale } from "@/types/i18n";

export const APP_METADATA = {
  name: "نسائم الخير",
  description: "دليل نسائم الخير للعمرة وأذكار السفر والمواقيت.",
  defaultLocale: "ar" satisfies AppLocale,
  themeColor: "#FAF9F6"
} as const;
