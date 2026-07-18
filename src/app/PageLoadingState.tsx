import { LoaderCircle } from "lucide-react";

interface PageLoadingStateProps {
  label?: string;
}

export function PageLoadingState({ label = "جاري التحميل" }: PageLoadingStateProps) {
  return (
    <div className="px-5 py-8 text-right" dir="rtl">
      <div className="rounded-[22px] border border-border bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
            <LoaderCircle className="size-5 animate-spin" strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-sm font-bold text-primary">{label}</p>
            <p className="text-xs text-muted-foreground">يتم تجهيز الصفحة بهدوء.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
