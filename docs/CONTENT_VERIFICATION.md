# Content Verification

Nasayem Alkhair content must be verified before it is published in production. Structural records may exist with empty content fields while verification is pending, but no dua, hadith text, Quran reference, translation, transliteration, or source claim should be treated as approved until it passes review.

## Arabic-First Publishing Rules

Arabic text is the primary content for duas, Quran-linked records, and hadith-linked records.

Translation and transliteration are optional future metadata. They may support display later, but they are not the source of truth for publishing approval.

No religious content is published without source verification. Empty structural slots may exist while verification is pending, but they must remain unpublished until their Arabic text and source metadata are verified.

## Production Rule

No dua enters production without source verification.

## Public Display Rule

Public content queries must return approved content only.

Only records with `verificationStatus` set to `approved` may be displayed publicly. Draft, needs-review, and rejected records may remain in internal content files for development and review, but they must be filtered before reaching public app surfaces.

Each approved dua record must include:

- Arabic text checked against a verified source.
- Arabic context explaining when the dua is used.
- Source reference.
- Authenticity status.
- Verification status.

## Quran References

Quran references require:

- Surah name.
- Verse number.
- Translation source when a translation is displayed.

Do not publish Quran-linked content with incomplete surah or verse metadata.

Quran verification requires:

- `sourceType` set to `Quran`.
- `sourceCollection` set to the surah name.
- `sourceNumber` set to the verse number or verse range.
- `sourceReference` containing the human-readable surah and verse reference.
- `authenticity` set to `Quran`.
- `verificationStatus` set to `approved` before publishing.

## Hadith References

Hadith references require:

- Collection name.
- Hadith number or stable reference when available.
- Grading or authenticity status.
- Grading source when the grading is displayed.

Do not invent hadith references, collection names, numbers, or grading.

Hadith verification requires:

- `sourceType` set to `Hadith`.
- `sourceCollection` set to the hadith collection name.
- `sourceNumber` set to the hadith number or stable reference when available.
- `sourceReference` containing the human-readable collection and reference.
- `authenticity` set to the verified grading or review status.
- `verificationStatus` set to `approved` before publishing.

## Content Lifecycle

Religious content moves through the following lifecycle:

```text
Draft -> Review -> Approved -> Published
```

Lifecycle meanings:

- `draft`: Structural record exists, but content is not ready for review.
- `needs-review`: Candidate content exists and requires scholarly/source verification.
- `approved`: Arabic content, source, context, and verification metadata have passed review.
- `rejected`: Content failed review and must not be published.

Publishing is separate from approval. A record may be approved before it is included in the production content pipeline.

## Approval Workflow

Content approval happens before publishing:

1. Add structural records with empty verification-dependent fields.
2. Import candidate content from the Firebase Studio concept or a verified Islamic content database.
3. Review Arabic text, Arabic context, source, and authenticity.
4. Set `verificationStatus` to `approved` only after verification is complete.
5. Publish approved records through the future Firebase content pipeline.

## Stage Content Approval

Umrah stage records are reviewed separately from duas and sources.

Stage information may include:

- Stage title.
- Stage phase.
- Short summary.
- Instruction structure.
- Progress key.
- Verification status.

Stage information must not include Quran text, hadith text, dua text, or source claims unless those fields are reviewed through the correct content workflow.

## Reviewing a New Umrah Stage

A new Umrah stage follows this process:

1. Create the structural stage record.
2. Set `verificationStatus` to `draft`.
3. Add only neutral metadata needed for navigation and organization.
4. Review the phase, summary, instruction structure, and progress key.
5. Move the stage to `needs-review` when candidate instructional content is added.
6. Move the stage to `approved` only after stage information is reviewed.
7. Keep publication separate from approval.

## Miqat Verification Rules

Miqat records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Name verification requires:

- Arabic name checked against a verified source.
- English name or transliteration reviewed for stable spelling.

Location verification requires:

- Region and location details checked against a verified source.
- No location description published from memory or unsupported assumptions.

Juristic information verification requires:

- Any rule, obligation, exception, or legal detail checked against a verified scholarly/source reference.
- `sourceReference` filled before approval.
- `verificationStatus` set to `approved` only after the name, location, and juristic information have passed review.

Draft Miqat records may exist with empty `descriptionAr`, `rulesAr`, `region`, and `sourceReference` fields while verification is pending.

## Miqat Approval Example

Miqat content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Public Miqat display must come only from records with `verificationStatus` set to `approved`. Draft and needs-review Miqat records remain hidden until their Arabic name, region, description, rules, source reference, and verification metadata pass review.

## Ihram Verification Rules

Ihram records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Intention information requires:

- Clear separation between neutral app structure and religious guidance.
- Source verification before any intention wording, instructional detail, or ruling is published.

Ihram restrictions information requires:

- Juristic source verification before publishing any restriction, obligation, exception, or practical ruling.
- Empty placeholder fields while verified source text is unavailable.

Talbiyah relationship verification requires:

- Talbiyah content to remain in its related stage or verified dua record until reviewed.
- Any relationship between Ihram and Talbiyah to be verified before publication.
- `verificationStatus` set to `approved` only after the content and sources pass review.

## Ihram Approval Example

Ihram content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Ihram stage metadata may be approved independently from Ihram dua or ruling records. Public Ihram content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review Ihram records remain hidden until their Arabic content, context, source reference, and verification metadata pass review.

## Talbiyah Verification Rules

Talbiyah records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Text verification requires:

- Arabic Talbiyah text checked against a verified source before publication.
- No partial, remembered, or paraphrased Talbiyah wording displayed publicly.

Source verification requires:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval.
- Authenticity reviewed before `verificationStatus` can move to `approved`.

Display approval requirements:

- Public display is allowed only after text, source, context, and authenticity are verified.
- Draft Talbiyah placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Talbiyah Approval Flow

Talbiyah content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Talbiyah stage metadata may be approved independently from Talbiyah text and source records. Public Talbiyah content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review Talbiyah records remain hidden until the Arabic text, context, source reference, authenticity, and verification metadata pass review.

## Entering Makkah Verification Rules

Entering Makkah records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Entry-related supplication verification requires:

- Any supplication connected to entering Makkah checked against a verified source before publication.
- No remembered, paraphrased, or unsourced entry-related wording displayed publicly.

Source verification requires:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.

Display approval requirements:

- Public display is allowed only after Arabic text, context, source metadata, and authenticity are verified.
- Draft Entering Makkah placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Entering Makkah Approval Flow

Entering Makkah content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Entering Makkah stage metadata may be approved independently from entry-related supplication records. Public Entering Makkah content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Masjid Al-Haram Entry Verification Rules

Masjid Al-Haram entry records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Entry-related supplication verification requires:

- Any supplication connected to entering Al-Masjid Al-Haram checked against a verified source before publication.
- No remembered, paraphrased, or unsourced entry-related wording displayed publicly.

Source verification requires:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.

Display approval requirements:

- Public display is allowed only after Arabic text, context, source metadata, and authenticity are verified.
- Draft Masjid Al-Haram entry placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Masjid Al-Haram Entry Approval Flow

Masjid Al-Haram entry content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Masjid Al-Haram entry stage metadata may be approved independently from entry-related supplication records. Public Masjid Al-Haram entry content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Seeing Kaaba Verification Rules

Seeing Kaaba records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Supplication verification requires:

- Any supplication connected to seeing the Kaaba checked against a verified source before publication.
- No remembered, paraphrased, or unsourced wording displayed publicly.

Source verification requires:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.

Display approval requirements:

- Public display is allowed only after Arabic text, context, source metadata, and authenticity are verified.
- Draft Seeing Kaaba placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Seeing Kaaba Approval Flow

Seeing Kaaba content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Seeing Kaaba stage metadata may be approved independently from supplication records. Public Seeing Kaaba content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Tawaf Verification Rules

Tawaf records follow the same draft, review, approval, and publishing lifecycle as other religious content.

General authentic supplications require:

- Arabic supplication text checked against a verified source before publication.
- Clear context explaining whether the content is general remembrance, supplication, or stage guidance.

Round-specific attribution requires:

- No specific dua may be attributed to a particular Tawaf round without verified evidence.
- Do not create fixed duas for each round unless the source review explicitly approves that structure.

Source verification before publishing requires:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.
- Draft Tawaf placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Tawaf Approval Flow

Tawaf content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Tawaf stage metadata may be approved independently from Tawaf supplication records. Public Tawaf supplication content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review Tawaf records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

Unsupported round-specific attribution is not allowed. No dua may be assigned to a specific Tawaf round unless source review explicitly verifies that attribution and approves the structure.

## Zamzam Verification Rules

Zamzam records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Narration verification requires:

- Any narration about Zamzam checked against a verified source before publication.
- No remembered, paraphrased, or unsourced narration wording displayed publicly.

Supplication attribution verification requires:

- Any supplication connected to drinking Zamzam checked against a verified source before publication.
- No supplication may be attributed to Zamzam without source review and authenticity metadata.

Source requirements:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.
- Draft Zamzam placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Zamzam Approval Flow

Zamzam content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Zamzam stage metadata may be approved independently from narration or supplication records. Public Zamzam content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Sa'i Verification Rules

Sa'i records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Steps verification requires:

- Any step-by-step guidance for Sa'i checked against verified source material before publication.
- No procedural detail, count, location instruction, condition, or ruling published from memory or unsupported assumptions.

Supplication attribution verification requires:

- Any supplication connected to Sa'i checked against a verified source before publication.
- No supplication may be attributed to Sa'i, a specific lap, or a specific location within Sa'i without source review and authenticity metadata.

Source requirements:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.
- Draft Sa'i placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Sa'i Approval Flow

Sa'i content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Sa'i stage metadata may be approved independently from Sa'i supplication records. Public Sa'i content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Shaving/Trimming Verification Rules

Shaving or Trimming Hair records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Rule verification requires:

- Any guidance about shaving, trimming, completion, exceptions, or practical rulings checked against verified source material before publication.
- No procedural detail, obligation, preference, condition, or ruling published from memory or unsupported assumptions.

Supplication attribution verification requires:

- Any supplication connected to shaving or trimming checked against a verified source before publication.
- No supplication may be attributed to this stage without source review and authenticity metadata.

Source requirements:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.
- Draft Shaving or Trimming Hair placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Shaving/Trimming Approval Flow

Shaving or Trimming Hair content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Shaving or Trimming Hair stage metadata may be approved independently from shaving or trimming ruling and supplication records. Public Shaving or Trimming Hair content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Completion of Umrah Verification Rules

Completion of Umrah records follow the same draft, review, approval, and publishing lifecycle as other religious content.

Completion content verification requires:

- Any guidance about completing the Umrah journey, post-completion review, next steps, or practical rulings checked against verified source material before publication.
- No procedural detail, obligation, recommendation, condition, or ruling published from memory or unsupported assumptions.

Supplication attribution verification requires:

- Any supplication connected to Completion of Umrah checked against a verified source before publication.
- No supplication may be attributed to completion of Umrah without source review and authenticity metadata.

Source requirements:

- `sourceReference`, `sourceCollection`, and `sourceNumber` filled from verified source metadata before approval when a source claim is made.
- Authenticity reviewed before `verificationStatus` can move to `approved`.
- Draft Completion of Umrah placeholders must keep `arabicText`, `contextAr`, and source fields empty until review content is available.

## Completion of Umrah Approval Flow

Completion of Umrah content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Completion of Umrah stage metadata may be approved independently from completion-related guidance and supplication records. Public Completion of Umrah content must still come only from records with `verificationStatus` set to `approved`; draft and needs-review records remain hidden until Arabic content, context, source reference, authenticity, and verification metadata pass review.

## Stage, Dua, and Source Separation

Content types must stay separate:

- Stage information describes the journey step and app structure.
- Dua content stores Arabic text, Arabic context, authenticity, and source metadata.
- Sources document where verified content comes from and must not be invented.

A stage can exist as `draft` while its duas and sources are still empty. A dua can remain hidden until its own `verificationStatus` is `approved`. Source metadata should be attached to the content item it verifies instead of being implied by a stage title.

## Travel Dua Lifecycle Example

A Travel dua record moves through the same verification lifecycle as all religious content:

```text
draft -> review -> approved -> published
```

## Travel Module Approval Example

Travel module content moves through the complete public-content workflow:

```text
Draft -> Review -> Approved -> Published
```

Travel stage metadata may be approved independently from Travel dua records. Public Travel dua display must still come only from records with `verificationStatus` set to `approved`; draft and needs-review Travel records remain hidden.

Example flow:

1. Create the Travel dua record with empty `arabicText`, `contextAr`, `sourceReference`, `sourceCollection`, and `sourceNumber`.
2. Set `verificationStatus` to `draft` while the slot is structural only.
3. Move to `needs-review` when candidate text and source metadata are added.
4. Review the Arabic text, Arabic context, source reference, source collection, source number, and authenticity.
5. Set `verificationStatus` to `approved` only when verification is complete.
6. Publish the approved record through the content pipeline.

If verified text or source metadata is not available, fields remain empty and the record must not be approved.

## Rejection Process

Rejected content must remain out of production.

When a record is rejected:

- Set `verificationStatus` to `rejected`.
- Keep the record unpublished.
- Preserve enough internal review context to explain why it failed.
- Do not reuse the rejected source metadata without a new review.
- Replace or revise the record only through a new draft and review cycle.

## Current Foundation Status

The current JSON records are content slots only. Empty fields mean verification is still pending, not that content is missing accidentally.
