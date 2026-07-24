"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, BriefcaseBusiness, Clock, Compass, Home } from "lucide-react";
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
    href: ROUTES.prayerTimes,
    label: "أوقات الصلاة",
    icon: Clock,
    match: (pathname) => pathname.startsWith(ROUTES.prayerTimes)
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
    icon: Compass,
    match: (pathname) => pathname.startsWith(ROUTES.umrah)
  },
  {
    href: ROUTES.services,
    label: "الخدمات",
    icon: BriefcaseBusiness,
    match: (pathname) => pathname.startsWith(ROUTES.services) || pathname.startsWith(ROUTES.more)
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--nasayem-border)] bg-[color-mix(in_srgb,var(--nasayem-surface)_94%,transparent)] p-1.5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-navigation backdrop-blur max-[279px]:p-1 max-[279px]:pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      dir="rtl"
    >
      <div className="mx-auto grid w-full max-w-[560px] min-w-0 grid-cols-5 gap-0 max-[279px]:grid-cols-6">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative mx-0.5 flex min-h-14 min-w-0 flex-col items-center justify-center rounded-[var(--radius-medium)] px-0.5 py-2 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background max-[279px]:min-h-11 max-[279px]:px-0 max-[279px]:py-0.5",
                index < 3 ? "max-[279px]:col-span-2" : "max-[279px]:col-span-3",
                isActive
                  ? "bg-[var(--nasayem-green-050)] text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
              href={item.href}
              key={item.label}
            >
              <Icon
                aria-hidden="true"
                className="mb-1 size-[22px] max-[279px]:mb-0.5 max-[279px]:size-[18px]"
                strokeWidth={1.7}
              />
              <span className="max-w-full truncate text-[11px] font-bold tracking-normal sm:text-[12px] max-[279px]:overflow-visible max-[279px]:text-clip max-[279px]:whitespace-normal max-[279px]:text-[9px] max-[279px]:leading-[1.15]">
                {item.label}
              </span>
              {isActive ? (
                <span className="absolute top-1 h-0.5 w-5 rounded-full bg-gold max-[279px]:top-0" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
