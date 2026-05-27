# E-book Publishing Plan

This plan covers how to turn the completed 24histories.com translation corpus into publishable e-books for Amazon KDP and other storefronts.

As of May 2026, the site has complete first-pass English translations for all 4,099 chapters across the Twenty-Four Histories, the Draft History of Qing, and the Zizhi Tongjian. The translations are AI-generated under Garrett M. Petersen's direction and should be published with clear AI-generated translation disclosure wherever a platform asks for it.

## Current Publishing Assumptions

- Canonical source data lives in `data/<book>/<chapter>.json`.
- Public site HTML is optimized for web reading, not for e-book distribution.
- E-book output should be generated from `data/`, not scraped from `public/*.html`.
- EPUB should be the canonical e-book artifact.
- KDP should receive reflowable EPUB, not PDF, for Kindle e-books.
- Print-on-demand should be a separate later project because print layout, page count, cover wrap, indices, and tables need different handling.

## Platform Constraints To Design Around

- KDP supports EPUB and recommends validating EPUB files with Kindle Previewer before upload: https://kdp.amazon.com/en_US/help/topic/G200634390
- KDP's Kindle Publishing Guidelines recommend reflowable content for text-heavy books and say to use EPUB, DOCX, or KPF for reflowable publishing; MOBI is no longer recommended/supported for reflowable content: https://kdp.amazon.com/en_US/help/topic/G79CTKR8BX79E96L
- KDP requires publishers to disclose AI-generated content, including AI-generated translations: https://kdp.amazon.com/en_US/help/topic/G200672390
- KDP has a title creation limit of 10 titles per book format per week unless an exception is granted.
- Draft2Digital accepts EPUB for e-books and can distribute to non-Amazon retailers: https://draft2digital.com/faq
- Apple Books accepts EPUB and requires EPUB validation: https://itunespartner.apple.com/books/support/9-prepare-book
- Kobo Writing Life accepts EPUB and enforces file-size limits: https://kobowritinglife.zendesk.com/hc/en-us/articles/360059386271-File-Types-Sizes

## Product Strategy

Do not launch the whole corpus as one product. It is too large, hard to validate, hard to price, and hard for readers to navigate.

Recommended sequence:

1. Pilot: `Records of the Grand Historian`, Volume 1.
2. Complete one medium-sized work as a full series proof: `Records of the Three Kingdoms` or `Book of Song`.
3. Publish each major work as a series.
4. Split very large works into multiple volumes by chapter ranges.
5. Publish omnibus editions only after individual volumes are stable.

Suggested volume policy:

- Small works under about 60 chapters: one e-book.
- Medium works: split by natural section or 50-80 chapters.
- Large works such as `Songshi`, `Mingshi`, `Qingshigao`, and `Zizhi Tongjian`: split into 6-12+ volumes.
- Table-heavy chapters should be grouped carefully because they need manual QA on small screens.

## Rights And Disclosure Gates

Before commercial upload, run a short rights review:

- Confirm all Chinese base texts are safe to use commercially from their source terms or underlying public-domain status.
- Record source attribution for each title: Chinese Notes, CText, and/or Wikisource.
- Confirm whether each source requires license text or attribution language in the e-book.
- Make each e-book's front/back matter clear that the English translation is AI-generated and edited/published by Garrett M. Petersen.
- On KDP, disclose AI-generated translations in the publishing workflow.
- Do not claim human scholarly translation quality beyond what has actually been reviewed.

Recommended front-matter wording:

> This English translation was generated with AI tools under the direction of Garrett M. Petersen. It is a complete first-pass translation intended for accessibility and reading, with ongoing editorial review planned.

## E-book Build Pipeline

Create a new generator rather than adapting `generate-static-pages.js` directly:

- `scripts/generate-ebook.mjs`
- Output directory: `dist/ebooks/`
- Source: `data/<book>/<chapter>.json`
- Product manifest: `ebooks/manifest.json`
- Generated files:
  - `dist/ebooks/<slug>/<slug>.epub`
  - `dist/ebooks/<slug>/content/` for debug XHTML
  - `dist/ebooks/<slug>/metadata.json`
  - `dist/ebooks/<slug>/qa-report.json`

Core command shape:

```bash
node scripts/generate-ebook.mjs --book shiji --volume 001
node scripts/generate-ebook.mjs --book shiji --all-volumes
node scripts/generate-ebook.mjs --all
```

Make targets:

```make
ebook:
	node scripts/generate-ebook.mjs --book $(BOOK) --volume $(VOLUME)

ebook-book:
	node scripts/generate-ebook.mjs --book $(BOOK) --all-volumes

ebook-validate:
	node scripts/validate-ebook.mjs dist/ebooks/$(SLUG)/$(SLUG).epub
```

## EPUB Structure

Each EPUB should include:

- Cover image.
- Title page.
- Copyright and AI-translation disclosure.
- Source text attribution.
- Translator/publisher note.
- Navigable table of contents.
- Chapter title pages.
- Chapter body.
- Optional end matter: source URLs, revision date, website URL, feedback/contact.

Use EPUB 3 with:

- `EPUB/package.opf`
- `EPUB/nav.xhtml`
- `EPUB/text/*.xhtml`
- `EPUB/styles/ebook.css`
- `EPUB/images/cover.jpg` or `.png`
- `mimetype`
- `META-INF/container.xml`

The EPUB generator should write simple, conservative XHTML. Avoid web-only JavaScript, sticky UI, citation buttons, sentence hover spans, and search metadata.

## Content Rendering Rules

For e-books, render only the English translation by default.

Recommended chapter layout:

- Book title.
- Chapter number and English title.
- Chinese title in smaller text.
- English paragraphs.
- Optional source note at the end of the chapter.

Sentence handling:

- Prefer idiomatic translation.
- Fall back to literal translation only if idiomatic is absent.
- Fail the build if any countable sentence or table cell has no translation.
- Fail the build on placeholders such as `(No translation available)`, `[translation]`, `TODO`, or empty English for countable text.

Chinese text:

- Do not interleave full Chinese text in the commercial reading edition unless we decide to publish bilingual editions.
- Keep Chinese chapter titles and names where useful.
- A separate bilingual edition can come later.

Tables:

- Wide HTML tables are risky in reflowable Kindle and EPUB readers.
- Default strategy: convert table rows into readable list-style entries unless the table is small.
- Preserve source row order.
- For genealogical tables, use nested or indented line entries when possible.
- Add a QA flag for any chapter with table rows above a configured width.
- Allow an override per chapter:
  - `tableMode: "list"`
  - `tableMode: "simple-table"`
  - `tableMode: "image"` only as a last resort, because images hurt accessibility and search.

## Metadata Model

Create `ebooks/manifest.json` with explicit product definitions.

Example:

```json
{
  "products": [
    {
      "slug": "shiji-volume-01",
      "book": "shiji",
      "volume": 1,
      "title": "Records of the Grand Historian, Volume 1",
      "subtitle": "Basic Annals",
      "chapters": ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012"],
      "series": "Records of the Grand Historian",
      "seriesNumber": 1,
      "author": "Sima Qian",
      "translator": "Garrett M. Petersen",
      "language": "en",
      "sourceAttribution": ["Chinese Notes", "CText", "Wikisource"],
      "editionStatus": "Complete first-pass AI translation"
    }
  ]
}
```

## Covers

Start with programmatic covers so we can scale:

- Reuse the existing OG image stack if possible.
- Generate one cover per product from a deterministic template.
- Export front cover as high-resolution JPG/PNG for e-book stores.
- Later, commission or manually design branded covers for best-selling volumes.

Cover requirements to track:

- Front cover for e-books.
- Separate full-wrap PDF for paperback/hardcover later.
- Clear series branding.
- Legible title at thumbnail size.
- No tiny chapter-range metadata on the cover; put details in subtitle/product description.

## Quality Gates

Every e-book build should produce a QA report and fail on hard blockers.

Hard blockers:

- Missing translations for countable text.
- Placeholder text.
- Invalid XHTML.
- Missing TOC entries.
- Missing metadata fields.
- Missing AI/source disclosure.
- EPUBCheck errors.
- Kindle Previewer conversion errors.

Warnings:

- Very large files.
- Chapters with wide tables.
- English text containing unexpected Chinese characters without `allowChineseCharacters`.
- Repeated chapter titles.
- Very long paragraphs.
- Footnotes or source links that do not resolve.

Manual QA checklist for each pilot volume:

- Open in Kindle Previewer.
- Open in Apple Books.
- Open in Thorium or Calibre.
- Check TOC navigation.
- Check first, middle, and last chapter.
- Check table-heavy chapters.
- Check cover and metadata.
- Check sample boundary if platform allows preview customization.

## Pilot Milestone

Pilot target: `Records of the Grand Historian, Volume 1`.

Scope:

- Chapters 001-012, or another coherent first section if preferred.
- English-only reflowable EPUB.
- Generated cover.
- Full QA report.
- Manual review of all front/back matter.
- Upload test to KDP as draft, not published.

Pilot success criteria:

- EPUB passes EPUBCheck.
- Kindle Previewer reports no blocking errors.
- TOC and chapter navigation work.
- No visible placeholders.
- No missing translations.
- Product description and AI disclosure text are ready.
- We know whether the table rendering strategy is acceptable.

## Rollout Plan

Phase 1: Infrastructure

- Add `ebooks/manifest.json`.
- Add `scripts/generate-ebook.mjs`.
- Add `scripts/validate-ebook.mjs`.
- Add `ebook` Makefile targets.
- Generate one pilot EPUB.

Phase 2: Pilot Publishing

- Build `shiji-volume-01`.
- Validate locally.
- Upload as KDP draft.
- Fix formatting and metadata problems.
- Decide pricing and series metadata.

Phase 3: Series Production

- Generate all Shiji volumes.
- Create batch QA checklist.
- Publish at a controlled pace, respecting KDP title limits.
- Use direct KDP for Amazon.
- Use Draft2Digital or direct uploads for non-Amazon stores.

Phase 4: Scale To Corpus

- Define volume splits for all 26 works.
- Generate all EPUBs.
- Batch-validate and prioritize by quality/readability.
- Publish work-by-work.
- Track published ASINs/ISBNs/store URLs in `ebooks/published.json`.

Phase 5: Print And Premium Editions

- Create print-specific layout pipeline.
- Decide trim size, typography, indices, and table handling.
- Generate print PDFs.
- Publish selected volumes as paperback/hardcover.

## Open Decisions

- Use one imprint name or personal author/publisher account?
- Buy ISBNs or use platform-provided identifiers?
- Price per volume or by series bundle strategy?
- Enroll Amazon e-books in KDP Select/Kindle Unlimited or keep wide distribution?
- Publish AI disclosure only in platform metadata, or also visibly in front matter? Recommendation: both.
- English-only first, or bilingual editions later?
- How much editorial review is required before a volume is labeled "polished" rather than "first-pass"?

## Immediate Next Tasks

1. Create `ebooks/manifest.json` with a pilot Shiji volume.
2. Build a minimal EPUB generator for English-only chapters.
3. Add placeholder/missing-translation validation to the generator.
4. Generate and validate the first EPUB.
5. Review the first EPUB manually in Kindle Previewer.
6. Iterate on table rendering.
7. Prepare KDP draft metadata and disclosure text.
