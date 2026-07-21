import { cn } from "@/lib/utils";

export interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  size?: "small" | "medium" | "large";
  tone?: "green" | "gold";
  variant?: "corner" | "watermark" | "header";
}

const sizeClassName = {
  small: "size-16",
  medium: "size-24",
  large: "size-36"
} as const;

const toneClassName = {
  green: "text-primary",
  gold: "text-gold"
} as const;

const variantClassName = {
  corner: "absolute end-3 top-3",
  watermark: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  header: "absolute end-4 top-2"
} as const;

export function IslamicPattern({
  className,
  opacity,
  size = "medium",
  tone = "green",
  variant = "corner"
}: IslamicPatternProps) {
  const resolvedOpacity =
    opacity ?? (variant === "watermark" ? 0.035 : variant === "header" ? 0.045 : 0.05);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none shrink-0 overflow-visible",
        "rtl:[transform-box:fill-box]",
        sizeClassName[size],
        toneClassName[tone],
        variantClassName[variant],
        className
      )}
      fill="none"
      focusable="false"
      style={{ opacity: resolvedOpacity }}
      viewBox="0 0 100 100"
    >
      <path
        d="M50 8 61 39 92 50 61 61 50 92 39 61 8 50 39 39 50 8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M50 22 58 42 78 50 58 58 50 78 42 58 22 50 42 42 50 22Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <path
        d="M28 28h44v44H28z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1"
        transform="rotate(45 50 50)"
      />
      <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
