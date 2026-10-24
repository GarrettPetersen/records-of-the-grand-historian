# Jinshu 108 sticky date recovery — incomplete handoff

Author `/root/progress108`; read-only inspection. This note is not a date
repair, review, approval, permission to take over a worker, or authority to
publish. **Do not retry this hold yet.** Preserve the claim, process lock,
lease, all candidate rounds, rejected results, conversations and blocker.

## Observed state and provenance

The live remote queue ref `codex/people-work-queue` and the locally available
remote-tracking ref both pointed to `4aca09929f40d88b55271e75e780d6423d494b2c`
when checked. Its `dateAudits["jinshu/108"]` has stable worker
`jinshu-release-dates-cursor-sdk`, lane `cursor-sdk`, status
`research-blocked`, executor host `Garretts-MacBook-Pro-2.local`, and no
executor expiry recorded. No expiry alone establishes that the host process
or shared executor is inactive; check live process and lease ownership before
any execution. The original packet source and extraction document hashes are
`sha256:d15a364ee7cefa821da0202907743d2a5a8830523c9a1cfd13d158eeeec7f101`
and `sha256:ad6690b52cc4ef5057a0b0411628c2456bc2fb1ffa5a058f459befc555c26f27`.

Local `data/people/generated/date-workflow/jinshu/108/state.json` raw SHA-256
`7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152`
retains round 2, phase `repair`, index 1, `candidate-2.json` and
`repair-candidate-2-1.json`. The second repair job is
`repair-2-002-46f1c395ad55b4617423-d31cb56612a3`; its retained Cursor agent is
`bc-0aafa8d5-9ca8-4f06-b78b-7a06e7967d4f` and run is
`run-08a4bdee-74be-4edc-8970-7d28a9153f23`. Its returned artifact hash is
`78015aa4928f8bd719f873ee2852724dbb23e30aa255ba671ebde8b6c1852035`, matching
the raw bytes of `research-blocker.json`. The retained `candidate-2.json` raw
SHA-256 is `c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413`.
These are observations at that queue revision, not a current lease check.

The new independent [Gao Zhan chronology source note](jinshu108-gao-zhan-chronology-independent-source-note-20261020-incomplete.md)
has raw SHA-256 `2eb08216c758a261b1f37e71cfa9bd7962370d837b6d2551337dbe4d438a4bf7`.
It explains why the `onOrBefore AD 319` bound in death claim 249 is not
supported: Taixing's early period is not its first year, and an annal's
narrative grouping does not prove the death occurred in the heading year.
At most a source-verified one-sided lower bound may be considered; the note
does not approve one. The phase-2 findings also question upper bounds in the
related war claims 124, 175 and 176; the first repair has proposed one-sided
bounds with unresolved flags, but that is neither final approval nor a
complete independent audit. Review all affected facts on the actual candidate.

## Why an unchanged retry is unsafe

At the inspected code revision, raw SHA-256 values are:

- `scripts/lib/people-date-worker.mjs`: `714c35bfa7c91fd9151a624b4b77c55f1ed40b91a90e352f1c7ab1abd3e30a79`.
- `scripts/lib/people-date-workflow.mjs`: `749560098c702ec28c40c563d2647cef3870593ffebc4b1bfeeef728fb16cc3e`.
- `scripts/run-people-date-workflow.mjs`: `6426f753c649c1c901be33cf89c17085a44b27596a9fba444a1deb695270d03b`.
- `scripts/test-people-date-worker.mjs`: `f54c1ac25c0e3fd0d336105abd3e12f9d87b41ec0dda96a6bc3bedb3ff6681bd`.
- `scripts/test-people-date-workflow.mjs`: `665762ca66aa4ce4e4b66244db05fdb91e6bc1eb4b4edb1605cb416d65f5573b`.

In the first file, `dateWorkerInput` (around lines 25–100) builds the repair
input from retained findings and references, with no input for the newly
researched note. Around lines 186–194, any existing research blocker together
with a returned retained repair can trigger replacement of its agent context.
Around lines 226–230, a blocker triggers a generic assertion that the host
resolved an active-hint invariant, regardless of the actual reason; that is
not an accurate statement of this Gao Zhan hold. In the second file, the
repair loop (around lines 557–596) writes a blocked result directly to the
same `research-blocker.json` path, potentially overwriting its earlier bytes.
The host runner enforces worker/lane, host, executor and current fingerprint
checks around lines 159–178; `--retry-blocked` changes eligibility, not the
evidence packet or the validity of these checks. Simply adding that flag would
not supply the new research and risks damaging recovery provenance.

## Proposed implementation, not yet adopted

Add an explicit bounded operator-supplied research supplement for an existing
repair job. Bind it to book, chapter, exact retained job key, packet
source/extraction hashes and original blocker byte hash, and include the
specific source evidence and citations in the continuation payload. Reject
missing, mismatched, stale or oversized supplements before spending; do not
relax the original retained packet ceilings. The intended job should continue
the existing conversation first, not silently replace it, and should not replay
the identical already-returned blocker as a new result. Remove the blanket
claim that any hold is the resolved active-hint invariant. Record the actual
supplement, continuation and output provenance without changing claim ownership
or frozen repair-plan membership.

Before a later blocker is recorded, preserve the exact original bytes using
an immutable content-addressed archive and verify the archived hash; fail on
conflicting content. Preserve each subsequent distinct blocker as well, with
atomic/crash-safe writes and explicit references from state. Do not delete or
rewrite the original recovery artifact to implement this. After a valid repair,
validate against production schema, retain all rounds, and perform a complete
fresh date review independent of the repair authors. Neither a lower bound nor
the prior research note can substitute for that review.

The tests should cover chronology versus active-hint blockers, pinned
supplement and blocker mismatches, stable-agent continuation, identical versus
new returned artifact, packet ceiling, repeated blockers, archive collisions,
interrupted recovery, self-review rejection and no queue/lease takeover.
Existing blocker preservation fixtures are in
`scripts/test-people-date-worker.mjs` around lines 208–239, with retained
conversation tests after them and packet tests around 616 onward. Exercise
`scripts/test-people-date-workflow.mjs`, the date-worker offline tests,
`scripts/test-people-campaign-dates.mjs`, and
`npm run people:dates:workflow:self-test`; follow all project instructions.

The separately prepared s0090 source and extraction are **not canonical**.
Publishing them first changes the original sticky source/extraction
fingerprints and the host runner correctly refuses changed sticky inputs.
Coordinate any final amended candidate with reviewed combined curation and a
fresh final date review; never repin old approvals or overwrite the retained
work to make the queue check pass. This is a suggested design, not a tested
implementation or a command to resume now.
