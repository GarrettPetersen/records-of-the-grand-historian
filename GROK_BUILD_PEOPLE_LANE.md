# Grok Build subscription lane (local people extraction)

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
to `https://cli-chat-proxy.grok.com/v1/chat/completions` over HTTPS, with the installed
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
it. Before any live run, check Grok's current weekly allowance and the account's
Extra Usage Credits / Auto Top Up settings; this runner cannot enforce a weekly
percentage or prevent account-level top-up charges. The lane is intended for
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

This first integration handles **people extraction only**. Independent date audits
still use the existing Cursor/Grok Bot/manual date-workflow lanes; do not claim a
date audit under `grok-build` until a separate date record-tool adapter and
independent-review test are implemented.
