import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { APP_METADATA } from "@/constants/app.constants";

import { AppShell } from "./AppShell";
import { AppProviders } from "./providers";
import "./globals.css";

const CANONICAL_PRODUCTION_ORIGIN = "https://nasayem-alkhair-green.vercel.app";

const cairo = localFont({
  display: "swap",
  fallback: ["Segoe UI", "Tahoma", "Arial", "sans-serif"],
  src: [
    {
      path: "../assets/fonts/cairo/Cairo-Variable.ttf",
      style: "normal",
      weight: "200 1000"
    }
  ],
  variable: "--font-cairo",
});

const amiri = localFont({
  display: "swap",
  fallback: ["Times New Roman", "serif"],
  src: [
    {
      path: "../assets/fonts/amiri/Amiri-Regular.ttf",
      style: "normal",
      weight: "400"
    },
    {
      path: "../assets/fonts/amiri/Amiri-Bold.ttf",
      style: "normal",
      weight: "700"
    }
  ],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_PRODUCTION_ORIGIN),
  title: {
    default: APP_METADATA.name,
    template: `%s | ${APP_METADATA.name}`
  },
  description: APP_METADATA.description,
  applicationName: APP_METADATA.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ar_YE",
    url: "/",
    siteName: APP_METADATA.name,
    title: APP_METADATA.name,
    description: APP_METADATA.description,
    images: [
      {
        url: "/pwa/icon-512.png",
        width: 512,
        height: 512,
        alt: APP_METADATA.name
      }
    ]
  },
  twitter: {
    card: "summary",
    title: APP_METADATA.name,
    description: APP_METADATA.description,
    images: ["/pwa/icon-512.png"]
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/pwa/favicon-32.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: "/pwa/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
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
