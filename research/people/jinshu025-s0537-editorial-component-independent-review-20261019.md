# Jinshu 025 s0537 editorial component: independent bounded review

Reviewer: `/root/seal_materialize`, 2026-10-19. This review concerns the
editorial component and its reproducible replay only. It is not an accepted
curation receipt, a chapter-wide source/identity/date review, or publication
approval.

## Evidence and verdict

I inspected `jinshu025-s0537-editorial-component-date-remaining-20261019.json`
(SHA-256 `f3a72bc5e2b3390103f10b9458fbf826c2e2d21ab3b2ed6b9eef86970871b81f`)
and its applied rows (SHA-256
`bd624e1476d9486b70a9827e99e6f81e0073f157f750040e5a0765172d73313d`).
The component has two accept decisions, each citing the exact Chinese s0537
unit. The old strings match the retained three-date candidate's source and
the new strings match the previously reviewed proposal and saved provisional
source. Read with s0536, the subject of 佩之 is the seal; s0537 distinguishes
wearing, later naming, and joint imperial treasuring. Neither replacement
asserts the sword was acquired by Gaozu or supplies a date. The source witness
is accurately transcribed. The applied rows preserve both decision reasons.

Rerunning `test-jinshu025-s0537-editorial-component-20261019.mjs` with the
e02a staging loader and the 16-file fixture validated the component against
the pending proposals and original packet. The exact two field replacements
replay to the saved amended source; merged history preserves both prior
reviews. The resulting candidate, with the two applied rows added, passes
the staging strict compact validator (607 units, 683 candidates, 173 mentions,
448 claims, eight repairs, no alias conflicts) and applied-decision history
check. Changed proposal fingerprints and lost applied-review reasoning were
rejected. The source-alteration check is an equality control, not a separate
demonstration that the editorial validator detects every possible alteration.

The component attributes its review to `/root/025_date_remaining` and its
own decisions independently address the two proposed strings. The host
reports that `/root/seal_editorial` wrote the earlier proposal and
`/root/seal_editorial_review` separately adjudicated it; do not attribute
that earlier adjudication to this component's reviewer. This record alone
does not establish the identities or independence of legacy extraction chunks
whose agent IDs are null. That provenance remains a separate gate.

The replay is in-memory only: the saved provisional candidate and history
still lack these applied rows and merged history. A host-controlled,
fingerprint-bound materialization and curation receipt must perform that
step; do not call these partial files editorially closed. Independent review
of the exact final source and extraction, remaining date holds, fresh
independent complete date audit, identity resolution, publication/backlink
and ebook verification also remain required. No canonical files, shared Git
index, queue, claims, locks, or worktrees were changed for this review.
