import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "التسبيح",
  description: "عداد تسبيح يومي محفوظ محليًا ضمن تطبيق نسائم الخير.",
  alternates: {
    canonical: "/tasbih"
  }
};

export default function TasbihLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
