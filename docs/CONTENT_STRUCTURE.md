# Nasayem Alkhair Content Structure

This document describes the local content storage foundation for future migration from the Firebase Studio concept and verified Islamic content sources. These files are intentionally empty and contain no placeholder religious content.

## Directory Layout

```text
data/
  umrah/
    stages.json
    duas.json
  azkar/
    categories.json
    items.json
  miqat/
    miqat.json
```

## Umrah Content

`data/umrah/stages.json`

- Collection shape: `UmrahStage[]`
- Purpose: Stores the ordered Umrah journey stages.
- Future records should include the stage identity, Arabic and English titles, phase, summary, instructions, source references, related duas, and progress key.
- This file is the main structure for the Umrah companion journey.

`data/umrah/duas.json`

- Collection shape: `Dua[]`
- Purpose: Stores duas that can be attached to Umrah stages.
- Each dua links back to a stage through `stageId`.
- Future records should include Arabic text, translation, transliteration, context, source, authenticity status, stage reference, and display order.

Relationship:

- `UmrahStage.id` is the parent identifier for stage content.
- `Dua.stageId` references the related `UmrahStage.id`.
- `UmrahStage.duas` can later be hydrated from `duas.json` or from a Firebase subcollection/query result.

## Azkar Content

`data/azkar/categories.json`

- Collection shape: `AzkarCategory[]`
- Purpose: Stores the enabled azkar category keys.
- Supported category values are `morning`, `evening`, `sleep`, `wakeup`, and `travel`.
- This file is empty until the verified category migration is performed.

`data/azkar/items.json`

- Collection shape: `AzkarItem[]`
- Purpose: Stores individual azkar entries.
- Each item references a category through `category`.
- Future records should include Arabic text, translation, count, source, and display order.

Relationship:

- `AzkarItem.category` references one value from `AzkarCategory`.
- Category-level pages can filter `items.json` by category.
- Progress tracking can later store completed item identifiers per category.

## Miqat Content

`data/miqat/miqat.json`

- Collection shape: `Miqat[]`
- Purpose: Stores Miqat information for the Umrah journey.
- Future records should include Arabic and English names, region, description, and rules.
- Miqat content should connect conceptually to the Umrah `miqat` and `ihram` phases.

## Future Firebase Mapping

The local JSON files are prepared to map cleanly to Firebase collections later:

```text
data/umrah/stages.json      -> umrahStages
data/umrah/duas.json        -> duas
data/azkar/categories.json  -> azkarCategories
data/azkar/items.json       -> azkarItems
data/miqat/miqat.json       -> miqat
```

Recommended Firebase relationships:

- `duas.stageId` should reference an `umrahStages` document id.
- `azkarItems.category` should reference an allowed `azkarCategories` key.
- User progress should stay separate from content collections and reference content ids.
- Source and authenticity fields should remain content metadata, not user state.

## Migration Notes

- Do not add unverified religious content.
- Preserve Arabic text as UTF-8.
- Keep source and authenticity metadata with migrated duas and azkar.
- Prefer stable ids and slugs so progress data remains valid across content updates.
