# Independent review: unresolved death capture v2 (incomplete)

Reviewed patch SHA-256: `a9815367e57056ca8fc7ecc1fca8505ef6cf0e39767cd1b7c61fedc749fa9867`.
Compared with v1 SHA-256: `f58427518053ad227591ae6b2f757510109585077eb4ead8f49e498d28a359eb`.
Base: `51219058da723b2f56cb36b502cc5212fe29cf54`. The four files patched and the date-value, audit, publication, and ebook-readiness libraries are unchanged between that base and staging commit `739a407c34bead7cbb2e12444f2e8375fa8e0b29`.

## Scope and assessment

The production change removes only the special exclusion of `death` from the existing all-unresolved temporal evidence exception. The exception still requires an attestation, source-date text and a substantive unresolved reason, and excludes Western dates in every temporal container. Source-only death without an explicit hold remains rejected by the changed self-test. Other death representations (`died-at` and event-participation/deceased) remain excluded, as before. Prompt v5/v7 and compact/expanded representations are exercised in the added regression tests.

This is **capture**, not a semantic validation of event ownership. The patch intentionally accepts the synthetic false case where the source describes Alice's father dying and the extracted claim describes Alice's death. The unresolved flag refers to chronology and does not make the death fact itself tentative. Do not interpret a passing extraction validator as confirmation of that claim. Independent source review must resolve or remove the factual misattribution; it is not enough to supply a date or remove the hold.

The patch changes no production audit, ebook, or catalog-publication gate. In the base implementation, death is always selected for date-audit items, `temporalContainers` includes root and nested unresolved objects, and an audited report is rejected if any item retains an unresolved container. A prior report becomes stale after the extraction changes. The ebook current-date check requires a current audited report, and ebook readiness requires a current audited chapter. The synthetic regression verifies a mixed dated-and-unresolved death is stale and rejected, then verifies the gate opens only after a synthetic repair and a newly recorded reviewer report. This fixture does not prove a real reviewer was independent or its historical evidence was sound.

**Promotion blocker: public preview is not an access-control boundary.** In the inspected base, `scripts/lib/people-site.mjs:33-47` and `scripts/lib/people-publication.mjs:1-28` fence ordinary non-preview generation: a pending date audit prevents a complete, publishable catalog. However, setting `PEOPLE_SITE_PREVIEW=1` activates that incomplete catalog. `scripts/generate-people-pages.mjs:1018-1019` renders death claims; lines 1417-1444 write page shards and search entries for all catalog people, including preview. The preview meta tag (`:927`) says `noindex,nofollow`, but does not prevent retrieval. `functions/people/[slug].js` serves a shard's HTML without checking a date or preview status. Thus a preview deployment could expose the deliberately tolerated unsupported death claim and provide a search entry linking to it. Verify production configuration and generated output, and ensure unapproved claims cannot reach public shards, before promoting the capture change. The live `https://24histories.com/data/people/site-status.json` returned the site's HTML fallback rather than JSON; that observation is not proof of production preview configuration or coverage. This is a source-code trace, not an exhaustive audit of every deployment or consumer path.

V2 differs from v1 only by three lines expanding the synthetic post-repair readiness assertion: it captures the audited status, updates the fixture site index, and checks `assessEbookPeopleReadiness(...).ready === true`. The production behavior is unchanged between versions.

## Independent offline checks

Using an isolated, script-only fixture materialized from the base (no worktree, corpus clone, canonical modifications or full build):

- `git apply --check` and patch application succeeded for v2.
- `npm run people:validate-extraction:self-test` passed its expanded and compact positive/negative controls, normalizer controls and unresolved audit rejection.
- `node --test scripts/test-people-date-audit.mjs`: 18 tests passed, including the new mixed chronology and ebook gate test.
- `node --test scripts/test-ebook-people-readiness.mjs`: passed.

These are focused synthetic tests; they do not establish complete corpus coverage, prove prior review provenance, verify the complete production build, validate actual Jinshu 053 source assertions, or approve an extraction, date report, ebook, chapter, or release. The fixture and review are not canonical publication artifacts.
