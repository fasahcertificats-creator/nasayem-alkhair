import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const loadingSkeletonVariants = cva("animate-pulse rounded-md bg-muted", {
  variants: {
    variant: {
      default: "h-4 w-full",
      text: "h-4 w-3/4",
      title: "h-7 w-1/2",
      avatar: "size-12 rounded-full",
      card: "h-40 rounded-card"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface LoadingSkeletonProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingSkeletonVariants> {}

export function LoadingSkeleton({ className, variant, ...props }: LoadingSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(loadingSkeletonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { loadingSkeletonVariants };
