import { colors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const islamicPremiumTheme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  components: {
    button: {
      base: [
        radius.full,
        typography.weight.semibold,
        shadows.focus,
        "transition-all duration-200"
      ].join(" "),
      variants: {
        primary: [colors.emerald.surface, colors.emerald.foreground, colors.emerald.hover].join(
          " "
        ),
        gold: [colors.gold.surface, colors.gold.foreground, colors.gold.hover].join(" "),
        outline: [
          "border",
          colors.ivory.border,
          colors.ivory.surfaceRaised,
          colors.ivory.text,
          shadows.soft,
          "hover:border-gold hover:text-primary"
        ].join(" "),
        ghost: [colors.emerald.text, "hover:bg-secondary"].join(" ")
      }
    },
    card: {
      base: [
        radius.card,
        "border",
        colors.ivory.border,
        colors.ivory.surfaceRaised,
        colors.ivory.text,
        shadows.card
      ].join(" ")
    },
    section: {
      base: colors.ivory.surface,
      container: spacing.container
    },
    badge: {
      base: [radius.full, typography.weight.semibold, "inline-flex w-fit items-center border"].join(
        " "
      ),
      variants: {
        emerald: [colors.emerald.surfaceSoft, colors.emerald.text, colors.emerald.border].join(" "),
        gold: [colors.gold.surfaceSoft, colors.gold.text, colors.gold.border].join(" "),
        ivory: [colors.ivory.surfaceRaised, colors.ivory.text, colors.ivory.border].join(" ")
      }
    }
  }
} as const;

export type IslamicPremiumTheme = typeof islamicPremiumTheme;
