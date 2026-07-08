import type { AppLocale } from "@/types/i18n";

export const SUPPORTED_LOCALES = ["ar", "en"] as const satisfies readonly AppLocale[];
export const DEFAULT_LOCALE = "ar" satisfies AppLocale;
