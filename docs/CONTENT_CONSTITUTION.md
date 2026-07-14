# Nasayem Alkhair Content Constitution

This document is the controlling policy for all religious content in Nasayem Alkhair. It applies before content expansion, source import, editorial review, and public publishing.

## Core Principle

Nasayem Alkhair accepts religious content only when it is grounded in the Quran or authentic Sunnah.

- No popular, circulated, remembered, or commonly shared supplication is included without evidence.
- No content is published because it is familiar, emotionally appealing, or widely repeated.
- When there is no verified specific supplication for a stage or action, that absence must be stated clearly when relevant.
- General permissible dua may be allowed as general dua, but it must not be presented as a specific Sunnah supplication.

## Quran Content Rules

Every Quran-linked public record requires:

- Exact Arabic Quran text.
- Surah name.
- Verse number or verse range.
- Context of use.
- `sourceType` set to `Quran`.
- `sourceReference` with a human-readable surah and verse reference.
- `sourceCollection` set to the surah name.
- `sourceNumber` set to the verse number or verse range.
- `authenticity` set to `Quran`.
- `verificationStatus` set to `approved` before publication.

No paraphrase, explanation, translation, or remembered wording may be presented as Quran. If a translation or explanation is displayed in the future, it must be clearly separated from the Arabic Quran text and must have its own reviewed source.

## Hadith Content Rules

Every Hadith-linked public record requires:

- Exact Arabic wording, or carefully verified Arabic wording when narration wording differs by source.
- Hadith collection.
- Hadith number or stable reference when available.
- Authenticity grading.
- Narrator when useful for context or source clarity.
- `sourceType` set to `Hadith`.
- `sourceReference` with a human-readable collection and reference.
- `sourceCollection` set to the hadith collection name.
- `sourceNumber` set to the hadith number or stable reference when available.
- `verificationStatus` set to `approved` before publication.

Differences between narrations must not be merged carelessly. If two narrations differ, each wording must be reviewed against its own source, or the public record must use only the verified wording tied to the cited source.

## Content Record Requirements

Every public religious record must include:

- `titleAr`
- `arabicText`
- `contextAr`
- `sourceType`
- `sourceReference`
- `sourceCollection`
- `sourceNumber`
- `authenticity`
- `verificationStatus`
- `order`

Optional fields may exist for future display, but they do not replace the required Arabic text, context, source, authenticity, and verification metadata.

## Publishing Rule

Only records with:

```text
verificationStatus = "approved"
```

may appear publicly.

Records with `draft`, `needs-review`, or `rejected` status must remain hidden from public app surfaces.

## Content Lifecycle

Religious content follows this lifecycle:

```text
draft -> needs-review -> approved -> published
```

Lifecycle meanings:

- `draft`: A structural slot or early record exists, but it is not ready for religious review.
- `needs-review`: Candidate text or metadata exists and requires source and religious review.
- `approved`: Arabic text, context, source metadata, authenticity, and approval metadata have passed review.
- `published`: Approved content is available through the public content pipeline.

Rejected content:

- Remains internal or is removed.
- Must not be displayed publicly.
- Must include a rejection reason in documentation or internal review notes.
- Must not reuse rejected source metadata without a new review.

## Writing Style

Nasayem Alkhair uses an Arabic-first editorial style.

- Write clearly and concisely.
- Avoid excessive preaching.
- Do not make unsupported promises of reward.
- Do not issue personal legal verdicts.
- Avoid long warnings.
- Use respectful, calm language.
- Keep guidance practical without overstating certainty.

## Umrah Guidance Rules

Umrah content must clearly separate these categories:

- Verified supplication.
- General permissible dua.
- Practical instruction.
- Juristic information.
- Common mistake.

Do not present practical guidance as hadith. Do not present a general permissible dua as a specific Sunnah dua. Do not attach a specific time, place, count, or ritual attribution to a supplication unless the source review verifies that attribution.

## Authenticity Display

Approved public authenticity labels should be clear and source-aware.

Allowed public labels include:

- `قرآن`
- `صحيح`
- `حسن`
- `ثابت`

Avoid vague or evidence-free labels such as:

- `مشهور`
- `متداول`
- `مجرب`

If a label cannot be supported by verified source review, the content must remain unpublished.

## Review Responsibility

Content may be prepared technically by developers, editors, or import tools. Religious approval must remain separate from technical implementation.

- Technical preparation does not equal religious approval.
- Reviewer identity does not need to appear publicly.
- Internal approval status must remain traceable.
- Approval changes must be intentional and reviewable.
- Developers must not approve religious content merely to satisfy UI, testing, or product needs.

## No-Content Rule

When no approved content exists for a stage or category, the public app must display:

```text
سيتم إضافة المحتوى الموثق لهذه المرحلة قريبًا
```

Empty sections must not be filled with invented text, remembered supplications, generic source claims, or unsupported religious guidance.

## Future Content Categories

This constitution applies to all current and future religious content categories, including:

- Umrah.
- Azkar.
- Miqat.
- Daily reminders.
- Prayer-related content.

No future category may bypass the approved-only publishing rule, the source verification requirement, or the separation between technical implementation and religious approval.
