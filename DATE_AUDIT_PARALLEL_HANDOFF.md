# Date-audit parallelism: idle-boundary handoff

Prepared October 5, 2026. **Do not interrupt the current date run.** The tested
implementation is staged in `patches/date-audit-parallel.patch`, not installed
over the active runner. This intentional handoff preserves the orchestrator's
uncommitted date/editorial changes and its running conversations.

## What changes

- One shared worker-call pool per invocation: default four slots, maximum eight.
  Chapter concurrency remains two by default; the limits do not multiply.
- Audit and fresh re-audit chunks dispatch concurrently with unchanged ownership
  plans, workflow version, fingerprints, complete coverage and independence gates.
- Repair application/publication remain serial within each chapter. All successful
  siblings checkpoint even when another chunk fails; failure drains before return.
- `--chapters-file` selects an explicit editorially closed ready cohort.
- `--job-concurrency` or launcher environment `PEOPLE_DATE_JOB_CONCURRENCY` controls
  the job pool. The existing managed campaign automatically inherits the runner's
  four-slot default after adoption; no paid-wave or chapter caps were increased.
- Summary JSON exposes the pool's limit, peak and completed calls. Completed calls
  include failures/retries and must never be reported as approved chapters.
- Repair evidence now includes all cited source units for the affected people's
  retained chronology, not just the first explicitly named finding. The packet
  ceiling still fails before spending; never truncate to make it fit.

This is single-provider-per-invocation parallelism, not a multi-provider scheduler.
Keep the host-wide run lock; do not launch competing lane executors. Workers need
only sealed packets and isolated artifact directories, never repository copies.

## Adoption after the current invocation finishes

1. Wait for the entire date-runner invocation to exit naturally, not just one
   chunk. Verify its PID stopped and its executor leases were released. Do not
   delete a live lock or use `--takeover` merely to install this change.
2. In the host-owned checkout, inspect the patch and run:

   ```sh
   git apply --check patches/date-audit-parallel.patch
   git apply patches/date-audit-parallel.patch
   node --test scripts/test-people-date-workflow.mjs scripts/test-people-date-worker.mjs scripts/test-people-campaign-dates.mjs
   ```

   The patch was checked against the current **working files**, including the
   orchestrator's uncommitted improvements—not against an older clean HEAD. If
   the preflight fails because those files changed further, reconcile the small
   hunks manually and rerun tests. Never overwrite the live file with the test
   bundle, force-apply a partial patch, or reset the checkout. The host owns Git
   staging and commits; stage only reviewed exact files with its own checkpoint.
3. Resume the same stable worker and existing claim. Keep the original packet
   byte/unit ceilings and every ignored recovery file. Concurrency does not
   change chunk IDs or require discarding completed work. A retained incomplete
   repair chat may need the fuller sealed evidence on its next validator-guided
   continuation; do not replace it just because parallelism changed.
4. Use an explicit cohort JSON array, for example:

   ```json
   [{"book":"jinshu","chapter":"024"}]
   ```

   Include only accepted extractions with finished source editorial review.
   Complete existing repairs/re-audits before adding fresh chapters. Coordinate
   source editing so admitted chapters' fingerprints stay stable. Do not release
   another worker's ownership or blindly schedule all 130 extraction reservations.
5. Preview, then resume using the owning worker's actual ID and existing approved
   lane/model. The commands below are templates, not authorization for a new paid
   wave or a capacity-calendar override:

   ```sh
   npm run people:dates:run -- --book jinshu --chapters-file /absolute/date-cohort.json \
     --dry-run --limit 5 --concurrency 2 --job-concurrency 4
   npm run people:dates:run -- --book jinshu --chapters-file /absolute/date-cohort.json \
     --worker EXISTING_STABLE_WORKER --lane cursor-sdk --model grok-4.6 --run \
     --limit 5 --concurrency 2 --job-concurrency 4 \
     --summary-out /absolute/date-summary.json
   ```

   In a managed campaign launcher, `PEOPLE_DATE_JOB_CONCURRENCY=4` gives the same
   pool without changing its chapter calibration or paid budgets. Increase to
   eight only after accepted cost, failure rate, quota availability and duration
   support it. Setting one remains useful for diagnosis, not an old code path.

## Verification and scope

107 offline workflow/worker/campaign tests passed, including new simultaneous
audit/re-audit, cross-chapter global-cap, failed-sibling drain/recovery and quota
stop checks. The worker evidence test failed in the unchanged active checkout
too; its scoped evidence fix passes in the refactor. No inference requests or
queue mutations were made for this work.

A read-only dry run of the refactored runner found Jinshu 024's current packet has
487 units, 590 date items and 16 review chunks (largest 57,125 bytes). Four review
slots can overlap those jobs; actual approval throughput must still be measured.

The source-only test bundle is `/tmp/people-date-parallel.ODBLcR` (about 9 MiB,
no copied corpus, history, site output or node_modules). It is a disposable test
environment, **not** the production runner or recovery source. Durable code and
operating instructions are in the patch and this handoff; adoption does not
depend on that temporary directory surviving a reboot.

After testing and host checkpointing, keep the new section in
`PEOPLE_DATE_AUDIT.md` as the operational reference. Preserve negative reports,
research holds, independent re-audits, identity gates and batch publication.
