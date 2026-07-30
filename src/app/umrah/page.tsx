import type { Metadata } from "next";

import { getUmrahStages } from "@/services/content";

import { UmrahCompanionContent } from "./UmrahCompanionContent";

export const metadata: Metadata = {
  title: "دليل العمرة",
  description: "دليل مرتب لمراحل العمرة من الاستعداد والإحرام إلى إتمام النسك.",
  alternates: {
    canonical: "/umrah"
  }
};

export default function UmrahGuidePage() {
  const stages = getUmrahStages();

  return <UmrahCompanionContent stages={stages} />;
}
