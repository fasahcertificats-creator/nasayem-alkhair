import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function check(name, passed, detail) {
  checks.push({
    name,
    status: passed ? "PASS" : "FAIL",
    detail
  });
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function collectSourceFiles(directory, output = []) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);

    if (statSync(path).isDirectory()) {
      collectSourceFiles(path, output);
    } else if (/\.(?:js|mjs|ts|tsx)$/.test(name)) {
      output.push(path);
    }
  }

  return output;
}

function readPngDimensions(relativePath) {
  const bytes = readFileSync(join(root, relativePath));
  const pngSignature = "89504e470d0a1a0a";

  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== pngSignature
  ) {
    return null;
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

const requiredFiles = [
  "src/app/manifest.ts",
  "src/app/offline/page.tsx",
  "src/pwa/PwaRuntime.tsx",
  "src/pwa/PwaControls.tsx",
  "src/pwa/sw-template.js",
  "src/pwa/offline-routes.generated.ts",
  "src/assets/fonts/cairo/Cairo-Variable.ttf",
  "src/assets/fonts/cairo/OFL.txt",
  "src/assets/fonts/amiri/Amiri-Regular.ttf",
  "src/assets/fonts/amiri/Amiri-Bold.ttf",
  "src/assets/fonts/amiri/OFL.txt",
  "public/sw.js",
  "PWA_OFFLINE_TECHNICAL_AUDIT_REPORT.json"
];
check(
  "required-files",
  requiredFiles.every((path) => existsSync(join(root, path))),
  "Manifest, runtime, controls, offline route, local fonts, service worker sources and technical audit exist"
);

const fontLayoutSource = read("src/app/layout.tsx");
const pwaTechnicalAudit = JSON.parse(
  read("PWA_OFFLINE_TECHNICAL_AUDIT_REPORT.json")
);
check(
  "local-font-offline-assets",
  fontLayoutSource.includes('from "next/font/local"') &&
    fontLayoutSource.includes("../assets/fonts/cairo/Cairo-Variable.ttf") &&
    fontLayoutSource.includes("../assets/fonts/amiri/Amiri-Regular.ttf") &&
    fontLayoutSource.includes("../assets/fonts/amiri/Amiri-Bold.ttf") &&
    pwaTechnicalAudit.localFontAssets.loader === "next/font/local" &&
    pwaTechnicalAudit.localFontAssets.checkedIntoApplication === true &&
    pwaTechnicalAudit.localFontAssets.sameOriginDelivery === true &&
    pwaTechnicalAudit.localFontAssets.googleFontsBuildOrRuntimeRequests === false &&
    pwaTechnicalAudit.localFontAssets.offlineCacheEligible === true,
  "Checked-in Cairo and Amiri assets use next/font/local and are eligible for same-origin offline caching"
);

const manifestSource = read("src/app/manifest.ts");
const layoutSource = read("src/app/layout.tsx");
check(
  "manifest-and-layout",
  manifestSource.includes('display: "standalone"') &&
    manifestSource.includes('start_url: "/"') &&
    manifestSource.includes('scope: "/"') &&
    layoutSource.includes('manifest: "/manifest.webmanifest"') &&
    layoutSource.includes('url: "/pwa/apple-touch-icon.png"'),
  "The web app manifest is installable and linked once from root metadata"
);

const requiredIcons = [
  ["public/pwa/favicon-32.png", 32],
  ["public/pwa/apple-touch-icon.png", 180],
  ["public/pwa/icon-192.png", 192],
  ["public/pwa/icon-512.png", 512],
  ["public/pwa/icon-maskable-512.png", 512]
];
check(
  "pwa-icons",
  requiredIcons.every(([path, size]) => {
    if (!existsSync(join(root, path))) {
      return false;
    }

    const dimensions = readPngDimensions(path);
    return dimensions?.width === size && dimensions.height === size;
  }),
  "All referenced PNG icons exist with the declared square dimensions"
);

const nextConfigSource = read("next.config.ts");
check(
  "service-worker-headers",
  nextConfigSource.includes('source: "/sw.js"') &&
    nextConfigSource.includes('"application/javascript; charset=utf-8"') &&
    nextConfigSource.includes('"no-cache, no-store, must-revalidate"') &&
    nextConfigSource.includes('"Service-Worker-Allowed"') &&
    nextConfigSource.includes('value: "/"'),
  "/sw.js has explicit JavaScript, no-cache and root-scope headers"
);

const allApplicationSource = collectSourceFiles(join(root, "src"))
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");
const providersSource = read("src/app/providers.tsx");
const moreSource = read("src/app/more/page.tsx");
check(
  "single-service-worker-registration",
  countMatches(allApplicationSource, /\.serviceWorker\.register\s*\(/g) === 1,
  "Application source contains exactly one service worker registration call"
);
check(
  "single-runtime-and-controls-mount",
  countMatches(providersSource, /<PwaRuntimeProvider>/g) === 1 &&
    countMatches(moreSource, /<PwaControls\s*\/>/g) === 1,
  "PwaRuntime is mounted once globally and PwaControls once on /more"
);

const runtimeSource = read("src/pwa/PwaRuntime.tsx");
const controlsSource = read("src/pwa/PwaControls.tsx");
const offlinePageSource = read("src/app/offline/page.tsx");
check(
  "offline-pack-controls",
  controlsSource.includes('"PREPARE_OFFLINE_PACK"') &&
    controlsSource.includes('"REMOVE_OFFLINE_CONTENT"') &&
    controlsSource.includes("PWA_OFFLINE_CACHE_PREFIX") &&
    controlsSource.includes("localStorage.removeItem(PWA_OFFLINE_METADATA_KEY)"),
  "Offline content can be prepared and its dedicated pack caches removed"
);
check(
  "offline-page",
  offlinePageSource.includes("لا يوجد اتصال بالإنترنت") &&
    offlinePageSource.includes("<OfflineRetryButton />"),
  "/offline provides a local fallback and retry action"
);
check(
  "global-connection-state",
  runtimeSource.includes("online: boolean") &&
    runtimeSource.includes('window.addEventListener("offline"') &&
    runtimeSource.includes('window.addEventListener("online"') &&
    runtimeSource.includes('aria-live="polite"'),
  "Online state and connection announcements are owned by the global PWA runtime"
);
check(
  "installation-guidance",
  runtimeSource.includes('"beforeinstallprompt"') &&
    runtimeSource.includes('"appinstalled"') &&
    runtimeSource.includes("isIosDevice") &&
    controlsSource.includes("إضافة إلى الشاشة الرئيسية"),
  "Android install prompting and iOS home-screen instructions are implemented"
);
check(
  "user-controlled-update-flow",
  runtimeSource.includes("setWaitingWorker") &&
    runtimeSource.includes('type: "SKIP_WAITING"') &&
    runtimeSource.includes('"controllerchange"') &&
    runtimeSource.includes("PWA_UPDATE_RELOAD_KEY"),
  "Waiting updates activate only after the user chooses the update action"
);

const categories = JSON.parse(read("data/azkar/categories.json"));
const stages = JSON.parse(read("data/umrah/stages.json"))
  .toSorted((first, second) => first.order - second.order);
const requiredStaticRoutes = [
  "/",
  "/prayer-times",
  "/azkar",
  "/tasbih",
  "/progress",
  "/umrah",
  "/miqat",
  "/services",
  "/more",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/sources",
  "/support",
  "/offline"
];
const expectedOfflineRoutes = [
  ...requiredStaticRoutes,
  ...categories.map((category) => `/azkar/${category}`),
  ...stages.map((stage) => `/umrah/${stage.slug}`)
];
const generatedRoutesSource = read("src/pwa/offline-routes.generated.ts");
const releaseVersionMatch = generatedRoutesSource.match(
  /PWA_RELEASE_VERSION = ("[^"]+") as const;/
);
const generatedRouteMatch = generatedRoutesSource.match(
  /OFFLINE_ROUTES = (\[[\s\S]*?\]) as const;/
);
const generatedRoutes = generatedRouteMatch
  ? JSON.parse(generatedRouteMatch[1])
  : [];
check(
  "unified-offline-route-inventory",
  JSON.stringify(generatedRoutes) === JSON.stringify(expectedOfflineRoutes) &&
    new Set(generatedRoutes).size === generatedRoutes.length,
  "Generated routes exactly match static pages plus the canonical Azkar and Umrah data"
);

const swTemplateSource = read("src/pwa/sw-template.js");
const publicServiceWorkerSource = read("public/sw.js");
const expectedServiceWorker =
  releaseVersionMatch && generatedRouteMatch
    ? swTemplateSource
        .replace("__PWA_RELEASE_VERSION__", JSON.parse(releaseVersionMatch[1]))
        .replace(
          "__PWA_OFFLINE_ROUTES__",
          JSON.stringify(expectedOfflineRoutes)
        )
    : "";
check(
  "generated-service-worker-current",
  publicServiceWorkerSource === expectedServiceWorker,
  "public/sw.js exactly matches its local template, release and route inventory"
);
check(
  "same-origin-get-only-cache-policy",
  publicServiceWorkerSource.includes('request.method !== "GET"') &&
    publicServiceWorkerSource.includes(
      "url.origin !== self.location.origin"
    ) &&
    publicServiceWorkerSource.includes(
      'request.headers.has("authorization")'
    ),
  "Only unauthenticated same-origin GET requests enter cache strategies"
);
check(
  "external-services-network-only",
  !/nominatim|wa\.me|whatsapp|importScripts/i.test(publicServiceWorkerSource) &&
    publicServiceWorkerSource.includes(
      "url.origin !== self.location.origin"
    ),
  "Nominatim, WhatsApp, external origins and external worker imports are excluded"
);
check(
  "filtered-cache-deletion",
  publicServiceWorkerSource.includes("OFFLINE_PACK_CACHE_PREFIX") &&
    publicServiceWorkerSource.includes(
      'cacheName.startsWith(`${CACHE_PREFIX}-`)'
    ) &&
    !/cacheNames\.map\(\s*\(cacheName\)\s*=>\s*caches\.delete/.test(
      publicServiceWorkerSource
    ),
  "Cache deletion is limited to owned obsolete caches or the offline-pack prefix"
);
check(
  "no-automatic-skip-waiting",
  countMatches(publicServiceWorkerSource, /self\.skipWaiting\s*\(/g) === 1 &&
    publicServiceWorkerSource.includes('data.type === "SKIP_WAITING"') &&
    !/addEventListener\("install"[\s\S]{0,300}skipWaiting/.test(
      publicServiceWorkerSource
    ),
  "skipWaiting exists only in the explicit client-message update branch"
);
check(
  "no-storage-wide-clear",
  !/localStorage\.clear\s*\(/.test(allApplicationSource),
  "Application source does not call localStorage.clear()"
);

const privacySource = read("src/app/privacy/page.tsx");
const sourcesSource = read("src/app/sources/page.tsx");
check(
  "cache-storage-disclosure",
  privacySource.includes("Cache Storage") &&
    privacySource.includes("لا تشمل هذه الحزمة ردود Nominatim") &&
    sourcesSource.includes("Cache Storage") &&
    sourcesSource.includes(
      "ولا تُخزن استجابات Nominatim أو WhatsApp أو أي أصل خارجي"
    ),
  "Privacy and sources pages disclose Cache Storage and external-origin exclusions"
);

const failedChecks = checks.filter((item) => item.status === "FAIL");
const report = {
  reportVersion: 1,
  generatedAt: new Date().toISOString(),
  status: failedChecks.length === 0 ? "PASS" : "FAIL",
  execution: "STATIC_SOURCE_VERIFICATION",
  summary: {
    expectedOfflineRouteCount: expectedOfflineRoutes.length,
    checkCount: checks.length,
    passedCount: checks.length - failedChecks.length,
    failedCount: failedChecks.length
  },
  checks,
  failedChecks: failedChecks.map((item) => item.name)
};

writeFileSync(
  join(root, "PWA_OFFLINE_IMPLEMENTATION_REPORT.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);

if (failedChecks.length > 0) {
  console.error(`FAIL: ${failedChecks.map((item) => item.name).join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} PWA source checks`);
}
