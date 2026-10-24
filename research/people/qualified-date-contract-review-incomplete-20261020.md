# Independent review: qualified chronology prototype

Disposition: **not approved for production**. This is research, not an audit or a
chapter-completion decision. Baseline reviewed: staging commit
`89296b9f9da8683bcd807c78b0cf27f94d129865`. Prototype SHA-256s:

- `qualified-summary.mjs`: `210208b8f76a3b37d91d1ba3285b0ddc970a0eab91fe312aab67e3306cfedeeb`
- `test-qualified-summary.mjs`: `349eea2ec914fbd48d9f6a7ee21dc806b16f2d0164e7224c18e8d5ffef80573b`

The test imports the shared checkout's libraries, not pinned Git blobs. The
checkout's presentation module matches staging; the date-values module has
local formatting differences. Results below therefore reproduce the behavior
of that checkout, while the quoted production call paths were inspected from
staging blobs. No worktree, canonical edit, claim or lock was changed.

## Blocking findings

1. `dateQualification` is not an accepted attestation/date-context field in
   `validateAttestationClaim`; the date repair workflow also restricts
   `date-context` keys and date field ownership. The fixture omits mandatory
   `sourceDate`, so it is not a valid production-shaped extraction claim.
   Adding the field only in display code cannot make this data publishable.
2. `certainty` and an arbitrary qualification key are the only conditions
   recognized by the prototype. Existing `unresolved` and `unresolvedReason`
   are ignored. An explicit AD 100 attestation with `unresolved: true` and a
   reason conditional on another source renders `Attested AD 100` without
   that reason. An uncertain claim with only source date and unresolved reason
   silently becomes `Dates uncertain`. Importantly, the date audit correctly
   refuses approval if *any* temporal container remains unresolved; using
   unresolved as an approved qualification would weaken that gate.
3. Ordinary claims fall through to the existing summary logic unchanged.
   `death onOrBefore AD 100` plus `attestation AD 200` produces
   `First attested AD 200; died on or before AD 100`: an impossible life
   chronology. This arises because an upper-bounded death lacks a sortable
   `deathSummary`, leaving infinity as the comparison threshold. Conflicting
   claims should remain independently reviewable, not be silently deleted or
   fused into a coherent chronology. The prototype cannot solve this by
   passing the relevant claim to the old summarizer.
4. The Jinshu 025 p047 candidate stores `onOrBefore AD 13` in an uncertain
   attestation with event text `outside-knowledge conversion`. The factual
   conditional premise is outside the claim. `uncertain` alone does not say
   *what assumption* produces the bound, and the qualification fixture's
   unrelated explanation does not bind this actual claim. It remains an
   incomplete noncanonical candidate.
5. Date claims with no formatable numeric label are dropped, including
   qualitative or source-date-only statements and reasons. The presence of a
   conditional claim also alters age filtering; this must be tested with
   unrelated ages, related conditional ages and deaths, same-unit evidence,
   and no birth inferred from uncertain premises. Claim certainty applies to
   the whole assertion; a textual variant is not automatically a date variant.
6. Raw URLs and unit IDs in one summary string are not an adequate provenance
   contract. Existing detailed page evidence is rendered as passage links, but
   the EPUB entry renders only this summary plus mention excerpts. A link or
   excerpt needs an unambiguous binding to the exact qualified claim and the
   supporting interpretation, including external research where necessary.
7. Fixing `personLifeSummary` alone is insufficient. The summary is consumed
   by cards, family charts, JSON-LD descriptions, people search data, and the
   ebook. Person-page description is sliced at 220 characters, which can cut
   off a trailing caveat. In addition, `representativePersonYear` drives browse
   periods and `personCoherentActivityClaims` filters detailed claim lists;
   both currently consume claim dates independently of the prototype. They
   must not classify or hide claims as though conditional dates were certain.

## Recommended contract and verification

An explicit, structured, claim-bound qualification can be viable if it
states the actual premise and event scope, identifies source passages and
reviewed external research with stable hashes, and survives full and compact
extraction, normalization, date-repair proposals, immutable fingerprints,
independent audit and catalog deduplication. Treat any schema change as a
versioned data-contract change; validate exact qualification fields, references
and conflicts, fail closed for malformed data, and preserve current stale
approval behavior. A separate independent source audit must establish that a
qualified claim, rather than merely its referenced material, is defensible.
The reviewer must distinguish a date conditional on source tradition from an
unknown conversion and avoid attributing certainty to either.

Presentation should consume a structured set of independently labelled claims
with their own source and assumption, not flatten qualified and ordinary facts
into one inferred life range. Keep an ordinary well-supported date visible;
do not globally suppress dates because one claim is uncertain. Preserve an
undated source assertion and its limitations when no Western date is justified.
Offer compact contexts a safe self-contained label or omit only the unsafe
numeric assertion; never cut its caveat away. Detail pages and ebooks should
render visible claim-specific provenance, with validated/escaped links and
offline-usable citation text. Any API/version approach must be tested through
actual generation from an extraction, not a hand-built canonical fixture.

Minimum focused tests: compact/full extraction round trip and unknown/malformed
qualification rejection; repair field preservation and independent audit plus
stale hashes; exact BC/AD, no-year-zero and bounds geometry; contradictory
dated activity and death; mixed exact/conditional/qualitative/undated facts;
claim-local certainty and independent age/death inference; retrospective versus
personal activity; cross-chapter merge/deduplication; source reference/hash
integrity and unrelated, missing or hostile URLs; no qualification leaks or
truncation in meta, JSON-LD, search, family chart, browse periods, page fact
lists or ebook XHTML; ordinary unqualified output remains intact. Verify each
case against expected historical semantics, not just byte matching. Run the
existing extraction, date-audit, people-site and ebook-readiness tests on exact
staging-pinned code, followed by an end-to-end scoped artifact test; do not run
a full build while disk remains below the repository's reserve.
