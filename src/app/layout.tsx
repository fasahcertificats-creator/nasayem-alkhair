import type { Metadata, Viewport } from "next";
import { Amiri, Cairo } from "next/font/google";
import type { ReactNode } from "react";

import { APP_METADATA } from "@/constants/app.constants";

import { AppShell } from "./AppShell";
import { AppProviders } from "./providers";
import "./globals.css";

const cairo = Cairo({
  display: "swap",
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800"]
});

const amiri = Amiri({
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: {
    default: APP_METADATA.name,
    template: `%s | ${APP_METADATA.name}`
  },
  description: APP_METADATA.description,
  applicationName: APP_METADATA.name
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: APP_METADATA.themeColor
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html dir="rtl" lang={APP_METADATA.defaultLocale}>
      <body className={`${cairo.variable} ${amiri.variable}`}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
