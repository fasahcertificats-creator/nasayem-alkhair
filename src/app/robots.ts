import type { MetadataRoute } from "next";

const CANONICAL_PRODUCTION_ORIGIN = "https://nasayem-alkhair-green.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${CANONICAL_PRODUCTION_ORIGIN}/sitemap.xml`,
    host: CANONICAL_PRODUCTION_ORIGIN
  };
}
