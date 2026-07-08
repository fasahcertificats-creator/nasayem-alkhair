"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { BookOpenText, Clock3, Home, Map, MoreHorizontal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { AppButton, spacing, typography } from "@/design-system";
import { cn } from "@/lib/utils";

type NavigationItem = {
  href: Route | `${Route}#${string}`;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  match: (pathname: string) => boolean;
};

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "الرئيسية",
    icon: Home,
    match: (pathname) => pathname === "/"
  },
  {
    href: "/azkar",
    label: "الأذكار",
    icon: BookOpenText,
    match: (pathname) => pathname.startsWith("/azkar")
  },
  {
    href: "/umrah",
    label: "دليل العمرة",
    icon: Map,
    match: (pathname) => pathname.startsWith("/umrah")
  },
  {
    href: "/#prayer-card",
    label: "المواقيت",
    icon: Clock3,
    match: (pathname) => pathname.startsWith("/prayer-times")
  },
  {
    href: "/progress",
    label: "المزيد",
    icon: MoreHorizontal,
    match: (pathname) => pathname.startsWith("/progress")
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-card backdrop-blur md:sticky"
    >
      <div className={`mx-auto grid max-w-md grid-cols-5 ${spacing.inline.xs} ${spacing.inset.sm}`}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);

          return (
            <AppButton
              aria-current={isActive ? "page" : undefined}
              asChild
              className={cn(
                "h-auto min-w-0 flex-col rounded-md px-0 py-2",
                typography.hierarchy.caption,
                isActive ? "shadow-soft" : "shadow-none"
              )}
              key={item.label}
              tone={isActive ? "gold" : "ghost"}
            >
              <Link href={item.href}>
                <Icon aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            </AppButton>
          );
        })}
      </div>
    </nav>
  );
}
