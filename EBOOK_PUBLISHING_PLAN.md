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

1. Pilot: `Records of the Grand Historian` as a complete single-work e-book.
2. Complete one medium-sized work as a full series proof: `Records of the Three Kingdoms` or `Book of Song`.
3. Publish each major work as one complete e-book.
4. Reserve print editions or premium formats for later, after the e-book workflow is stable.

Suggested product policy:

- Each source work gets one e-book product.
- Very large works such as `Songshi`, `Mingshi`, `Qingshigao`, and `Zizhi Tongjian` should still be packaged as single e-books unless a platform limit forces a change.
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

> This English translation was generated with AI tools under the direction and editorial supervision of Garrett M. Petersen. It is a complete AI-assisted English translation intended for accessibility and reading.

## E-book Build Pipeline

Create a new generator rather than adapting `generate-static-pages.js` directly:

- `scripts/generate-ebook.mjs`
- Output directory: `dist/ebooks/`
- Source: `data/<book>/<chapter>.json`
- Product manifest: `ebooks/manifest.json`
- Generated files:
  - `dist/ebooks/<slug>/<slug>.epub`
  - `dist/ebooks/<slug>/cover.png`
  - `dist/ebooks/<slug>/kdp-metadata.md`
  - `dist/ebooks/<slug>/upload-checklist.md`
  - `dist/ebooks/<slug>/content/` for debug XHTML
  - `dist/ebooks/<slug>/metadata.json`
  - `dist/ebooks/<slug>/qa-report.json`
  - `dist/ebooks/<slug>/publication-manifest.json` with file sizes and SHA-256 checksums for upload and support artifacts

Core command shape:

```bash
node scripts/generate-ebook.mjs --book shiji
node scripts/generate-ebook.mjs --book shiji --all-products
node scripts/generate-ebook.mjs --all
```

Make targets:

```make
ebook:
	node scripts/generate-ebook.mjs --book $(BOOK)

ebook-book:
	node scripts/generate-ebook.mjs --book $(BOOK) --all-products

ebook-validate:
	node scripts/validate-ebook.mjs dist/ebooks/$(SLUG)/$(SLUG).epub

ebook-qa:
	node scripts/ebook-qa.mjs --slug $(SLUG)

ebook-manual-qa:
	node scripts/validate-ebook-manual-qa.mjs --slug $(SLUG)

ebook-readiness:
	node scripts/validate-ebook-manual-qa.mjs --slug $(SLUG) --json
```

`ebook-validate` performs local structural checks, verifies sidecar manifests, scans packaged XHTML for known visible artifacts, checks XML/XHTML well-formedness with `xmllint`, and fails if the generated QA report has errors or warnings. If `EPUBCHECK_JAR=/path/to/epubcheck.jar` is set, it also runs official EPUBCheck before the local checks.

`ebook-qa` runs the reusable pre-publication automated gate: EPUB validation, packaged EPUB/upload-bundle publication-blocker scanning, optional Calibre EPUB-to-AZW3 smoke conversion, quote-span alignment, and cheap translation quality scanners.

Run the same gates for later products by changing only the slug/book values, or use `make ebook-qa ALL=1` once multiple e-book products are listed in `ebooks/manifest.json`. Product QA reads each product's `book` and `chapters` fields, so the source QA checks exactly the chapters that are packaged into that e-book. The EPUB validator imports the shared translation-artifact scanner, so source JSON and packaged XHTML use the same formulaic-English rules instead of drifting apart. The publication-blocker scanner checks the final EPUB and KDP upload support files for visible placeholders, raw table-span text, and known KDP spellcheck tripwires such as `edicted`, `strategems`, `Maquis`, `paoge`, unaccented `lese-majeste`, and lowercase `wuchen day`. The cheap source QA bundle also uses reusable compound-name, translation-completeness, translation-metadata, and literal-identical prose scanners, so future books get the same checks for split romanized surnames, missing idiomatic English, literal-only fallback text, stale or agent-labeled translator metadata, and chapters that need review because too much prose still matches the literal draft.

For review prioritization, run `npm run quality:scan -- --book <book> --summary --fail` after each review pass, or `npm run quality:scan -- --product <slug> --summary --fail` before packaging a specific e-book product. The hard-gate scanners decide the exit code; the literal-identical scanner is included as advisory output and reports long prose passages where the idiomatic translation is identical to the literal translation. It should not be a hard publication gate, because some terse annalistic prose genuinely needs little rewriting, but the highest-count chapters are good candidates for human review before packaging each book. For a focused report, run `npm run quality:literal-identical -- --book <book> --summary`.

The translation-alignment scanner uses Chinese Notes glossary anchors to catch likely sentence drift and low same-sentence glossary coverage. Run `npm run quality:translation-alignment -- --book <book> --summary --glossary-scope all --review-priorities --min-severity 3 --min-glossary-risk 10` for the publication top queue: proper nouns carry the most weight, while common multi-character glossary terms only count as fuzzy evidence when enough terms make the check meaningful. If that is too noisy for a book, rerun with `--glossary-scope proper`; for a smoke check using only curated high-confidence terms, use `--glossary-scope manual`. Severity 3+ findings above the risk cutoff should be treated as review candidates, especially when a cluster of glossary anchors appears in adjacent English or a sentence has very low glossary coverage. Use `--include-sentence-scores --json` to export per-sentence glossary scores for review prioritization beyond the top queue.

For publication readiness, add `REQUIRE_LANGUAGETOOL_CURRENT=1` to fail if cached LanguageTool scores are stale or missing for the product's source chapters. This does not contact the LanguageTool server; it verifies cache fingerprints. Refresh stale scores with `make score-languagetool BOOK=<book>` once the local LanguageTool server is running.

`ebook-manual-qa` creates and validates an artifact-bound human signoff file under `ebooks/manual-qa/`. It records Kindle Previewer, reader rendering, cover behavior, TOC navigation, frontmatter, table-heavy chapter review, and KDP draft ingestion. Use `make ebook-local-signoff SLUG=<slug> CHECKED_BY="Garrett M. Petersen" KINDLE_PREVIEWER_VERSION="<version>"` after local Kindle Previewer and reader checks pass; this records the local evidence while intentionally leaving KDP draft ingestion pending. After the unpublished KDP draft has been created and checked, use `make ebook-kdp-signoff SLUG=<slug> CHECKED_BY="Garrett M. Petersen" CONFIRM_KDP_DRAFT=1` to record the final account-side evidence. Normal site/e-book builds should not require this gate, but a book should not be treated as publishable until `make ebook-qa SLUG=<slug> REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1` passes against the current EPUB and cover hashes.

`ebook-readiness` emits the same manual signoff state as machine-readable JSON. It is intentionally strict: it exits nonzero until the manual signoff is complete, but the JSON can still show that all automated readiness checks are green and list the exact remaining human blockers.

For future books, follow the reusable [Book Publication QA Runbook](./BOOK_PUBLICATION_QA.md). For the Shiji pilot, `ebooks/shiji-publication-runbook.md` records the final Kindle Previewer, EPUB reader, KDP draft, and `ebooks/manual-qa/shiji.json` signoff workflow.

The generated QA report also performs a KDP metadata preflight before packaging: required product fields, title/subtitle length, product-description length, category count, seven keyword slots, duplicate keywords, keyword overlap with existing metadata, promotional/platform terms, URLs, and HTML-like characters in fields where KDP does not want them.

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
      "slug": "shiji",
      "book": "shiji",
      "title": "Records of the Grand Historian",
      "subtitle": "The First History of the Twenty-Four Histories",
      "chapters": ["001", "002", "003"],
      "series": "The Twenty-Four Histories",
      "seriesNumber": 1,
      "author": "Sima Qian",
      "translator": "Garrett M. Petersen",
      "language": "en",
      "sourceAttribution": ["Chinese Notes", "CText", "Wikisource"],
      "editionStatus": "Complete AI-assisted English translation"
    }
  ]
}
```

## Covers

Start with programmatic covers so we can scale:

- Reuse the existing OG image stack if possible.
- Generate one cover per product from a deterministic template.
- Export front cover as high-resolution JPG/PNG for e-book stores.
- Later, commission or manually design branded covers for best-selling books.

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
- Table-heavy chapters that need manual Kindle/small-screen review; for Shiji this currently means chapters 013-022.
- English text containing unexpected Chinese characters without `allowChineseCharacters`.
- Repeated chapter titles.
- Very long paragraphs.
- Footnotes or source links that do not resolve.

Manual QA checklist for each pilot book:

- Open in Kindle Previewer.
- Open in Apple Books.
- Open in Thorium or Calibre.
- Check TOC navigation.
- Check first, middle, and last chapter.
- Check table-heavy chapters.
- Check cover and metadata.
- Check sample boundary if platform allows preview customization.

## Pilot Milestone

Pilot target: `Records of the Grand Historian`.

Scope:

- Chapters 001-130.
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

- Build `shiji`.
- Validate locally.
- Upload as KDP draft.
- Fix formatting and metadata problems.
- Decide pricing and series metadata.

Phase 3: Series Production

- Use the completed Shiji workflow as the model for the next work.
- Create batch QA checklist.
- Publish at a controlled pace, respecting KDP title limits.
- Use direct KDP for Amazon.
- Use Draft2Digital or direct uploads for non-Amazon stores.

Phase 4: Scale To Corpus

- Define one e-book product for each source work.
- Generate all EPUBs.
- Batch-validate and prioritize by quality/readability.
- Publish work-by-work.
- Track published ASINs/ISBNs/store URLs in `ebooks/published.json`.

Phase 5: Print And Premium Editions

- Create print-specific layout pipeline.
- Decide trim size, typography, indices, and table handling.
- Generate print PDFs.
- Publish selected books as paperback/hardcover.

## Open Decisions

- Use one imprint name or personal author/publisher account?
- Buy ISBNs or use platform-provided identifiers?
- Price per book or by series bundle strategy?
- Enroll Amazon e-books in KDP Select/Kindle Unlimited or keep wide distribution?
- Publish AI disclosure only in platform metadata, or also visibly in front matter? Recommendation: both.
- English-only first, or bilingual editions later?
- How much editorial review is required before a book is labeled "polished" rather than "first-pass"?

## Immediate Next Tasks

1. Keep `ebooks/manifest.json` aligned with the complete Shiji product.
2. Keep the EPUB generator failing on missing translations, placeholders, invalid metadata, empty chapter titles, transparent covers, unresolved table labels, and suspicious table-title punctuation.
3. Generate and validate the complete Shiji EPUB after each source or generator change.
4. Install or provide EPUBCheck locally and run `EPUBCHECK_JAR=/path/to/epubcheck.jar make ebook-validate SLUG=shiji`.
5. Create the Shiji manual signoff template with `make ebook-manual-qa SLUG=shiji INIT=1`.
6. Use [BOOK_PUBLICATION_QA.md](./BOOK_PUBLICATION_QA.md) for the final Kindle Previewer, reader, navigation, table-heavy chapter, and KDP draft review. For the Shiji pilot, `ebooks/shiji-publication-runbook.md` records the completed handoff.
7. Check current structured readiness with `make ebook-readiness SLUG=shiji`; all `automatedReadiness` fields should be `true` before manual signoff.
8. Fill `ebooks/manual-qa/shiji.json` only after the manual reader and KDP draft checks pass.
9. Run `make ebook-qa SLUG=shiji REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1` before treating the book as publishable.
