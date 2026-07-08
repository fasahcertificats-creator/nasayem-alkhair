import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { islamicPremiumTheme } from "./theme";

type ShadcnBadgeProps = ComponentProps<typeof Badge>;

export interface AppBadgeProps extends Omit<ShadcnBadgeProps, "variant"> {
  tone?: "emerald" | "gold" | "ivory";
}

const badgeToneToVariant = {
  emerald: "default",
  gold: "gold",
  ivory: "outline"
} as const;

export function AppBadge({ className, tone = "emerald", ...props }: AppBadgeProps) {
  return (
    <Badge
      className={cn(islamicPremiumTheme.components.badge.variants[tone], className)}
      variant={badgeToneToVariant[tone]}
      {...props}
    />
  );
}
