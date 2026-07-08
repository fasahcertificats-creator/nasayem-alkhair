export const spacing = {
  section: {
    sm: "py-section-sm",
    md: "py-section-md",
    lg: "py-section-lg"
  },
  container: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
  stack: {
    xs: "space-y-2",
    sm: "space-y-3",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8"
  },
  inline: {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6"
  },
  inset: {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }
} as const;

export type AppSpacingToken = typeof spacing;
