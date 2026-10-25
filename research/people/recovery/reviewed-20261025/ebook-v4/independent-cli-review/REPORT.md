# Independent V4 digest and full CLI review

Exact base `81240df60b45d748f7b951c41810ef8cac9c7a3d`; exact patch SHA256 `b3e6b9b0ca7f6a50eb066f88e2f6cb58f5b0a03a8a9d560323e7d38d140e2d9a`; exact digest module SHA256 `11d0a3f532a35b3924e751b50ead8be4224dacfda9b5ed14515a7457e5d5f722`.

This is a fresh independent V4 execution, not an inherited V3 approval. All 14 envelope file/base hashes and exact patch hash verified. `reviewed-hashes.json` records pins and exact V3 comparison. All compiler/generator/qualifier/source/verifier/editorial runtime code is byte-identical to V3 except `peopleDigest`. The only other changes are the new digest tests and adding those tests to the existing required CI command. The working tree and all author-sealed files remain untouched.

Disk preflight passed at 51.04 GiB. Only uniquely owned tiny synthetic fixtures and scripts in this review directory were written. No checkout/repository/data/public/dependency-tree copy, canonical code write, Git mutation, global build, network or paid model request occurred. The independent loader verifies unchanged runtime dependencies against exact base.

## Incremental hashing

Inspected the delta: sorted object-key order, array order/separators, JSON scalar encoding, historical undefined behavior and failure on invalid root undefined/BigInt are retained. Pending fragments flush after approximately 64 KiB; larger encoded scalar fragments hash directly. A surrogate pair cannot be split by buffer flush because emitted fragments are complete JSON-encoded keys/scalars or ASCII syntax, and lone surrogates are escaped by JSON.stringify.

`digest-independent.mjs` uses its own deterministic randomized cases and separately accumulated expected SHA, not the implementation's serializer, for the large aggregate. Under `--max-old-space-size=64`, it passed 5,000 compatibility cases against the exact legacy stableJson bytes, 44 Unicode/flush-boundary cases, and a logical 537,921,541-unit Unicode aggregate exceeding this runtime's 536,870,888 maximum string length. Independent streamed expected SHA matched. Evidence: `digest-independent-results.json`.

An initial combined low-heap experiment also attempted the legacy full aggregate serializer and exhausted the 64 MiB heap before testing the replacement. The corrected low-heap harness deliberately avoids materializing the old aggregate, retaining small compatibility tests and an independent streamed expected hash. The successful result above measures V4, not that failing reference construction.

## Full publication and source binding

Fresh production strict extraction validation and source-pinned date recording seeded Jia and Ding plus an unrelated unaudited outside book, with one cross-book identity merge. A fresh ordinary compiler generated the V4 identity seal. The filesystem/ZIP checks passed: global.complete=false, one pending outside date audit, two scoped people, source-only outside alias/birth excluded, one parent-of family edge and derived child-of adjacency preserved. Missing/stale date approvals, missing/stale identity seal, self-review, forged embedded certificate and injected outside glossary fact rejected.

The full actual required generator passed. Actual packaged glossary checks also reject explicitly preloaded sources containing an extra unmentioned sentence or changed metadata, and separately reject mismatched production inputFingerprint/inputUnitCount. Equivalent physical-root symlink is accepted. `results.json`, `source-object-check.mjs` and `split-root-results.json` retain executable evidence.

Fresh full required validator exited 0 and printed `EPUB validation passed`. Fresh split-root generator and validator both exited 1 specifically for certified-root mismatch with B containing the original unchanged mention sentence plus “Jia secretly abdicated.” Existing B output content sentinel survived unchanged, and no validator extraction directory appeared. These outcomes are asserted by `split-root-test.mjs` and retained in `split-root-results.json`.

## Independent disposition

APPROVE the exact V4 incremental digest repair and the full synthetic required-publication path at the reviewed patch hash. No remaining finding in this review scope. This approval is for code behavior and synthetic integration, not adoption or real-book readiness. No real Jinshu release/source approval/certificate, full-corpus build, external EPUBCheck or deployment was performed. Corpus-wide hashing IO and full-catalog in-memory retention remain unbenchmarked here; this review specifically verifies removal of the aggregate serialized-string limit, not elimination of all full-catalog memory costs.
