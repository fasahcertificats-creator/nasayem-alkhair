import type { AppLocale } from "@/types/i18n";

import type { AppTranslation } from "../entities/app-translation";

export interface TranslationRepository {
  getNamespace(locale: AppLocale, namespace: string): Promise<AppTranslation[]>;
}
