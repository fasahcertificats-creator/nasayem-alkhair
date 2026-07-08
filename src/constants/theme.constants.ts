import type { ThemeMode } from "@/types/theme";

export const THEME_MODES = ["light", "dark", "system"] as const satisfies readonly ThemeMode[];
export const DEFAULT_THEME_MODE = "system" satisfies ThemeMode;
