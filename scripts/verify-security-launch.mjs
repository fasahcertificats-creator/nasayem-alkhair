import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function check(name, passed) {
  checks.push({ name, passed });
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

const packageJson = JSON.parse(read("package.json"));
check("next-version", packageJson.dependencies?.next === "16.2.12");
check("react-version", packageJson.dependencies?.react === "19.2.7");
check(
  "react-dom-version",
  packageJson.dependencies?.["react-dom"] === "19.2.7"
);
check("eslint-version", packageJson.devDependencies?.eslint === "9.39.4");
check(
  "eslint-config-next-version",
  packageJson.devDependencies?.["eslint-config-next"] === "16.2.12"
);

const reportPaths = [
  "SECURITY_TECHNICAL_AUDIT_REPORT.json",
  "SECURITY_DEPENDENCY_AUDIT_REPORT.json",
  "SECURITY_IMPLEMENTATION_REPORT.json"
];
const requiredPaths = [
  "src/lib/safe-external-url.ts",
  ...reportPaths
];
check(
  "required-security-files",
  requiredPaths.every((path) => existsSync(join(root, path)))
);
check(
  "temporary-repair-script-absent",
  !existsSync(join(root, "repair_nasayem_security_state.ps1"))
);

const sourceFiles = collectSourceFiles(join(root, "src"));
const forbiddenPatterns = [
  ["eval", /\beval\s*\(/],
  ["new Function", /\bnew\s+Function\b/],
  ["document.write", /\bdocument\.write\s*\(/],
  ["insertAdjacentHTML", /\.insertAdjacentHTML\s*\(/],
  ["dangerouslySetInnerHTML", /\bdangerouslySetInnerHTML\b/],
  ["localStorage.clear", /\blocalStorage\.clear\s*\(/],
  ["sessionStorage.clear", /\bsessionStorage\.clear\s*\(/]
];
const forbiddenFindings = [];

for (const path of sourceFiles) {
  const source = readFileSync(path, "utf8");

  for (const [name, pattern] of forbiddenPatterns) {
    if (pattern.test(source)) {
      forbiddenFindings.push(`${name}:${relative(root, path)}`);
    }
  }
}

check("forbidden-source-usage-absent", forbiddenFindings.length === 0);

const nextConfig = read("next.config.ts");
const requiredHeaderTokens = [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy"
];
check(
  "security-headers",
  requiredHeaderTokens.every((token) => nextConfig.includes(token)) &&
    nextConfig.includes("frame-ancestors 'none'") &&
    nextConfig.includes("object-src 'none'")
);

const serviceWorker = read("src/pwa/sw-template.js");
const requiredMessageTypes = [
  "GET_PWA_STATUS",
  "CACHE_CURRENT_PAGE",
  "PREPARE_OFFLINE_PACK",
  "REMOVE_OFFLINE_CONTENT",
  "SKIP_WAITING"
];
check(
  "service-worker-message-allowlist",
  serviceWorker.includes("ACCEPTED_MESSAGE_TYPES") &&
    requiredMessageTypes.every((type) => serviceWorker.includes(`"${type}"`))
);
check(
  "service-worker-same-origin",
  serviceWorker.includes("sourceUrl.origin === self.location.origin") &&
    serviceWorker.includes("url.origin !== self.location.origin")
);
check(
  "service-worker-get-only",
  serviceWorker.includes('request.method !== "GET"')
);
check(
  "service-worker-prefixed-cache-deletion",
  serviceWorker.includes('cacheName.startsWith(`${CACHE_PREFIX}-`)') &&
    serviceWorker.includes("OFFLINE_PACK_CACHE_PREFIX")
);
check(
  "service-worker-cache-limits",
  serviceWorker.includes("PAGE_CACHE_MAX_ENTRIES = 40") &&
    serviceWorker.includes("STATIC_ASSET_CACHE_MAX_ENTRIES = 120") &&
    serviceWorker.includes("RUNTIME_CACHE_MAX_ENTRIES = 60")
);

const supportContact = read("src/components/legal/SupportContact.tsx");
check(
  "security-privacy-support-category",
  supportContact.includes("بلاغ أمني أو متعلق بالخصوصية")
);

const legalContent = read("src/components/legal/legal-content.ts");
check(
  "contact-destination-allowlist",
  legalContent.includes("OFFICE_PHONE_NUMBERS") &&
    legalContent.includes("requireTrustedOfficePhone") &&
    /buildTelephoneUrl[\s\S]*requireTrustedOfficePhone/.test(legalContent) &&
    /buildWhatsappUrl[\s\S]*requireTrustedOfficePhone/.test(legalContent)
);

let reportsParse = true;

for (const reportPath of reportPaths) {
  try {
    JSON.parse(read(reportPath));
  } catch {
    reportsParse = false;
  }
}

check("security-reports-parse", reportsParse);

const failed = checks.filter((item) => !item.passed);

if (failed.length > 0) {
  console.error(
    `FAIL: ${failed.length}/${checks.length} checks failed: ${failed
      .map((item) => item.name)
      .join(", ")}`
  );

  if (forbiddenFindings.length > 0) {
    console.error(`Forbidden findings: ${forbiddenFindings.join(", ")}`);
  }

  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} security launch checks`);
}
