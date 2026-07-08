export const typography = {
  fontFamily: {
    arabic: "font-sans",
    english: "font-sans"
  },
  direction: {
    arabic: "text-right",
    english: "text-left"
  },
  hierarchy: {
    display: "text-display",
    heading: "text-heading",
    subheading: "text-subheading",
    body: "text-body-premium",
    caption: "text-caption-premium"
  },
  tone: {
    primary: "text-primary",
    body: "text-foreground",
    muted: "text-muted-foreground",
    gold: "text-gold-foreground"
  },
  weight: {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  }
} as const;

export type AppTypographyToken = typeof typography;
