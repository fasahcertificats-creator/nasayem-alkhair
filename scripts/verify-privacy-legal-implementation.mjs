import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const routes = ["privacy", "terms", "disclaimer", "sources", "support"];
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

const routeSources = Object.fromEntries(
  routes.map((route) => [
    route,
    read(`src/app/${route}/page.tsx`)
  ])
);

for (const [route, source] of Object.entries(routeSources)) {
  check(
    `route-${route}-exists`,
    source.length > 0,
    `/${route} has a page source file`
  );
  check(
    `route-${route}-metadata`,
    /export const metadata:\s*Metadata/.test(source) &&
      /title:/.test(source) &&
      /description:/.test(source),
    `/${route} declares a distinct metadata title and description`
  );
}

const moreSource = read("src/app/more/page.tsx");
for (const route of routes) {
  check(
    `more-links-${route}`,
    moreSource.includes(`href: "/${route}"`),
    `/more links to /${route}`
  );
}

const prayerSource = read("src/app/prayer-times/page.tsx");
const prayerServiceSource = read(
  "src/services/prayer/prayer-times.service.ts"
);
const prayerHookSource = read("src/hooks/usePrayerTimes.ts");
const layoutSource = read("src/app/layout.tsx");
const globalStylesSource = read("src/app/globals.css");
check(
  "prayer-location-privacy-link",
  /href=\{?"\/privacy#location"/.test(prayerSource) &&
    routeSources.privacy.includes('id="location"'),
  "Prayer Times links to the stable privacy location section"
);
check(
  "fonts-self-hosted",
  layoutSource.includes('from "next/font/local"') &&
    layoutSource.includes("../assets/fonts/cairo/Cairo-Variable.ttf") &&
    layoutSource.includes("../assets/fonts/amiri/Amiri-Regular.ttf") &&
    layoutSource.includes("../assets/fonts/amiri/Amiri-Bold.ttf") &&
    globalStylesSource.includes("var(--font-cairo)") &&
    globalStylesSource.includes("var(--font-amiri)"),
  "Cairo and Amiri use checked-in next/font/local assets"
);
check(
  "nominatim-user-action-only",
  prayerHookSource.includes(
    "const nextLocation = await requestGeolocatedPrayerLocation()"
  ) &&
    prayerHookSource.indexOf("requestGeolocatedPrayerLocation()") >
      prayerHookSource.indexOf("const requestLocation = useCallback") &&
    !prayerServiceSource.includes("setInterval("),
  "Nominatim is reached only through the user-triggered requestLocation callback with no request loop"
);
check(
  "nominatim-rate-cache-identification",
  prayerServiceSource.includes(
    "REVERSE_GEOCODING_MIN_INTERVAL_MS = 1000"
  ) &&
    prayerServiceSource.includes("reverseGeocodingCache") &&
    prayerServiceSource.includes("getStoredReverseGeocodingResult") &&
    prayerServiceSource.includes(
      'referrerPolicy: "strict-origin-when-cross-origin"'
    ) &&
    prayerServiceSource.includes("ReverseGeocodingProvider"),
  "Nominatim has one-request-per-second throttling, result caching, browser Referer identification and a replaceable provider interface"
);
check(
  "nominatim-visible-attribution",
  prayerSource.includes("OpenStreetMap") &&
    prayerSource.includes("Nominatim") &&
    prayerSource.includes("https://www.openstreetmap.org/copyright"),
  "Prayer Times visibly attributes OpenStreetMap and Nominatim"
);

const storageSource = read("src/lib/app-storage.ts");
check(
  "deletion-uses-allowlist",
  storageSource.includes("NASAYEM_LOCAL_STORAGE_KEYS") &&
    storageSource.includes("NASAYEM_SESSION_STORAGE_KEYS") &&
    storageSource.includes("removeItem"),
  "Local-data deletion iterates explicit application-owned key allowlists"
);
check(
  "no-localstorage-clear",
  ![
    storageSource,
    routeSources.privacy,
    read("src/components/legal/LocalDataManager.tsx")
  ].some((source) => /localStorage\.clear\s*\(/.test(source)),
  "No localStorage.clear() call exists in the deletion implementation"
);

const audit = JSON.parse(read("PRIVACY_TECHNICAL_AUDIT_REPORT.json"));
check(
  "analytics-claim-matches-audit",
  audit.tracking.analyticsDetected === false &&
    routeSources.privacy.includes(
      "لا يستخدم التطبيق حاليًا ملفات ارتباط إعلانية أو أدوات تتبع تسويقية."
    ),
  "Privacy analytics and advertising statement matches the technical audit"
);
check(
  "font-audit-updated",
  audit.assetsAndScripts.googleFontsBrowserRuntimeFlowDetected === false &&
    audit.assetsAndScripts.googleFontsBuildTimeFlowDetected === false &&
    audit.assetsAndScripts.externalFonts.length === 0 &&
    audit.assetsAndScripts.selfHostedFonts.length === 2,
  "Technical audit records same-origin local fonts with no Google Fonts build or browser flow"
);
check(
  "vercel-disclosed",
  audit.hostingAndLogging.provider === "Vercel" &&
    routeSources.privacy.includes("تستضيف Vercel التطبيق") &&
    routeSources.sources.includes("Vercel: تستضيف التطبيق"),
  "Vercel hosting, technical processing and plan-dependent retention are disclosed"
);
check(
  "whatsapp-retention-disclosed",
  audit.whatsappRetentionDisclosure.status === "ADDED" &&
    routeSources.privacy.includes(
      "يحتفظ المكتب بالمراسلات التي يرسلها المستخدم عبر واتساب بالقدر اللازم"
    ) &&
    routeSources.privacy.includes(
      "لا يتحكم المكتب في نسخة WhatsApp الخاصة بالخدمة أو نسخها الاحتياطية أو"
    ),
  "Approved office retention wording and limits on control over WhatsApp copies are present"
);
check(
  "production-url-unconfirmed",
  audit.productionUrl.confirmed === false &&
    audit.productionUrl.launchAction.includes("Vercel"),
  "No production URL is invented and the Vercel launch action is recorded"
);

const legalContent = read("src/components/legal/legal-content.ts");
const servicesSource = read("src/app/services/page.tsx");
const requiredOfficeValues = [
  "مكتب نسائم الخير للسفريات والسياحة",
  "عدن - الشيخ عثمان - شارع عمر المختار",
  "بجانب مدرسة الحصاد الأهلية",
  "967774360027",
  "967774383736"
];
const servicesContactPhoneBindings = [
  ...servicesSource.matchAll(/\bphone=\{([^}]+)\}/g)
].map((match) => match[1].trim());
const servicesImportsCanonicalContactApi =
  /import\s*\{[\s\S]*?\bbuildTelephoneUrl\b[\s\S]*?\bbuildWhatsappUrl\b[\s\S]*?\bOFFICE_DETAILS\b[\s\S]*?\}\s*from\s*"@\/components\/legal\/legal-content";/.test(
    servicesSource
  );
const canonicalNumbersAreAllowlisted =
  legalContent.includes("const OFFICE_PHONE_NUMBERS") &&
  legalContent.includes("OFFICE_DETAILS.primaryPhone") &&
  legalContent.includes("OFFICE_DETAILS.secondaryPhone") &&
  legalContent.includes("OFFICE_PHONE_NUMBERS.has(phone)") &&
  /export function buildTelephoneUrl\(phone: string\)\s*\{[^}]*requireTrustedOfficePhone\(phone\)/.test(
    legalContent
  ) &&
  /export function buildWhatsappUrl\(phone: string, message\?: string\)\s*\{[\s\S]*?requireTrustedOfficePhone\(phone\)/.test(
    legalContent
  );
const servicesUsesCanonicalNumbers =
  servicesSource.includes(
    "const primaryWhatsappNumber = OFFICE_DETAILS.primaryPhone"
  ) &&
  servicesSource.includes(
    "const secondaryWhatsappNumber = OFFICE_DETAILS.secondaryPhone"
  ) &&
  servicesContactPhoneBindings.length === 2 &&
  servicesContactPhoneBindings.every((binding) =>
    ["primaryWhatsappNumber", "secondaryWhatsappNumber"].includes(binding)
  );
const servicesUsesAllowlistedBuildersOnly =
  servicesSource.includes(
    "href={buildWhatsappUrl(primaryWhatsappNumber, message)}"
  ) &&
  servicesSource.includes("href={buildTelephoneUrl(phone)}") &&
  servicesSource.includes("href={buildWhatsappUrl(phone)}") &&
  !/\bhref\s*=\s*["'{]?\s*(?:tel:|https:\/\/wa\.me\/)/i.test(
    servicesSource
  );
check(
  "approved-office-data",
  requiredOfficeValues.every((value) => legalContent.includes(value)) &&
    servicesImportsCanonicalContactApi &&
    canonicalNumbersAreAllowlisted &&
    servicesUsesCanonicalNumbers &&
    servicesUsesAllowlistedBuildersOnly,
  "Services consume canonical OFFICE_DETAILS numbers through allowlisted telephone and WhatsApp builders without duplicated destinations"
);

const allLegalSource = [
  ...Object.values(routeSources),
  moreSource,
  legalContent,
  read("src/components/legal/OfficeContactDetails.tsx"),
  read("src/components/legal/SupportContact.tsx"),
  prayerSource
].join("\n");
check(
  "no-unapproved-email",
  !/mailto:|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(allLegalSource),
  "No email address or mailto link was added"
);
check(
  "no-madhab-wording",
  !/Madhab|المذهب|شافعي|حنفي/i.test(allLegalSource),
  "No Madhab or jurisprudential-school wording appears on legal pages"
);

const externalHosts = [
  ...allLegalSource.matchAll(/https:\/\/([^/"'`\s)]+)/g)
].map((match) => match[1].toLowerCase());
const allowedExternalHosts = new Set([
  "operations.osmfoundation.org",
  "www.openstreetmap.org",
  "www.geonames.org",
  "www.whatsapp.com",
  "vercel.com",
  "wa.me"
]);
check(
  "external-providers-audited",
  externalHosts.every((host) => allowedExternalHosts.has(host)),
  "Every linked external provider is present in the technical audit"
);

const failedChecks = checks.filter((item) => item.status === "FAIL");
const report = {
  reportVersion: 1,
  generatedAt: new Date().toISOString(),
  status: failedChecks.length === 0 ? "PASS" : "FAIL",
  summary: {
    routeCount: routes.length,
    checkCount: checks.length,
    passedCount: checks.length - failedChecks.length,
    failedCount: failedChecks.length
  },
  checks,
  failedChecks: failedChecks.map((item) => item.name)
};

writeFileSync(
  join(root, "PRIVACY_LEGAL_IMPLEMENTATION_REPORT.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);

if (failedChecks.length > 0) {
  console.error(
    `FAIL: ${failedChecks.map((item) => item.name).join(", ")}`
  );
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} privacy/legal implementation checks`);
}
