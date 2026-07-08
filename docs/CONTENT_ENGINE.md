# Content Engine

The content engine is the single access layer for local Nasayem Alkhair content.

Pages must not read JSON files directly. UI routes should request content through services so the app can change storage providers later without rewriting page logic.

## Service Responsibilities

`src/services/content/umrah.service.ts`

- Reads `data/umrah/stages.json`.
- Reads `data/umrah/duas.json`.
- Returns validated `UmrahStage` and `Dua` records.
- Sorts ordered content before returning it.
- Handles empty or malformed collections gracefully.

`src/services/content/azkar.service.ts`

- Reads `data/azkar/categories.json`.
- Reads `data/azkar/items.json`.
- Returns validated `AzkarCategory` and `AzkarItem` records.
- Filters azkar items by category.
- Handles empty data without throwing.

`src/services/content/miqat.service.ts`

- Reads `data/miqat/miqat.json`.
- Returns validated `Miqat` records.
- Handles empty data without throwing.

`src/services/content/index.ts`

- Re-exports the content service functions.
- Keeps imports consistent for future consumers.

## Why Pages Should Not Access Data Directly

Direct JSON reads from pages would couple route code to the current storage format. That makes future migration harder and spreads parsing, sorting, and validation rules across the app.

The service layer centralizes:

- Runtime validation.
- Empty-state behavior.
- Sorting and filtering.
- Type-safe return values.
- Future storage replacement.

## Future Firebase Migration Path

The current services read local JSON files. When content moves to Firebase, these service functions should keep the same public API:

```text
getUmrahStages()
getUmrahStageById(id)
getDuasByStageId(stageId)
getAzkarCategories()
getAzkarItems(category)
getMiqatList()
```

Future Firebase-backed services can replace the local JSON imports with collection queries while preserving callers. Pages and UI components should not need to know whether content came from JSON, Firestore, or a verified content pipeline.

Recommended mapping:

- `data/umrah/stages.json` -> `umrahStages`
- `data/umrah/duas.json` -> `duas`
- `data/azkar/categories.json` -> `azkarCategories`
- `data/azkar/items.json` -> `azkarItems`
- `data/miqat/miqat.json` -> `miqat`

Religious content verification remains separate from the access layer. Services expose approved or draft records according to future product rules, but they do not perform scholarly verification themselves.
