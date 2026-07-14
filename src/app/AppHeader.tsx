import Image from "next/image";

import { spacing } from "@/design-system";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className={`flex items-center justify-center ${spacing.inset.sm}`}>
        <Image
          alt="نسائم الخير"
          className="h-16 w-auto sm:h-20"
          height={891}
          priority
          src="/nasayem-logo.png"
          width={1012}
        />
      </div>
    </header>
  );
}
