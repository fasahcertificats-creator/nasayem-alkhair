import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SurfaceCardProps extends ComponentProps<"div"> {
  decoration?: ReactNode;
  variant?: "default" | "muted" | "selected" | "elevated";
}

const variantClassName = {
  default: "border-border bg-card shadow-card",
  muted: "border-border bg-secondary shadow-soft",
  selected: "border-primary/35 bg-[var(--nasayem-green-050)] shadow-card",
  elevated: "border-border bg-card shadow-card-elevated"
} as const;

export function SurfaceCard({
  children,
  className,
  decoration,
  variant = "default",
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "relative box-border w-full min-w-0 overflow-hidden rounded-[var(--radius-card)] border text-foreground",
        variantClassName[variant],
        className
      )}
      {...props}
    >
      {decoration}
      {children}
    </div>
  );
}
