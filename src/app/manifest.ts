import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مكتب نسائم الخير للسفريات والسياحة",
    short_name: "نسائم الخير",
    description:
      "مواقيت الصلاة والأذكار ودليل العمرة وخدمات مكتب نسائم الخير",
    lang: "ar",
    dir: "rtl",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F7F4ED",
    theme_color: "#173D31",
    categories: ["utilities", "travel", "lifestyle"],
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "أوقات الصلاة",
        short_name: "الصلاة",
        url: "/prayer-times",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }]
      },
      {
        name: "الأذكار",
        short_name: "الأذكار",
        url: "/azkar",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }]
      },
      {
        name: "دليل العمرة",
        short_name: "العمرة",
        url: "/umrah",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }]
      },
      {
        name: "الخدمات",
        short_name: "الخدمات",
        url: "/services",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }]
      }
    ]
  };
}
