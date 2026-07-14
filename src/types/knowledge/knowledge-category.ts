import type { EntityId } from "../common";

export interface KnowledgeCategory {
  id: EntityId;
  slug: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
}
