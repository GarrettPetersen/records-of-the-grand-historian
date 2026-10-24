# Independent review: publication boundary research

Reviewed `publication-gate-research-97651f3-20261019.md` against Git revision
`97651f324e7995cf9d81a1709a2e8ad99fd35f34` and read-only live observations on
2026-10-19 UTC. This is not chapter approval, a release certificate, or
authorization to change a gate or publish.

## Verified

- `scripts/lib/people-publication.mjs` requires catalog-wide zero blocker
  counts, and `scripts/lib/people-site.mjs` requires a publishable catalog or
  explicit preview to activate. `scripts/generate-people-pages.mjs` skips its
  page/search output when the context is inactive. Preview exposes the full
  incomplete catalog and must not be substituted for a qualified projection.
- `scripts/compile-people-catalog.mjs` `canonicalRecord` aggregates members'
  names, roles, life claims, fact claims, references and derived fields; its
  family graph is also compiled over the aggregate. Releasing a canonical
  record merely because one member's chapter passed does not exclude facts or
  excerpts from its unfinished members. Filtering references alone is
  insufficient; derived fields and relationship/redirect/search dependencies
  require provenance-aware handling as described in the research note.
- `scripts/generate-ebook.mjs` derives an inactive `ebookPeople` when the
  people context/product readiness is inactive. The inactive branch of
  `scripts/validate-ebook.mjs` rejects stray glossary/link files but does not
  require an otherwise absent glossary. This verifies the stated validation
  gap, not whether a separate release policy or actual ebook passed.
- `scripts/lib/people-corpus.mjs` `loadValidatedResolutionDocuments` checks the
  document schema, unique batch IDs and known local people; its loop does not
  compare decision-bound extraction fingerprints. This does not prove that no
  other workflow retains relevant hashes or that any specific decision is
  stale. `scripts/lib/people-editorial-decisions.mjs` compares identified
  reviewer and extractor agent IDs for retained proposal decisions, but that
  does not establish whole-chapter editorial coverage.
- Shiji 064's staged extraction semantic SHA-256 is
  `01c41317e9e71e608a6f72f91da7e6d5e754bc303dac7659010374211b43b112`;
  the staged report binds
  `b5280701ed91ffd06d5a60ca1cd5a9bfc63d8480c54982a639288713fd5cf1ec`.
  Each of the eight embedded receipt inputs hashes to its declared byte hash;
  the embedded source, editorial and date-report bytes equal the staged
  objects, while the embedded extraction does not. The receipt's embedded
  validation binds the report's old extraction hash. This independently
  supports the specific stale-approval warning, not a conclusion about the
  correctness of either extraction or any other chapter.
- GitHub workflow 39186309487 reports `success` at master commit
  `e2a3f340d4e53aed243e989e8005007ba42d4f2b`. At this check, the live people
  index served HTML with canonical `/`, the example historical slug returned
  HTTP 503, and Jinshu 129's `s0001` rendered its name without a person link.
  The live Jinshu progress document was generated `2026-10-10T06:22:56.544Z`
  and still described 129's date report as `audited`; this does not prove the
  post-merge revision was deployed. These are point-in-time observations, not
  an exhaustive site or search test.

## Qualifications

`dateAuditStatus` allows a partial non-audited report with partial unit, person
and item checks; *complete* coverage is enforced for `audited` reports. Thus
the research note's sentence that it "validates report coverage" should be
read with that status-dependent qualification. Date schema and checked
independence flags cannot by themselves prove substantive accuracy, reviewer
identity, or independent retrieval of external references. The preserved
Shiji receipt's hash consistency is likewise not a generic certification of
every source, reviewer or current cross-corpus identity decision.

`generate-progress.js` calls a chapter mechanically complete when it is
prompt-current, date-audited, has no proposed repairs, and has no persons
marked `needs-review`; this is not independent proof of the goal's whole-chapter
editorial, identity-freshness, actual publication, or ebook-output gates.

The proposed fail-closed sequence is consistent with preserving these gates;
it is a design direction, not an implementation proven safe. It must consider
current full-corpus candidate comparisons even while projecting only eligible
source facts, stable IDs and retired URLs, dependency-sealed reviewers,
positive and negative end-to-end tests, and a legitimate no-person chapter.
It must not manufacture approval by treating an absent proposal, an identity
flag, a preview or a narrow schema pass as sufficient evidence.
