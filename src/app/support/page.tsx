import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { OfficeContactDetails } from "@/components/legal/OfficeContactDetails";
import { SupportContact } from "@/components/legal/SupportContact";

export const metadata: Metadata = {
  title: "الدعم والتواصل",
  description:
    "التواصل مع مكتب نسائم الخير للدعم الفني وملاحظات المحتوى والخصوصية وخدمات السفر."
};

export default function SupportPage() {
  return (
    <LegalPage
      description="اختر نوع الملاحظة لفتح رسالة واتساب مختصرة. لا يطلب التطبيق اسمك ولا يحفظ نموذج دعم داخليًا."
      title="الدعم والتواصل"
    >
      <LegalSection title="التواصل مع المكتب">
        <OfficeContactDetails />
      </LegalSection>
      <LegalSection title="إرسال ملاحظة">
        <SupportContact />
      </LegalSection>
    </LegalPage>
  );
}
