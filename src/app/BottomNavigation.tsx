"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Clock3, Home, Map, MoreHorizontal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { ROUTES } from "@/constants/routes.constants";
import { typography } from "@/design-system";
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
    label: "الأذكار",
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/92 shadow-card backdrop-blur md:sticky"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-2 px-3 py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-center transition-colors",
                typography.hierarchy.caption,
                isActive
                  ? "bg-gold/22 text-primary shadow-soft"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-primary"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon aria-hidden="true" className="size-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
