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
check(
  "prayer-location-privacy-link",
  /href=\{?"\/privacy#location"/.test(prayerSource) &&
    routeSources.privacy.includes('id="location"'),
  "Prayer Times links to the stable privacy location section"
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

const legalContent = read("src/components/legal/legal-content.ts");
const servicesSource = read("src/app/services/page.tsx");
const requiredOfficeValues = [
  "مكتب نسائم الخير للسفريات والسياحة",
  "عدن - الشيخ عثمان - شارع عمر المختار",
  "بجانب مدرسة الحصاد الأهلية",
  "967774360027",
  "967774383736"
];
check(
  "approved-office-data",
  requiredOfficeValues.every((value) => legalContent.includes(value)) &&
    ["967774360027", "967774383736"].every((value) =>
      servicesSource.includes(value)
    ),
  "Legal office details match the approved office identity and service contact numbers"
);

const allLegalSource = [
  ...Object.values(routeSources),
  moreSource,
  legalContent,
  read("src/components/legal/OfficeContactDetails.tsx"),
  read("src/components/legal/SupportContact.tsx")
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
  "policies.google.com",
  "www.geonames.org",
  "www.whatsapp.com",
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
