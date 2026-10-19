# Independent check: Jinshu 025 combined incomplete artifact

Reviewer `/root/curation_path`, 2026-10-19 UTC. This is an artifact integrity
and bounded validation check, not a date audit, complete source/identity
review, curation receipt, or chapter/publication approval. I did not write
canonical data, touch the index, claims or locks, create a checkout, or delete
recovery artifacts.

## Final artifact pins

- Materializer SHA-256: `ef7748b2a2d2ded8de98ffcaa0de400b9b3785cc9da8dfb67efac74719026c10`.
- Incomplete manifest SHA-256: `a85821f5b87f4848b0354aca6dd5b4c144189930501b6fb2373a49baaf33dc43`.
- Source SHA-256: `2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`.
- Candidate SHA-256: `ee2528391c5ac3daa3b675c517f7701903925abd699131c9e5b10e9d83a0564c`.
- Merged editorial history SHA-256: `e71d9ff6edc7067b90e11e2b35c8cbe16467203cdb0fa92536d043d0cfd11c2c`.

I independently verified each saved output's bytes and digest against the
manifest. Parsed candidate contents exactly equal the prior retained Shi Hu
partial candidate plus the two reviewed s0544 applied rows; no other candidate
field changed. The new source bytes exactly match the earlier partial source.
The two merged v4 review records exactly equal the original staged v3 history
and the new independent v3 component after removing their outer scope fields.
An altered unrelated candidate field fails the comparison. The original source
and editorial history pins were independently checked in the companion s0544
component review.

The saved candidate and history are equivalent to the inputs validated in the
staging-pinned `jinshu025-s0544-editorial-current-staging-test-20261019.mjs`:
strict compact extraction and applied editorial decisions passed, preserving
the earlier review; see the companion independent component review for counts
and the negative decision-reason test. `git diff` showed no change in scripts,
relevant schema/config inputs, source, or old editorial file from validation
revision `e02a499df802b8c0eaa8f5cf9f06397c397fad11` to staging
`1a84c9f3ef6c1993ce76e50f3121a581f852f1bc`. This does not prove unrelated
inputs or future staging revisions unchanged. Local installed dependencies
were not independently pinned.

With the final materializer and the existing 16-file staging fixture, invoking
the materializer against its already-existing destination failed with
`Refusing existing destination` before any output write. The script also uses
exclusive file creation for new outputs. An interrupted first creation can
leave a partial directory; preserve and investigate it rather than deleting or
overwriting it. The production workflow remains host-owned.

The candidate contains 22 explicitly unresolved temporal claims. I requested a
clarification to the earlier manifest wording; the final manifest and generator
now both explicitly state that unresolved flags cannot pass date approval and
require resolution or accurate source-supported reclassification. Reclassifying
solely to pass validation is not supported. Full independent source/identity
coverage, a fresh complete independent date audit, author/reviewer independence
(including the original Grok Bot chunks with null IDs), protected seals, exact
claim/workflow ownership and receipt, identity resolution, and publication,
search, backlink and ebook checks remain outstanding.
