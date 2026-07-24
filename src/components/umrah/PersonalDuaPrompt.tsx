import { UMRAH_COMPANION_COPY } from "@/data/umrah-companion-copy";

export function PersonalDuaPrompt() {
  return (
    <aside className="space-y-1.5 rounded-[var(--radius-medium)] bg-[var(--nasayem-green-050)] px-4 py-3">
      <h3 className="text-primary text-sm font-bold">
        {UMRAH_COMPANION_COPY.common.personalDuaTitle}
      </h3>
      <p className="text-muted-foreground text-[13px] leading-[1.8]">
        {UMRAH_COMPANION_COPY.common.personalDuaText}
      </p>
    </aside>
  );
}
