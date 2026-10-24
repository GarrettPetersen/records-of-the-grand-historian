# Retained date-research recovery

A research hold is not date approval. Preserve its stable worker, lease, lock,
original packet, every returned artifact and all independent-review evidence.
Do not release, take over, or remove a lock to make a retry possible. Confirm
the host owns an idle invocation and follow the chapter's normal queue gates.

For a retained Cursor repair, an operator may prepare a JSON supplement with
`schemaVersion: 1`, `book`, `chapter`, `jobKey`, `sourceHash`,
`extractionHash`, `originalSourceHash`, `originalExtractionHash`,
`blockerHash`, and a nonempty `evidence` string. The source and extraction
fields identify the active repair packet; the `original` fields identify the
sticky workflow's first sealed packet. The blocker is the `sha256:`-prefixed
hash of the exact blocked SDK artifact, not a guessed or reserialized hash.
Evidence must contain the actual source findings and citations, including
uncertainty, and must not instruct a reviewer to manufacture an answer.

Supply the file with `--research-supplement PATH`, `--retry-blocked`, the
single explicit `--book` and `--chapter`, and the original stable `--worker`
and packet ceilings. Cursor model turns still require the normal explicit
`--run --model` and budget controls. Artifact-only `--recover-only` may use
the same supplement to recover a continuation; it does not authorize a turn.
Never infer that an unchanged blocker is a successful repair.

The runner verifies the retained conversation and pinned inputs, transmits
the whole bounded repair packet with the supplement, and preserves the raw
blocker, supplement, raw response and workflow result as immutable evidence.
Completed supplement receipts are verified on subsequent runs even if no
supplement is passed. The repair and all retained repair contexts remain
ineligible to approve their own work. Production validation and a complete,
fresh independent date re-audit are still required before publication.

The runner deliberately fails if the lock already exists, including a stale
lock; this workflow does not remove someone else's lock. A changed source,
extraction, evidence, receipt or unexplained run remains a hold for explicit
reconciliation, not a reason to rebind prior approvals.
