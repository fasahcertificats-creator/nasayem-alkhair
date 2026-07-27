import type { Metadata } from "next";

import {
  LegalList,
  LegalNotice,
  LegalPage,
  LegalSection
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "المصادر والمراجع",
  description:
    "مصادر الأذكار ودليل العمرة ومواقيت الصلاة وبيانات المدن والخدمات الخارجية في تطبيق نسائم الخير."
};

export default function SourcesPage() {
  return (
    <LegalPage
      description="تسجل هذه الصفحة المصادر الموجودة فعلًا في المستودع، ولا تدعي مراجعة علمية أو رسمية تتجاوز تقارير المشروع."
      title="المصادر والمراجع"
    >
      <LegalSection title="1. مصادر الأذكار">
        <p>
          تحتوي سجلات الأذكار على حقل للمصدر وحقل للرابط المرجعي، مع بيانات
          التكرار وحالة المراجعة. تشمل صيغ العرض أسماء السور والآيات، ومراجع
          الأحاديث عندما تكون مسجلة، وروابط «مرجع النص» الموجودة في البيانات.
        </p>
        <p>
          يغطي تقرير التدقيق الحالي 10 أقسام و289 عنصرًا، دون عناصر تتطلب
          المراجعة وقت إنشائه.
        </p>
        <LegalNotice>
          نجاح التدقيق يعني سلامة البنية والمراجع المسجلة وفق قواعد المشروع، ولا
          يعني اعتمادًا شرعيًا مستقلًا خارج المراجعة الموثقة في المستودع.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="2. مصادر دليل العمرة">
        <p>
          تتضمن بيانات الدليل حقولًا مرجعية لكل مرحلة أو دعاء، منها اسم المصدر
          ورقم المرجع وحالة التحقق. المصادر المسجلة تشمل القرآن الكريم وصحيح
          البخاري وصحيح مسلم وسنن أبي داود وسنن ابن ماجه، إضافة إلى إرشادات عملية
          موسومة بأنها مراجعة.
        </p>
        <p>
          عندما يكون المحتوى إرشادًا داخليًا لا نصًا منقولًا، يظهر في البيانات
          بوصفه إرشادًا عمليًا أو إرشادًا مراجعًا بدل اختراع مرجع كتابي له.
        </p>
      </LegalSection>

      <LegalSection title="3. مواقيت الصلاة">
        <p>
          يستخدم التطبيق مكتبة <bdi dir="ltr">adhan 4.4.4</bdi> المثبتة في
          المشروع. يجري الحساب من الإحداثيات باستخدام طريقة رابطة العالم الإسلامي
          الثابتة داخليًا.
        </p>
      </LegalSection>

      <LegalSection title="4. بيانات المدن والمواقع">
        <LegalList>
          <li>
            بيانات المناطق والمحافظات السعودية تستند إلى ترميز المركز الوطني
            للأرشيف والوثائق، مع إحداثيات وأسماء إثرائية من GeoNames.
          </li>
          <li>
            بيانات محافظات ومديريات اليمن وإحداثياتها مستوردة من GeoNames.
          </li>
          <li>
            يحتوي الملف المولد على بصمات مصدر وتقارير تغطية، وقد استُخدمت مواءمة
            وتوليد داخليان لربط الأسماء والمستويات الإدارية.
          </li>
        </LegalList>
        <p>
          لا يدعي التطبيق أن كل إحداثية أو تسمية يدوية مصدرها جهة حكومية. تتطلب
          بيانات GeoNames الإسناد إلى
          {" "}
          <a
            aria-label="موقع GeoNames الخارجي وترخيصه"
            className="text-primary focus-visible:ring-gold break-words font-bold underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
            href="https://www.geonames.org/about.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            GeoNames
          </a>
          ، وهي متاحة وفق ترخيصها المبين في موقعها.
        </p>
      </LegalSection>

      <LegalSection title="5. بيانات المكتب">
        <p>
          اسم المكتب والعنوان وأرقام الهاتف وساعات العمل وأوصاف الخدمات معلومات
          قدمها مكتب نسائم الخير للسفريات والسياحة.
        </p>
      </LegalSection>

      <LegalSection title="6. البرمجيات والخدمات الخارجية">
        <LegalList>
          <li>
            Nominatim / OpenStreetMap: للتعرف العكسي على المدينة بعد طلب الموقع.
            {" "}
            <a
              aria-label="سياسة استخدام Nominatim الخارجية"
              className="text-primary focus-visible:ring-gold break-words font-bold underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
              href="https://operations.osmfoundation.org/policies/nominatim/"
              rel="noopener noreferrer"
              target="_blank"
            >
              سياسة Nominatim
            </a>
          </li>
          <li>
            Google Fonts: لتقديم خطي Cairo وAmiri عند توفر الاتصال.
            {" "}
            <a
              aria-label="سياسة خصوصية Google الخارجية"
              className="text-primary focus-visible:ring-gold break-words font-bold underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              سياسة خصوصية Google
            </a>
          </li>
          <li>
            WhatsApp: يُفتح فقط عندما يختار المستخدم المراسلة.
            {" "}
            <a
              aria-label="سياسة خصوصية WhatsApp الخارجية"
              className="text-primary focus-visible:ring-gold break-words font-bold underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
              href="https://www.whatsapp.com/legal/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              سياسة خصوصية WhatsApp
            </a>
          </li>
        </LegalList>
      </LegalSection>
    </LegalPage>
  );
}
