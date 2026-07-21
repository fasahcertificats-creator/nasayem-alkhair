import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export interface IconBadgeProps extends ComponentProps<"span"> {
  decorative?: boolean;
  shape?: "circle" | "rounded";
  tone?: "green" | "sage" | "gold" | "neutral";
}

const toneClassName = {
  green: "bg-[var(--nasayem-green-100)] text-primary",
  sage: "bg-[var(--nasayem-sage-100)] text-[var(--nasayem-sage-600)]",
  gold: "bg-[var(--nasayem-gold-050)] text-gold",
  neutral: "bg-secondary text-muted-foreground"
} as const;

const shapeClassName = {
  circle: "rounded-full",
  rounded: "rounded-[var(--radius-medium)]"
} as const;

export function IconBadge({
  children,
  className,
  decorative = true,
  shape = "rounded",
  tone = "green",
  ...props
}: IconBadgeProps) {
  return (
    <span
      aria-hidden={decorative ? "true" : undefined}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center [&_svg]:size-5 [&_svg]:stroke-[1.7]",
        toneClassName[tone],
        shapeClassName[shape],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
