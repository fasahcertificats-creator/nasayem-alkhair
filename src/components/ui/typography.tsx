import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function DisplayText({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-display text-primary", className)} {...props} />;
}

export function HeadingText({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-heading text-primary", className)} {...props} />;
}

export function SubheadingText({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-subheading text-primary", className)} {...props} />;
}

export function BodyText({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-body-premium text-foreground", className)} {...props} />;
}

export function CaptionText({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-caption-premium text-muted-foreground", className)} {...props} />;
}
