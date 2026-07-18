import { notFound, permanentRedirect } from "next/navigation";

import { getDuasByStageId, getUmrahStages } from "@/services/content";

import { StageDetailContent } from "./StageDetailContent";

interface StagePageProps {
  params: Promise<{
    stage: string;
  }>;
}

export function generateStaticParams() {
  return getUmrahStages().map((stage) => ({
    stage: stage.slug
  }));
}

export default async function UmrahStagePage({ params }: StagePageProps) {
  const { stage: stageSlug } = await params;

  if (stageSlug === "miqat") {
    permanentRedirect("/umrah/ihram");
  }

  const stage = getUmrahStages().find((item) => item.slug === stageSlug);

  if (!stage) {
    notFound();
  }

  const approvedDuas = getDuasByStageId(stage.slug);

  return <StageDetailContent approvedDuas={approvedDuas} stage={stage} />;
}
