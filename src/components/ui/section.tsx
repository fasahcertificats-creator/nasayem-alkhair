import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  heading?: ReactNode;
  description?: ReactNode;
  spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
  sm: "py-section-sm",
  md: "py-section-md",
  lg: "py-section-lg"
} as const;

export function Section({
  className,
  children,
  heading,
  description,
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {(heading || description) && (
          <div className="mb-8 max-w-3xl space-y-3">
            {heading && <h2 className="text-heading text-primary">{heading}</h2>}
            {description && (
              <p className="text-body-premium text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
