import type { NextConfig } from "next";

const applicationContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://nominatim.openstreetmap.org",
  "manifest-src 'self'",
  "worker-src 'self'",
  "media-src 'self'",
  "frame-src 'none'",
  "upgrade-insecure-requests"
].join("; ");

const serviceWorkerContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "script-src 'self'",
  "connect-src 'self'"
].join("; ");

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off"
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains"
  },
  {
    key: "Permissions-Policy",
    value:
      "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), browsing-topics=()"
  }
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/:path((?!sw\\.js$).*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: applicationContentSecurityPolicy
          }
        ]
      },
      {
        source: "/sw.js",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8"
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate"
          },
          {
            key: "Service-Worker-Allowed",
            value: "/"
          },
          {
            key: "Content-Security-Policy",
            value: serviceWorkerContentSecurityPolicy
          }
        ]
      }
    ];
  }
};

export default nextConfig;
