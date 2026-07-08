import Link from "next/link";
import dynamic from "next/dynamic";

import { AppButton, AppSection, spacing } from "@/design-system";
import { getUmrahContent } from "@/services/firestore/umrahContentService";

import { PageLoadingState } from "../PageLoadingState";

const UmrahStepList = dynamic(
  () => import("./UmrahStepList").then((module) => module.UmrahStepList),
  {
    loading: () => <PageLoadingState label="Loading Umrah guide" />
  }
);

const timelineSteps = [
  {
    id: "ihram",
    title: "Ihram",
    stage: "preparation"
  },
  {
    id: "tawaf",
    title: "Tawaf",
    stage: "kaaba"
  },
  {
    id: "sai",
    title: "Sa'i",
    stage: "safa-marwah"
  },
  {
    id: "hair",
    title: "Shaving/Cutting hair",
    stage: "completion"
  }
] as const;

export default async function UmrahGuidePage() {
  const content = await getUmrahContent();

  return (
    <main>
      <AppSection
        description="A step-by-step timeline for the essential Umrah stages."
        heading="Umrah Guide"
        spacing="lg"
      >
        <div className={spacing.stack.lg}>
          <UmrahStepList content={content} steps={timelineSteps} />
          <AppButton asChild tone="outline">
            <Link href="/">Back Home</Link>
          </AppButton>
        </div>
      </AppSection>
    </main>
  );
}
