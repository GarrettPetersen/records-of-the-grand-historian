# Independent review: Jinshu 053 Chinese-amendment prototype

Decision: **do not publish or use for canonical transition**. Reviewed the
frozen isolated candidate under
`/tmp/jinshu053-amend-prototype.iGonV2qE/` against the production workflow at
staging `aee5f25`; no live queue, canonical files, shared Git state, builds,
clones or worktrees were changed. The author reported 133/133 offline tests;
those tests do not establish the safety properties below. The separate
real-source replay test uses this laptop's absolute repository path and the
specific staging commit, so it is a host diagnostic, not a portable CI test.

1. **Witness authentication is missing.** The contract pins and the reviewer
   repeats hashes of author-supplied `{url, quote, reading}` objects. It does
   not pin a saved witness's actual bytes, independently verify that the quote
   occurs in those bytes, or establish edition/transcription provenance. An
   isolated offline invocation of `replayReviewedChineseAmendments` accepted
   a fabricated quote and `https://example.invalid/not-a-witness` after their
   self-declared hashes matched. This demonstrates the replay check, not a
   claim that the actual Jinshu witnesses are fabricated. Require sealed
   witness artifacts with exact byte/hash and reading locators, with
   independently recorded source and provenance review; hashing a declaration
   by itself is not evidence that an external text said it.
2. **Global identity and external-reference impact is not accounted for.**
   Local candidate/source/date reports and the references they choose to list
   are validated, but the publisher neither inventories nor pins/reconciles
   all existing cross-chapter resolution decisions concerning this chapter or
   other audits that cite changed units. The separate pinned Jinshu 053
   inventory identified 80 resolution files and 595 potentially affected
   decisions, not 595 proven invalid decisions. Require an exact global
   dependency inventory and independently reviewed reconciliation or safe
   exclusion from completion; don't blindly delete decisions. Exercise a
   fixture with an unlisted impacted decision and an external audit citation.
3. **A pending publication does not fence the ordinary date runner.** The
   publisher sets `claim.combinedCuration` before its durable receipt; its
   failure cleanup clears the executor token and expiry but leaves that
   marker. At staged `scripts/run-people-date-workflow.mjs`, neither startup
   reconciliation nor same-owner reservation checks this marker. An ordinary
   runner can therefore resume/reconcile the old claim once the lease is
   absent or expires, while the reviewed transition is incomplete or partly
   published. The host-local process lock does not establish shared cross-host
   fencing. Add marker-aware fail-closed fencing and test receipt recovery
   with isolated queue CAS at every crash checkpoint, including after lease,
   receipt, each canonical role, local state and shared finalization, as well
   as attempted same-owner, competing-worker and startup reconciliation.
   Preserve the existing stable worker and all sticky recovery state.
4. **Exact old-date bytes are not guaranteed on history reuse.** The current
   publisher checks an existing date-history file by parsing and deep equality
   rather than comparing its bytes to the original report. Different formatting
   can pass without the old bytes being archived. Require exact-byte matching
   or a separate byte-addressed archive, with tests for pre-existing
   semantically equal but byte-different files and crash replay.

Exact source replay, declared author/reviewer separation, fresh date
validation, and local before/after hash checks are useful parts of the
prototype, but do not cure the blockers above. In particular, no test here
authorizes changing s0170 or s0171, changing reviewers' source evidence, or
claiming the chapter complete. A final integrated review must use the frozen
production revision and its actual dependencies, not symlinks to a mutable
dirty working tree, and must include the normal source, editorial, identity,
date, and publication gates.
