import type { MetadataRoute } from "next";

import { getAzkarCategories, getUmrahStages } from "@/services/content";

const CANONICAL_PRODUCTION_ORIGIN = "https://nasayem-alkhair-green.vercel.app";

const publicPaths = [
  "",
  "/prayer-times",
  "/azkar",
  "/tasbih",
  "/umrah",
  "/services",
  "/more",
  "/offline",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/sources",
  "/support"
] as const;

function getProductionOrigin(): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredOrigin) {
    return CANONICAL_PRODUCTION_ORIGIN;
  }

  try {
    const parsedUrl = new URL(configuredOrigin);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isCanonicalVercelOrigin = parsedUrl.origin === CANONICAL_PRODUCTION_ORIGIN;
    const isVercelPreview = hostname.endsWith(".vercel.app") && !isCanonicalVercelOrigin;
    const isLocalHostname =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".local");
    const hasOriginOnlyPath =
      (parsedUrl.pathname === "/" || parsedUrl.pathname === "") &&
      parsedUrl.search === "" &&
      parsedUrl.hash === "";

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.username !== "" ||
      parsedUrl.password !== "" ||
      isLocalHostname ||
      isVercelPreview ||
      !hasOriginOnlyPath
    ) {
      return CANONICAL_PRODUCTION_ORIGIN;
    }

    return parsedUrl.origin;
  } catch {
    return CANONICAL_PRODUCTION_ORIGIN;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getProductionOrigin();
  const azkarPaths = getAzkarCategories().map((category) => `/azkar/${category}`);
  const umrahPaths = getUmrahStages().map((stage) => `/umrah/${stage.slug}`);
  const indexablePaths = [...publicPaths, ...azkarPaths, ...umrahPaths].sort();

  return indexablePaths.map((path) => ({
    url: new URL(path || "/", origin).toString()
  }));
}
