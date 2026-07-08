import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto min-h-screen max-w-md border-x border-border bg-background shadow-soft">
        <AppHeader />
        <div className="pb-24">{children}</div>
        <BottomNavigation />
      </div>
    </div>
  );
}
