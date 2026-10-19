# Date-runtime three-way reconciliation — incomplete research

Staging source: `aa559d891725681842916d22ce395a9098b73ad2`.
The candidate patch is against the live checkout as observed during this investigation;
its SHA-256 is `9e622de947052c02ca123006ac0f16b4e7d90748dd6560452e9ca4c050f6012c`.
`git apply --check` passed, but this is not a production-ready patch.

It mechanically reconciles `people-date-workflow.mjs`, `run-people-date-workflow.mjs`
and `people-work-queue.mjs` from staging over existing local changes. It preserves the
local addition in `localCursorRecoveryTargets()` that skips local recovery whenever
`extractionIsCurrent()` returns true. This is unsafe: that helper checks coverage
flags, prompt version and source fingerprint, not incorporation of retained chunks
and conversations. The sync routine can subsequently delete the corresponding
`resume-required` claim. Resolve that independently without discarding user edits or
sticky recovery, and add tests covering current-but-unvalidated extraction and
retained conversation/chunk ownership before considering the candidate.

The live schema removes staged `externalPrimaryChronology`; date prompts and other
dependent files also differ. These changes are outside the candidate. Schema and
prompt reconciliation, whole dependency graph, resumed-job resource provenance,
active process dependencies and host-owned rollout remain unresolved. The active
GrokBot dispatcher loads scripts from the live checkout; do not modify its runtime
without confirming safe process ownership.

Tests used exact staging scripts, schema, prompt and tests, with the three merged
candidate files and the existing installed `node_modules` symlinked read-only by
convention. The stage-pinned ownership tests use an isolated temporary local Git
origin. Ownership, worker and date-audit tests passed (114 tests); the workflow test
initially lacked the fixture config, then passed all 57 after restoring the exact
staging `data/people/config.json`. These tests do not cover the local suppression
delta, live resource differences, or a real resumed review. No production worker,
live queue, canonical chapter, shared index, or shared source file was changed.
