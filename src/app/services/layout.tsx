import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "الخدمات",
  description: "خدمات العمرة والزيارات والتأشيرات والحجوزات لدى مكتب نسائم الخير.",
  alternates: {
    canonical: "/services"
  }
};

export default function ServicesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
