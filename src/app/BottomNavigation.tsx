"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Clock3, Home, Map, MoreHorizontal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

type NavigationItem = {
  href: Route;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  match: (pathname: string) => boolean;
};

const navigationItems: NavigationItem[] = [
  {
    href: ROUTES.home,
    label: "الرئيسية",
    icon: Home,
    match: (pathname) => pathname === ROUTES.home
  },
  {
    href: ROUTES.azkar,
    label: "أذكار السفر",
    icon: BookOpenText,
    match: (pathname) => pathname.startsWith(ROUTES.azkar)
  },
  {
    href: ROUTES.umrah,
    label: "دليل العمرة",
    icon: Map,
    match: (pathname) => pathname.startsWith(ROUTES.umrah)
  },
  {
    href: ROUTES.miqat,
    label: "المواقيت",
    icon: Clock3,
    match: (pathname) => pathname.startsWith(ROUTES.miqat)
  },
  {
    href: ROUTES.more,
    label: "المزيد",
    icon: MoreHorizontal,
    match: (pathname) => pathname.startsWith(ROUTES.more)
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-1 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-0">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-w-0 flex-col items-center justify-center rounded-xl px-0.5 py-2 text-center transition-all duration-200",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon aria-hidden="true" className="mb-1 size-5" />
              <span className="max-w-full truncate text-[12px] font-bold tracking-normal sm:text-[13px]">
                {item.label}
              </span>
              {isActive ? (
                <span className="absolute top-0 size-1.5 rounded-full bg-gold" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
