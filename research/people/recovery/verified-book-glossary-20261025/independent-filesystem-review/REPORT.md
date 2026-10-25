# Independent v2 filesystem and full synthetic publication integration

Verdict: approve this reviewed integration boundary. No blocking defect reproduced in v2. The actual normal compiler, filesystem qualifier, required generator and required validator all pass for a complete small synthetic publication while the outside book remains unaudited and the global catalog incomplete. This supersedes only the v1 integration evidence; v1's separately identified editorial authorization defect remains grounds not to adopt v1.

Reviewed patch: `sha256:72a2369b17cff7c97c46c84a63505b681096c459856713da4f4c3362bf70fa94`; exact base `81240df60b45d748f7b951c41810ef8cac9c7a3d`. All 11 envelope file hashes match; `reviewed-hashes.json` records them. No sealed v1/v2 file was changed.

## Positive full publication result

`results.json` records exact commands, cwd, output and statuses:

- `normal-compiler`: exit 0; normal successful CLI emits fresh v2 catalog/site-index/shards and identity seal. No v1 seal is reused.
- `filesystem-and-zip`: exit 0; real filesystem qualifier, real source/extraction/editorial/date gates and default independent ZIP verifier all pass.
- `actual-required-generator`: exit 0; actual byte-identical v2 `generate-ebook.mjs --book jinshu --require-people-glossary` produces a complete publication EPUB, content, cover PNG/JPEG, metadata, QA, manifest, review/checklist sidecars and upload bundle. Final QA has `errors=[]`, `warnings=[]`.
- `actual-required-validator`: exit 0; actual v2 `validate-ebook.mjs --require-people-glossary <full-generated-epub>` reports `EPUB validation passed: dist/ebooks/jinshu-synthetic-review/jinshu-synthetic-review.epub`.

All built-in publication, ZIP, XML/XHTML, cover, metadata, QA, source/date, glossary, links, certificate and sidecar gates remain enabled. `xmllint` is available and the actual validator calls it. External EPUBCheck was not run: neither the `epubcheck` command nor `EPUBCHECK_JAR` is available in this environment. No external EPUBCheck pass is claimed.

Final full EPUB SHA256: `dd3de0c1bebaa00124d1d92776abffc2bf6e7f4c3cc4ba6c77782cacdeb4da22`. `publication-artifact-hashes.json` records 19 generated publication/upload artifact hashes and the byte-identical executable copy hash.

The synthetic product is named `jinshu-synthetic-review`, visibly labeled as a fictional integration fixture, and has one authored fictional source chapter. It uses the supported `jinshu` book ID solely to exercise the unchanged static cover/book-metadata path. These results make no assertion about any real Jinshu chapter, existing canonical source, real approval or real publication readiness.

## Filesystem and isolation evidence

The production packet builder/seed and strict extraction validator accept three synthetic local people across the in-scope and outside one-chapter books. Production `recordDateAudit` records an independent source-pinned report only for the in-scope chapter. The normal compiler resolves a curated cross-book merge and yields 2 canonical people, 1 scoped family edge, `complete=false` and `dateAuditPendingChapters=1`.

The outside merged member contributes an alias and birth date to the global catalog. The actual `loadCertifiedEbookPeople` reads the authoritative product manifest, compiler outputs/seal, fresh packets and production gates, then excludes those outside facts. The scoped parent/child edge and inverse adjacency survive and family rendering resolves the actual scoped target. The complete generated publication contains two people, one glossary shard, two English mention links and two source backlinks.

Negative filesystem tests reject missing date approval, stale date source pin, missing compiler seal, post-compilation source-byte edits, and editorial self-review even with empty repair arrays. Default verifier tests reject a forged embedded certificate and an outside alias injected into the glossary. Gate functions and gate results are never mocked. The ZIP verifier receives neither a context nor chapter-data override and independently reloads authoritative filesystem data.

The separate v2 provenance reviewer exercised normal `applyPeopleTranslationRepairs`, accepted and revised repairs, merged history, reconciliation and idempotent replay, and proved unauthorized extra applied repairs and self-review reject. That evidence is in the sibling `independent-provenance-review`; it was not substituted for this filesystem/full-publication test.

## Harness details and reproducibility

Disk preflight passed before writes with 51.15 GiB free. All fixture and harness writes stay in this unique v2 review directory. No repo/corpus/.git/node_modules copy, worktree, branch/index/claim/runtime/source change, external model call or live runner operation occurred.

The review loader reuses the existing sparse dependency runtime, checks unchanged modules against exact master, and routes changed/new modules to sealed v2. That runtime omits `public/book-design.js`; the loader routes only that import to the existing primary file after comparing its bytes with exact master. No `public/` copy or runtime edit was needed. A single byte-identical generator executable is individually placed in the fixture's `scripts/` directory to honor its existing `import.meta.url` root convention. Its copied bytes enter the fresh compiler input seal. Schema/config/chronology/vocabulary dependencies are individually copied as required by production configuration; fixture source/extraction/curation/product files are individually authored.

From the shared checkout:

```sh
npm run people:disk:check
REVIEW="$PWD/data/people/generated/code-drafts/verified-book-glossary-20261024-v2/independent-filesystem-review"
node "$REVIEW/setup.mjs"
PEOPLE_REPO_ROOT="$REVIEW/fixture" node --loader "$REVIEW/loader.mjs" "$REVIEW/seed.mjs"
node "$REVIEW/run.mjs"
```

`run.mjs` runs normal compilation, filesystem/ZIP checks, required full generation and required full validation sequentially. Every process uses the synthetic root and the same existing dependency runtime. No check is skipped.

Initial harness-resolution failure is retained in `initial-loader-results.json`. First full publication validation correctly rejected incomplete fixture metadata (keyword warnings and missing explicit standard AI/translation-rights wording); the exact output remains in `metadata-first-results.json`. Only synthetic manifest metadata was corrected, with no validator relaxation. The final publication-only rerun requalified its current authoritative manifest and full certificate, generated anew and passed. Original successful compiler/filesystem results are retained in final `results.json`; their inputs stayed unchanged apart from the product metadata, which is independently rebound in the fresh product certificate.

Remaining limits: full real-corpus inventory IO and repeated gate performance are unbenchmarked; no real-book release is certified; external EPUBCheck remains unavailable. The full required generator/validator integration gap from v1 is closed for a legitimate small synthetic publication.
