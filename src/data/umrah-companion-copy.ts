import type { UmrahContext } from "@/types";

export const UMRAH_COMPANION_COPY = {
  common: {
    counterNotice: "هذا العداد للتذكير فقط، فتأكّد بنفسك من عدد الأشواط.",
    generalDuaNotice: "هذه الأدعية عامة وليست مخصّصة لشوط بعينه.",
    personalDuaText:
      "اسأل الله حاجتك بلسانك، وادعُ لنفسك وأهلك ومن تحب بخير الدنيا والآخرة.",
    personalDuaTitle: "وادعُ بما في نفسك",
    religiousNotice:
      "لا يوجد دعاء مختلف ثابت لكل شوط؛ اذكر الله واقرأ ما تيسّر من القرآن وادعُ بما شئت من الخير.",
    selectedDuasSupport:
      "أدعية قرآنية ونبوية عامة للاستعانة بها دون تخصيصها بشوط معيّن.",
    selectedDuasTitle: "أدعية مختارة ومناجاة"
  },
  tawaf: {
    blackStoneInstruction: "عند محاذاة الحجر الأسود كبّر، ولا تزاحم أو تؤذِ أحدًا.",
    blackStoneReminder: "عند محاذاة الحجر الأسود: الله أكبر.",
    completedCounterText: "اكتملت الأشواط السبعة في العداد.",
    completionCaution:
      "تحقّق بنفسك من إتمام الطواف على الوجه الصحيح قبل متابعة المناسك.",
    currentRoundGuidance:
      "ابدأ من محاذاة الحجر الأسود، واجعل الكعبة عن يسارك، وأتم الشوط عند عودتك إلى نقطة البداية.",
    directionReminder:
      "بين الركن اليماني والحجر الأسود اقرأ الدعاء الثابت المعروض أعلاه.",
    otherPartsGuidance:
      "وفي بقية الطواف اذكر الله، واقرأ ما تيسّر من القرآن، وادعُ بما شئت من خيري الدنيا والآخرة.",
    personalRoundReminder: "وادعُ بما في نفسك من خير الدنيا والآخرة.",
    support: "تابع الأشواط السبعة واستعن بالأدعية العامة.",
    title: "مرافق أشواط الطواف"
  },
  sai: {
    completedCounterText: "اكتملت أشواط السعي السبعة في العداد.",
    completionCaution:
      "تحقّق بنفسك من إتمام السعي على الوجه الصحيح قبل متابعة المناسك.",
    dhikrInstruction: "يُقال ثلاث مرات، ويدعو بين المرات بما شاء.",
    pathReminder:
      "وأثناء السعي اذكر الله وادعُ بما تيسّر لك من خير الدنيا والآخرة.",
    positionReminder:
      "على الصفا والمروة: قل الذكر الثابت المعروض أعلاه، ثم ادعُ بما شئت.",
    support: "تابع الاتجاهات السبعة واستعن بالأدعية العامة.",
    title: "مرافق أشواط السعي"
  }
} as const;

export const UMRAH_COMPANION_STORAGE_KEYS: Record<UmrahContext, string> = {
  tawaf: "nasayem-alkhair:umrah:tawaf-round:v1",
  sai: "nasayem-alkhair:umrah:sai-round:v1"
};
