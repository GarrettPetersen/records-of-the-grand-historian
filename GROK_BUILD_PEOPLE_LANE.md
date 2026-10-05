# Grok Build subscription lane (chapter completion)

This is a separate, opt-in people-extraction lane using the Grok Build subscription
session already logged in on this Mac. It does **not** use `XAI_API_KEY`, Cursor SDK,
the Grok Bot desktop app, computer use, Cloudflare, or a new checkout per chapter.
The trusted host still owns the shared queue, source packet, record tools, validators,
and publication. It does not automatically run when another lane is exhausted.

## Why the transport is different

`grok -p` is an entire coding agent. On this host, a one-word reply from inside the
repo used 15,209 input tokens (21,894 total); an isolated directory and short system
instruction still used 13,877 input tokens (15,098 total). Grok Build's own agent
scaffolding dominates those calls. Feeding it a shorter user prompt alone does not
remove that fixed context.

The official Grok Build source [documents calling its CLI chat proxy with the local
login session](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-shell/README.md#using-authjson-for-api-access).
The runner reads `~/.grok/auth.json` in process memory and sends its credential only
to the fixed `https://cli-chat-proxy.grok.com` HTTPS origin (chat completions and
read-only billing checks), with the installed
CLI's version header. It never prints, copies, or stores the token in the repo or
`.env`. `grok login` refreshes the session when needed. A bounded direct request on
this host used 197 prompt tokens and 936 total tokens; a tool-call probe used 282
prompt tokens and 508 total. These are request measurements, **not** guarantees of
weekly-allowance percentage or chapter cost. xAI can change this interface; an HTTP
or response-shape change must fail loudly and be reviewed, never fall back to a paid
API key.

## Run one chapter deliberately

Check the orchestrator's queue before choosing a chapter. A dry run does not reserve
work or spend model allowance:

```sh
npm run people:queue:status
npm run people:grok-build:extract -- --worker grok-build-local-1 --book BOOK --chapter NNN --dry-run
```

To start or resume that exact chapter, use the **same** worker ID and add `--run`:

```sh
npm run people:grok-build:extract -- --worker grok-build-local-1 --book BOOK --chapter NNN \
  --max-units 20 --max-worker-kib 24 --max-turns 20 --max-total-tokens 50000 --run
```

There is no unattended `--all` switch. The default is dry-run; `--run` is required
for inference. The runner checks the current `codex/people-work-queue` ledger and
atomically claims under the distinct `grok-build` lane. A chapter held by Cursor,
Grok Bot, a date audit, or another Grok Build worker is refused. Claims are sticky.
The model gets a short instruction and a small set of record-writing tools; it reads
only the sealed source units, schema, and task instructions it needs. It cannot read
the whole repository, run shell commands, or publish. Reasoning remains enabled.

Every raw response, named-field draft, chunk plan, and validated chunk is retained
under ignored `data/people/generated/grok-build-extractions/`. The host validates
every chunk and the assembled chapter against the current packet, checks career
coverage and unchanged source bytes, writes the exact extraction file, then marks
the claim `ready`. The orchestrator must inspect and publish the file to staging,
run focused extraction/editorial review, and obtain a separate date audit. `ready`
is **not** date approval or master publication. Do not delete retained recovery
files during disk cleanup.

The token cap is an invocation circuit breaker measured from proxy usage; it is
not a percentage-of-weekly-capacity guarantee, and a single response can overshoot
it. Every production request checks the official billing and auto-top-up endpoints.
Execution refuses enabled auto-top-up, a nonzero on-demand cap or purchased balance,
and stops at 100% reported weekly usage. A changed billing response fails loudly.
This does not enforce an arbitrary percentage cap or guarantee xAI billing semantics.
The lane is intended for
deliberate short-chapter calibration first. If a run
pauses or validation rejects a draft, inspect the saved diagnostics and resume with
the same worker and source; do not release the sticky claim or change ceilings
silently. HTTP 429 stops the lane, without switching providers.

## Verification and scope

`npm run people:grok-build:self-test` exercises credential selection, request
shape, quota errors, and malformed responses without model use. The direct proxy
and one named-field tool call were live-probed on 2026-10-04. No full chapter has yet
been accepted through this lane, so its throughput and quality remain uncalibrated.
Do not count it as production capacity until a complete chapter passes the normal
host validators and independent review.

## End-to-end stages and completion gates

The target is a chapter on **master**, not an extraction or date report alone.
The same subscription transport now has extraction, independent semantic review,
editorial decision, date audit/repair/re-audit, and identity decision adapters.
These adapters are being live-calibrated; no chapter has yet passed this entire
Grok Build path. Do not advertise production throughput from saved records.

1. Resume the sticky extraction worker above. Every chunk must pass the real
   extraction and career-coverage validators, then a fresh independent semantic
   record-tool review of all units, people, claims, surfaces and proposals.
   Revision findings return to the retained extractor. Changed drafts get a new
   independent review fingerprint/context. Research holds remain explicit.
2. Review proposed English repairs in an independent context:
   `npm run people:grok-build:editorial -- --book BOOK --chapter NNN --run`.
   The host constructs immutable proposal contracts and reviewer metadata; tools
   record individual decisions and dependent-claim amendments. Then run
   `npm run people:apply-editorial -- --book BOOK --chapter NNN` and the scoped
   integrated people validator. Source edits invalidate old audit approvals.
3. Run the existing durable date state machine with Grok Build record tools:

   ```sh
   npm run people:dates:run -- --book BOOK --chapter NNN --worker grok-build-date-ID \
     --lane manual --transport grok-build --run --concurrency 1 --limit 1 \
     --max-tool-turns 120 --max-run-tokens 4000000
   ```

   `manual` is the **queue compatibility category**, not the inference provider.
   The explicit transport invokes only the subscription proxy, never Cursor.
   This avoids introducing an unsupported queue enum to the parallel orchestrator.
   Use `--fresh-audit` only to start a fresh source audit instead of seeding a repair
   from an old placeholder report; it does not erase or restart saved workflow state.
   `--recover-only` cannot launch inference. `--takeover` requires confirming the
   exact prior executor has stopped. Distinct task keys/contexts separate source
   review, repair and fresh candidate re-audit. The repair author cannot approve
   its candidate. Failed reviews, research sources and staged rounds are retained.
4. On the single full host checkout, after the reviewed cohort is available, run
   the normal cross-corpus identity scheduler with explicit transport:

   ```sh
   npm run people:resolve -- --batch STABLE-BATCH --chapters BOOK/NNN \
     --transport grok-build --run --concurrency 1 --component-shards \
     --max-run-tokens 4000000 --skip-cloud-recovery
   ```

   Do not run this against a chapter-only sparse corpus and mistake absent chapters
   for an empty identity backlog. Existing dossier partitioning, resumable parts,
   source reads, prior separations, remaining-pair coverage and full aggregate
   consistency remain mandatory. It does not use a Cursor key or recover Cursor
   conversations. A validated uncertain `possible-same-as` keeps records separate.
5. The host performs scoped validation, full milestone validation, date approval
   verification, catalog/person shards/chapter links/search/sitemap and normal
   build verification. Publish exact tracked source/extraction/editorial/date/
   resolution files through the staging milestone and a passing master PR.
   Respect the required `master-build` check. Never bypass it or count a failed
   build, unresolved identity backlog, staged repair or extraction `ready` state
   as completion. Check the merged files on `origin/master` and deployed output.

## Recovery and live calibration handoff

Raw responses commit before tool-state updates; an interrupted saved response is
replayed without another inference request. Named record tools construct tuples
on the host. `link_candidates` selects actual sealed occurrences; it cannot invent
a full-name span. Date evidence may use `quote:null` to cite the entire exact sealed
Chinese unit, avoiding simplified/traditional transcription drift. Reviewer reasons,
event ownership, findings and production validation are still model/review duties.

Long transcripts are archived before compaction. Saved records, source evidence,
citations and diagnostics are supplied in the resumed context; compaction is not
permission to discard evidence or approve a chapter. All archived/raw state stays
ignored and must survive disk cleanup. Date telemetry is locally durable every
turn and coalesced on the shared Git queue to reduce contention.

The 2026-10-04 calibration owns `jiutangshu/058` as `grok-build-repair-1` and
`houhanshu/109` date work as `grok-build-date-1`. Recovery currently lives in the
small code-editing checkout:
`/Users/garrettpetersen/.codex/worktrees/grok-build-lane-20261004/records-of-the-grand-historian`.
Do not create a fresh checkout or duplicate these claims. The other orchestrator
migrated the extraction's queue category to `grokbot` while retaining its worker
and Grok Build note; the runner explicitly recognizes only that exact owned
compatibility claim. It does not use the Grok Bot app or steal another worker.

Preserve these directories before retiring that checkout:

- `data/people/generated/grok-build-extractions/grok-build-repair-1/jiutangshu/058/`
- `data/people/generated/date-workflow/houhanshu/109/`
- any `grok-build-editorial/`, `grok-build-identity/`, date repair receipts and tracked
  accepted chapter artifacts subsequently produced there.

At the current checkpoint, extraction is incomplete and date review has substantive
saved checks/findings but no accepted full chapter. Earlier calibration revealed
record-ordering bugs, source-transcription errors, overlong transcripts, research
queries incorrectly passed as literal substrings, and shared-queue contention.
Those are explicit recovery/quality failures, not completed work.
