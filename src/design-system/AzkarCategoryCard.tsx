import type { ComponentType, CSSProperties, SVGProps } from "react";

import Link from "next/link";
import type { Route } from "next";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { IconBadge } from "./IconBadge";
import { IslamicPattern } from "./IslamicPattern";

export interface AzkarCategoryCardProps {
  accent: string;
  actionLabel: string;
  className?: string;
  href: Route;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
}

export function AzkarCategoryCard({
  accent,
  actionLabel,
  className,
  href,
  icon: Icon,
  title
}: AzkarCategoryCardProps) {
  return (
    <Link
      aria-label={`${actionLabel}: ${title}`}
      className={cn(
        "group relative box-border flex min-h-[136px] min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card p-4 text-right shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--category-accent)] hover:shadow-card-elevated focus-visible:ring-2 focus-visible:ring-[color:var(--category-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className
      )}
      href={href}
      style={{ "--category-accent": accent } as CSSProperties}
    >
      <IslamicPattern
        className="end-2 top-2"
        opacity={0.035}
        size="small"
        tone="gold"
        variant="corner"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-4 end-0 w-1 rounded-s-full bg-[color:var(--category-accent)] opacity-70"
      />
      <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-4">
        <IconBadge
          className="size-10 bg-[color:var(--category-accent-soft)] text-[color:var(--category-accent)]"
          style={{ "--category-accent-soft": `${accent}1A` } as CSSProperties}
          tone="neutral"
        >
          <Icon aria-hidden="true" />
        </IconBadge>
        <div className="min-w-0 space-y-3">
          <h2 className="text-primary text-[17px] leading-relaxed font-bold text-balance">
            {title}
          </h2>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--category-accent)] opacity-80 transition group-hover:opacity-100">
            <span>{actionLabel}</span>
            <ChevronDown aria-hidden="true" className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
