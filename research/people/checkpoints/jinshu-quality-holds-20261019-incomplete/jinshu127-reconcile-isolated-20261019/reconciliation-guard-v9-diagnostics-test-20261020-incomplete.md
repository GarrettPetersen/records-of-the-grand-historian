# V9 diagnostic-only reconciliation: research artifact

Patch `reconciliation-guard-303b4e0-review-v9-diagnostics-only.patch` has
SHA-256 `01f50ded622b966ee8d98707531d50c4301b85d7e14770fe40d96a1db8677690`,
is based on `303b4e0fe883d4d305d84987b656322a91e5c3a4`, and passed
`git apply --cached --check` on a separate temporary index. V8 remains
unchanged; neither patch is deployed.

An independent v8 review found that the analysis result exposed a complete
reconciled extraction which could pass strict validation if its outer
`analysisOnly` marker were discarded. V9's separate analysis entry point never
returns an extraction, regardless of whether questions exist. It returns only
the unscanned question packet, unresolved candidate IDs and span summaries,
plus non-schema diagnostic summaries of mention surfaces, claim evidence and
disposition reasons. These summaries are for inspection and do not supply the
fields or geometry of a publishable extraction. Its arguments remain
unmodified. The normal CLI continues to fail closed on unresolved questions
and untrusted review replay.

Tests explicitly check that no `extraction` property is returned, and that a
serialized diagnostic result with its `analysisOnly` marker removed is not a
valid extraction, both with and without unscanned questions. The original CLI
self-test passes while asserting the same six unresolved candidates and two
unscanned `Prince of Anping` questions; it invents no approvals. The four
focused offline suites pass 40 tests, including real-chapter mixed export,
zero-case export, refused replay, and no writes to the protected data tree.
The chapter fixture test is explicitly pinned and restricted to its
script-only directory.

This is not an independent review of v9, a complete coverage proof, an
authenticated review dispatch/replay mechanism, or chapter completion. All
editorial, date, identity, validation and publication gates remain in force.
