# Independent partial-publication architecture analysis

**Research and design, not implementation or authorization to publish.** This
analysis reads the Git tree at staging commit
`729b0ab0d4f84781b168cba48f4c0d4d5ea0c08c`; it does not assume the dirty host
checkout matches it. No build, canonical writes, Git/index operation, queue
claim, lock or lease was performed. The exact commit pins the cited scripts.

## Existing chain and the global bottleneck

1. `scripts/lib/people-corpus.mjs:78` loads **every** extraction and validates
   it against its chapter packet; any invalid extraction aborts this load.
   `compile-people-catalog.mjs:1301` loads every resolution document and then
   compiles a global catalog and global site index. This is an additional
   operational dependency on unrelated broken extraction data.
2. `compile-people-catalog.mjs:833–846,923–961` globally resolves clusters,
   calculates unresolved same-name pairs, and sets `catalog.complete` from
   whole-corpus statistics. `scripts/lib/people-publication.mjs` requires zero
   missing chapters, date-audit-pending chapters, legacy chapters and people,
   pending repairs, and unresolved candidate blocks. Missing chapters count as
   date pending too. Its assertion also requires consistent coverage totals.
3. `scripts/lib/people-site.mjs:26–58` deactivates the entire context unless
   that global catalog is publishable; preview is separately noindex.
   `generate-static-pages.js:46,493` obtains chapter mentions through that
   context. `scripts/generate-people-pages.mjs:1406–1436` cleans the owned
   people output and skips generation when inactive. Thus no independently
   finished chapter gets public chapter links or person pages while unrelated
   chapters remain incomplete. `verify-people-site.mjs:82–105` checks this
   global gate and currently treats missing output as correct when gated.
4. When active, the page generator emits HTML shards and search data from all
   `catalog.people` and `site-status.json`; `scripts/generate-sitemap.mjs`
   includes its search-entry slugs only when `status.published`. Cloudflare's
   person function serves those generated shards. The generated chapter index
   at `compile-people-catalog.mjs:574–618` contains mentions from **every**
   loaded extraction, not merely chapters judged complete.
5. Ebook generation uses the same globally gated context. After activation,
   `scripts/lib/ebook-people-readiness.mjs` checks product chapter presence,
   prompt version, date status and canonical `needs-review`, and selects any
   canonical person with a local member in the product. It does not by itself
   verify independent editorial provenance or limit that canonical person's
   other chapters' facts. `validate-ebook.mjs` can require a glossary, but
   readiness report structure is not independent qualification.

## Why a boolean exception is unsafe

`canonicalRecord()` at `compile-people-catalog.mjs:621–714` chooses the
preferred name/descriptor from cluster members and aggregates their names,
roles, claims, chronology, family relationships and references. Its records
therefore combine facts from all linked local people, including unrelated
unreviewed chapters. Name/role `claimRefs`, claim evidence, and reference
`book/chapter` provide useful provenance, but descriptor suggestions and the
fallback preferred label may have no adequately attributable claim. Family
inverses, family edges, redirects, snippets, search terms and JSON-LD can
propagate those values. Filtering **after** canonical aggregation or filtering
only the chapter links leaks facts and can give a false merged identity.

`generate-progress.js:673–681` calls a chapter `current` based on prompt
version, date-audit status, pending proposed repairs and unresolved people.
This is useful triage, **not** sufficient release proof: it does not establish
complete independent editorial review, applied decision provenance or accepted
translation artifact checks, and prior source audits have shown that a
structurally accepted date report is not automatically a substantively correct
one. `dateAuditStatus()` does check current source/extraction hashes, full
structural report and referenced quotations; it cannot by itself prove the
reviewer's historical inference correct. These distinctions must remain.

`loadValidatedResolutionDocuments()` checks schema, batch uniqueness and
existence of local IDs. The v1 resolution schema contains no source/extraction
fingerprint; the loader does not independently establish that a decision was
made against the current extraction. Separate mutation-time invalidation exists
in `people-resolution-invalidation.mjs`, but a publication projection cannot
assume every historical writer used that path. The full current candidate graph
and cited decision provenance must be checked, not just an old resolution count
or locally filtered alias graph.

The shared queue coordinates extraction/date work per project policy. The
catalog compiler, site loader and renderer above do not acquire a queue claim or
lease. Host-owned checkpoint/release and existing claim/lease rules still apply;
no inferred permission to overwrite a chapter or take a lease follows from a
read-only release assessment. A projection design is not a replacement for
writer fencing or trusted reviewer identity.

## Minimal fail-closed projection design

The smallest safe production unit is an independently versioned, immutable
**publication snapshot**, separate from the full internal catalog. Its manifest
must identify source revision/generation, projection version, and each included
chapter's source and extraction fingerprints, current prompt, strictly validated
coverage, accepted applied editorial decisions/reviewer provenance, current
independent date report, and completion of relevant current identity decisions.
Use current validators and explicitly reject missing or unverifiable evidence;
never infer editorial approval merely from zero proposed repairs. Reviewer
provenance requires an authenticated or otherwise independently verifiable
trust anchor, not a self-asserted JSON field. Historical artifacts lacking
such evidence require revalidation or review, not a blanket invented approval.

Build in two distinct phases:

1. **Internal identity boundary.** Use a current full-corpus candidate graph
   (or a documented provably equivalent incremental index) so a finished
   chapter is compared with known outside-chapter candidates. A chapter is
   eligible only if every one of its local people has no *unreviewed* relevant
   pair; an independently validated `possible-same-as` closes the pair while
   keeping two records separate. Current source/extraction hashes must seal
   the comparisons/decisions, including all evidence-bearing participants.
   An unrelated ambiguous pair need not block this chapter; a new candidate or
   changed participant invalidates affected eligibility until reviewed. Unknown
   future extractions are not grounds to assert absolute corpus-wide identity
   completeness: label scope and conservatively re-evaluate on corpus changes.
   Do not solve the global-load problem by quietly omitting a corrupt current
   extraction from the comparison universe. Its trustworthy indexed identity
   boundary must be proven current, or affected release must fail closed.
2. **Evidence-filtered projection.** Construct public local-person inputs only
   from eligible chapters before producing any canonical aggregates; use only
   merges supported by current independent evidence, never an unreviewed
   transitive bridge. Keep separate/possible-same-as identities separate.
   Compute public claims, aliases, preferred names, descriptions, sex, life,
   references, relationship inverses/edges and search content solely from
   eligible cited contributions. A preferred-name override must remain backed
   by eligible claims; replace unproven member-suggestion-derived labels and
   descriptors with validated eligible evidence or fail closed. Public
   relationship targets must resolve to an eligible public page or be omitted
   without leaking that target's hidden data. Rebuild the chapter mention index
   using only eligible chapters and verify each target is an included person.
   Do not emit redirects for identities joined only by unreviewed evidence.

Stable public IDs and slugs need explicit treatment: using global cluster IDs
whose smallest member comes from an ineligible chapter can unintentionally leak
or unstable-merge identity. Keep a durable, reviewed public-ID registry and
publish redirects only for independently justified public merges. Pin registry,
comparison snapshot and eligible chapter set in the same atomic generation;
handle splits, retractions and changes to previously published evidence
explicitly. A filtered catalog must not counterfeit global `complete=true` or
rewrite global statistics. A separate projection schema should distinguish
`globallyComplete` from `publishedChapterIds` and coverage outside the
projection. Existing catalog/index manifests are generation-sharded and must be
published atomically as a matching set with a generation hash.

One host-owned release process verifies the snapshot against current source,
extraction, editorial, date and identity inputs before publishing exact files;
it must not mutate active claims. Staging/CI still validate all release inputs,
and a PR with required CI remains mandatory. Site renderers and verifier must
consume only the same snapshot: chapter links, person HTML/JSON-LD, family
trees, search/featured lists, redirects, status and sitemap. Ebook assessment
must require every product chapter present in that snapshot and serialize only
the projection's eligible evidence; Jinshu release still requires all 130
chapters to pass its gate. Rebuild affected outputs and verify on deployment.

## First implementable step and tests

Build a pure, read-only `assessChapterPublicationEligibility` function and
schema for a fingerprinted evidence manifest, with injected validators and
candidate snapshot; default to ineligible for missing provenance. Do not wire
it into production or add a preview bypass yet. Add synthetic offline tests
for two independently reviewed chapters plus: unrelated incomplete chapter
does not block one eligible chapter; same-name unresolved external candidate
does; independently reviewed ambiguity remains separate; stale source,
extraction, date, editorial or identity evidence blocks; no repairs is not
editorial approval; a broken unrelated extraction without a trustworthy current
identity index fails closed; and host/shared-queue state is never modified.
Then test the projection with mixed eligible/ineligible members sharing a
canonical cluster, unreviewed transitive bridges, excluded references, names,
dates, descriptors, relationship targets and snippets. Assert no excluded
source token, claim, slug, redirect, search term or backlink reaches any public
HTML, JSON-LD, sitemap, shard or ebook. Add generation-mismatch, newly appearing
candidate, approved possible-same-as, changed/split identity, valid redirect,
product partiality, and noindex preview tests. Finally add end-to-end CI and
deploy verification before removing the old global gate. Until that work and
the evidence trust model exist, chapter-scoped release is a sound target, not a
verified currently available option.
