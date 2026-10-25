# Reviewed ownership correction staging plans

This draft adds no canonical publisher, queue transition, model call or approval bypass. It produces a deterministic plan on stdout. The host may inspect that plan and feed its exact bytes into the existing temporary-index/leased-Git staging workflow, followed by a normal PR and full CI. An output is **extraction-ready only**, never date-approved, identity-complete or publication-ready.

Run with Node 22+ and `--experimental-vm-modules`:

```
node --experimental-vm-modules scripts/prepare-people-ownership-plan.mjs \
  --root /absolute/shared/checkout --commit FULL_COMMIT \
  --book jiutangshu --chapter 029 \
  --candidate /absolute/job/candidate.json \
  --proposal /absolute/job/proposal.json --review /absolute/job/review.json \
  --pins /absolute/job/pins.json > /absolute/job/staging-plan.json
```

No `--apply` exists. No checkout, source tree or data tree is materialized. Baseline modules and their packet/schema/config/glossary/chronology reads come from the pinned Git commit in memory, using a read-only filesystem adapter. Node builtins and installed Ajv packages come from the host runtime; normal CI must verify the draft under the project's supported Node/dependency installation. This adapter is an exact-input mechanism, not a security sandbox for untrusted repository code. The baseline commit must be trusted. No code or data is imported from the mixed working tree.

`pins.json` requires `sourceSha256`, `extractionSha256`, `candidateSha256`, `proposalSha256`, and `reviewSha256`, each `sha256:` plus the SHA-256 of the exact file bytes. The source and extraction paths derive solely from book/chapter. The candidate is a full compact-v2 artifact. Duplicate JSON keys and ambiguous numeric values are rejected. Source bytes are never supplied as replacement content and cannot appear in the plan's writes.

The author proposal has schemaVersion 1, a nonempty canonical `authorId`, `affectedPeople` containing existing short IDs such as p060, and `input` with commit/book/chapter/sourceSha256/extractionSha256/candidateSha256. It includes `deltas`, the complete `computeCurationDrift` inventory, and `changedRecords`, the exhaustive before/after semantic claim and mention contracts returned by the exported helper. It also includes explicit `lineage` groups `{kind, before: [locator], after: [locator], reason}` assigning every changed input and output exactly once. Claim groups preserve predicate, output evidence must be partitioned from the group’s input evidence, and retractions have an empty after list. This bounded ownership tool rejects newly invented claims/evidence requiring a broader extraction repair. The review must endorse the exact lineage groups. Numeric expanded c/m IDs in their locators are positional evidence locators, not stable identities. Existing person IDs must remain; fresh IDs must be noncolliding. No old person can be silently replaced or renumbered.

The independent review has schemaVersion 1, reviewerId, reviewedAt, status `approved`, empty findings, the same input plus proposalSha256, and exact copies of deltas and changedRecords. Every delta requires a `deltaChecks` row `{delta, reason, units, quotes}`. Every changed output claim/mention requires an ordered `evidenceChecks` row `{record, reason, units, quotes}`. Its units must exactly equal the output claim's evidence IDs (short form) or the mention's unit. Quotes must be nonempty exact Chinese substrings of those pinned source units. Reasons must contain at least 20 characters. Reviewers must determine ownership from the complete source context, explicitly partition mixed-evidence claims and account for every changed name, role, date, relationship and hint; matching quotes alone is not a semantic proof. The reviewer must be independent of the declared proposal author and recorded extractor identities. These are verifiable artifact identity declarations, not a means to discover undeclared collaborators.

The plan checks strict production compact validation before and after, complete source-occurrence multisets, unchanged candidate dispositions, source fingerprints, extractor provenance, translation-repair history and coverage. Unrelated people, surfaces and assertions remain identical. The exceptions are explicitly reviewed inbound relationship assertions and related-person hint references touching affected people. Existing editorial history is validated normally against the candidate. A conflicting historical approval stops preparation; this draft contains no supersession mechanism. The current target chapters have no baseline editorial history.

`changes` contains only relative extraction/resolution paths and a new content-addressed receipt at `data/people/ownership-repairs/BOOK/CHAPTER/HASH.json`, exact before hashes, after hashes and exact staged bytes as base64. Null after hash/content means delete. Every entire resolution decision touching an affected existing person is removed; a transitive merge A/B/C is never reduced to B/C. Unrelated decisions remain semantically identical. A resolution file is deleted only when no decisions remain. Removed decisions, exact proposal/review bytes, baseline input hashes and reviewer reasoning are retained in the content-addressed receipt; old file bytes remain in pinned Git ancestry. Date-report files are absent from the changes: the extraction hash change makes old approval stale through existing gates, and reports must not be rehashed to preserve approval.

Before host staging, independently review the code, actual source correction and plan. Host staging must verify the exact baseline and before hashes and reject unexpected paths. Run the normal chapter/editorial/date/identity/publication gates afterwards. This command performs no build or corpus identity graph computation.

Offline checks:

```
node --experimental-vm-modules scripts/test-people-ownership-plan.mjs
```

Tests use pinned Jiutangshu 029 and synthetic identity decisions. Their metadata and mixed-evidence ownership correction is a test fixture, not a historical source approval, and is never written to canonical data.

## V2: an exact mention reclassification, with candidate accounting retained

V1's occurrence-preservation rule remains the default. V2 adds only an explicit reviewed personal-mention → existing non-person/title candidate contract. `proposal.mentionReclassifications` and `review.mentionReclassifications` must be identical arrays. Every row is:

```
{
  before: exact changedRecords.before mention record,
  language: "zh" or "en",
  span: exact original mention span,
  candidate: exact pinned packet candidate,
  beforeDisposition: exact original expanded disposition,
  afterDisposition: exact candidate expanded disposition,
  sourceQuote: exact sentence substring containing the enclosing candidate,
  reason: substantive source-specific explanation
}
```

The removed mention must belong to an affected person. Its span must be contained by the exact candidate text and offsets in the same unit and language. The candidate must already have a `not-person`/`title` disposition before the repair and retain that classification afterwards. The after note must explain the specific source occurrence. Only that disposition's reviewed note may change. Other dispositions remain identical. No personal mention may overlap the non-person candidate afterwards. Duplicate reclassification rows, forged contracts/refs and every other added, lost or duplicated source occurrence fail. The exact removal and note update also require the normal full deltas, lineage and independent reviewer coverage; this is not a general mention-deletion mechanism.

For Jinshu 028, `s0373` says `汝非皇太子`: the false p153 inner `太子` span (3–5) is enclosed by the already disposed `皇太子` candidate (2–5). The candidate remains accounted for as a denied title; assigning it to the earlier crown prince had created the false person link. Removing that link preserves all 1,813 scanner candidate accounts and all other source occurrences. The real candidate bytes are read directly as a test fixture and never altered. Synthetic test reviews establish only code behavior, not source approval.

Run both the unchanged V1 regression suite and the new real-edge suite:

```
node --experimental-vm-modules scripts/test-people-ownership-plan.mjs
node --experimental-vm-modules scripts/test-people-ownership-reclassification.mjs
```

The new suite requires the pinned real candidate at `data/people/generated/independent-identity-recovery/jinshu028-ownership-30e2e9-20261025/candidate.compact.json`, SHA-256 `a0d95a87a9db42ea48f83bcd35faec68406c7453e7ac3b1b8ca53e6d2a435155`. This ignored fixture is preserved by the host; it is not copied into the patch or granted publication approval.

## Reusing exact-baseline validation

V1 already exports `baselineApi`; source authors need not duplicate its VM loader. With `--experimental-vm-modules`, use the exported `api.p.buildPeopleExtractionPacket(book, chapter)` and `api.v.validateCompactPeopleExtraction(candidate, packet, {strictAliasDispositions:true})`. Source/config/schema/glossary/chronology reads come from the pinned commit. `api.read(relativePath)` returns exact baseline bytes. Parse raw compact artifacts with `JSON.parse` to preserve input-fingerprint property order; to reject duplicate keys first, call `api.d.parseCurationDriftJson(raw)` for validation and then `JSON.parse(raw)` for the production validator. The drift parser intentionally canonicalizes key order, so its return value should not be fed directly into the compact fingerprint validator. None of these calls writes a packet or canonical file.
