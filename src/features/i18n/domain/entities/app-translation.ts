import type { AppLocale } from "@/types/i18n";

export interface AppTranslation {
  locale: AppLocale;
  namespace: string;
  key: string;
  value: string;
}
