# Independent materialization check: Jinshu 025 s0537

This is a bounded check of `/root/date_plan_review`'s saved partial output and
materializer, **not** a date audit, curation receipt, identity decision, or
chapter approval. I authored the scoped s0537 decision component; therefore
this check is independent of the materializer, but is not a second independent
editorial assessment of my own decision. Separate source adjudication and the
component's independent review are preserved in their existing reports. Historic
null extraction/chunk IDs do not establish reviewer independence.

## Exact artifacts

- Materializer SHA-256: `989ae5430a4a752f343f0ae91e962fcc25aca3a26b1084bfb770797f7607ee7f`.
- Saved `source.json`: `02c4c78e636051d3e81397d696443984f3963ebaad881805befcc60a92c6be78`.
- Saved `candidate.json`: `b7057ccb80b2fa13e83047bc18a3d6000baa0760055ea5a23170708e28b617b4`.
- Saved `editorial-history.json`: `a2f590d7cd367d4293b69ae00cddbd4e3c1c105981c1ff845a60e493db841530`.
- Saved `manifest.json`: `ddfb85d867a64a6937c8da18b1e193b95615a8e87b5e34e4d3cc6e8cbbd4e601`.
- Saved `INCOMPLETE.txt`: `6837c03115f8e2c13b687200d863dc448d22bafe952eee4961e61918d6cb71ec`.

I separately read the actual output files and verified all manifest output
hashes and byte lengths. Starting from the exact pre-edit source, applying only
the two component translations in memory produced the entire saved source,
not merely the target unit. The saved compact extraction contains the exact
two applied rows; removing them reproduces the complete provisional extraction.
All 448 claims equal the prior three-date-holds candidate, including previously
revised rows 161, 162 and 195. Both prior editorial reviews are preserved, and
the third review's input, reviewer, proposals, decisions and claim-change arrays
match the component. These comparisons do not independently endorse the prior
chronology revisions.

## Validation and negative checks

I reran `test-jinshu025-s0537-editorial-materializer-20261019.mjs` using the
`e02a499df802b8c0eaa8f5cf9f06397c397fad11` Git-pinned script loader and the
existing separate 16-file fixture at `/tmp/combined-history-bytes.Aqa9Xm9K`.
The materializer verified the fixture bytes against the revision; the test
reproduced the saved output, rejected changes to each of seven pinned inputs,
verified unchanged prior reviews, and confirmed a second invocation refused the
existing destination without changing its candidate hash. The materializer
validated the pending review, merged history, applied decisions and strict
compact extraction: 607 units, 683 candidates, 80 people, 173 mentions,
448 claims, eight repairs, 528 dispositions and no alias-disposition conflicts.
The local Node dependencies were not independently version-pinned.

At observation, staging was `c149b40dd30b3692bfea7f1cdd19e9b40636e5a1`;
`git diff` showed no changes from the validation revision in scripts, packet
schemas/configuration, chronology, glossary, chapter source, or the named
editorial decision path. Recheck against the live remote before any canonical
action. The output remains explicitly incomplete: 19 temporal claims still
contain unresolved flags, and the original sticky ownership, canonical receipt,
fresh complete independent date audit, identity review and publication/ebook
gates remain outstanding.
