# Knowledge Migration

This document tracks migrations from legacy feature content into the Islamic Knowledge Base.

## Travel Migration Source

Phase 11.2 migrates only the already-approved Travel records from:

```text
data/umrah/duas.json
```

Migrated records:

- `travel-dua-travel`
- `travel-dua-returning-from-travel`

No draft, needs-review, rejected, or unverified Travel records are migrated.

## Preserved Metadata

The migration preserves:

- Arabic title.
- Arabic text.
- Arabic context.
- Source type.
- Source reference.
- Source collection.
- Source number.
- Authenticity.
- Approved verification status.
- Legacy order relationship.

The shared source reference is stored once in `data/knowledge/sources.json`, and both Knowledge records reference that source through `sourceId`.

## Duplicate Prevention

Knowledge records are keyed by stable IDs that match the approved legacy records. The migration should upsert by ID rather than append blindly.

Duplicate checks must confirm:

- No duplicate `KnowledgeRecord.id`.
- No duplicate `KnowledgeSource.id`.
- No duplicate relation tuple of `knowledgeId`, `entityType`, and `entityId`.
- No duplicate category `slug`.

If the same Arabic text and source are needed in multiple app surfaces, add a `KnowledgeRelation` instead of copying the record.

## Temporary Coexistence

Legacy Umrah data remains in place during this migration test.

The app still reads existing Umrah data for public display. The Knowledge Base now contains migrated Travel records for future reuse, but no UI or route has been changed to consume them.

This temporary coexistence allows validation of the Knowledge architecture without changing application behavior.

## Relations Created

The migrated Travel records are related to:

- `entityType: "umrah-stage"` with `entityId: "travel"`.
- `entityType: "azkar-category"` with `entityId: "travel"` for future reuse.

The Azkar relation is dormant until a later UI or service migration explicitly consumes Knowledge records.

## Rollback Approach

Rollback is data-only for this phase:

1. Remove the migrated Travel rows from `data/knowledge/records.json`.
2. Remove the Travel source row from `data/knowledge/sources.json` if no other Knowledge record uses it.
3. Remove the Travel migration relation rows from `data/knowledge/relations.json`.
4. Remove categories from `data/knowledge/categories.json` only if no later migration uses them.
5. Keep legacy Umrah records unchanged.

Because no application behavior is changed in this phase, rollback does not require route, UI, Firebase, or Design System changes.
