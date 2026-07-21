export const colors = {
  nasayem: {
    bg: "var(--nasayem-bg)",
    surface: "var(--nasayem-surface)",
    surfaceMuted: "var(--nasayem-surface-muted)",
    green900: "var(--nasayem-green-900)",
    green800: "var(--nasayem-green-800)",
    green700: "var(--nasayem-green-700)",
    green100: "var(--nasayem-green-100)",
    green050: "var(--nasayem-green-050)",
    sage600: "var(--nasayem-sage-600)",
    sage400: "var(--nasayem-sage-400)",
    sage100: "var(--nasayem-sage-100)",
    gold600: "var(--nasayem-gold-600)",
    gold500: "var(--nasayem-gold-500)",
    gold200: "var(--nasayem-gold-200)",
    gold100: "var(--nasayem-gold-100)",
    gold050: "var(--nasayem-gold-050)",
    text: "var(--nasayem-text)",
    textSecondary: "var(--nasayem-text-secondary)",
    textMuted: "var(--nasayem-text-muted)",
    border: "var(--nasayem-border)",
    borderStrong: "var(--nasayem-border-strong)",
    success: "var(--nasayem-success)"
  },
  emerald: {
    surface: "bg-primary",
    surfaceSoft: "bg-primary/5",
    text: "text-primary",
    foreground: "text-primary-foreground",
    border: "border-primary/15",
    hover: "hover:bg-[#122A22]"
  },
  gold: {
    surface: "bg-gold",
    surfaceSoft: "bg-gold/10",
    text: "text-gold",
    foreground: "text-gold-foreground",
    border: "border-gold/20",
    hover: "hover:bg-[#a68242]"
  },
  ivory: {
    surface: "bg-background",
    surfaceRaised: "bg-card",
    text: "text-foreground",
    mutedText: "text-muted-foreground",
    border: "border-border"
  }
} as const;

export type AppColorToken = typeof colors;
