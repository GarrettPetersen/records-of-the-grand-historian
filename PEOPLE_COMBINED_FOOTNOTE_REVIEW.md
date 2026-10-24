# Reviewed footnote additions in combined curation

This contract is for adding a reviewed footnote to an English translation as
part of an otherwise fully reviewed combined-curation source amendment. It does
not support standalone publication, replacing or deleting notes, changing
Chinese, or changing translation metadata. The usual new independently reviewed
translation repairs and every existing publication gate remain mandatory.

Build the contract over the source *after* replaying approved translation
repairs and before adding notes. Use `documentHash` from
`scripts/lib/people-combined-curation-review.mjs` for the two parsed JSON
documents and for the contract itself. Those semantic JSON hashes do not replace
the source and artifact **byte hashes** protected by the normal review seal and
receipt. In particular, footnotes do not enter the extraction or date packet
fingerprints; the exact source-byte seal is essential.

Put the following object in `materialization.sourceFootnoteContract`:

```json
{
  "schemaVersion": 1,
  "kind": "english-footnote-additions",
  "book": "BOOK",
  "chapter": "NNN",
  "authorAgentId": "actual-author-id",
  "beforeSourceHash": "sha256:...",
  "afterSourceHash": "sha256:...",
  "additions": [{ "unit": "s0001", "text": "Exact reviewed footnote." }]
}
```

Each unit must have a unique ID and exactly one English translation with
nonempty literal or idiomatic text and no existing `footnote`. The replay
adds only the specified field. Add the actual footnote author to the declared
author IDs; all source, extraction, repair and footnote authors must be excluded
from every reviewer, including editorial reviewers. Do not substitute a guessed
identity where authorship is unknown.

The complete independent identity reviewer must explicitly perform and document
an editorial review of each proposed note. Set its
`sourceFootnoteReviewKind` to `independent-editorial-footnote-review` and its
ordered `sourceFootnoteChecks` to one object per addition:

```json
{
  "unit": "s0001",
  "text": "Exact reviewed footnote.",
  "verdict": "supported",
  "reason": "Explain why the exact note is supported by the cited evidence.",
  "sourceQuote": "exact quotation from this source unit",
  "referenceIndexes": [0]
}
```

Each zero-based index identifies a reference in the identity report's existing
`references` array. Use the normal date-review reference schema. The normal
combined reviewer validates reference structure and local citation freshness;
an external quote's hash proves only the quote's recorded bytes, not that the
external witness or its interpretation is genuine. The independent reviewer
must actually consult the witness and assess the note. Input records must not
pretend a synthetic or provisional review is an approval.

Set `sourceFootnoteContractHash` to `documentHash(contract)` in both the
identity and date reports' `reviewContext` objects, the validation document,
and the input seal. The existing review seals must protect the exact materialized
contract and both before and after source bytes. If the contract or any source
changes, obtain fresh reviews rather than regenerating approvals.

Offline tests:

```sh
node --test scripts/test-people-combined-footnote-review.mjs
node --test --test-name-pattern='old no-footnote|reviewed footnote validates|combined review rejects footnote author|combined review rejects reference source|combined review rejects same-chapter|combined review rejects unreviewed|combined review rejects date review' scripts/test-people-combined-footnote-integration.mjs
```

Run the full combined-curation regression suite as well before adopting this
change. Preparing or verifying a receipt does not itself publish a chapter or
prove that its human/model review is truthful or that all remaining gates pass.
