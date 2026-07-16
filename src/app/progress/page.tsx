import dynamic from "next/dynamic";

import { AppSection } from "@/design-system";

import { PageLoadingState } from "../PageLoadingState";

const ProgressDashboard = dynamic(
  () => import("./ProgressDashboard").then((module) => module.ProgressDashboard),
  {
    loading: () => <PageLoadingState label="جاري تحميل التقدم" />
  }
);

export default function ProgressPage() {
  return (
    <main>
      <AppSection
        description="متابعة المراحل المكتملة والمتبقية في دليل العمرة."
        heading="التقدم"
        spacing="lg"
      >
        <ProgressDashboard />
      </AppSection>
    </main>
  );
}
