import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { islamicPremiumTheme } from "./theme";

type ShadcnButtonProps = ComponentProps<typeof Button>;

export interface AppButtonProps extends Omit<ShadcnButtonProps, "variant"> {
  tone?: "primary" | "gold" | "outline" | "ghost";
}

const buttonToneToVariant = {
  primary: "default",
  gold: "premium",
  outline: "outline",
  ghost: "ghost"
} as const;

export function AppButton({ className, tone = "primary", ...props }: AppButtonProps) {
  return (
    <Button
      className={cn(islamicPremiumTheme.components.button.base, className)}
      variant={buttonToneToVariant[tone]}
      {...props}
    />
  );
}
