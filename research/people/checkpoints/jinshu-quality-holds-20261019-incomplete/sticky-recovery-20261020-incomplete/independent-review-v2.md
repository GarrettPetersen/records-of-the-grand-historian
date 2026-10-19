# Independent review: sticky queue recovery patch v2

**Disposition: reject for production pending provenance and liveness work.**
This is a review of an isolated candidate, not an approved implementation,
queue update, claim release, or chapter completion. I did not change the
shared checkout's code or index, the shared queue, locks, or canonical chapter
data. The isolated test itself writes fixture data in its existing `/tmp`
script-only test directory; it does not use the production queue.

## Reviewed artifacts (byte SHA-256)

- `sticky-recovery-v2.patch`: `718942caf6e747867ea6eedcf33fe24ddb91a16899f04144b3f50375454e0848`
- `test-recovery.mjs`: `d62f6ca7ee725ab1008b74f84ca992285701ab8d1c35cd1cfca8bdf54550d4f1`
- Patched fixture `scripts/lib/people-work-queue.mjs`: `8123cfe3633d5a907fd95fe5098e0395c369a5e58ed01198d62d3cdf6fde8c8e`
- Patched fixture `scripts/sdk-people-extract.mjs`: `21e279000ea04da6e6993854dd0cf86368253fe3770a2655da562c19e48db05d`

The artifacts were under `/tmp/people-queue-recovery-review.I9mfxzKC` when
reviewed. `node test-recovery.mjs` there returned `queue recovery focused checks
passed`. It exercises in-memory ledger fixtures and does not prove production
queue state or a complete end-to-end scheduler run. I reviewed the actual
candidate patch, fixture code, the queue broker's production call paths, and
the accept function.

## What the revision improves

In the isolated fixture, foreign sticky Cursor `resume-required` and `ready`
claims are blocked by `reservePeopleTargetsInLedger` rather than silently
adopted, and the scheduler's availability predicate agrees with this ownership
rule. Desired keys are excluded from pruning before synchronization, so the
previous reproduced scenario where a live foreign Grok claim was pruned before
the local recovery collision was assessed is now rejected. Recovery entries
win over local-ready entries for the same key. These focused checks are
valuable but do not establish all ownership and provenance invariants.

## 1. Base-hash equality does not prove the note's origin

The candidate prunes a `grokbot/ready` claim if its freely writable `note`
matches the text pattern produced by `acceptGrokbot` and its embedded hash
equals the base branch extraction's bytes. The real `acceptGrokbot` validates
an imported output and writes that pattern; however, `markRemotePeopleClaims`
accepts arbitrary status and note strings, and ledger validation does not
bind the note to the accepting function or independently verify its claims.
An exact byte hash is evidence that the base file equals the hash in the
ledger, not evidence that the listed statistics are real or that this exact
claim was accepted by the validator. A typed field alone would not prove the
producer either: its creation/update path and operational trust assumptions
must be defined and enforced.

Reproduction in the existing isolated fixture after its focused test:

```sh
node --input-type=module -e 'import { pruneMergedClaims } from "./scripts/lib/people-work-queue.mjs"; import {readFileSync} from "node:fs"; import {createHash} from "node:crypto"; const h=createHash("sha256").update(readFileSync("data/people/extractions/fixture/001.json")).digest("hex"); const ledger={claims:{"fixture/001":{lane:"grokbot",worker:"never-validated",status:"ready",sticky:true,note:`Imported direct attachment: 999 people, 999 mentions, 999 claims; sha256 ${h}`,updatedAt:new Date(0).toISOString()}}}; process.stdout.write(JSON.stringify({removed:pruneMergedClaims(ledger,{baseRef:"HEAD"}),remaining:ledger.claims})+"\n")'
```

Observed: `removed` contained `fixture/001`, with an empty remaining claim
map. The claim was constructed directly in memory, not produced by acceptance.
This is a deliberately adversarial fixture demonstrating that the comment
“recorded by acceptGrokbot after strict validation” is not mechanically
guaranteed. It does **not** establish that a real claim was forged or actually
lost, nor that a hostile actor has access to the ledger. The question for the
design is whether trusted-but-mistaken ledger writers and replayed notes are
within scope; if they are, the pruning rule needs an enforceable acceptance
record, not just a regex. Even an enforceable receipt must be tied to the
chapter and artifact and checked against the base publication state.

## 2. Shared-state collisions can stall unrelated scheduler work

`localCursorRecoveryTargets()` reads all chapters in the shared checkout's
extraction state. `syncLocalCursorReservations()` runs before the scheduler
filters its chapter targets, and the revised reconciler throws if *any* such
recovery is owned by a different active worker. Thus two otherwise independent
stable Cursor workers using the prescribed shared checkout can cause the
second worker's entire synchronization to fail on the first worker's retained
chapter, before it can work on a different chapter. This is a control-flow
analysis, not a claim that the live schedulers are presently in this state.
Ownership of the conflicting chapter must remain protected; a design that
reports and excludes that specific foreign-owned work while safely processing
unrelated work may be appropriate, subject to preserving visible conflict
diagnostics and the shared-ledger race guarantees. Confirm with a two-owner,
two-chapter scheduler/in-memory integration test rather than suppressing errors
globally or taking over another worker's claim.

## 3. Conservative cleanup lacks a complete reconciliation route

The candidate deliberately no longer automatically prunes Cursor-ready or
Grok-submitted claims from mere base metadata. That is safer than treating
current-looking metadata as proof that a retained artifact was incorporated,
but without a documented, tested owner-verified reconciliation path it can
retain those claims after legitimate publication indefinitely and prevent
subsequent work on those chapter keys. A locally tracked queue snapshot at
`origin/codex/people-work-queue` commit
`4aca09929f40d88b55271e75e780d6423d494b2c` had 15 Cursor `ready`, 138 Grok
`submitted`, 42 Grok `ready`, and 2 each Grok and OpenRouter `claimed`.
These are snapshot counts, **not** evidence any particular claim was merged,
stale, safe to release, or still has the same current remote status.

Specify and test an explicit reconciliation route for each relevant state
without taking live leases, clearing sticky artifacts or adopting someone
else's work. Preserve legitimate handoffs through a documented, owner-checked
transition; do not silently reintroduce unrestricted cross-worker adoption.
Need tests for receipt provenance, stale or rewritten source/extraction,
concurrent unrelated owners, exact output versus same source metadata, and
publication of validated reviewed outputs whose bytes legitimately changed.
No claim should be marked complete solely on this review.
