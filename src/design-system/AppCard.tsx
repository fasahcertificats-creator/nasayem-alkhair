import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { islamicPremiumTheme } from "./theme";

export type AppCardProps = ComponentProps<typeof Card>;

export interface PremiumAppCardProps extends AppCardProps {
  variant?: "standard" | "emphasized" | "dark-primary" | "compact" | "disclosure";
}

const cardVariantClassName = {
  standard: "",
  emphasized: "bg-secondary",
  "dark-primary": "border-primary bg-primary text-primary-foreground",
  compact: "rounded-xl",
  disclosure:
    "transition duration-200 hover:border-gold/40 focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-background"
} as const;

export function AppCard({ className, variant = "standard", ...props }: PremiumAppCardProps) {
  return (
    <Card
      className={cn(
        islamicPremiumTheme.components.card.base,
        cardVariantClassName[variant],
        className
      )}
      {...props}
    />
  );
}
