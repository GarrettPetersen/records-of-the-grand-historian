# Sticky-claim publication mismatch — incomplete investigation

Read-only reproduction: from the repository root, run
`node data/people/generated/jinshu-identity-ref-64521198-20261018/sticky-master-mismatch-20261020-incomplete.mjs`.
This reads the pinned queue and master Git objects and the current ignored Cursor
recovery state. It does not synchronize or mutate the ledger or any artifact.
The ignored recovery state can change, so the reported local-state details are
not a permanent snapshot; Git references are pinned.

At queue `4aca09929f40d88b55271e75e780d6423d494b2c` and master
`26ebf8c830a43c3eb0a15e361c72436bd946c83e`, 195 claims were `ready` or
`submitted`; only `hanshu/005` and `hanshu/088` have master extraction paths.
Path existence alone does not establish incorporation. Both are retained Cursor
ready claims; the master files last changed in commits `07e5abb388d` on
2026-09-08 (005) and `17f7b2a100a` on 2026-09-23 (088), before their October
claims. Their master files report August 11
Grok 4.5 extractions using prompt versions 3 and 4, respectively. The saved
Cursor states report different agents for accepted chunks on October 1; their
state input fingerprints differ from the subsequently created claim
fingerprints. A shared source fingerprint between older state and old master
is not an extraction identity. No claim was released.

These findings only compare artifact metadata, not every mention or claim.
They do not establish that the retained Cursor outputs are current or fully
validated, nor do they establish that any chapter passed downstream gates.
Other queue claims may become reconcilable after a future master merge, but
none of the other 193 had a master extraction path at this pinned revision.

## Reconciliation evidence gap

The v5 sticky-recovery candidate correctly avoids treating current-looking
metadata or a free-form note as proof. For older Cursor ready claims, the
ledger contains no machine-bound accepted output identity; for Grok ready
claims, `note` text containing an artifact hash is not a validated receipt.
PR existence, a merged PR, or a current master extraction alone cannot bridge
this gap: the output can be replaced by other work before the squash merge.

A usable future path needs the validating acceptance operation to atomically
bind the immutable assignment identity, source fingerprint and exact accepted
artifact digest to the owner's claim, before master publication; preserve the
accepted bytes or a content-addressed immutable Git object. At reconciliation,
read the actual remote master and actual current ledger, authenticate the same
claim and terminal status without adopting or force-releasing active work,
verify the artifact is incorporated in master, and perform production
validation against the master source. A Git ancestor alone is insufficient for
a squash merge or for a subsequently overwritten extraction. An exact byte or
semantic match establishes the narrow unchanged case; a changed output needs
verified replay of fingerprint-bound, independently approved transformations,
including the actual final master source and required current audits. Check
the claim identity and master evidence again inside an atomic queue mutation;
reject races and preserve unrelated claims. Never treat notes or supplied
hashes as proof, and do not advertise this sketch as implemented.

Legacy claims without bound acceptance need recovery of independently
verifiable accepted artifacts and an auditable validated host attestation, or
must remain reserved; fabricated retrospective proof and blanket release are
unsafe. The two historical cases above require retained-work reconciliation,
not automatic removal. No code patch for the live queue is approved by this
investigation.
