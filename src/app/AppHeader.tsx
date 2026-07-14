import Image from "next/image";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex flex-col items-center justify-center px-4 py-3">
        <Image
          alt="نسائم الخير"
          className="h-24 w-auto sm:h-28"
          height={1254}
          priority
          src="/nasayem-logo.png"
          width={1254}
        />
        <p className="font-arabic-studio mt-1 text-center text-[1.35rem] font-semibold leading-tight text-primary">
          نسائم الخير
        </p>
      </div>
    </header>
  );
}
