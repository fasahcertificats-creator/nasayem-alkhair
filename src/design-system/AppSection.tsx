import type { ComponentProps } from "react";

import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

import { islamicPremiumTheme } from "./theme";

export type AppSectionProps = ComponentProps<typeof Section>;

export function AppSection({ className, ...props }: AppSectionProps) {
  return (
    <Section className={cn(islamicPremiumTheme.components.section.base, className)} {...props} />
  );
}
