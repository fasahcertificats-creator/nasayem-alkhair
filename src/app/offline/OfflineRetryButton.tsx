"use client";

import { RefreshCw } from "lucide-react";

export function OfflineRetryButton() {
  return (
    <button
      className="border-primary/20 text-primary focus-visible:ring-gold inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => window.location.reload()}
      type="button"
    >
      <RefreshCw aria-hidden="true" className="size-4" />
      إعادة المحاولة
    </button>
  );
}
