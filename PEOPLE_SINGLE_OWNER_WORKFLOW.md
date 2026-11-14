# One chapter owner, one independent final review

November 13, 2026: use this scheduling design at the next idle chapter boundary.
Preserve active claims, runs, locks and recovery. This does not alter a running
invocation or waive any native publication gate. Start with the next already-owned
nonempty Jinshu chapter; do not create another extraction wave or repeat Jinshu 053.

## Work order and ownership

The host pins one work order: chapter/source revision, all source units, both
English fields, existing extraction and repairs, accepted review artifacts and
their actual reviewer provenance, approved label/schema sets, registry generation,
existing claims, assigned artifact paths, and deterministic validation commands.
Include the full chapter, but retrieve external people/evidence on demand through
the bounded lookup API in `PEOPLE_LOOKUP_API.md`. Missing evidence is an explicit
blocker, not permission to manufacture an identity, date or approval.

Full chapter availability does not require putting every file in the first prompt.
Send a compact work-order manifest and sealed chapter files; the same owner reads
them in bounded portions and records complete unit coverage. Do not preload the
whole person registry, unrelated campaign logs or repository instructions/history.
Oversized tool results require bounded retrieval, never silently dropped evidence.

Assign one capable reasoning model in a persistent Cursor cloud conversation to
own the draft through source review, extraction, chronology, identity proposals,
validation and corrections. Select an actually available model explicitly; do not
default to the cheapest model or disable reasoning. Preserve the same cloud agent ID
when the local coordinator rotates. One coordinator and one owner may share a
chapter; competing owners may not. Respect the existing ledger and sticky recovery.

Cloud workers operate on the supplied chapter packet and their own artifacts. They
must not clone the corpus or build the site. Local lanes share the host checkout;
no per-chapter worktree, data/public/node_modules copy, branch switch or shared Git
index mutation. Host publication, builds, staging and merges remain host-owned.

## Draft the complete chapter before freezing it

The owner reads the complete source and both English fields and accounts for every
unit. It batches definite translation repairs, names/aliases, mentions, relationships,
supported dates, evidence, and conservative canonical identity proposals in one draft.
Reuse existing accepted work instead of recreating it. Treat genuinely undated facts
as undated under the approved schema, not permanent research holds. Retrospective
is the approved chronology category; do not invent categories. Distinct name kinds
such as posthumous-name are not chronology categories.

Use small tool/command submissions for individual records and corrections, with
immediate schema and referential-integrity feedback. The host's production appliers
assemble the candidate; do not demand a perfect giant JSON response or commission
an agent to repair formatting. Reuse each lane's existing recording tools; do not
invent a new output schema because a model finds the old one awkward. Date-hint
normalization and other deterministic repairs happen before sealing the candidate.
The read-only people API supplies retrieval, not write/validation/publication tools.

Run deterministic validators against the candidate in the same owner conversation.
Feed compact errors back there. Do not launch a new reviewer for each field or round.
Source repairs, extraction updates and date/identity proposals are reviewed as a
coherent candidate before canonical publication, using existing reviewed production
curation/applier contracts. No blanket source freeze before omissions are checked.

## One independent final reviewer, explicit native reports

A separate conversation/model invocation reviews the finished candidate against the
full source and bounded person evidence. It checks translation coverage and fidelity,
mention/person coverage, chronology, identity membership/uncertainty, and the entire
repair batch together, then returns all findings in one batch. It must be distinct
from every author whose changes it approves. Tool logs and transcript identity must
establish actual independence; an agent-written `reviewerId` is not proof.

Produce the existing editorial/date/identity report formats from this review; one
review session does not mean a vague combined thumbs-up. Existing validators still
require their exact coverage, fingerprints and provenance. If a specific native
recorder cannot accept that capture, preserve the review and report the adapter gap;
do not relabel it as approved or buy a redundant review without diagnosing the gap.

The current canonical runtime's `publish-people-combined-curation.mjs` already
requires the identity report, date report and input seal to identify the same
independent reviewer. Use that existing contract rather than inventing three review
agents. Its materialized inputs are `data/BOOK/NNN.json`, `candidate.json`,
`editorial-decisions.json` and `validation.json`; review artifacts are
`identity-review.json`, `date-report.json`, `validation.json` and `input-seal.json`.
Inspect/prepare/verify a content-addressed receipt with that runtime before host
publication. Do not import a partial older runtime from this checkout or run a
chapter-specific bespoke applier. The separate canonical identity certification and
publication checks still have to pass; combined curation is not itself public completion.

Return corrections to the original owner, then the independent reviewer checks the
patch and its dependencies. Reuse that reviewer's context where possible. Preserve
the existing circuit breaker (at most three repair/re-audit rounds, repeated candidate
and non-improvement stops); hold the precise unresolved issue and continue another
chapter instead of repeatedly restarting full audits.

A new whole-chapter receipt does not inherently require another whole-chapter model
read. The same independent reviewer can continue its original captured review,
inspect the exact patch/dependency closure, and explicitly approve the complete
current candidate in the native report formats. Preserve its original report and
the actual continuation capture. The host must not manufacture that approval by
copying old reports and changing their fingerprints. If native capture cannot prove
that continuation, that is an adapter gap, not permission for a synthetic approval.

## Preserve work with explicit dependency-scoped review

Never overwrite old reports or change their hashes to make them current. Each review
component needs exact source units/fields, person/claim/mention IDs, date evidence,
canonical dossier/member versions, approved schema version and actual reviewer
capture. A changed component receives a new reviewed patch. A new chapter receipt
must reference retained unchanged proofs and newly reviewed components, not pretend
the old whole-chapter hash reviewed new bytes.

Review the transitive dependency closure of a patch: an English correction can affect
attribution, mentions and dates; a new person affects chapter coverage; a merge can
affect other memberships. Ordering and chapter-wide completeness are dependencies
too. Missing dependency metadata requires broader review, never automatic reuse.
Cheap full deterministic validation may rerun without repeating all model reasoning.
Unchanged content stays reusable where native proof composition validates it.

Implementation boundary: the production runtime already has identity proof
composition and reviewed combined-curation contracts. They are the publication
authority. General incremental reuse across arbitrary source edits is **not** enabled
by this document or the lookup API. Add any missing composition support once in that
runtime, with independent code review and regressions for source, membership, date
and external-dossier changes, before using it to retain approvals. Until then follow
the native gate, keep prior work, and identify the exact unsupported dependency.

## Acceptance and rollout

Run one existing nonempty chapter through this topology first. Measure accepted
nonempty published chapters, elapsed time, owner/reviewer turns, actual billed usage
and cache usage when exposed, patch rounds and late defects. Keep zero-person chapters
separate. Compare total cost per published chapter, including rework, rather than
model price or extraction throughput. A fresh conversation does not universally
imply a cold cache; keep stable prompt/tool prefixes, but measure provider caching.

The host validates exact candidate/report bytes, publishes with the normal gates,
checks backlinks/person search and ebook eligibility, pushes completed chapters to
staging and releases master at the established milestone. A draft, API deployment,
passing build or lookup result is not chapter completion. Scale cloud concurrency
only after resource checks and a measured successful run. No automatic lane rollout
or spending wave is authorized merely by installing this service.

Suggested owner instruction:

> Own this assigned chapter end to end using the sealed work order. Read all source
> units and both English fields. Reuse accepted work; batch repairs, people, mentions,
> chronology and conservative identity proposals into one validated candidate. Use
> the read-only people lookup for bounded versioned evidence, and the supplied
> production recording tools for small submissions. Remain in this conversation
> through validator feedback and independent-review corrections. Do not self-approve,
> invent labels, infer missing dates, clone the repo, publish canonical files, change
> branches or create a worktree. Write only your assigned artifacts. Return complete
> coverage, exact patch contracts, lookup versions, all validator results and any
> precise unresolved blocker. The host supplies the independent reviewer and publishes.
