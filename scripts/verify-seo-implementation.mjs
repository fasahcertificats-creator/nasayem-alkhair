import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const canonicalOrigin = "https://nasayem-alkhair-green.vercel.app";

const topLevelRoutes = [
  "/",
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
];
const azkarRoutes = [
  "morning",
  "evening",
  "prayer",
  "sleep",
  "wakeup",
  "after-prayer",
  "quran-duas",
  "prophetic-duas",
  "names-of-allah",
  "comprehensive-duas"
].map((slug) => `/azkar/${slug}`);
const umrahRoutes = [
  "travel",
  "ihram",
  "entering-makkah",
  "tawaf",
  "zamzam",
  "sai",
  "shaving-or-trimming-hair",
  "completion-of-umrah"
].map((slug) => `/umrah/${slug}`);
const expectedRoutes = [...topLevelRoutes, ...azkarRoutes, ...umrahRoutes];
const excludedRoutes = ["/sw.js", "/manifest.webmanifest", "/miqat", "/progress"];
const metadataSources = [
  "src/app/layout.tsx",
  "src/app/azkar/page.tsx",
  "src/app/azkar/[category]/page.tsx",
  "src/app/prayer-times/layout.tsx",
  "src/app/tasbih/layout.tsx",
  "src/app/umrah/page.tsx",
  "src/app/umrah/[stage]/page.tsx",
  "src/app/services/layout.tsx",
  "src/app/more/page.tsx",
  "src/app/offline/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/sources/page.tsx",
  "src/app/support/page.tsx"
];

let checkCount = 0;

function check(condition, message) {
  checkCount += 1;

  if (!condition) {
    throw new Error(`SEO verification failed: ${message}`);
  }
}

function readProjectFile(relativePath) {
  const absolutePath = resolve(projectRoot, relativePath);

  check(existsSync(absolutePath), `${relativePath} must exist`);
  return readFileSync(absolutePath, "utf8");
}

function getBuiltHtmlPath(route) {
  if (route === "/") {
    return resolve(projectRoot, ".next/server/app/index.html");
  }

  return resolve(projectRoot, ".next/server/app", `${route.slice(1)}.html`);
}

function extractAttribute(html, elementPattern, attributeName) {
  const element = html.match(elementPattern)?.[0];

  if (!element) {
    return null;
  }

  return element.match(new RegExp(`${attributeName}="([^"]+)"`))?.[1] ?? null;
}

function isCanonicalProductionUrl(value) {
  return value === canonicalOrigin || value?.startsWith(`${canonicalOrigin}/`) === true;
}

const robotsSource = readProjectFile("src/app/robots.ts");
const sitemapSource = readProjectFile("src/app/sitemap.ts");
const rootLayoutSource = readProjectFile("src/app/layout.tsx");
const combinedMetadataSource = metadataSources.map(readProjectFile).join("\n");

check(
  robotsSource.includes(canonicalOrigin) &&
    robotsSource.includes('userAgent: "*"') &&
    robotsSource.includes('allow: "/"') &&
    robotsSource.includes("/sitemap.xml"),
  "robots metadata must allow public crawling and reference the production sitemap"
);
check(
  !/\bdisallow\s*:|noindex/i.test(robotsSource),
  "robots metadata must not disallow or noindex public routes"
);
check(
  sitemapSource.includes("NEXT_PUBLIC_APP_URL") &&
    sitemapSource.includes(canonicalOrigin) &&
    sitemapSource.includes("getAzkarCategories") &&
    sitemapSource.includes("getUmrahStages"),
  "sitemap must use the validated environment origin, safe fallback, and detail-route sources"
);
check(!sitemapSource.includes("Date.now("), "sitemap must not use non-deterministic timestamps");
check(
  rootLayoutSource.includes("metadataBase: new URL(CANONICAL_PRODUCTION_ORIGIN)"),
  "metadataBase must use the canonical production origin"
);
check(
  rootLayoutSource.includes("openGraph:") &&
    rootLayoutSource.includes('locale: "ar_YE"') &&
    rootLayoutSource.includes('type: "website"'),
  "Arabic Open Graph metadata must exist"
);
check(
  rootLayoutSource.includes("twitter:") && rootLayoutSource.includes('card: "summary"'),
  "Twitter summary metadata must exist"
);
check(
  existsSync(resolve(projectRoot, "public/pwa/icon-512.png")),
  "the same-origin social preview image must exist"
);
check(
  !/\b(?:localhost|127\.0\.0\.1|::1)\b/i.test(combinedMetadataSource),
  "canonical metadata must not contain a local origin"
);
const sourceWithoutCanonicalOrigin = combinedMetadataSource.replaceAll(canonicalOrigin, "");
check(
  !/[a-z0-9-]+\.vercel\.app/i.test(sourceWithoutCanonicalOrigin),
  "canonical metadata must not contain a Vercel preview origin"
);
check(
  !/noindex|index\s*:\s*false/i.test(combinedMetadataSource),
  "metadata must not accidentally disable indexing"
);

const sitemapBody = readProjectFile(".next/server/app/sitemap.xml.body");
const sitemapUrls = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapUrlSet = new Set(sitemapUrls);

check(sitemapUrls.length === expectedRoutes.length, `sitemap must contain ${expectedRoutes.length} URLs`);
check(sitemapUrlSet.size === sitemapUrls.length, "sitemap URLs must be unique");

for (const route of expectedRoutes) {
  const expectedUrl = new URL(route, `${canonicalOrigin}/`).toString();

  check(sitemapUrlSet.has(expectedUrl), `sitemap must include ${expectedUrl}`);
}

for (const route of excludedRoutes) {
  const excludedUrl = new URL(route, `${canonicalOrigin}/`).toString();

  check(!sitemapUrlSet.has(excludedUrl), `sitemap must exclude ${excludedUrl}`);
}

for (const sitemapUrl of sitemapUrls) {
  const parsedUrl = new URL(sitemapUrl);

  check(parsedUrl.protocol === "https:", `${sitemapUrl} must use HTTPS`);
  check(parsedUrl.origin === canonicalOrigin, `${sitemapUrl} must use the canonical production origin`);
}

const robotsBody = readProjectFile(".next/server/app/robots.txt.body");
check(/User-Agent:\s*\*/i.test(robotsBody), "built robots.txt must address all crawlers");
check(/Allow:\s*\/(?:\r?\n|$)/i.test(robotsBody), "built robots.txt must allow public crawling");
check(
  robotsBody.includes(`${canonicalOrigin}/sitemap.xml`),
  "built robots.txt must reference the canonical sitemap"
);
check(!/Disallow:|noindex/i.test(robotsBody), "built robots.txt must not block public routes");

const pageTitles = new Set();

for (const route of expectedRoutes) {
  const htmlPath = getBuiltHtmlPath(route);

  check(existsSync(htmlPath), `built HTML must exist for ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
  const canonicalUrl = extractAttribute(html, /<link[^>]+rel="canonical"[^>]*>/, "href");
  const expectedCanonicalUrl =
    route === "/" ? canonicalOrigin : new URL(route, `${canonicalOrigin}/`).toString();
  const openGraphUrl = extractAttribute(html, /<meta[^>]+property="og:url"[^>]*>/, "content");
  const twitterImage = extractAttribute(
    html,
    /<meta[^>]+name="twitter:image"[^>]*>/,
    "content"
  );

  check(title.trim().length > 0, `${route} must have a non-empty title`);
  check(!pageTitles.has(title), `${route} must have a distinct title`);
  pageTitles.add(title);
  check(canonicalUrl === expectedCanonicalUrl, `${route} must have its exact canonical URL`);
  check(
    html.includes('property="og:title"') &&
      html.includes('property="og:description"') &&
      isCanonicalProductionUrl(openGraphUrl),
    `${route} must include canonical Open Graph metadata`
  );
  check(
    html.includes('name="twitter:card"') &&
      html.includes('name="twitter:title"') &&
      isCanonicalProductionUrl(twitterImage),
    `${route} must include same-origin Twitter metadata`
  );
  check(!/noindex/i.test(html), `${route} must not include noindex`);
}

console.log(`PASS: ${checkCount} SEO implementation checks across ${expectedRoutes.length} routes`);
