# Knowledge Architecture

The Knowledge Base is the long-term single source of truth for Islamic content in Nasayem Alkhair. It is an architecture layer only until content migration is intentionally started.

## Single Source of Truth

Religious content should live once as a `KnowledgeRecord`.

A record stores the reviewed Arabic text, context, summary, authenticity, verification status, search metadata, and the `sourceId` that points to its source metadata. Product features should reference knowledge records instead of copying Quran text, Hadith text, duas, or religious guidance into feature-specific files.

This keeps approval status, source metadata, and future corrections traceable in one place.

## Core Files

The repository layer is stored under `data/knowledge/`:

- `records.json`: canonical knowledge records.
- `sources.json`: Quran, Hadith, and scholarly source metadata.
- `categories.json`: reusable knowledge categories.
- `relations.json`: display relationships between knowledge and app entities.

All four files start as empty arrays. Empty repositories are valid and must return gracefully from services.

## Knowledge Models

The TypeScript models are stored under `src/types/knowledge/`:

- `KnowledgeRecord`
- `KnowledgeSource`
- `KnowledgeCategory`
- `KnowledgeRelation`

The models separate content, source metadata, categorization, and app placement. This separation prevents content duplication and keeps verification independent from UI needs.

## Relationship Model

`KnowledgeRelation` connects a knowledge record to an app entity without copying the content.

Supported relationship targets include:

- Knowledge categories.
- Umrah stages.
- Azkar categories.
- Miqat content.
- Daily reminders.
- Prayer-related content.

A relation contains:

- `knowledgeId`: the canonical record.
- `entityType`: the target type.
- `entityId`: the target entity.
- `priority`: broad ranking for display.
- `displayOrder`: stable ordering within the target.

This allows the same verified record to appear in multiple places while preserving one source of truth.

## Knowledge Reuse

Reusable content must be referenced by relation, topic, tag, or category. It must not be duplicated into separate JSON files for each feature.

Examples of future reuse:

- A verified travel supplication can relate to Umrah Travel and a future Travel Azkar category.
- A Quran verse can relate to multiple topics without copying the verse text.
- A source record can support one canonical knowledge record while preserving collection, number, surah, ayah, narrator, page, or notes.

## No Duplicated Records

Do not create duplicate knowledge records for the same Arabic text and source merely because the content appears in multiple app surfaces.

Create a new record only when:

- The Arabic wording differs.
- The source differs materially.
- The context of use requires a separately reviewed record.
- The authenticity or verification decision differs.

When in doubt, keep one record and add more relations.

## Approved-Only Publishing

The Knowledge Base follows the Content Constitution. Public display must use only records with:

```text
verificationStatus = "approved"
```

Draft, needs-review, and rejected records may exist internally but must not appear publicly.

## Future Scalability

The architecture supports gradual growth without migrating existing Umrah data immediately.

Future phases can add:

- Import scripts.
- Reviewer metadata.
- Search indexes.
- Topic pages.
- Cross-feature recommendations.
- Source browsing.
- Localization metadata.
- Firebase-backed persistence.

Those phases must preserve the same separation between content records, source metadata, categories, relations, and public display filtering.
