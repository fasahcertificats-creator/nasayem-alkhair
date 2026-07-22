import { cn } from "@/lib/utils";

interface UmrahSourceMetaProps {
  className?: string;
  displayReferenceAr?: string;
}

export function UmrahSourceMeta({ className, displayReferenceAr }: UmrahSourceMetaProps) {
  const sourceText = displayReferenceAr?.trim();

  if (!sourceText) {
    return null;
  }

  return (
    <p
      className={cn(
        "border-border/70 text-muted-foreground border-t pt-3 text-[12px] leading-relaxed",
        className
      )}
    >
      {sourceText}
    </p>
  );
}
