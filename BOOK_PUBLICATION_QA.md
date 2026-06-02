# Book Publication QA Runbook

This is the reusable checklist for taking one completed source book from the website corpus to a publishable e-book product. It is meant for the 24 histories, `Qingshigao`, and `Zizhi Tongjian`; change only the `BOOK` and `SLUG` values.

Use this alongside the book-specific generated files in `dist/ebooks/<slug>/`. The Shiji pilot also has a historical handoff file at `ebooks/shiji-publication-runbook.md`, but this document is the general process for future books.

## Inputs

Before starting, confirm:

- `ebooks/manifest.json` has a product entry for the e-book.
- The product has `slug`, `book`, `title`, `author`, `translator`, `publisher`, `chapters`, categories, keywords, product description, and source attribution.
- The book's source chapters under `data/<book>/` are fully translated.
- Any known book-specific table or frontmatter concerns are captured in the manifest or generated review files.

In examples below:

```bash
BOOK=shiji
SLUG=shiji
```

## 1. Regenerate The Website Data

Run the normal site update for the book so counts, public JSON, static HTML, search data, and OpenGraph assets match the source.

```bash
make update BOOK=<book>
```

For a final corpus-wide release, use:

```bash
make update-all
```

Cloudflare builds intentionally do not run LanguageTool. LanguageTool cleanup scores must be refreshed locally when they matter.

## 2. Run Source-Level QA

Start with the cheap reusable scanners:

```bash
make quality-scan BOOK=<book> OPTIONS="--summary --fail"
```

This runs source artifact checks, translation artifact checks, quote/alignment-adjacent translation checks, compound-name spacing, title style, translation completeness, metadata, and literal-identical prose advisory output.

Treat hard-gate failures as blockers. Treat advisory output as a review queue, not proof of defects.

For broad review prioritization, run:

```bash
npm run quality:scan -- --book <book> --summary --review-priorities
```

The broader review-priority mode deliberately surfaces more candidates than the final gate. Use it to choose chapters for human review.

## 3. Use Glossary Alignment As A Review Queue

The translation-alignment scanner uses curated anchors and the Chinese Notes glossary. It now checks both likely sentence offsets and suspiciously low same-sentence glossary coverage.

Run the normal broad pass:

```bash
npm run quality:translation-alignment -- --book <book> --summary --glossary-scope all --review-priorities
```

If it is too noisy, narrow it:

```bash
npm run quality:translation-alignment -- --book <book> --summary --glossary-scope proper --review-priorities
npm run quality:translation-alignment -- --book <book> --summary --glossary-scope manual
```

Interpretation:

- `COMMON_GLOSSARY_NEARBY_SOURCE` and `COMMON_GLOSSARY_NEARBY_ENGLISH` often indicate sentence offset or quote-boundary drift.
- `LOW_GLOSSARY_SAME_SENTENCE_COVERAGE` means the Chinese sentence has enough glossary anchors, but the English matches very few of them.
- A low glossary score is smoke, not a verdict. It is strongest for sentences with several proper nouns, offices, titles, places, or technical terms.
- False positives are expected when the translation uses a better rendering than the glossary, such as an established house style or a title form the glossary does not list.

For machine-readable triage:

```bash
npm run quality:translation-alignment -- --book <book> --json --review-priorities > /tmp/<book>-alignment.json
```

Review highest-count chapters first, then inspect individual severity 3 findings.

## 4. Refresh LanguageTool Scores

Start the local LanguageTool server, then refresh the cached scores:

```bash
make score-languagetool BOOK=<book>
```

Check cache freshness without contacting the server:

```bash
make check-languagetool-cache BOOK=<book>
```

Use the LanguageTool data to prioritize chapters with grammar, spelling, agreement, and typography issues. Do not chase every false positive. Known acceptable style choices, such as direct classical renderings, should remain if they are intentional and readable.

## 5. Review Chapters

Use the chapter review loop for any chapter selected by LanguageTool, glossary alignment, literal-identical prose, table warnings, KDP spellcheck, or manual sampling.

```bash
make extract-review CHAPTER=data/<book>/<chapter>.json
make apply-review CHAPTER=data/<book>/<chapter>.json
```

For queue-based review:

```bash
make extract-next-review BOOK=<book>
```

After each meaningful review batch, rerun:

```bash
make quality-scan BOOK=<book> OPTIONS="--summary --fail"
make score-languagetool BOOK=<book>
make update BOOK=<book>
```

Stop reviewing when the remaining findings are mostly low-value style preferences, glossary false positives, or acceptable literal renderings. Do not let heuristic cleanup expand forever.

## 6. Generate The E-Book

Generate the EPUB package and support artifacts:

```bash
make ebook BOOK=<book>
```

Expected output includes:

- `dist/ebooks/<slug>/<slug>.epub`
- `dist/ebooks/<slug>/cover.png`
- `dist/ebooks/<slug>/kdp-upload-fields.json`
- `dist/ebooks/<slug>/kdp-draft-worksheet.md`
- `dist/ebooks/<slug>/review-checklist.md`
- `dist/ebooks/<slug>/table-review.md`
- `dist/ebooks/<slug>/upload/`, including the upload EPUB, PNG/JPG cover assets, KPF output when generated, and checksums
- `dist/ebooks/<slug>/qa-report.json`
- `dist/ebooks/<slug>/publication-manifest.json`

## 7. Run Automated E-Book QA

Run the structural EPUB validator:

```bash
make ebook-validate SLUG=<slug>
```

Run the full automated publication gate:

```bash
make ebook-qa SLUG=<slug> REQUIRE_LANGUAGETOOL_CURRENT=1
```

This validates EPUB structure, optional Calibre conversion, quote-span alignment, cheap source QA, and cached LanguageTool freshness.

If Calibre is unavailable or the environment cannot run it:

```bash
make ebook-qa SLUG=<slug> REQUIRE_LANGUAGETOOL_CURRENT=1 SKIP_CALIBRE=1
```

Before final publication, the stricter command should pass:

```bash
make ebook-qa SLUG=<slug> REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1
```

That final command is expected to fail until the manual signoff file is complete.

## 8. Manual Reader QA

Create or refresh the manual signoff template:

```bash
make ebook-manual-qa SLUG=<slug> INIT=1
make ebook-manual-qa SLUG=<slug> REPORT=1
```

Open the EPUB in Kindle Previewer and at least one ordinary EPUB reader, such as Calibre, Thorium, Apple Books, or Kobo preview tooling.

Check:

- cover appears as one page and does not invert in dark mode
- frontmatter displays correctly, including copyright, source attribution, AI translation disclosure, publisher, and edition note
- table of contents navigates to cover, frontmatter, early chapter, middle chapter, late chapter, and final chapter
- light and dark mode body text are readable
- chapter title styling is consistent
- first, middle, and last prose chapters read normally
- table-heavy chapters listed in `dist/ebooks/<slug>/table-review.md` are readable on a narrow pane
- no visible placeholders, raw HTML, `colspan`, `rowspan`, or `(No translation available)` text appears

Some readers may modify an EPUB while opening it. If that happens, regenerate the upload artifact before final QA:

```bash
make ebook BOOK=<book>
```

## 9. KDP Draft QA

Verify the upload bundle:

```bash
make ebook-upload-bundle-check SLUG=<slug>
```

Use:

- manuscript: `dist/ebooks/<slug>/upload/<slug>.epub`
- cover: `dist/ebooks/<slug>/upload/cover.png`
- metadata worksheet: `dist/ebooks/<slug>/upload/kdp-draft-worksheet.md`
- field source: `dist/ebooks/<slug>/kdp-upload-fields.json`

Create a KDP draft before publishing. Confirm:

- title, subtitle, series, author, translator, publisher, language, edition, and rights match the generated fields
- ISBN is blank unless assigning one
- categories and seven keywords are entered
- product description is present and intentionally edited if needed
- AI-generated content disclosure is correct: original text is not AI-generated, cover is not diffusion-generated unless that changes, translation is AI-generated or AI-assisted as required by KDP wording
- KDP spellcheck findings are either fixed or intentionally accepted
- KDP manuscript and cover ingestion report no errors
- DRM and KDP Select choices match the current publishing strategy
- price and royalty options are set intentionally

## 10. Final Signoff

After Kindle Previewer, reader QA, table review, and KDP draft ingestion pass, record signoff:

```bash
make ebook-kdp-signoff SLUG=<slug> CHECKED_BY="Garrett M. Petersen" CONFIRM_KDP_DRAFT=1
```

Then run the final gate:

```bash
make ebook-qa SLUG=<slug> REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1
```

Only treat the book as publishable after that command passes against the current EPUB, cover, upload bundle, generated metadata, and manual signoff hashes.

## 11. Publication Cutoff

A book is ready to publish when:

- all countable source text is translated
- source-level hard QA passes
- LanguageTool cache is current
- high-confidence glossary alignment issues have been reviewed
- the generated EPUB validates
- the cover is opaque and renders correctly
- table-heavy chapters have been checked manually
- Kindle Previewer reports no blocking conversion issues
- KDP draft ingestion reports no manuscript or cover errors
- final manual signoff passes

Do not continue polishing solely to satisfy weak heuristics. At this stage, remaining acceptable issues should be recorded as known style choices or future edition improvements, not blockers.

## Related Documents

- [EBOOK_PUBLISHING_PLAN.md](./EBOOK_PUBLISHING_PLAN.md)
- [REVIEW_PROCESS.md](./REVIEW_PROCESS.md)
- [QUALITY_STANDARDS.md](./QUALITY_STANDARDS.md)
- [ebooks/shiji-publication-runbook.md](./ebooks/shiji-publication-runbook.md)
