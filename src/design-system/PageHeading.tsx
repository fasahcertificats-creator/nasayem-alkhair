import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeadingProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function PageHeading({ children, className, id }: PageHeadingProps) {
  return (
    <h1 className={cn("text-heading text-primary text-center", className)} id={id}>
      {children}
    </h1>
  );
}
