import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  AZKAR_LEGACY_COUNTERS_STORAGE_KEY,
  AZKAR_PROGRESS_STORAGE_KEY,
  loadAzkarProgress,
  sanitizeAzkarProgress,
  type AzkarCatalog
} from "../src/lib/azkar-progress";
import {
  getAllAzkarItems,
  getAzkarCatalog,
  getAzkarCategories,
  getAzkarCategoryDefinition,
  getAzkarCategoryDefinitions,
  getAzkarItems
} from "../src/services/content/azkar.service";
import { AZKAR_CATEGORY_IDS, type AzkarCategory } from "../src/types/azkar";

interface RawAzkarItem {
  id: string;
  category: string;
  arabicText: string;
  count: number;
  source?: string;
  sourceReference?: string;
}

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const workspaceRoot = resolve(import.meta.dirname, "..");
const rawItems = JSON.parse(
  readFileSync(resolve(workspaceRoot, "data/azkar/items.json"), "utf8")
) as RawAzkarItem[];
const rawCategories = JSON.parse(
  readFileSync(resolve(workspaceRoot, "data/azkar/categories.json"), "utf8")
) as string[];
const categories = getAzkarCategories();
const categoryDefinitions = getAzkarCategoryDefinitions();
const items = getAllAzkarItems();
const catalog = getAzkarCatalog();
const approvedCategoryIds = new Set<string>(AZKAR_CATEGORY_IDS);
const duplicateIds = new Set<string>();
const idCounts = new Map<string, number>();
const normalizedTextGroups = new Map<string, string[]>();

function normalizeTextForDuplicateCheck(value: string) {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

function hasMalformedUnicode(value: string) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = value.charCodeAt(index + 1);

      if (nextCode < 0xdc00 || nextCode > 0xdfff) {
        return true;
      }

      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }

  return false;
}

function hasUnbalancedPunctuation(value: string) {
  const pairs = [
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
    ["«", "»"]
  ] as const;

  return pairs.some(
    ([opening, closing]) =>
      [...value].filter((character) => character === opening).length !==
      [...value].filter((character) => character === closing).length
  );
}

for (const item of rawItems) {
  idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
  const normalizedText = normalizeTextForDuplicateCheck(item.arabicText);
  normalizedTextGroups.set(normalizedText, [
    ...(normalizedTextGroups.get(normalizedText) ?? []),
    item.id
  ]);
}

for (const [itemId, count] of idCounts) {
  if (count > 1) {
    duplicateIds.add(itemId);
  }
}

const duplicateTextGroups = [...normalizedTextGroups.values()]
  .filter((group) => group.length > 1)
  .map((itemIds) => ({
    itemIds,
    categories: [
      ...new Set(
        itemIds.map(
          (itemId) =>
            rawItems.find((item) => item.id === itemId)?.category ?? "unknown"
        )
      )
    ]
  }));

const itemResults = rawItems.map((item) => {
  const text = item.arabicText;
  const duplicateGroup =
    normalizedTextGroups.get(normalizeTextForDuplicateCheck(text)) ?? [];
  const checks = {
    uniqueStableId:
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(item.id) &&
      !duplicateIds.has(item.id),
    validCategoryId: approvedCategoryIds.has(item.category),
    nonEmptyArabicText: text.trim().length > 0 && /[\u0600-\u06ff]/.test(text),
    validRepetitionCount:
      Number.isSafeInteger(item.count) && item.count > 0,
    sourceOrReferencePresent: Boolean(
      item.source?.trim() || item.sourceReference?.trim()
    ),
    duplicateTextChecked: true,
    duplicateIdChecked: true,
    malformedUnicodeAbsent: !hasMalformedUnicode(text),
    replacementCharacterAbsent: !text.includes("\ufffd"),
    brokenHtmlEntityAbsent:
      !/&(?:#\d+|#x[\da-f]+|[a-z][a-z0-9]+)(?!;)/i.test(text),
    latinDirectionCorruptionAbsent:
      !/[A-Za-z]/.test(text) &&
      !/[\u202a-\u202e\u2066-\u2069]/.test(text),
    closingPunctuationStructurallyValid: !hasUnbalancedPunctuation(text),
    suspiciousOuterWhitespaceAbsent: text === text.trim(),
    unsupportedHtmlAbsent: !/<[^>]*>/i.test(text),
    unsafeRenderedContentAbsent:
      !/<\s*(?:script|iframe|object|embed)\b/i.test(text) &&
      !/javascript\s*:/i.test(text)
  };
  const issues = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([check]) => check);

  return {
    id: item.id,
    categoryId: item.category,
    status: issues.length > 0 ? "REVIEW_REQUIRED" : "PASS",
    checks,
    duplicateTextWith: duplicateGroup.filter(
      (itemId) => itemId !== item.id
    ),
    issues
  };
});

const reviewRequired = itemResults
  .filter((item) => item.status === "REVIEW_REQUIRED")
  .map(({ id, categoryId, issues }) => ({
    id,
    categoryId,
    issues
  }));
const categoryItemCounts = Object.fromEntries(
  categories.map((categoryId) => [
    categoryId,
    rawItems.filter((item) => item.category === categoryId).length
  ])
);
const contentAuditReport = {
  reportVersion: 1,
  generatedAt: new Date().toISOString(),
  status: reviewRequired.length === 0 ? "PASS" : "REVIEW_REQUIRED",
  summary: {
    approvedCategoryCount: categories.length,
    itemsAudited: rawItems.length,
    duplicateTextGroupCount: duplicateTextGroups.length,
    duplicateIdCount: duplicateIds.size,
    reviewRequiredCount: reviewRequired.length
  },
  categoryItemCounts,
  duplicateTextGroups,
  reviewRequired,
  itemResults
};

writeFileSync(
  resolve(workspaceRoot, "AZKAR_CONTENT_AUDIT_REPORT.json"),
  `${JSON.stringify(contentAuditReport, null, 2)}\n`,
  "utf8"
);

const verificationChecks: Record<
  string,
  { status: "PASS" | "FAIL"; detail: string }
> = {};

function recordCheck(name: string, passed: boolean, detail: string) {
  verificationChecks[name] = {
    status: passed ? "PASS" : "FAIL",
    detail
  };
}

recordCheck(
  "exactlyTenApprovedCategories",
  categories.length === 10 &&
    rawCategories.length === 10 &&
    AZKAR_CATEGORY_IDS.length === 10,
  `${categories.length} approved categories found`
);
recordCheck(
  "uniqueCategoryIds",
  new Set(categories).size === categories.length,
  "All category IDs are unique"
);
recordCheck(
  "uniqueItemIds",
  new Set(items.map((item) => item.id)).size === items.length,
  "All item IDs are unique"
);
recordCheck(
  "everyCategoryHasItems",
  categories.every((category) => getAzkarItems(category).length > 0),
  "Every approved category resolves at least one item"
);
recordCheck(
  "validArabicText",
  items.every(
    (item) => item.text.trim().length > 0 && /[\u0600-\u06ff]/.test(item.text)
  ),
  "Every item contains non-empty Arabic text"
);
recordCheck(
  "positiveSafeIntegerTargets",
  items.every(
    (item) =>
      Number.isSafeInteger(item.targetCount) && item.targetCount > 0
  ),
  "Every target count is a positive safe integer"
);
recordCheck(
  "noZeroTargets",
  items.every((item) => item.targetCount !== 0),
  "No target count is zero"
);
recordCheck(
  "noReplacementCharacters",
  items.every((item) => !item.text.includes("\ufffd")),
  "No religious text contains the Unicode replacement character"
);
recordCheck(
  "noUnsafeHtml",
  items.every(
    (item) =>
      !/<[^>]*>/i.test(item.text) && !/javascript\s*:/i.test(item.text)
  ),
  "Religious text contains no HTML or scriptable URL content"
);
recordCheck(
  "categoryTotalsDerivedFromData",
  categoryDefinitions.every(
    (category) =>
      catalog[category.id].length ===
      items.filter((item) => item.categoryId === category.id).length
  ),
  "Every displayed total is sourced from the normalized catalog"
);
recordCheck(
  "everyRouteResolvesCategory",
  categories.every(
    (category) =>
      getAzkarCategoryDefinition(category) &&
      getAzkarItems(category).every((item) => item.categoryId === category)
  ),
  "Every generated /azkar/[category] route resolves its category and items"
);

const legacyStorage = new MemoryStorage();
const legacyItem = catalog.morning[0];
legacyStorage.setItem(
  AZKAR_LEGACY_COUNTERS_STORAGE_KEY,
  JSON.stringify({ [legacyItem.id]: legacyItem.targetCount })
);
const legacyResult = loadAzkarProgress(catalog, legacyStorage);
recordCheck(
  "validLegacyMigration",
  legacyResult.migrated &&
    legacyResult.state.categories.morning?.counts[legacyItem.id] ===
      legacyItem.targetCount &&
    Boolean(legacyStorage.getItem(AZKAR_PROGRESS_STORAGE_KEY)),
  "Valid legacy counter data migrates to the versioned category model"
);

const firstEveningItem = catalog.evening[0];
const invalidCountsResult = sanitizeAzkarProgress(
  {
    version: 2,
    categories: {
      morning: {
        categoryId: "morning",
        currentItemId: legacyItem.id,
        counts: {
          [legacyItem.id]: legacyItem.targetCount + 100,
          unknown_item: 9
        },
        completed: true,
        lastOpenedAt: 1
      },
      evening: {
        categoryId: "evening",
        currentItemId: firstEveningItem.id,
        counts: {
          [firstEveningItem.id]: -2,
          [catalog.evening[1].id]: "1"
        },
        completed: false,
        lastOpenedAt: 2
      },
      unknown_category: {
        counts: {}
      }
    }
  },
  catalog
);
recordCheck(
  "invalidStoredCountsSanitized",
  invalidCountsResult.recovered &&
    invalidCountsResult.state.categories.morning?.counts[legacyItem.id] ===
      legacyItem.targetCount &&
    invalidCountsResult.state.categories.morning?.counts.unknown_item ===
      undefined &&
    invalidCountsResult.state.categories.evening?.counts[firstEveningItem.id] ===
      undefined &&
    invalidCountsResult.state.categories.evening?.counts[
      catalog.evening[1].id
    ] === undefined,
  "Above-target counts clamp; negative, string, and unknown-item counts are rejected"
);
recordCheck(
  "unknownIdsDoNotCrash",
  !Object.hasOwn(
    invalidCountsResult.state.categories,
    "unknown_category" satisfies string
  ),
  "Unknown category and item IDs are ignored without discarding valid categories"
);

const duplicateRecordResult = sanitizeAzkarProgress(
  {
    version: 1,
    categories: [
      {
        categoryId: "morning",
        currentItemId: legacyItem.id,
        counts: { [legacyItem.id]: 0 },
        lastOpenedAt: 1
      },
      {
        categoryId: "morning",
        currentItemId: legacyItem.id,
        counts: { [legacyItem.id]: legacyItem.targetCount },
        lastOpenedAt: 2
      }
    ]
  },
  catalog
);
recordCheck(
  "duplicateRecordsMerged",
  duplicateRecordResult.migrated &&
    duplicateRecordResult.state.categories.morning?.counts[legacyItem.id] ===
      legacyItem.targetCount,
  "Duplicate legacy category records merge safely using valid bounded counts"
);
recordCheck(
  "religiousContentAudit",
  contentAuditReport.status === "PASS",
  contentAuditReport.status === "PASS"
    ? "No religious-content item requires review"
    : `${reviewRequired.length} item(s) require review`
);

assert.deepEqual(
  categories,
  [...AZKAR_CATEGORY_IDS],
  "Approved category order must stay stable"
);
assert.equal(
  Object.keys(categoryItemCounts).length,
  10,
  "Category item counts must cover exactly ten categories"
);
assert.ok(
  (Object.keys(catalog) as AzkarCategory[]).every(
    (categoryId) => (catalog as AzkarCatalog)[categoryId].length > 0
  ),
  "Catalog categories must not be empty"
);

const failedChecks = Object.entries(verificationChecks)
  .filter(([, result]) => result.status === "FAIL")
  .map(([name]) => name);
const implementationReport = {
  reportVersion: 1,
  generatedAt: new Date().toISOString(),
  status:
    contentAuditReport.status === "REVIEW_REQUIRED"
      ? "REVIEW_REQUIRED"
      : failedChecks.length === 0
        ? "PASS"
        : "FAIL",
  routes: ["/azkar", "/azkar/[category]"],
  categoryCount: categories.length,
  itemCount: items.length,
  categoryItemCounts,
  storage: {
    version: 2,
    key: AZKAR_PROGRESS_STORAGE_KEY,
    legacyKey: AZKAR_LEGACY_COUNTERS_STORAGE_KEY
  },
  checks: verificationChecks,
  failedChecks,
  religiousContentAuditStatus: contentAuditReport.status
};

writeFileSync(
  resolve(workspaceRoot, "AZKAR_IMPLEMENTATION_REPORT.json"),
  `${JSON.stringify(implementationReport, null, 2)}\n`,
  "utf8"
);

if (failedChecks.length > 0) {
  throw new Error(`Azkar verification failed: ${failedChecks.join(", ")}`);
}

console.log(
  `PASS: ${categories.length} categories and ${items.length} Azkar items verified`
);
console.log(
  `PASS: ${duplicateTextGroups.length} duplicate-text groups recorded without content changes`
);
console.log("PASS: versioned progress migration and sanitization verified");
console.log(`PASS: content audit status ${contentAuditReport.status}`);
