import { getUmrahStages } from "@/services/content";

import { UmrahCompanionContent } from "./UmrahCompanionContent";

export default function UmrahGuidePage() {
  const stages = getUmrahStages();

  return <UmrahCompanionContent stages={stages} />;
}
