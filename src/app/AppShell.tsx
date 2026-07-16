import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden border-x border-border bg-background shadow-xl">
        <AppHeader />
        <div className="flex-1 overflow-x-hidden pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}
