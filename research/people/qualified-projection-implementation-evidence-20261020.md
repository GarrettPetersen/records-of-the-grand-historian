# Chapter-qualified projection: implementation evidence, not authorization

Inspected staging `2a99c0e7a5dad39b1bcb93920b0549ef3d5bec4d`. The
checkout copies of the compiler, corpus loader and resolver match that revision;
the compiler self-test passed. No chapter qualification or publication was
performed. Real, current full-chapter editorial and decision-freshness evidence
must be established before a production projection is authorized.

## Integration boundary

`loadValidatedPeopleCorpus()` constructs local people with chapter-scoped
claims and mentions. `compilePeopleCatalog()` constructs the candidate graph,
resolves identities, aggregates records, derives family edges and builds the
site index. It is the appropriate place to split *analysis* from *rendering*:
analyze identity candidates over the validated full corpus first; then build
public records afresh from the eligible local members, rather than filtering
the aggregate `catalog.people`. A subset candidate scan alone would miss
same-name candidates in excluded chapters and cannot certify identities.

The qualification input must be the result of checking current source and
extraction, complete independent editorial coverage, the independent date
report and full-corpus identity decisions against sealed dependencies. The
existing applied-repair history is not a full editorial attestation; the
existing resolution schema does not itself bind extraction hashes. These are
missing evidence contracts, not flags to set or omissions to ignore. Recompute
qualification after a dependency changes and make no candidate eligible merely
because it lacks a repair or unresolved block.

## Identity and reference hazards

An executable synthetic test with the actual resolver established that A–B
and B–C merge decisions produce one full-corpus cluster; if B is omitted, the
original decisions fail on an unknown local person, whereas discarding them
leaves A and C in separate clusters. Thus a projection must not bridge through
unqualified B, carry a multi-person decision or canonical pin without its
qualified evidence, or infer retired redirects from the full cluster. Fresh
source-backed decisions can instead establish a valid direct merge. The public
URL/redirect policy must preserve already published identity history without
redirecting through an unqualified or newly disputed identity.

`rewriteLocalPersonRefs` fails for a recognizable unresolved local-person
reference, while family-edge compilation demands actual projected targets.
Cross-scope identity claims and relationships therefore need an explicit,
reviewed dependency policy; don't silently retain a target, drop evidence, or
publish a dangling link. Curation overrides (including preferred description,
name and slug) also need evidence and scope checks: filtering overrides by ID
alone does not prove their text is supported by eligible members. Derived
names, life claims, descriptions, assertions, inverse relationships, snippets,
search and redirects must all be built from the same qualified projection.

## Atomic publication

The CLI currently calls all three `writePeople*` functions **before** testing
`--require-resolved`. A failing invocation can thus replace generated output
before reporting failure. Produce and validate an isolated generation, then
commit a single generation manifest last; never repoint live consumers midway.
Use one generation identity across catalog, site index, HTML, search, sitemap,
progress and ebook. Maintain honest full-corpus coverage separately from the
projected publication count. Explicitly support a qualified chapter with no
named people; `peopleCatalogIsPublishable` currently requires at least one
person, so globally flipping `complete` is neither a safe nor sufficient fix.

## Required verification before integration

Test positive and negative chapter qualifications using genuine sealed input;
stale source, extraction, reviewer, date, vocabulary and decision dependencies;
full-corpus unresolved candidates; the transitive bridge above; a qualified
family reference to an excluded target; unqualified curation; ID/redirect
stability; no-person chapters; mixed included/excluded claims; and failure
before manifest commit. Exercise chapter links, page snippets, search, sitemap
and EPUB links against an actually qualified chapter before deployment. The
resolver fixture and compiler self-test alone do not establish any of these
publication properties.
