# Ebook people-glossary check: scope and remaining release blockers

Research and code-review record, 2026-10-19 UTC. This is not a release
certificate. The comparison base is staging commit
`cb7107e7182f2692e3a137fdf47c2839e2edebbc`.

The combined `ebook-qa.mjs --require-manual-signoff` path now requests the
`validate-ebook.mjs --require-people-glossary` structural check. That check
rejects an absent, inactive, preview, or structurally malformed readiness
report and retains the existing EPUB index, entry-count, links and snippet
checks. Preview and signoff options cannot be combined. Normal draft QA can
still validate an ebook without a glossary; that result is not release proof.

This is only a necessary check. An independent review identified that the
readiness report is editable and a relabeled preview can claim readiness
without proving current source, date, editorial or identity qualification.
The existing standalone `validate-ebook-manual-qa.mjs` checks human signoff
and does not invoke this structural validator. Neither route independently
certifies provenance or current chapter gates. Do not use this change alone to
release a book. A qualified projection tied to source fingerprints, actual
chapter approvals and the packaged EPUB is still needed, including explicit
handling for genuinely person-free chapters.

The staging catalog's publication gate remains corpus-wide:
`peopleCatalogIsPublishable` requires every global blocker count to be zero.
`loadPeopleSiteContext` therefore leaves chapter links, person pages and ebook
glossaries inactive while unrelated chapters remain unfinished. Simply
activating preview or filtering canonical records after aggregation is unsafe:
claims, aliases, derived facts, relationships, excerpts and redirects can
incorporate unfinished chapters. See the independently reviewed
`research/people/publication-gate-independent-review-97651f3-20261019.md`
for provenance and identity-freshness constraints.

Verification performed: `npm run ebook:people:self-test`, syntax checks, and
conflicting-option checks. A real previously generated Jinshu EPUB was rejected
as a preview by the structural validator; it also failed many independent
source-alignment checks because it predates local source changes. No EPUB was
built, no chapter was declared complete, and no public deployment was made.
