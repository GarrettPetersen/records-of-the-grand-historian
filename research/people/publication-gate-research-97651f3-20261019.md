# Publication boundary research — unapproved, not a release certificate

Reviewed staging revision: `97651f324e7995cf9d81a1709a2e8ad99fd35f34`.
Master revision observed: `e2a3f340d4e53aed243e989e8005007ba42d4f2b`.
This is research, not a proposed removal of any gate, proof of chapter
completion, approval of any chapter, or authorization to publish. Current
workspace has many independent uncommitted changes; use the pinned revision
when evaluating this note. Staging may move while this is reviewed.

## Observed publication bottleneck

At the pinned staging revision `scripts/lib/people-publication.mjs` requires
the entire catalog to be complete, including zero missing or legacy chapters,
date-audit pending chapters, proposed translation repairs, and unresolved
candidate blocks. `scripts/lib/people-site.mjs` disables its context otherwise;
`generate-static-pages.js` only renders chapter mention links with an active
context, while `scripts/generate-people-pages.mjs` skips the index and shards.
The `PEOPLE_SITE_PREVIEW` override is not a safe production substitute: it would
expose the incomplete catalog rather than qualifying only reviewed evidence.

On 2026-10-19, `https://24histories.com/people/` returned the home page, whose
canonical URL is `/`. The generated (historical local catalog) slug
`https://24histories.com/people/juqu-mengxun-6py5758g.html` returned HTTP 503.
`https://24histories.com/jinshu/129` contained the named mention in
`#en-s0001` without literal `a[data-person-id]` links. The reader script did not
contain the word `people`. These observations are on the older live deployment;
the slug came from a local generated catalog and is not proof of a current
canonical identity. The held chapter is not eligible to publish just to make a
test pass. Search, pages and backlink tests must be repeated on a genuinely
qualified projected chapter after deployment.

The post-merge master workflow 39186309487 completed successfully for master
`e2a3f34`. That is CI, not proof of deployment: live
`/data/progress/books/jinshu.json` still showed generatedAt
`2026-10-10T06:22:56.544Z` and marked 129's date audit `audited`, whereas the
merged master report marks it `research-blocked`. Recheck later rather than
attributing the old live state to the new build.

## Ebook omission gap

The pinned `scripts/generate-ebook.mjs` first calls the same globally gated
`loadPeopleSiteContext`; its product-scoped `assessEbookPeopleReadiness` cannot
activate when that context is inactive. The generator then sets
`ebookPeople = null` and records `qa.peopleGlossary.active = false`, producing
no people glossary or links. In `scripts/validate-ebook.mjs`, the inactive
branch rejects unexpected people files and links but does not, by itself,
require a glossary. Thus a successful general EPUB validation is not proof of
the requested glossary; no claim is made here about a particular EPUB or any
other publication gate. Product-specific release policy must explicitly require
the glossary when requested, and Jinshu must require every product chapter to
meet all gates before ebook release.

## Existing evidence adapters and limitations

- Rebuild the extraction packet and run `validatePeopleExtraction` or
  `validateCompactPeopleExtraction` with strict alias dispositions; this
  validates extraction, not whole-chapter independent editorial review.
- `dateAuditStatus` builds the date packet, compares semantic source and
  extraction hashes, validates report coverage and references. Its ordinary
  report check requires an independence boolean; this does not independently
  establish a reviewer conversation or external witness retrieval. Retained
  runner jobs/receipts may provide provenance, subject to current hashes and
  review; unsupported old approvals must not be assumed valid.
- `validateAppliedEditorialDecisions` checks retained applied proposal
  decisions and rejects a reviewer matching an identified extraction agent.
  `prompt-people-editorial-review.txt` covers proposed-repair windows; it is not
  automatically a complete independent editorial review of all chapter units.
- `loadValidatedResolutionDocuments` checks schemas, batch uniqueness and
  referenced local IDs. Resolution decisions do not intrinsically pin each
  extraction. Resolver dossier manifests do contain source-file fingerprints,
  but those separate scheduling artifacts are not automatically bound to every
  published decision. Candidate and decision freshness must be established
  against the exact current corpus; merely reading `curation.status` or the
  progress `glossaryState` cannot prove this.
- `validateCombinedReviews` in `scripts/lib/people-combined-curation-review.mjs`
  verifies stronger source-amendment-specific contracts: source/extraction
  hashes, reviewer identity comparisons, source-unit and other identity
  coverage, strict extraction, report validation, and protected dependencies.
  It depends on specific before/after contracts and does not itself certify all
  cross-corpus identity candidate decisions or serve as a generic full-chapter
  editorial certificate. Its input-seal model should be assessed for reuse,
  not treated as universal proof.

For a concrete retained example, tracked Shiji 064's combined-curation receipt
contains hash-verified embedded reviewed inputs; staging source, editorial and
date-report bytes match the receipt. Its current staging extraction has
semantic hash `sha256:01c41317e9e71e608a6f72f91da7e6d5e754bc303dac7659010374211b43b112`,
while its retained report and receipt bind
`sha256:b5280701ed91ffd06d5a60ca1cd5a9bfc63d8480c54982a639288713fd5cf1ec`.
That historical date approval is stale for the current extraction. Preserve the
receipt; do not restore old bytes or assert current approval from it.

## Implementation sequence and verification required

1. Define a fail-closed, immutable chapter qualification contract derived
   from fresh production validation, current source/extraction hashes, complete
   independent editorial coverage, audited date evidence and provenance, and
   current identity candidate/decision coverage. Bind all material
   dependencies, reviewers and authority to exact inputs; define how old
   evidence is reconciled. Check actual retained evidence before introducing a
   new receipt format; no booleans alone should manufacture independence.
2. Construct a separate publication projection from qualified source records,
   rather than filter already-aggregated canonical people. Rebuild preferred
   names, descriptions, facts, dates, claims, references, family edges,
   relationship targets, and identity merges using only eligible evidence;
   retain conservatively separated homonyms and do not expose unqualified
   snippets, redirects or claims. Address transitive merges, decision-source
   invalidation and stable canonical URLs explicitly.
3. Route chapter annotation, person shards, search, sitemap and progress through
   the same sealed projection. Route ebook content through product-specific
   qualified chapters and make the requested glossary a required release check,
   not an optional absent output. Keep incomplete source chapters and global
   coverage honestly labeled.
4. Add isolated deterministic tests for stale/changed source, extraction,
   scanner, vocabulary, evidence and decisions; missing or self-reviewing
   reviewers; incomplete unit coverage; pending repairs; disputed identity;
   transitive cross-chapter identity contamination; partial and interrupted
   outputs; and projection changes. Verify exclusions as well as inclusions.
   Then exercise actual chapter HTML, person HTML, all bidirectional references,
   indexed search, sitemap/robots, EPUB glossary and backlinks with a real
   independently qualified chapter. Verify full site CI, master merge and live
   deployment before claiming publication. Preserve active claims and recovery
   state throughout.

An isolated exploratory script in `/tmp/people-qualification.XriQ52l8` always
refuses publication and runs tests using the dirty working tree; it is not
production code and must not be staged as dead scaffolding.
