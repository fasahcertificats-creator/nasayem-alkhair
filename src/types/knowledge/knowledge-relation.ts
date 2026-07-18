import type { EntityId } from "../common";

export type KnowledgeRelationEntityType =
  | "knowledge-category"
  | "umrah-stage"
  | "azkar-category"
  | "daily-reminder"
  | "prayer-related-content";

export interface KnowledgeRelation {
  knowledgeId: EntityId;
  entityType: KnowledgeRelationEntityType;
  entityId: EntityId;
  priority: number;
  displayOrder: number;
}
