# Shiji Publication Runbook

This runbook is the final human handoff for publishing `Records of the Grand Historian` as the Shiji pilot e-book. It assumes the generated e-book package already exists under `dist/ebooks/shiji/`.

## Source Of Truth

- Upload manuscript: `dist/ebooks/shiji/shiji.epub`
- Upload cover: `dist/ebooks/shiji/cover.png`
- KDP form fields: `dist/ebooks/shiji/kdp-upload-fields.json`
- Human checklist: `dist/ebooks/shiji/review-checklist.md`
- Upload checklist: `dist/ebooks/shiji/upload-checklist.md`
- Table review samples: `dist/ebooks/shiji/table-review.md`
- Artifact-bound signoff: `ebooks/manual-qa/shiji.json`

## Regenerate And Check

Run these before starting a final review pass:

```bash
make ebook BOOK=shiji
make ebook-manual-qa SLUG=shiji INIT=1
make ebook-upload-bundle-check SLUG=shiji
make ebook-qa SLUG=shiji REQUIRE_LANGUAGETOOL_CURRENT=1
make ebook-readiness SLUG=shiji
```

`make ebook-readiness` is expected to exit nonzero until `ebooks/manual-qa/shiji.json` is fully signed off. Its JSON output should still show every `automatedReadiness` field as `true`.

## Completion Cutoff

Treat the translation-polish phase as complete when all of the following are true for the current generated Shiji artifact:

- `make ebook-qa SLUG=shiji REQUIRE_LANGUAGETOOL_CURRENT=1` passes.
- `make ebook-readiness SLUG=shiji` reports every `automatedReadiness` field as `true`.
- LanguageTool has current green scores for all 130 Shiji chapters, with zero matches.
- Cheap QA reports zero source artifacts, translation artifacts, translation-alignment candidates, compound-name spacing candidates, title-style candidates, translation-completeness candidates, translation-metadata candidates, and literal-identical prose candidates.
- Table-heavy chapters 013-022 are marked passed in `ebooks/manual-qa/shiji.json`.
- Recent high-risk prose passes have addressed the highest rough-language clusters.

Do not keep editing solely to remove low-value style heuristics after these checks pass. Remaining work at that point is publication signoff, not translation polish: Kindle Previewer, a reader light/dark rendering pass, and KDP draft ingestion.

## Reader Review

Open `dist/ebooks/shiji/shiji.epub` in Kindle Previewer and at least one EPUB reader such as Calibre, Thorium, Apple Books, or Kobo preview tooling.

Some desktop readers modify EPUBs in place while opening them. Calibre can add
`META-INF/calibre_bookmarks.txt`, which changes the upload artifact hash and
causes `make ebook-qa` to fail. After any manual reader pass, rebuild the EPUB
before treating `dist/ebooks/shiji/shiji.epub` as the upload file:

```bash
make ebook BOOK=shiji
```

Already locally verified by the generated QA/signoff artifacts:

- The EPUB is structurally valid.
- The cover image is a fully opaque PNG and the packaged cover page uses explicit white backgrounds.
- The EPUB table of contents contains cover, frontmatter, and all 130 chapter links.
- Frontmatter contains the AI disclosure, source attribution, and rights statement.
- Table-heavy chapters 013-022 have generated list-style samples and have been spot-checked in the current signoff.

Confirm:

- Kindle Previewer reports no blocking conversion errors.
- The cover appears as one page.
- Light mode and dark mode body text are readable.
- The table of contents opens the expected locations.
- Frontmatter displays normally in the reader.

Use these prose-flow targets from the current signoff template:

- `EPUB/text/chapter-001.xhtml`: Annals of the Five Emperors
- `EPUB/text/chapter-071.xhtml`: Biographies of Shu Lizi and Gan Mao
- `EPUB/text/chapter-130.xhtml`: Autobiographical Afterword of the Grand Historian

Use these navigation targets:

- `cover.xhtml`: Cover
- `frontmatter.xhtml`: Copyright and Source Note
- `text/chapter-001.xhtml`: Annals of the Five Emperors
- `text/chapter-066.xhtml`: Biography of Wu Zixu
- `text/chapter-130.xhtml`: Autobiographical Afterword of the Grand Historian

Review the table-heavy chapters listed in `dist/ebooks/shiji/table-review.md`, especially chapters 013-022, on a narrow reading pane.

## KDP Draft

Create a KDP draft, not a published release.

Use:

- Upload bundle: `dist/ebooks/shiji/upload/`
- Manuscript upload: `dist/ebooks/shiji/upload/shiji.epub`
- Cover upload: `dist/ebooks/shiji/upload/cover.png`
- Metadata source: `dist/ebooks/shiji/upload/kdp-draft-worksheet.md`

Immediately before upload, run:

```bash
make ebook-upload-bundle-check SLUG=shiji
```

Confirm in KDP:

- Title, subtitle, author, translator, publisher, language, series, edition, and rights match `kdp-upload-fields.json`.
- ISBN is left blank unless assigning your own ISBN.
- Product description is entered exactly or intentionally revised.
- Suggested list price is entered.
- Publishing rights match the generated note.
- Categories and all seven keyword slots are entered.
- AI-generated content disclosure is entered.
- KDP ingestion reports no errors.

Do not publish from the draft until the final manual signoff command passes.

## Fill The Signoff

After the KDP draft exists and KDP reports no manuscript or cover ingestion
errors, record the final signoff with:

```bash
make ebook-kdp-signoff SLUG=shiji CHECKED_BY="Garrett M. Petersen" CONFIRM_KDP_DRAFT=1
```

This fills the KDP draft fields, refreshes artifact hashes, and sets the
top-level signoff to passed. Use `DRY_RUN=1` first if you want to preview the
JSON update.

If editing `ebooks/manual-qa/shiji.json` manually instead, do it only after the
review above is complete.

Set:

- top-level `status` to `"passed"`
- `checkedBy` to the reviewer name
- `checkedAt` to an ISO timestamp or date
- each reviewed section `status` to `"passed"`
- each boolean field to `true`, except `conversionErrors` and `ingestionErrors`, which must be `false`
- each table-heavy chapter review `status` to `"passed"` after checking its listed rows

Do not edit the artifact hashes manually. If they are stale, regenerate:

```bash
make ebook BOOK=shiji
make ebook-manual-qa SLUG=shiji INIT=1
```

## Final Gate

Run:

```bash
make ebook-qa SLUG=shiji REQUIRE_LANGUAGETOOL_CURRENT=1 REQUIRE_MANUAL_SIGNOFF=1
```

Only treat Shiji as ready to publish after that command passes against the current EPUB, cover, support files, and manual signoff.
