import type { ReactNode } from "react";

import { PwaRuntimeProvider } from "@/pwa/PwaRuntime";

import { ErrorBoundary } from "./providers/ErrorBoundary";

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ErrorBoundary>
      <PwaRuntimeProvider>{children}</PwaRuntimeProvider>
    </ErrorBoundary>
  );
}
