import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-dvh bg-[var(--nasayem-bg)] text-foreground">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[560px] min-w-0 flex-col overflow-hidden border-x border-[var(--nasayem-border-strong)] bg-background shadow-[var(--shadow-shell)]">
        <AppHeader />
        <div className="flex-1 overflow-x-hidden pb-[calc(6.75rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}
