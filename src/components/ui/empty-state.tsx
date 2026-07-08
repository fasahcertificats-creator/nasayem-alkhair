import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  action,
  className,
  description,
  heading,
  icon,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border-border bg-card/70 shadow-soft flex min-h-64 flex-col items-center justify-center border border-dashed p-8 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="bg-gold/18 text-primary mb-4 flex size-12 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-subheading text-primary">{heading}</h3>
      {description && (
        <p className="text-body-premium text-muted-foreground mt-3 max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
