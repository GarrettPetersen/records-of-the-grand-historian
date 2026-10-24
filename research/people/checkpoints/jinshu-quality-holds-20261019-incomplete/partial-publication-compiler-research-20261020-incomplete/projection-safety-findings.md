# Chapter-scoped people publication: staging evidence and missing gates

Research only; not a publication artifact or proof that any chapter is ready.
Base: `22a5d92fb6925a5a4dcf40a6471d5516c22213cc`.

## Executable counterexample

`node scripts/test-projection-contamination-research.mjs` compiles a synthetic
two-chapter corpus using the actual staging `compilePeopleCatalog`. A merged
canonical person associated with 001 contains the additional alias, date,
description, and source backlink of 002. The test's selection by 001 retains
all of those 002 values. This is not a source review or approval for either
chapter. It proves that selecting whole canonical records by membership in a
chapter cannot guarantee publication contains only eligible chapter content.

## What the production data does and does not establish

* `loadValidatedPeopleCorpus` builds fresh extraction packets and runs the
  structural validator, but its normal calls do not set
  `strictAliasDispositions`. Extractor-completed flags and absence of pending
  proposals do not, by themselves, establish independent editorial review.
* `dateAuditStatus` validates reports against fresh source/extraction hashes
  and reference currency. It establishes the current date audit status, not a
  whole-chapter review of all identities and non-date claims.
* `buildPeopleSiteIndex` records each chapter's mentions and date-audit
  status but not the chapter's extraction/source fingerprints, review
  components, or independent identity/source/claim approval. A matching
  generation timestamp and counts alone do not bind inputs.
* `resolution.schema.json` stores local IDs and decisions but no reviewed
  extraction fingerprints or reviewer identity. `loadValidatedResolutionDocuments`
  checks schema and local IDs; source-change invalidation is performed by
  specific host mutation paths, not proved by the decision documents alone.
  Therefore a resolver snapshot needs independent current-generation binding,
  including all participants and all decisions that support a cluster, before
  it can certify a publication projection.
* Canonical names and roles have `claimRefs`; some deduplicated facts have
  merged `claimRefs` and `evidence`. `canonicalRecord` chooses description,
  historicity, identification, preferred name and slug from mixed members or
  overrides. In particular description text may come from a member's
  `descriptorSuggestion`, while its recorded refs are all role-claim refs;
  these refs do not prove the description's originating member or entailment.
  Filtering arrays after compilation therefore cannot reliably recover the
  source of all presentation fields. Family inverse edges, retired IDs and
  references add more cross-chapter dependencies.
* Some newer combined-curation workflows have rigorous hash-bound independent
  identity/date reports, reviewer checks and source-repair replays. Their
  availability and successful verification for one candidate does not imply
  that every already-extracted chapter has such a durable completion receipt.
* Progress's `glossaryState: current` is derived from current prompt version,
  date status, proposed repair count and unresolved-person count. It is not an
  explicit fingerprint-current independent review of every accepted claim or
  proof that individual pages, backlinks, search, and ebook output were checked.

## Required supported construction before implementation

1. Define a host-generated eligibility result for each explicitly selected
   chapter, bound to exact current source, extraction, extraction protocol and
   independent editorial/date/identity evidence. Reject missing, stale,
   malformed, failed or ambiguous components; a boolean supplied by the caller
   is not evidence. Use existing exact replay validators where applicable and
   preserve legacy artifacts until they are actually verified. Do not infer
   approval from empty proposal arrays.
2. Build or verify an identity-resolution generation covering all relevant
   candidate pairs, including mixed eligible/ineligible participants, and pin
   the source/extraction generation of every participant and decision. A
   merged cluster is publishable only under a current reviewed merge path;
   keep reviewed ambiguity separate and do not guess around unresolved pairs.
3. Recompile publication records from eligible source-backed local members and
   reviewed, current identity links rather than copying full canonical records.
   Recompute preferred name, slug, descriptor, roles, life facts, chronology,
   references and relationships with provenance; if a curated presentation
   value cannot be supported by selected evidence, fail closed or choose an
   actually supported value. Reconcile historical IDs/redirects deliberately.
4. Generate person shards, chapter backlinks, search, JSON-LD, sitemap and
   ebooks only from the same immutable, verified projection generation. Check
   all person references, redirects, relationship targets and source anchors,
   and enforce stale-input rejection immediately before publishing. A preview
   or count-based catalog must never be promoted by simply changing a flag.

## Required negative tests

Change one source byte, extraction fact, review report, identity participant,
candidate set, resolver decision or source reference after approval: reject the
projection. Exclude a chapter in a merged cluster and ensure its unique alias,
descriptor, dates, relationships, source excerpts and terms are absent from
all pages, search data, structured data, sitemap and ebook. Reject a relation
to an omitted person unless both endpoints and its supporting claim are in the
projection. Require stale person URLs to resolve only to a current projected
target. Exercise positive current reviewed chapters, reviewed ambiguity, empty
but independently reviewed proposals, compact and expanded extraction, and a
genuinely fresh re-audit. Check real generated outputs, not only helper mocks.
