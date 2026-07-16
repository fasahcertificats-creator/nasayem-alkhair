import dynamic from "next/dynamic";

import { AppSection } from "@/design-system";
import { getUmrahStages } from "@/services/content";

import { PageLoadingState } from "../PageLoadingState";

const ProgressDashboard = dynamic(
  () => import("./ProgressDashboard").then((module) => module.ProgressDashboard),
  {
    loading: () => <PageLoadingState label="جاري تحميل التقدم" />
  }
);

export default function ProgressPage() {
  const stages = getUmrahStages().map(({ id, progressKey, slug, titleAr }) => ({
    id,
    progressKey,
    slug,
    titleAr
  }));

  return (
    <main>
      <AppSection
        description="متابعة المراحل المكتملة والمتبقية في دليل العمرة."
        heading="تقدم العمرة"
        spacing="lg"
      >
        <ProgressDashboard stages={stages} />
      </AppSection>
    </main>
  );
}
