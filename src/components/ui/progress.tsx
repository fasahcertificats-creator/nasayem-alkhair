import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export function Progress({ className, value = 0, max = 100, ...props }: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (normalizedValue / max) * 100 : 0;

  return (
    <div
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cn("bg-secondary h-2 w-full overflow-hidden rounded-full", className)}
      role="progressbar"
      {...props}
    >
      <div
        className="bg-gold h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
