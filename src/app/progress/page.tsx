import dynamic from "next/dynamic";

import { AppSection } from "@/design-system";

import { PageLoadingState } from "../PageLoadingState";

const ProgressDashboard = dynamic(
  () => import("./ProgressDashboard").then((module) => module.ProgressDashboard),
  {
    loading: () => <PageLoadingState label="Loading progress" />
  }
);

export default function ProgressPage() {
  return (
    <main>
      <AppSection
        description="A simple view of completed and remaining journey steps."
        heading="Progress"
        spacing="lg"
      >
        <ProgressDashboard />
      </AppSection>
    </main>
  );
}
