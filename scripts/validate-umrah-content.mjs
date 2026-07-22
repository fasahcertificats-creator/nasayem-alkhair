import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stages = JSON.parse(fs.readFileSync(path.join(rootDir, "data/umrah/stages.json"), "utf8"));
const duas = JSON.parse(fs.readFileSync(path.join(rootDir, "data/umrah/duas.json"), "utf8"));

const approvedStageSlugs = [
  "travel",
  "ihram",
  "entering-makkah",
  "tawaf",
  "zamzam",
  "sai",
  "shaving-or-trimming-hair",
  "completion-of-umrah"
];

const requiredEvidenceIds = [
  "travel-dua-travel",
  "travel-dua-returning-from-travel",
  "ihram-talbiyah",
  "masjid-entry-dua",
  "masjid-exit-dua",
  "tawaf-black-stone-takbir",
  "tawaf-between-corners-dua",
  "zamzam-water-hadith",
  "sai-safa-marwah-quran",
  "sai-beginning-at-safa",
  "sai-safa-marwah-dhikr",
  "hair-shaving-hadith"
];

const errors = [];

function fail(message) {
  errors.push(message);
}

function hasDuplicate(values) {
  return new Set(values).size !== values.length;
}

function visibleText(value) {
  return String(value ?? "");
}

function hasVisibleHadithGrade(text) {
  return /[—-]\s*(?:صحيح|حسن)(?=\s|$|\()/.test(visibleText(text));
}

function hasNonBukhariMuslimHadithSource(reference) {
  return /Sunan|Musnad|Muwatta|Tirmidhi|Nasai|Nasa'i|Ibn Majah|Abi Dawud|Abu Dawud/i.test(
    visibleText(reference)
  );
}

function displaysGradeAuthority(text, authority) {
  const value = visibleText(text);

  if (!authority) {
    return false;
  }

  return (
    value.includes(`(${authority})`) ||
    value.includes(`صححه ${authority}`) ||
    value.includes(`حسنه ${authority}`)
  );
}

function assertHadithGradePolicy(item) {
  const reference = visibleText(item.sourceReference);
  const displayReference = visibleText(item.displayReferenceAr);
  const visibleGrade = hasVisibleHadithGrade(displayReference);
  const nonBukhariMuslimHadith = hasNonBukhariMuslimHadithSource(reference);

  if (item.sourceType === "Quran" && !nonBukhariMuslimHadith && visibleGrade) {
    fail(`${item.id}: Quran source displays an authenticity grade`);
  }

  if (!nonBukhariMuslimHadith) {
    return;
  }

  if ((item.authenticity === "sahih" || item.authenticity === "hasan") && !item.gradingAuthorityAr) {
    fail(`${item.id}: non-Bukhari/Muslim Hadith grade lacks gradingAuthorityAr`);
  }

  if (visibleGrade && !displaysGradeAuthority(displayReference, item.gradingAuthorityAr)) {
    fail(`${item.id}: visible non-Bukhari/Muslim Hadith grade lacks grading authority`);
  }
}

function assertNoForbiddenVisibleText(itemId, text) {
  const value = visibleText(text);

  if (/https?:\/\//i.test(value)) {
    fail(`${itemId}: raw URL appears in visible content`);
  }

  if (/Sahih|Sunan|Quran|Bukhari|Muslim|Dawud|Majah/i.test(value)) {
    fail(`${itemId}: English source display appears in visible content`);
  }

  if (value.includes("رابط المرجع") || value.includes("مرجع المصدر")) {
    fail(`${itemId}: forbidden source label appears`);
  }

  if (/دعاء الشوط (الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع)/.test(value)) {
    fail(`${itemId}: seven-circuit dua label appears`);
  }
}

if (stages.length !== 8) {
  fail(`expected exactly eight stages, found ${stages.length}`);
}

if (hasDuplicate(stages.map((stage) => stage.slug))) {
  fail("duplicate stage slug found");
}

const actualStageSlugs = stages.sort((a, b) => a.order - b.order).map((stage) => stage.slug);

if (JSON.stringify(actualStageSlugs) !== JSON.stringify(approvedStageSlugs)) {
  fail(`stage order changed: ${actualStageSlugs.join(", ")}`);
}

if (hasDuplicate(duas.map((dua) => dua.id))) {
  fail("duplicate religious item id found");
}

const stageSlugSet = new Set(approvedStageSlugs);
const duaIdSet = new Set(duas.map((dua) => dua.id));

for (const id of requiredEvidenceIds) {
  if (!duaIdSet.has(id)) {
    fail(`missing required evidence item: ${id}`);
  }
}

for (const stage of stages) {
  assertNoForbiddenVisibleText(stage.id, stage.titleAr);
  assertNoForbiddenVisibleText(stage.id, stage.summary);

  for (const duaId of stage.duas) {
    if (!duaIdSet.has(duaId)) {
      fail(`${stage.slug}: references missing dua ${duaId}`);
    }
  }

  for (const section of stage.contentSections ?? []) {
    if (section.verificationStatus !== "approved") {
      fail(`${section.id}: non-approved section remains in production data`);
    }

    if (!section.kind || !section.evidenceStatus) {
      fail(`${section.id}: missing classification or evidence status`);
    }

    assertNoForbiddenVisibleText(section.id, section.titleAr);
    assertNoForbiddenVisibleText(section.id, section.bodyAr);
    assertNoForbiddenVisibleText(section.id, section.displayReferenceAr);

    if (section.kind === "quran" || section.sourceReference.includes("Quran")) {
      if (!section.surahNumber || !section.surahNameAr || !section.ayahStart || !section.ayahEnd) {
        fail(`${section.id}: Quran metadata missing`);
      }

      if (section.sourceReference.includes("excerpt") && section.isExcerpt !== true) {
        fail(`${section.id}: Quran excerpt not explicitly marked`);
      }
    }
  }
}

for (const dua of duas) {
  if (!stageSlugSet.has(dua.stageId)) {
    fail(`${dua.id}: stageId is not one of the eight approved stage slugs`);
  }

  if (dua.verificationStatus !== "approved") {
    fail(`${dua.id}: non-approved item remains in production data`);
  }

  if (!dua.arabicText.trim()) {
    fail(`${dua.id}: empty religious text`);
  }

  if (!dua.kind || !dua.evidenceStatus) {
    fail(`${dua.id}: missing classification or evidence status`);
  }

  assertNoForbiddenVisibleText(dua.id, dua.titleAr);
  assertNoForbiddenVisibleText(dua.id, dua.arabicText);
  assertNoForbiddenVisibleText(dua.id, dua.contextAr);
  assertNoForbiddenVisibleText(dua.id, dua.displayReferenceAr);
  assertHadithGradePolicy(dua);

  if (dua.kind === "quran" || dua.sourceType === "Quran") {
    if (!dua.surahNumber || !dua.surahNameAr || !dua.ayahStart || !dua.ayahEnd) {
      fail(`${dua.id}: Quran metadata missing`);
    }

    if (dua.authenticity !== "Quran" && dua.id !== "tawaf-between-corners-dua") {
      fail(`${dua.id}: Quran item has non-Quran authenticity`);
    }
  }

  if (dua.evidenceStatus === "human-review-required") {
    fail(`${dua.id}: human-review-required item remains visible`);
  }
}

if (duas.some((dua) => /الكعبة/.test(dua.titleAr) && dua.arabicText.trim())) {
  fail("fixed seeing-the-Kaaba dua exists");
}

if (duas.some((dua) => /إتمام العمرة/.test(dua.titleAr) && dua.arabicText.trim())) {
  fail("fixed completion dua exists");
}

if (duas.some((dua) => /زمزم/.test(dua.titleAr) && /اللهم إني أسألك علما/.test(dua.arabicText))) {
  fail("unsupported Zamzam dua appears");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Umrah content validation passed");
