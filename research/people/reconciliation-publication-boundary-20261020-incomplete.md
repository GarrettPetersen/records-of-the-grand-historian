# Reconciliation publication boundary — safety design, not an approval

Inspected against staging `a74f5ac`. This note proposes no canonical change;
it does not approve a reconciliation, source edit, or chapter. The independently
reviewed prototype limitations in
`reconciliation-review-contract-independent-review-20261020-incomplete.md`
still apply.

## What the existing applier authorizes

`applyPeopleTranslationRepairs` has two reconciliation write paths:

1. `--reconcile-current` expands compact data against the *current* packet,
   reconciles without a previous packet, and writes the extraction and packet.
   It does not load an editorial decision document in this branch.
2. The ordinary accepted-repair branch verifies the existing editorial
   decisions, changes source text, runs the same reconciliation with the old
   packet, and writes the chapter, extraction, and packet as separate atomic
   file operations. An editorial decision about a source repair is not an
   independent review of all resulting person, claim, disposition and mention
   mutations.

Both paths validate schema and candidate coverage, but those checks cannot
establish the semantic correctness of a new disposition or person assignment.
The CLI options `--candidate-person` and `--candidate-disposition` are supplied
by the invoking operator; they do not authenticate a separate reviewer. The
existing disposition option also writes a note asserting an independently
reviewed translation repair even when used in `--reconcile-current`, where no
editorial decision is loaded. This assertion should not be emitted without
evidence of the claimed review.

The no-proposal editorial-history replay is a separate write path and must not
be silently folded into the two reconciliation paths. Its correctness and
fingerprint handling require their own tests. Library consumers also call the
reconciliation function directly, so protecting one CLI alone cannot be
described as a complete protection for all callers.

## Required safe publication contract

- Generate a bounded, immutable review artifact containing exact before and
  proposed after bytes and hashes, historical packet provenance and pinned
  scanner/glossary/code dependencies. A packet rebuilt from current source, or
  a fingerprint stamped during compact expansion, is not historical evidence.
- Review the full semantic delta, including source, people, claims, mentions,
  spans and offsets, candidate dispositions, deleted objects, renumbered IDs,
  and all downstream references. Associate decisions with exact reviewed
  changes; a candidate assignment alone is not whole-delta approval.
- Verify an independently authored sealed review against all relevant authors,
  the complete exact delta and actual immutable hashes. Reject absent, stale,
  incomplete, duplicate, contradictory or unauthenticated decisions. Do not
  infer an approval from a passing schema validator or CLI argument.
- At host publication, re-read and compare every expected input fingerprint,
  enforce ownership, and prevent a competing write between comparison and
  publication. Protect the multi-file transition with a recoverable atomic
  protocol: independent atomic renames do not make the group atomic.
- Revalidate production schema, editorial history and downstream references;
  invalidate or freshly review affected date/identity approvals. Exact retained
  data and reviewer conversations remain recoverable throughout.

The safe interim option is a deliberate hold on canonical publication from both
reconciliation branches until such a contract exists. This is a safety stop,
not a throughput solution: it blocks legitimate automated repair publication
too, and should not be represented as completing or fixing those repairs.

Required tests include actual staged applier fixtures and real retained packet
receipts; changed-context same-ID and homograph controls; unchanged and changed
unscanned spans; insertions/renumbering and stale references; invalid authors,
reviews and dependency hashes; concurrent writers, crash/recovery at each
publication step and post-review mutation; and the existing offline suite.
Never make the old inference-based expectations pass by silently treating them
as independently reviewed.
