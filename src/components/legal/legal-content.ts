export const LEGAL_LAST_UPDATED = "27 يوليو 2026";

export const OFFICE_DETAILS = {
  name: "مكتب نسائم الخير للسفريات والسياحة",
  addressLine1: "عدن - الشيخ عثمان - شارع عمر المختار",
  addressLine2: "بجانب مدرسة الحصاد الأهلية",
  primaryPhone: "967774360027",
  primaryPhoneDisplay: "+967 77 436 0027",
  secondaryPhone: "967774383736",
  secondaryPhoneDisplay: "+967 77 438 3736",
  workingDays: "السبت إلى الخميس",
  workingHours: "9:00 صباحًا - 9:00 مساءً"
} as const;

export function buildWhatsappUrl(phone: string, message?: string) {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";

  return `https://wa.me/${phone}${query}`;
}
