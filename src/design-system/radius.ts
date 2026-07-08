export const radius = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  card: "rounded-card",
  full: "rounded-full"
} as const;

export type AppRadiusToken = typeof radius;
