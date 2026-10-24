# Standalone people-site freshness: isolated reproduction (incomplete)

Observed in the current shared checkout; this note does not certify a chapter or a release.

## Reproduction

On 2026-10-19, an isolated temporary `PEOPLE_REPO_ROOT` fixture was constructed with a publishable legacy-format catalog, a matching schema-v2 site index and an extraction. The catalog and index had the same `generatedAt`, `complete` and prompt version. Their single `fixture:001:m001` indexed the unchanged English span `Zhang` to `per_a` / `old-person`. The extraction's matching mention initially pointed to `fixture:001:p001`.

After changing only the extraction's person to `fixture:001:p002`, preserving the mention ID and exact span, the production `loadPeopleSiteContext({allowMissing:false})` still returned `active: true`; `chapterPeopleContext` and `renderPersonLinkedText` emitted exactly the same old-person link. This is a deliberately small fixture, not a valid complete production extraction or an end-to-end build. It specifically proves the loader does not compare extraction inputs and cannot catch this same-span remapping. The production shard readers also support the fixture's legacy manifest formats. The temporary fixture is `/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-stale-fixture-h5Wm3t` on this host; it contains no credentials or recovery state.

## Build boundary and interim handling

`npm run build` invokes `scripts/compile-people-catalog.mjs` before the chapter and person page generators. `npm run people:site`, `node generate-static-pages.js`, and `node scripts/generate-people-pages.mjs` do not compile first; a matching catalog/index pair may predate current corpus inputs. The current loader checks generation metadata, not extraction, source, audit, resolution, schema or scanner fingerprints. The verifier separately reads those generated files and is not a freshness barrier.

With externally controlled, unchanged inputs and no concurrent compiler or page writer, an operator can run `npm run people:catalog` immediately before site generation and treat any failure as a stop; this reduces the stale-input exposure but is **not** an atomic publication guarantee, nor an independently tested end-to-end mitigation. The compiler's existing offline `--self-test` passed in the current checkout. The stale-link fixture above passed, demonstrating the defect, not a fix. No full compilation or build was run because free space is below the 30 GiB threshold.

There is no proven production-safe interim guard in this investigation: independently hashing inputs before and after compilation cannot exclude an ABA change, and generated output is written incrementally. A sound fix requires a consistent input snapshot or universally enforced writer exclusion, a generation commit binding the exact inputs and output manifests/shards, and an output publication strategy that prevents a failed or mixed generation being served. Any such change must preserve intentionally inactive/partial catalogs and reconcile existing unstaged edits. No production files or locks were changed for this note.
