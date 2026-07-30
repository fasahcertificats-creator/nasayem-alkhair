import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ROUTES } from "@/constants/routes.constants";
import {
  getDuasByStageId,
  getUmrahCompanionDuas,
  getUmrahStages
} from "@/services/content";

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

export async function generateMetadata({ params }: StagePageProps): Promise<Metadata> {
  const { stage: stageSlug } = await params;
  const stage = getUmrahStages().find((item) => item.slug === stageSlug);

  if (!stage) {
    return {
      title: "دليل العمرة",
      alternates: {
        canonical: ROUTES.umrah
      }
    };
  }

  return {
    title: stage.titleAr,
    description: stage.summary,
    alternates: {
      canonical: ROUTES.umrahStage(stage.slug)
    }
  };
}

const mergedStageRedirects: Record<string, Route> = {
  miqat: ROUTES.umrahStage("ihram"),
  talbiyah: ROUTES.umrahStage("ihram"),
  "entering-al-masjid-al-haram": ROUTES.umrahStage("entering-makkah"),
  "seeing-kaaba": ROUTES.umrahStage("entering-makkah")
};

export default async function UmrahStagePage({ params }: StagePageProps) {
  const { stage: stageSlug } = await params;

  const redirectTarget = mergedStageRedirects[stageSlug];

  if (redirectTarget) {
    permanentRedirect(redirectTarget);
  }

  const stage = getUmrahStages().find((item) => item.slug === stageSlug);

  if (!stage) {
    notFound();
  }

  const approvedDuas = getDuasByStageId(stage.slug);
  const companionDuas =
    stage.slug === "tawaf" || stage.slug === "sai" ? getUmrahCompanionDuas(stage.slug) : [];

  return (
    <StageDetailContent approvedDuas={approvedDuas} companionDuas={companionDuas} stage={stage} />
  );
}
