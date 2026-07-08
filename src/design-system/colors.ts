export const colors = {
  emerald: {
    surface: "bg-primary",
    surfaceSoft: "bg-primary/10",
    text: "text-primary",
    foreground: "text-primary-foreground",
    border: "border-primary/15",
    hover: "hover:bg-primary/92"
  },
  gold: {
    surface: "bg-gold",
    surfaceSoft: "bg-gold/18",
    text: "text-gold-foreground",
    foreground: "text-gold-foreground",
    border: "border-gold/25",
    hover: "hover:bg-gold/88"
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
