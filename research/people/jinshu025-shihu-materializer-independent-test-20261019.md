# Independent materializer check: Jinshu 025 Shi Hu

Reviewer `/root/jinshu025_hold`, 2026-10-19 UTC. This is a bounded check of
the noncanonical partial artifact, not a chapter, editorial, date, identity,
publication, or ebook approval. No canonical file, Git index, claim, lease,
or lock was changed.

The input is `jinshu025-unapproved-partial-scanner-reconciled-20261019`.
The materializer requires the exact input byte SHA-256 values
`2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`
for source and
`1c2fd4ede2d8804d1c26d5abea80c0a1027e85f19e52b1b54adf5974e7340fef`
for extraction. It checks the complete original attestation and death rows
for p076, then replaces only their value objects. The output source retains
the same bytes; the saved output candidate SHA-256 is
`a67293ef781c9e7f30451c2a3d4398a7822f41e62c0cf8ae76070e2bc4a6a438`.
Both values identify the death, use the same undated local source expression
and AD 349 conventional year, mention the contradictory Taihe 6 reading and
the collation's Yonghe 5 emendation, and explicitly avoid dating the seal's
later return. No other parsed extraction fields change. The source wording
and attributed collation have separately been reviewed; the external source
citations still require fingerprint-bound reference records in the fresh audit.

I ran `jinshu025-shihu-partial-materializer-test-20261019.mjs`: its saved-output
integrity and exhaustive parsed-field comparison passed, modified input-byte
controls were rejected, and a second invocation refused to overwrite the
existing artifact. The staging-pinned validator at
`425d98d465c0873db29c887f6650dd90e0837bf1` passed strict alias-disposition
validation: 607 source units, 681 candidates, 80 people, 173 mentions,
448 claims, 528 dispositions, zero alias-disposition conflicts. The harness
uses a small 16-file temporary reference fixture, not another checkout.
Installed Node dependencies were not separately pinned by this check.

I also reran `jinshu025-shihu-review-harness-20261019.mjs`: the proposed
candidate passed; controls changing the explicit death year alone or
attributing a father's death to the subject were rejected. Live staging was
`30f1550ddfb03534f3a25c734adee80a21825197` on inspection; the relevant
`scripts/`, schema, config, role vocabulary, chronology and glossary inputs
had no changes versus the validator's pinned `425d98d` revision.

The candidate is based on amended editorial/scanner inputs and remains
unpublished. The independently accepted curation receipt, complete independent
date audit on the exact final source and extraction fingerprints, unresolved
research holds, identity, publication and ebook gates are still required.
No test here grants permission to alter sticky ownership or canonical inputs.

The local artifact depends on its exact scanner-reconciled input
`jinshu025-unapproved-partial-scanner-reconciled-20261019/{source.json,candidate.json}`,
the materializer and its test/loader, the staged validator revision and its
configuration, and the retained review/candidate evidence. These inputs are
not bundled or published by this report; the output by itself is not a
reproducible or independently approved handoff. The accepted source/scanner
curation receipt and fresh date-audit report with hashed external references
are not yet present. Preserve the ignored artifacts rather than cleaning them
as completed work.
