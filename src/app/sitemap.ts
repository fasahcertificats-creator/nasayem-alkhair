import type { MetadataRoute } from "next";

const publicPaths = [
  "",
  "/prayer-times",
  "/azkar",
  "/umrah",
  "/services",
  "/more",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/sources",
  "/support"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredOrigin || !/^https?:\/\//i.test(configuredOrigin)) {
    return [];
  }

  const origin = configuredOrigin.replace(/\/+$/, "");

  return publicPaths.map((path) => ({
    url: `${origin}${path}`
  }));
}
