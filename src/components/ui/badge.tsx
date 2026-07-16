import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/15 bg-primary/5 text-primary",
        gold: "border-gold/20 bg-gold/10 text-gold",
        muted: "border-border bg-muted text-muted-foreground",
        outline: "border-border bg-secondary text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { badgeVariants };
