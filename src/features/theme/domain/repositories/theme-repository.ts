import type { ThemePreference } from "../entities/theme-preference";

export interface ThemeRepository {
  getPreference(userId: string): Promise<ThemePreference | null>;
  savePreference(userId: string, preference: ThemePreference): Promise<void>;
}
