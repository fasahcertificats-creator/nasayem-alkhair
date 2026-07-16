export const colors = {
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
