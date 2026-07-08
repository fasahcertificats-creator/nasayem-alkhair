import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { islamicPremiumTheme } from "./theme";

export type AppCardProps = ComponentProps<typeof Card>;

export function AppCard({ className, ...props }: AppCardProps) {
  return <Card className={cn(islamicPremiumTheme.components.card.base, className)} {...props} />;
}
