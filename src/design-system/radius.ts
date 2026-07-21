export const radius = {
  sm: "rounded-[var(--radius-small)]",
  md: "rounded-[var(--radius-medium)]",
  lg: "rounded-[var(--radius-large)]",
  xl: "rounded-[var(--radius-large)]",
  card: "rounded-[var(--radius-card)]",
  full: "rounded-[var(--radius-pill)]"
} as const;

export type AppRadiusToken = typeof radius;
