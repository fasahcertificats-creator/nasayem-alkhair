import categoriesData from "../../../data/knowledge/categories.json";
import recordsData from "../../../data/knowledge/records.json";
import relationsData from "../../../data/knowledge/relations.json";
import sourcesData from "../../../data/knowledge/sources.json";

import type {
  ContentVerificationStatus,
  KnowledgeAuthenticity,
  KnowledgeCategory,
  KnowledgeRecord,
  KnowledgeRecordType,
  KnowledgeRelation,
  KnowledgeRelationEntityType,
  KnowledgeSource,
  KnowledgeSourceType
} from "@/types";

const knowledgeRecordTypes = new Set<KnowledgeRecordType>([
  "quran",
  "hadith",
  "dua",
  "dhikr",
  "guidance",
  "juristic-information",
  "common-mistake",
  "reminder"
]);

const knowledgeAuthenticityValues = new Set<KnowledgeAuthenticity>([
  "Quran",
  "sahih",
  "hasan",
  "thabit",
  "general",
  "needs-review"
]);

const knowledgeSourceTypes = new Set<KnowledgeSourceType>([
  "",
  "Quran",
  "Hadith",
  "ScholarlyReference"
]);

const knowledgeRelationEntityTypes = new Set<KnowledgeRelationEntityType>([
  "knowledge-category",
  "umrah-stage",
  "azkar-category",
  "daily-reminder",
  "prayer-related-content"
]);

const verificationStatusValues = new Set<ContentVerificationStatus>([
  "draft",
  "needs-review",
  "approved",
  "rejected"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isKnowledgeRecord(value: unknown): value is KnowledgeRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    knowledgeRecordTypes.has(value.type as KnowledgeRecordType) &&
    typeof value.titleAr === "string" &&
    typeof value.arabicText === "string" &&
    typeof value.translation === "string" &&
    typeof value.transliteration === "string" &&
    typeof value.summaryAr === "string" &&
    typeof value.contextAr === "string" &&
    typeof value.sourceId === "string" &&
    typeof value.verificationStatus === "string" &&
    verificationStatusValues.has(value.verificationStatus as ContentVerificationStatus) &&
    typeof value.authenticity === "string" &&
    knowledgeAuthenticityValues.has(value.authenticity as KnowledgeAuthenticity) &&
    typeof value.order === "number" &&
    isStringArray(value.tags) &&
    isStringArray(value.topics) &&
    isStringArray(value.searchKeywords) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isKnowledgeSource(value: unknown): value is KnowledgeSource {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.sourceType === "string" &&
    knowledgeSourceTypes.has(value.sourceType as KnowledgeSourceType) &&
    typeof value.sourceReference === "string" &&
    typeof value.collection === "string" &&
    typeof value.number === "string" &&
    typeof value.surah === "string" &&
    typeof value.ayah === "string" &&
    typeof value.volume === "string" &&
    typeof value.page === "string" &&
    typeof value.narrator === "string" &&
    typeof value.authenticity === "string" &&
    typeof value.scholarNotes === "string"
  );
}

function isKnowledgeCategory(value: unknown): value is KnowledgeCategory {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.titleAr === "string" &&
    typeof value.descriptionAr === "string" &&
    typeof value.icon === "string"
  );
}

function isKnowledgeRelation(value: unknown): value is KnowledgeRelation {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.knowledgeId === "string" &&
    typeof value.entityType === "string" &&
    knowledgeRelationEntityTypes.has(value.entityType as KnowledgeRelationEntityType) &&
    typeof value.entityId === "string" &&
    typeof value.priority === "number" &&
    typeof value.displayOrder === "number"
  );
}

function parseCollection<T>(data: unknown, guard: (value: unknown) => value is T): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(guard);
}

export function getKnowledge(): KnowledgeRecord[] {
  return parseCollection(recordsData, isKnowledgeRecord).sort(
    (first, second) => first.order - second.order
  );
}

export function getKnowledgeById(id: string): KnowledgeRecord | undefined {
  return getKnowledge().find((record) => record.id === id);
}

export function getKnowledgeByTopic(topic: string): KnowledgeRecord[] {
  return getKnowledge().filter((record) => record.topics.includes(topic));
}

export function getKnowledgeByCategory(categoryId: string): KnowledgeRecord[] {
  const relatedKnowledgeIds = new Set(
    getKnowledgeRelations()
      .filter(
        (relation) =>
          relation.entityType === "knowledge-category" && relation.entityId === categoryId
      )
      .sort((first, second) => first.displayOrder - second.displayOrder)
      .map((relation) => relation.knowledgeId)
  );

  return getKnowledge().filter((record) => relatedKnowledgeIds.has(record.id));
}

export function getApprovedKnowledgeByEntity(
  entityType: KnowledgeRelationEntityType,
  entityId: string
): KnowledgeRecord[] {
  const approvedKnowledgeById = new Map(
    getKnowledge()
      .filter((record) => record.verificationStatus === "approved")
      .map((record) => [record.id, record])
  );

  return getKnowledgeRelations()
    .filter((relation) => relation.entityType === entityType && relation.entityId === entityId)
    .sort((first, second) => first.displayOrder - second.displayOrder)
    .map((relation) => approvedKnowledgeById.get(relation.knowledgeId))
    .filter((record): record is KnowledgeRecord => record !== undefined);
}

export function getKnowledgeRelations(): KnowledgeRelation[] {
  return parseCollection(relationsData, isKnowledgeRelation).sort((first, second) => {
    if (first.priority !== second.priority) {
      return first.priority - second.priority;
    }

    return first.displayOrder - second.displayOrder;
  });
}

export function getKnowledgeCategories(): KnowledgeCategory[] {
  return parseCollection(categoriesData, isKnowledgeCategory);
}

export function getKnowledgeSources(): KnowledgeSource[] {
  return parseCollection(sourcesData, isKnowledgeSource);
}
