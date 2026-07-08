# Content Verification

Nasayem Alkhair content must be verified before it is published in production. Structural records may exist with empty content fields while verification is pending, but no dua, hadith text, Quran reference, translation, transliteration, or source claim should be treated as approved until it passes review.

## Production Rule

No dua enters production without source verification.

Each approved dua record must include:

- Arabic text checked against a verified source.
- Translation reviewed for meaning and clarity.
- Transliteration reviewed for readability and accuracy.
- Context explaining when the dua is used.
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
- `approved`: Content, source, translation, transliteration, and metadata have passed review.
- `rejected`: Content failed review and must not be published.

Publishing is separate from approval. A record may be approved before it is included in the production content pipeline.

## Approval Workflow

Content approval happens before publishing:

1. Add structural records with empty verification-dependent fields.
2. Import candidate content from the Firebase Studio concept or a verified Islamic content database.
3. Review Arabic text, translation, transliteration, context, source, and authenticity.
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

## Stage, Dua, and Source Separation

Content types must stay separate:

- Stage information describes the journey step and app structure.
- Dua content stores Arabic text, translation, transliteration, context, authenticity, and source metadata.
- Sources document where verified content comes from and must not be invented.

A stage can exist as `draft` while its duas and sources are still empty. A dua can remain hidden until its own `verificationStatus` is `approved`. Source metadata should be attached to the content item it verifies instead of being implied by a stage title.

## Travel Dua Lifecycle Example

A Travel dua record moves through the same verification lifecycle as all religious content:

```text
draft -> review -> approved -> published
```

Example flow:

1. Create the Travel dua record with empty `arabicText`, `translation`, `transliteration`, `sourceCollection`, and `sourceNumber`.
2. Set `verificationStatus` to `draft` while the slot is structural only.
3. Move to `needs-review` when candidate text and source metadata are added.
4. Review the Arabic text, translation, transliteration, context, source collection, source number, and authenticity.
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
