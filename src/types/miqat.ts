import type { EntityId } from "./common";
import type { ContentVerificationStatus } from "./dua";

export interface Miqat {
  id: EntityId;
  nameAr: string;
  nameEn: string;
  region: string;
  descriptionAr: string;
  rulesAr: string;
  relatedStageId: EntityId;
  verificationStatus: ContentVerificationStatus;
  sourceReference: string;
  description?: string;
  rules?: string[];
}
