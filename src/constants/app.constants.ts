import type { AppLocale } from "@/types/i18n";

export const APP_METADATA = {
  name: "Nasayem Alkhair",
  description: "Production application foundation for Nasayem Alkhair.",
  defaultLocale: "ar" satisfies AppLocale,
  themeColor: "#ffffff"
} as const;
