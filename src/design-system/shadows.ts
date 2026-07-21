export const shadows = {
  none: "shadow-none",
  soft: "shadow-soft",
  card: "shadow-card",
  elevated: "shadow-card-elevated",
  navigation: "shadow-navigation",
  focus: "focus-visible:shadow-focus"
} as const;

export type AppShadowToken = typeof shadows;
