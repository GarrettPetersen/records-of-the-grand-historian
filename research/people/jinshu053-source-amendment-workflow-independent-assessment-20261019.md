# Independent assessment of Jinshu 053 source-amendment workflow

Reviewed `jinshu053-source-amendment-workflow-22427ca7-research.md` (file
SHA-256 `62c0c97bc715790fb20c56215acdaed88278a0b03e7f213d683a949ed4bab775`)
against the currently checked-out documentation and code. No code was executed
or changed; no mutation, queue, Git/index, build or chapter publication was
attempted. Findings are requirements and limitations for a prospective design,
not approval of one.

## Substantiated boundaries

1. **Chinese changes are not supported by current combined curation.**
   `PEOPLE_COMBINED_CURATION.md` expressly excludes Chinese emendations.
   `scripts/lib/people-combined-curation-review.mjs`'s
   `validateCombinedReviews` replays an optional reviewed whole-paragraph move
   and approved `literal`/`idiomatic` changes, then requires deep equality with
   the submitted source. Arbitrarily editing `zh`, a receipt, or its hash fails
   this boundary; a new protocol and review would be needed. The note correctly
   distinguishes this from the code-supported reordering contract, which the
   documentation still excludes. Do not treat the mismatch as authorization.
2. **Historical evidence is not renewed approval.** The pinned date report is
   `research-blocked` and its own finding explicitly says no further in-chapter
   repair is possible for the listed chronology and outside historical research
   is required. Keep this as a substantive open question, not merely a stale
   hash. A fresh independent full review of final source and extraction may
   remain blocked. `PEOPLE_DATE_AUDIT.md` makes reference freshness material;
   `people-date-audit.mjs` hashes source units and complete extraction, and also
   checks local reference freshness. Preserve reports, rounds and findings; do
   not transplant verdicts or copy new hash strings into old reports.
3. **Prior editorial data is single-review v3, not an array history on disk.**
   Pinned `data/people/editorial-decisions/jinshu/053.json` has top-level
   `reviewer`, `proposals` and eight `decisions`; the history helpers can
   normalize the old component. Preserve the exact old document and original
   source/extraction; verify each applied repair's before/after and current
   field. The future review must not quietly replace or reinterpret it. The
   note's characterization of eight decisions is supported.

## Safety gaps and qualifications

4. **Witness decision must be distinct from identity inference.** The two
   digital 虨 readings support recovery but do not demonstrate independent
   manuscript ancestry or a physically verified edition. For s0205, chapter
   053 witnesses disagree (Wikisource 暠, Siku transcription 廙), whereas
   chapter 044's father, office and crown-prince-companion evidence favors
   Hua Yi / Hua Heng. Chapter 044 is corroborating historical identification,
   not itself a chapter-053 witness. Preserve the variant, edition and cited
   excerpt and record an explicit editorial policy decision, noting whether a
   scan was actually inspected; do not assign 廙 or 虨 based solely on a
   validator or claim 暠 is a genuine alias. Review *both* English fields and
   every affected Chinese/English mention and source evidence after a decision.
5. **Person-identity pruning is not automatically evidence-aware.**
   `pruneResolutionPeople` filters specified IDs from `localPeople`, drops
   decisions with fewer than two remaining IDs, and removes a retained
   decision's `canonicalPersonId` after pruning. It does not independently
   re-adjudicate the remainder, inspect whether its rationale or cited evidence
   still supports it, decide which IDs to prune, or protect public slug/redirect
   continuity. Scope must be independently assessed, preserve exact originals,
   and review retained relations and IDs. `invalidateResolutionReferences` in
   `sdk-people-extract.mjs` applies to a changed replacement via that specific
   acceptance path; this is not evidence that arbitrary publishers or any
   direct edits automatically invalidate identities. Full validation can catch
   structural problems but cannot prove historical identity correctness.
6. **Downstream dependencies include external references and stable URLs.**
   Inventory decisions and date/identity reports elsewhere that cite an amended
   Chinese unit even where their `localPeople` do not contain a changed 053 ID.
   Review changed localized mention offsets, person names, alias dispositions,
   passage snippets, relationships, old/new canonical IDs and redirect behavior;
   ensure refreshed catalogs, backlinks, search, sitemap/SEO and ebooks derive
   from final approved generation. Do not assume pruning 053 IDs alone finds all
   textual-reference dependencies, or that successful generation is approval.
7. **Reviewer roles need a concrete design.** The present combined validator
   compares the agent IDs of identity, date and seal reviewers for equality;
   it also requires them to be independent of all declared authors, recursively
   includes extractor/chunk authors, and checks *every retained editorial
   review* against that author set. Thus one cannot assume its current identity
   and date reviewers must be different persons, nor can a historical editorial
   reviewer be silently repurposed as an amendment author when that would make
   retained history fail the current independence check. If a future protocol
   requires distinct source, identity, date or editorial reviewers, specify and
   enforce the intended roles rather than assuming this already happens. Verify
   real session provenance, not just self-declared agent strings.
8. **Archive procedures and ownership are state-dependent.**
   `archiveStaleDateWorkflow` only moves a stale *incomplete* generation and
   expressly leaves remote reservation reconciliation to its caller; it refuses
   a completed generation and an existing archive destination.
   `archiveStaleDateReport` similarly refuses an existing archive path. Neither
   operation grants permission to seize an active claim. Exact-byte copies and
   hash verification, current host ownership, queue/lease checks and normal
   collision-safe recovery must precede any eventual operation. Do not claim an
   earlier snapshot showing no claim establishes present idleness.
9. **Fencing and publication are an unresolved design problem.** The note
   correctly warns that check-then-write is not interprocess CAS. An eventual
   implementation must enumerate and fence all writers, including unrelated
   source editing and extraction/date processes, before the first canonical
   write; specify mixed-before/after recovery, durable receipt location, external
   hash custody, partial failure and rollback/forward behavior, retention of
   ignored job artifacts, and queue transition only after final validation.
   Test concurrent drift, crash at each write boundary, third states, altered
   external references, missing archives and reviewer/author collisions offline.
   The existing combined publisher's test coverage is not proof a new Chinese
   emendation publisher would be safe.
10. **Coverage should be proven on final coherent source.** Compose source
    decisions and all independently reviewed bilingual replacements first,
    preserve source-unit IDs and order unless a separate reviewed reorder is
    authorized, then seal exact candidate bytes. Compare all named mentions and
    scanner candidates, not only p028 and p024/p025; check for changed local
    context and ensure repair evidence points to the correct version. Fresh
    independent full-source editorial and date coverage and identity review
    remain separate gates, and unresolved rows block completion. A source-only
    emendation path must not falsely report completion of the unfinished broader
    translation review.

The note is a conservative research checklist, not a working end-to-end Chinese
amendment mechanism. Its staged source/queue observations should be refreshed
by the host before any implementation. No canonical action is recommended until
source decisions, a reviewed protocol, independent final-candidate reviews,
ownership, validation and recovery requirements are satisfied.
