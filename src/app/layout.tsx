import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { APP_METADATA } from "@/constants/app.constants";

import { AppProviders } from "./providers";
import "./globals.css";

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
    <html lang={APP_METADATA.defaultLocale} suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
