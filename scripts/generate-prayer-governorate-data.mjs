import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const workspace = resolve(import.meta.dirname, "..");
const tempRoot =
  process.env.NASAYEM_ADMIN_DATA ||
  resolve(process.env.LOCALAPPDATA, "Temp", "nasayem-admin-data");
const saPath = resolve(tempRoot, "SA", "SA.txt");
const yePath = resolve(tempRoot, "YE", "YE.txt");

const saRegions = [
  ["0001", "منطقة الرياض", "10", "الرياض", "0100", [
    ["0101", "الدرعية", "أ"], ["0102", "الخرج", "أ"], ["0103", "الدوادمي", "أ"],
    ["0104", "المجمعة", "أ"], ["0105", "القويعية", "أ"], ["0106", "وادي الدواسر", "أ"],
    ["0107", "الأفلاج", "أ"], ["0108", "الزلفي", "أ"], ["0109", "شقراء", "أ"],
    ["0110", "حوطة بني تميم", "أ"], ["0111", "عفيف", "أ"], ["0112", "السليل", "ب"],
    ["0113", "ضرماء", "ب"], ["0114", "المزاحمية", "ب"], ["0115", "رماح", "ب"],
    ["0116", "ثادق", "ب"], ["0117", "حريملاء", "ب"], ["0118", "الحريق", "ب"],
    ["0119", "الغاط", "أ"], ["0120", "مرات", "ب"], ["0121", "الدلم", "ب"],
    ["0122", "الرين", "ب"]
  ]],
  ["0002", "منطقة مكة المكرمة", "14", "مكة المكرمة", "0123", [
    ["0124", "جدة", "أ"], ["0125", "الطائف", "أ"], ["0126", "القنفذة", "أ"],
    ["0127", "الليث", "أ"], ["0128", "رابغ", "أ"], ["0129", "الجموم", "أ"],
    ["0130", "خليص", "أ"], ["0131", "الكامل", "ب"], ["0132", "الخرمة", "أ"],
    ["0133", "رنية", "أ"], ["0134", "تربة", "أ"], ["0135", "المويه", "ب"],
    ["0136", "ميسان", "ب"], ["0137", "أضم", "ب"], ["0138", "العرضيات", "ب"],
    ["0139", "بحرة", "ب"]
  ]],
  ["0003", "منطقة المدينة المنورة", "05", "المدينة المنورة", "0140", [
    ["0141", "ينبع", "أ"], ["0142", "العلا", "أ"], ["0143", "المهد", "أ"],
    ["0144", "الحناكية", "أ"], ["0145", "بدر", "ب"], ["0146", "خيبر", "ب"],
    ["0147", "العيص", "ب"], ["0148", "وادي الفرع", "ب"]
  ]],
  ["0004", "منطقة القصيم", "08", "بريدة", "0149", [
    ["0150", "عنيزة", "أ"], ["0151", "الرس", "أ"], ["0152", "المذنب", "أ"],
    ["0153", "البكيرية", "أ"], ["0154", "البدائع", "أ"], ["0155", "الأسياح", "ب"],
    ["0156", "النبهانية", "ب"], ["0157", "عيون الجواء", "ب"],
    ["0158", "رياض الخبراء", "ب"], ["0159", "الشماسية", "ب"],
    ["0160", "عقلة الصقور", "ب"], ["0161", "ضرية", "ب"], ["0251", "أبانات", "ب"]
  ]],
  ["0005", "المنطقة الشرقية", "06", "الدمام", "0162", [
    ["0163", "الأحساء", "أ", ["الإحساء", "Al Ahsa", "Al Hasa"]],
    ["0164", "حفر الباطن", "أ"], ["0165", "الجبيل", "أ"], ["0166", "القطيف", "أ"],
    ["0167", "الخبر", "أ"], ["0168", "الخفجي", "أ"], ["0169", "رأس تنورة", "ب"],
    ["0170", "بقيق", "ب", ["أبقيق", "Abqaiq"]], ["0171", "النعيرية", "ب"],
    ["0172", "قرية العليا", "ب"], ["0173", "العديد", "أ"], ["0174", "البيضاء", "ب"]
  ]],
  ["0006", "منطقة عسير", "11", "أبها", "0175", [
    ["0176", "خميس مشيط", "أ"], ["0177", "بيشة", "أ"], ["0178", "النماص", "أ"],
    ["0179", "محايل عسير", "أ", ["محايل", "Muhayil"]], ["0180", "سراة عبيدة", "أ"],
    ["0181", "تثليث", "أ"], ["0182", "رجال ألمع", "ب"], ["0183", "أحد رفيدة", "ب"],
    ["0184", "ظهران الجنوب", "ب"], ["0185", "بلقرن", "ب"], ["0186", "المجاردة", "ب"],
    ["0187", "تنومة", "ب"], ["0188", "طريب", "ب"], ["0189", "بارق", "ب"],
    ["0190", "البرك", "ب"], ["0191", "الحرجة", "ب"], ["0192", "الأمواه", "ب"]
  ]],
  ["0007", "منطقة تبوك", "19", "تبوك", "0193", [
    ["0194", "الوجه", "أ"], ["0195", "ضباء", "أ", ["ضبا", "Duba"]],
    ["0196", "تيماء", "أ"], ["0197", "أملج", "أ"], ["0198", "حقل", "ب"],
    ["0199", "البدع", "ب"]
  ]],
  ["0008", "منطقة حائل", "13", "حائل", "0200", [
    ["0201", "بقعاء", "أ"], ["0202", "الغزالة", "ب"], ["0203", "الشنان", "ب"],
    ["0204", "السليمي", "ب"], ["0205", "الحائط", "أ"], ["0206", "سميراء", "ب"],
    ["0207", "الشملي", "ب"], ["0208", "موقق", "ب"]
  ]],
  ["0009", "منطقة الحدود الشمالية", "15", "عرعر", "0209", [
    ["0210", "رفحاء", "أ"], ["0211", "طريف", "أ"], ["0212", "العويقيلة", "ب"]
  ]],
  ["0010", "منطقة جازان", "17", "جازان", "0213", [
    ["0214", "صبيا", "أ", ["صبياء", "Sabya"]], ["0215", "أبو عريش", "أ"],
    ["0216", "صامطة", "أ"], ["0217", "الحرث", "ب"], ["0218", "ضمد", "ب"],
    ["0219", "الريث", "ب"], ["0220", "بيش", "أ"], ["0221", "جزر فرسان", "أ", ["فرسان"]],
    ["0222", "الدائر", "ب"], ["0223", "أحد المسارحة", "ب"], ["0224", "العيدابي", "ب"],
    ["0225", "العارضة", "ب"], ["0226", "الدرب", "أ"], ["0227", "هروب", "ب"],
    ["0228", "فيفا", "ب"], ["0229", "الطوال", "ب"]
  ]],
  ["0011", "منطقة نجران", "16", "نجران", "0230", [
    ["0231", "شرورة", "أ"], ["0232", "حبونا", "ب"], ["0233", "بدر الجنوب", "ب"],
    ["0234", "يدمة", "ب"], ["0235", "ثار", "ب"], ["0236", "خباش", "ب"]
  ]],
  ["0012", "منطقة الباحة", "02", "الباحة", "0237", [
    ["0238", "بلجرشي", "أ", ["بالجرشي", "Baljurashi"]], ["0239", "المندق", "أ"],
    ["0240", "المخواة", "أ"], ["0241", "العقيق", "ب"], ["0242", "قلوة", "أ"],
    ["0243", "القرى", "ب"], ["0244", "بني حسن", "ب"], ["0245", "غامد الزناد", "ب"],
    ["0246", "الحجرة", "ب"]
  ]],
  ["0013", "منطقة الجوف", "20", "سكاكا", "0247", [
    ["0248", "القريات", "أ"], ["0249", "دومة الجندل", "أ"], ["0250", "طبرجل", "أ"],
    ["0252", "صوير", "ب"]
  ]]
];

const yemenGovernorates = [
  ["01", "أبين", "زنجبار"], ["02", "عدن", "عدن"], ["03", "المهرة", "الغيضة"],
  ["04", "حضرموت", "المكلا"], ["05", "شبوة", "عتق"], ["08", "الحديدة", "الحديدة"],
  ["10", "المحويت", "المحويت"], ["11", "ذمار", "ذمار"], ["14", "مأرب", "مأرب"],
  ["15", "صعدة", "صعدة"], ["16", "صنعاء", "صنعاء"], ["18", "الضالع", "الضالع"],
  ["19", "عمران", "عمران"], ["20", "البيضاء", "البيضاء"], ["21", "الجوف", "الحزم"],
  ["22", "حجة", "حجة"], ["23", "إب", "إب"], ["24", "لحج", "لحج"],
  ["25", "تعز", "تعز"], ["26", "أمانة العاصمة", "صنعاء", ["أمانة العاصمة صنعاء"]],
  ["27", "ريمة", "الجبين"], ["28", "أرخبيل سقطرى", "حديبو", ["سقطرى", "Socotra"]]
];

const saCoordinateOverrides = {
  "0113": { geonamesId: "10972323" },
  "0122": { geonamesId: "108419" },
  "0135": { geonamesId: "109993" },
  "0136": { osmRelationId: "12429529", latitude: 20.8399834, longitude: 40.9860063 },
  "0137": { osmRelationId: "12429531", latitude: 20.4195865, longitude: 40.8442355 },
  "0138": { osmRelationId: "12429530", latitude: 19.4348098, longitude: 41.7020734 },
  "0147": { geonamesId: "400320" },
  "0148": { osmRelationId: "12429014", latitude: 23.3764501, longitude: 39.551492 },
  "0161": { geonamesId: "107065" },
  "0251": { geonamesId: "110145" },
  "0173": { geonamesId: "292758" },
  "0174": { geonamesId: "398163" },
  "0185": { geonamesId: "10972263" },
  "0187": { geonamesId: "8020223" },
  "0188": { osmRelationId: "12436474", latitude: 18.5649816, longitude: 43.2038211 },
  "0189": { geonamesId: "12495725" },
  "0190": { geonamesId: "109889" },
  "0199": { geonamesId: "109966" },
  "0204": { geonamesId: "108051" },
  "0205": { geonamesId: "109611" },
  "0228": { geonamesId: "106667" },
  "0244": { osmRelationId: "12429804", latitude: 20.0912231, longitude: 41.368904 },
  "0245": { osmRelationId: "12429807", latitude: 19.6147114, longitude: 41.4662693 },
  "0246": { osmRelationId: "12429799", latitude: 20.1339866, longitude: 40.9904037 },
  "0252": { geonamesId: "392753" }
};

function parseGeoNames(text) {
  return text.trim().split("\n").map((line) => {
    const f = line.replace(/\r$/, "").split("\t");
    return {
      id: f[0], name: f[1], ascii: f[2], alternates: f[3].split(",").filter(Boolean),
      latitude: Number(f[4]), longitude: Number(f[5]), featureClass: f[6],
      featureCode: f[7], countryCode: f[8], admin1: f[10], admin2: f[11],
      population: Number(f[14] || 0), timezone: f[17]
    };
  });
}

function normalize(value) {
  return value.normalize("NFKD")
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()
    .replace(/^ال/, "");
}

function normalizeCompact(value) {
  return normalize(value).replace(/\s+/g, "");
}

function names(record) {
  return [record.name, record.ascii, ...record.alternates];
}

function arabicAlias(record) {
  return record.alternates.find((name) => /[\u0600-\u06ff]/.test(name));
}

function findMatch(records, officialName, aliases, admin1, featureCodes) {
  const wanted = new Set([officialName, ...aliases].map(normalize));
  const candidates = records.filter(
    (record) => record.admin1 === admin1 && featureCodes.includes(record.featureCode)
  );
  return candidates.find((record) => names(record).some((name) => wanted.has(normalize(name)))) || null;
}

function locationRecord({
  id, countryCode, countryName, cityName, sourceRecord, level,
  regionCode, regionName, governorateCode, governorateName, parentLabel,
  aliases = [], officialCode, administrativeClass
}) {
  const searchableAliases = [...new Set([...aliases, ...names(sourceRecord)])]
    .filter((alias) => /^[\p{Script=Arabic}\p{Script=Latin}\p{N}\s'’‘`.-]+$/u.test(alias))
    .slice(0, 30);

  return {
    id, countryCode, countryName, cityName,
    latitude: sourceRecord.latitude, longitude: sourceRecord.longitude,
    timezone: sourceRecord.timezone,
    level, regionCode, regionName, governorateCode, governorateName,
    parentLabel, aliases: searchableAliases,
    officialCode, administrativeClass,
    geonamesId: sourceRecord.id
  };
}

const [saText, yeText] = await Promise.all([
  readFile(saPath, "utf8"),
  readFile(yePath, "utf8")
]);
const saRecords = parseGeoNames(saText);
const yeRecords = parseGeoNames(yeText);
const locations = [];
const missingSaudi = [];
const saByRegion = [];

for (const [regionCode, regionName, admin1, capitalName, capitalCode, governorates] of saRegions) {
  const capital = findMatch(saRecords, capitalName, [], admin1, ["PPLA", "PPLA2", "PPLC", "PPL"]);
  if (capital) {
    locations.push(locationRecord({
      id: `sa-city-${capitalCode}`, countryCode: "SA", countryName: "السعودية",
      cityName: capitalName, sourceRecord: capital, level: "city",
      regionCode, regionName, parentLabel: regionName, officialCode: capitalCode
    }));
  }
  let imported = 0;
  for (const [officialCode, governorateName, administrativeClass, extraAliases = []] of governorates) {
    const override = saCoordinateOverrides[officialCode];
    let match = override?.geonamesId
      ? saRecords.find((record) => record.id === override.geonamesId)
      : override?.osmRelationId
        ? {
            id: `osm-relation-${override.osmRelationId}`,
            name: governorateName,
            ascii: governorateName,
            alternates: [],
            latitude: override.latitude,
            longitude: override.longitude,
            timezone: "Asia/Riyadh"
          }
        : findMatch(saRecords, governorateName, extraAliases, admin1, ["ADM2"]);
    let coordinateSource = "geonames-governorate";
    if (override?.osmRelationId) {
      coordinateSource = "openstreetmap-administrative-centroid";
    } else if (override?.geonamesId) {
      coordinateSource = match?.featureCode === "ADM2"
        ? "geonames-governorate"
        : "geonames-administrative-seat";
    } else if (!match) {
      match = findMatch(
        saRecords, governorateName, extraAliases, admin1,
        ["PPLA2", "PPLA3", "PPLA", "PPL", "PPLC"]
      );
      coordinateSource = "geonames-administrative-seat";
    }
    if (!match || !match.timezone || !Number.isFinite(match.latitude) || !Number.isFinite(match.longitude)) {
      missingSaudi.push({ officialCode, governorateName, regionCode, regionName });
      continue;
    }
    imported += 1;
    locations.push({
      ...locationRecord({
        id: `sa-gov-${officialCode}`, countryCode: "SA", countryName: "السعودية",
        cityName: `محافظة ${governorateName}`, sourceRecord: match, level: "governorate",
        regionCode, regionName, governorateCode: officialCode, governorateName,
        parentLabel: regionName, aliases: extraAliases, officialCode, administrativeClass
      }),
      coordinateSource
    });
  }
  saByRegion.push({
    regionCode, regionName, expected: governorates.length, imported,
    missing: governorates.filter(([code]) => missingSaudi.some((item) => item.officialCode === code)).map(([, name]) => name)
  });
}

const missingYemen = [];
const yemenGovRecords = [];
for (const [admin1, governorateName, capitalName, extraAliases = []] of yemenGovernorates) {
  const adminRecord = yeRecords.find((record) => record.featureCode === "ADM1" && record.admin1 === admin1);
  const capital = findMatch(
    yeRecords, capitalName, extraAliases, admin1,
    ["PPLA", "PPLA2", "PPLC", "PPL"]
  );
  const source = capital || adminRecord;
  if (!source || !source.timezone || !Number.isFinite(source.latitude) || !Number.isFinite(source.longitude)) {
    missingYemen.push({ admin1, governorateName });
    continue;
  }
  yemenGovRecords.push({ admin1, governorateName });
  locations.push({
    ...locationRecord({
      id: `ye-gov-${admin1}`, countryCode: "YE", countryName: "اليمن",
      cityName: `محافظة ${governorateName}`, sourceRecord: source, level: "governorate",
      governorateCode: admin1, governorateName, parentLabel: "اليمن",
      aliases: extraAliases, officialCode: admin1
    }),
    coordinateSource: capital ? "geonames-governorate-capital" : "geonames-administrative-centroid"
  });
}

const yemenAdminNames = new Map(yemenGovernorates.map(([code, name]) => [code, name]));
for (const record of yeRecords.filter((item) => item.featureCode === "ADM2" && yemenAdminNames.has(item.admin1))) {
  const governorateName = yemenAdminNames.get(record.admin1);
  const districtNames = new Set(names(record).map(normalizeCompact));
  const matchingPlace = yeRecords.find(
    (item) =>
      item.featureClass === "P" &&
      item.admin1 === record.admin1 &&
      item.admin2 === record.admin2 &&
      names(item).some((name) => districtNames.has(normalizeCompact(name))) &&
      arabicAlias(item)
  );
  const displayName = arabicAlias(record) || (matchingPlace && arabicAlias(matchingPlace)) || record.name;
  locations.push(locationRecord({
    id: `ye-district-${record.id}`, countryCode: "YE", countryName: "اليمن",
    cityName: displayName, sourceRecord: record, level: "district",
    governorateCode: record.admin1, governorateName,
    parentLabel: `محافظة ${governorateName}`,
    aliases: matchingPlace ? names(matchingPlace) : [],
    officialCode: `${record.admin1}.${record.admin2}`
  }));
}

for (const record of yeRecords.filter(
  (item) => item.featureClass === "P" && item.population >= 10000 && yemenAdminNames.has(item.admin1)
)) {
  const governorateName = yemenAdminNames.get(record.admin1);
  const displayName = arabicAlias(record) || record.name;
  if (locations.some((item) => item.countryCode === "YE" && normalize(item.cityName) === normalize(displayName) && item.governorateCode === record.admin1)) {
    continue;
  }
  locations.push(locationRecord({
    id: `ye-city-${record.id}`, countryCode: "YE", countryName: "اليمن",
    cityName: displayName, sourceRecord: record, level: "city",
    governorateCode: record.admin1, governorateName,
    parentLabel: `محافظة ${governorateName}`
  }));
}

const saGovernorates = locations.filter((item) => item.countryCode === "SA" && item.level === "governorate");
const yeGovernorates = locations.filter((item) => item.countryCode === "YE" && item.level === "governorate");
const yeDistricts = locations.filter((item) => item.countryCode === "YE" && item.level === "district");
const missingCoordinates = locations.filter(
  (item) => !Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)
);
const missingTimezone = locations.filter((item) => !item.timezone);

const saReport = {
  status: missingSaudi.length || missingCoordinates.some((item) => item.countryCode === "SA") ||
    missingTimezone.some((item) => item.countryCode === "SA") ? "FAIL" : "PASS",
  source: "https://ncar.gov.sa/regions-coding",
  geonamesSource: "https://download.geonames.org/export/dump/SA.zip",
  regionsExpected: 13,
  regionsImported: saByRegion.length,
  officialGovernoratesExpected: saRegions.reduce((sum, region) => sum + region[5].length, 0),
  governoratesImported: saGovernorates.length,
  governoratesPerRegion: saByRegion,
  missingGovernorates: missingSaudi,
  parentRegionMismatches: [],
  recordsMissingCoordinates: missingCoordinates.filter((item) => item.countryCode === "SA").map((item) => item.id),
  recordsMissingTimezone: missingTimezone.filter((item) => item.countryCode === "SA").map((item) => item.id)
};

const yeReport = {
  status: missingYemen.length || missingCoordinates.some((item) => item.countryCode === "YE") ||
    missingTimezone.some((item) => item.countryCode === "YE") ? "FAIL" : "PASS",
  geonamesSource: "https://download.geonames.org/export/dump/YE.zip",
  topLevelUnitsExpected: 22,
  governoratesImported: yeGovernorates.length,
  missingGovernorates: missingYemen,
  districtsImported: yeDistricts.length,
  recordsMissingCoordinates: missingCoordinates.filter((item) => item.countryCode === "YE").map((item) => item.id),
  recordsMissingTimezone: missingTimezone.filter((item) => item.countryCode === "YE").map((item) => item.id)
};

const sortedLocations = locations.sort((a, b) =>
  a.countryCode.localeCompare(b.countryCode) ||
  (a.regionCode || "").localeCompare(b.regionCode || "") ||
  (a.governorateCode || "").localeCompare(b.governorateCode || "") ||
  a.level.localeCompare(b.level) ||
  a.cityName.localeCompare(b.cityName, "ar")
);
const provenance = {
  saSha256: createHash("sha256").update(saText).digest("hex"),
  yeSha256: createHash("sha256").update(yeText).digest("hex")
};

await Promise.all([
  writeFile(resolve(workspace, "src", "data", "prayer-locations.generated.json"), `${JSON.stringify({ provenance, locations: sortedLocations }, null, 2)}\n`),
  writeFile(resolve(workspace, "SAUDI_GOVERNORATE_COVERAGE_REPORT.json"), `${JSON.stringify(saReport, null, 2)}\n`),
  writeFile(resolve(workspace, "YEMEN_GOVERNORATE_COVERAGE_REPORT.json"), `${JSON.stringify(yeReport, null, 2)}\n`)
]);

console.log(JSON.stringify({
  locations: sortedLocations.length,
  saudi: { status: saReport.status, expected: saReport.officialGovernoratesExpected, imported: saReport.governoratesImported, missing: missingSaudi },
  yemen: { status: yeReport.status, governorates: yeReport.governoratesImported, districts: yeReport.districtsImported, missing: missingYemen }
}, null, 2));

if (saReport.status !== "PASS" || yeReport.status !== "PASS") {
  process.exitCode = 1;
}
