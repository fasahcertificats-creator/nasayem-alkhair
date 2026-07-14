import Image from "next/image";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/92 backdrop-blur">
      <div className="flex items-center justify-center px-4 py-4">
        <Image
          alt="نسائم الخير"
          className="h-24 w-auto sm:h-28"
          height={1254}
          priority
          src="/nasayem-logo.png"
          width={1254}
        />
      </div>
    </header>
  );
}
