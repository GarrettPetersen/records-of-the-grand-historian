# Partial-publication evidence slicing prototype — incomplete

This is research, not an eligibility decision, a publication implementation,
or permission to expose any person record. Publication gates remain unchanged.
The compiler, corpus loader, resolver, and candidate-builder used for this
experiment match staging revision `e05f6c66e23741d4f5079e1e04c27f7e2f997490`.

## Artifacts and replay

The prototype source is `scripts/lib/people-evidence-slice.mjs` and its offline
test is `scripts/test-people-evidence-slice.mjs`. Replay with:

```sh
node scripts/test-people-evidence-slice.mjs
```

If these artifacts are archived under research paths, copy them into those
script paths in a suitable checkout before running: the test imports the
repository's actual compiler and the prototype using script-relative paths.
The test builds synthetic normalized-extraction-shaped inputs, exercises the
actual `compilePeopleCatalog` before and after slicing, and confirms that an
excluded member's unique alias, description, chronology and chapter backlink
do not appear in the sliced catalog or chapter index. It also checks an
excluded transitive identity bridge, source-input immutability, honest missing
coverage, nested excluded references and hints, foreign evidence, unknown
person IDs, malformed coverage, duplicate chapters and people, invalid claim
subjects, and contamination of the caller's precomputed local-person map.

The prototype reconstructs local-person data from selected normalized chapter
extractions before aggregation; it does not filter canonical records after the
fact. It rejects references to omitted local people and foreign claim evidence.
It does not accept or select resolution decisions or curation overrides.

## Real input and independent review

The source and extraction for Jinshu 053 matched the staging revision above.
An additional read-only check built its current packet, validated its expanded
or compact extraction using the appropriate existing validator, and sliced
the normalized result: 71 local people, 541 claims and 516 mentions. This is a
compatibility check only; it does not establish 053's editorial, date, identity
or publication readiness.

An independent reviewer checked the exact prototype against staging's actual
compiler/corpus/resolver interfaces, ran the test, and separately exercised
nested cross-boundary references, excluded hints, unknown IDs, foreign evidence,
bad coverage, duplicate chapters/people, invalid subjects, contaminated
precomputed local-person data and clone isolation. The reviewer approved the
limited nonintegrated prototype scope, not public release.

## Remaining work before any integration

The caller-supplied chapter selection is not an approval. Source/extraction
fingerprints and independently reviewed editorial/date/identity evidence must
be checked. Candidate comparison must cover the current full identity
universe, including excluded chapters; a reduced graph is not a valid gate.
Reviewed merge decisions, eligibility freshness and trusted identity provenance
need a separate verifiable boundary. Stable public IDs, slugs and redirects,
eligible cross-person relationships, atomic generation, snippets, search,
sitemap, structured data, backlinks and ebook contents remain unsolved and
require end-to-end tests. In particular, do not feed this slice directly into
production publication or present its catalog as an approved snapshot.
