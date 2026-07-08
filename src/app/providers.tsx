import type { ReactNode } from "react";

import { ErrorBoundary } from "./providers/ErrorBoundary";

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
