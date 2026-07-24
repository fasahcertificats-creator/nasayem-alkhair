import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const approvedIntroduction =
  "في رحلةٍ هي من أعظم رحلات المسلم، تتجرد القلوب من الشواغل، وترتفع الأكف إلى الله رجاء القبول والمغفرة. فالعمرة ليست مناسك تُؤدّى فحسب، بل لحظات قربٍ وخشوعٍ ورحمة، تكون فيها الأدعية زادًا للروح ولسانًا يناجي به العبد ربَّه في أشرف البقاع.";

const expectedGeneralDuas = [
  {
    authenticityLabel: undefined,
    context: "tawaf",
    id: "tawaf-general-acceptance",
    sourceKind: "quran",
    sourceLabel: "القرآن الكريم",
    sourceReference: "سورة البقرة، الآية ١٢٧",
    text: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ.",
    title: "سؤال القبول"
  },
  {
    authenticityLabel: undefined,
    context: "tawaf",
    id: "tawaf-general-mercy",
    sourceKind: "quran",
    sourceLabel: "القرآن الكريم",
    sourceReference: "سورة آل عمران، الآية ٨",
    text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا، وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً، إِنَّكَ أَنْتَ الْوَهَّابُ.",
    title: "سؤال الثبات والرحمة"
  },
  {
    authenticityLabel: undefined,
    context: "tawaf",
    id: "tawaf-general-religion-life-hereafter",
    sourceKind: "hadith",
    sourceLabel: "الحديث النبوي",
    sourceReference: "صحيح مسلم، رقم ٢٧٢٠",
    text: "اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي، واجعل الحياة زيادةً لي في كل خير، واجعل الموت راحةً لي من كل شر.",
    title: "صلاح الدين والدنيا والآخرة"
  },
  {
    authenticityLabel: undefined,
    context: "tawaf",
    id: "tawaf-general-piety",
    sourceKind: "hadith",
    sourceLabel: "الحديث النبوي",
    sourceReference: "صحيح مسلم، رقم ٢٧٢٢",
    text: "اللهم آتِ نفسي تقواها، وزكِّها أنت خير من زكّاها، أنت وليّها ومولاها.",
    title: "تزكية النفس"
  },
  {
    authenticityLabel: undefined,
    context: "sai",
    id: "sai-general-family",
    sourceKind: "quran",
    sourceLabel: "القرآن الكريم",
    sourceReference: "سورة الفرقان، الآية ٧٤",
    text: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ، وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا.",
    title: "صلاح الأهل والذرية"
  },
  {
    authenticityLabel: undefined,
    context: "sai",
    id: "sai-general-provision",
    sourceKind: "quran",
    sourceLabel: "القرآن الكريم",
    sourceReference: "سورة القصص، الآية ٢٤",
    text: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ.",
    title: "سؤال الخير والرزق"
  },
  {
    authenticityLabel: undefined,
    context: "sai",
    id: "sai-general-guidance",
    sourceKind: "hadith",
    sourceLabel: "الحديث النبوي",
    sourceReference: "صحيح مسلم، رقم ٢٧٢١",
    text: "اللهم إني أسألك الهدى والتقى والعفاف والغنى.",
    title: "الهدى والتقى والعفاف والغنى"
  },
  {
    authenticityLabel: "حديث صحيح",
    context: "sai",
    id: "sai-general-heart",
    sourceKind: "hadith",
    sourceLabel: "الحديث النبوي",
    sourceReference: "سنن الترمذي، رقم ٣٥٢٢",
    text: "يا مقلّب القلوب، ثبّت قلبي على دينك.",
    title: "الثبات على الدين"
  }
];

const prohibitedPhrases = [
  "دعاء الشوط الأول",
  "دعاء الشوط الثاني",
  "دعاء خاص بالشوط",
  "يقال في الشوط الأول"
];

const requiredGuidancePhrases = [
  "عند محاذاة الحجر الأسود كبّر، ولا تزاحم أو تؤذِ أحدًا.",
  "وفي بقية الطواف اذكر الله، واقرأ ما تيسّر من القرآن، وادعُ بما شئت من خيري الدنيا والآخرة.",
  "وأثناء السعي اذكر الله وادعُ بما تيسّر لك من خير الدنيا والآخرة.",
  "يُقال ثلاث مرات، ويدعو بين المرات بما شاء."
];

function listTextFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      return listTextFiles(path);
    }

    return /\.(?:json|mjs|ts|tsx)$/.test(path) ? [path] : [];
  });
}

const companionDuas = JSON.parse(
  readFileSync(join("data", "umrah", "companion-duas.json"), "utf8")
);
const normalizedCompanionDuas = companionDuas.map((item) => ({
  authenticityLabel: item.authenticityLabel,
  context: item.context,
  id: item.id,
  sourceKind: item.sourceKind,
  sourceLabel: item.sourceLabel,
  sourceReference: item.sourceReference,
  text: item.text,
  title: item.title
}));

assert.deepEqual(normalizedCompanionDuas, expectedGeneralDuas);
assert.equal(companionDuas.length, 8);
assert.equal(new Set(companionDuas.map((item) => item.id)).size, 8);
assert.ok(companionDuas.every((item) => item.scope === "general"));
assert.equal(companionDuas.filter((item) => item.context === "tawaf").length, 4);
assert.equal(companionDuas.filter((item) => item.context === "sai").length, 4);

const landingSource = readFileSync(
  join("src", "app", "umrah", "UmrahCompanionContent.tsx"),
  "utf8"
);
assert.ok(landingSource.includes(approvedIntroduction));

const searchableText = [
  ...listTextFiles("src"),
  ...listTextFiles("data")
].map((path) => readFileSync(path, "utf8")).join("\n");

for (const phrase of prohibitedPhrases) {
  assert.ok(!searchableText.includes(phrase), `Unsupported phrase found: ${phrase}`);
}

for (const phrase of requiredGuidancePhrases) {
  assert.ok(searchableText.includes(phrase), `Approved guidance phrase missing: ${phrase}`);
}

const existingDuas = JSON.parse(readFileSync(join("data", "umrah", "duas.json"), "utf8"));
const tawafPositionDua = existingDuas.find((item) => item.id === "tawaf-between-corners-dua");
const saiPositionDhikr = existingDuas.find((item) => item.id === "sai-safa-marwah-dhikr");

assert.equal(
  tawafPositionDua.arabicText,
  "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ."
);
assert.equal(
  saiPositionDhikr.arabicText,
  "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ."
);

console.log("PASS: approved introduction exact");
console.log("PASS: eight-item general dua whitelist exact");
console.log("PASS: Tawaf four-item and Sa'i four-item subsets exact");
console.log("PASS: every companion dua is general and has an approved context");
console.log("PASS: unsupported round-specific prayer phrases absent");
console.log("PASS: exact approved Tawaf and Sa'i guidance phrases present");
console.log("PASS: existing Tawaf and Sa'i positional wording preserved exactly");
console.log(
  "HUMAN REVIEW REQUIRED: existing positional punctuation/presentation differs from the new prompt; baseline wording was preserved by policy"
);
