import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { IslamicPattern } from "./IslamicPattern";

export interface SectionHeadingProps {
  align?: "right" | "center";
  className?: string;
  icon?: ReactNode;
  id?: string;
  ornament?: boolean;
  supportingText?: ReactNode;
  title: ReactNode;
}

export function SectionHeading({
  align = "right",
  className,
  icon,
  id,
  ornament = false,
  supportingText,
  title
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "relative min-w-0 space-y-1.5",
        isCentered ? "text-center" : "text-right",
        className
      )}
      dir="rtl"
    >
      {ornament ? <IslamicPattern size="small" tone="gold" variant="header" /> : null}
      <div
        className={cn(
          "relative flex min-w-0 items-center gap-2",
          isCentered ? "justify-center" : "justify-start"
        )}
      >
        {icon}
        <h2 className="text-subheading text-primary min-w-0 font-bold" id={id}>
          {title}
        </h2>
      </div>
      {supportingText ? (
        <p className="text-caption-premium text-muted-foreground relative min-w-0 break-words">
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}
