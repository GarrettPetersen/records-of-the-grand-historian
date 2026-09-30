# OpenRouter free people lane

This is a local, packet-only inference lane for chapter-local people extraction and independent date audits. It uses `OPENROUTER_API_KEY` from the repository's ignored `.env`, makes no paid-model requests, and needs no hosting. The default model is `dots-studio/dots-3-note-preview:free` as verified on 2026-09-30; pass `--model MODEL:free` if the catalog changes. `openrouter/free` is also accepted, but its random routing makes reproducibility and quality less predictable. Before every inference request, the client checks OpenRouter's live model catalog for zero prompt and completion prices. The router's actual selected model is checked too, and a nonzero reported cost fails loudly.

Reasoning remains enabled. The first one-shot extraction probe spent a full completion on reasoning, and a second returned truncated JSON. Both raw responses are retained but were never accepted. The lane now uses bounded tool calls: the model reads sealed evidence, upserts individual records or corrections, and asks the host to validate the assembled draft. A completed tool turn and its state checkpoint are atomic; a saved response can be replayed after a crash without paying for it again.

Free capacity is not unlimited or guaranteed. OpenRouter currently advertises 50 free requests per day, and individual upstream free providers may return HTTP 429 even before the account allowance is exhausted. A 429 stops the current extraction wave or date scheduler. Relaunch later with the **same worker ID**; completed chunks and date artifacts are reused. Do not switch to a paid model or a provider key automatically. Check current limits on OpenRouter's [pricing page](https://openrouter.ai/pricing/) before planning a campaign.

## People extraction

```sh
npm run people:openrouter:self-test
npm run people:openrouter:extract -- --worker openrouter-local-1 --book beiqishu --chapter 012 --dry-run
npm run people:openrouter:extract -- --worker openrouter-local-1 --all --limit 20
```

The runner selects unextracted chapters, claims them in the shared `codex/people-work-queue` ledger under the `openrouter` lane, plans disjoint bounded chunks, and saves raw tool responses, draft state, and validated chunks under ignored `data/people/generated/openrouter-extractions/`. It reuses the existing people-record tool protocol (read, upsert, validate, finish) rather than asking for a chapter-sized JSON object. Claims are sticky so an interrupted call cannot silently lose ownership. It assembles a chapter only after all chunks pass strict extraction validation and durable-career coverage, then writes `data/people/extractions/BOOK/NNN.json` and marks the queue claim `ready`. It will never replace an existing extraction. The trusted orchestrator must inspect the exact accepted file and publish it to `codex/people-glossary-staging-v2`; this runner does not stage, commit, or push. Run the ordinary focused extraction review and later independent date audit before milestone publication. A `ready` claim is not a date approval.

The tool harness returns validator diagnostics into the same retained conversation and keeps every response. It fails loudly on an unresolved blocker or depleted free quota; never mark a rejected draft accepted. Resuming requires the same source, model, worker ID, and chunk plan. If the source changes, reconcile the retained work before starting a fresh claim. `--max-turns` bounds a run but does not discard the saved draft. If another lane publishes the chapter to `origin/master` first, this runner skips it; its ignored tool artifacts remain for diagnosis and are not promoted over the published extraction.

## Independent date audit

```sh
npm run people:dates:run -- --lane openrouter --worker openrouter-local-dates --book shiji --chapter 115 --dry-run
npm run people:dates:run -- --lane openrouter --worker openrouter-local-dates --all --run --limit 20 --concurrency 1
```

The existing date workflow owns chunking, review/repair/re-review, validation, queue reservations, and publication. The OpenRouter worker reads sealed evidence and saves checks, findings, references, or corrections in small tool calls; `finish_date` assembles the artifact for the normal host validator. Separate request identities are recorded for repair and review so a repair cannot approve itself. Responses and rejected artifacts are preserved in the ignored date-workflow directory. `--run` is required to send requests; `--recover-only` forbids new model turns. Keep concurrency low on the free tier. A single local date workflow lock applies across all lanes: coordinate with the running orchestrator rather than removing the lock.

## Operational priority and recovery

Use this lane when Cursor or Grok capacity is unavailable, but do not steal their sticky claims. Run recovery first with the same worker ID. Check `npm run people:queue:status` and date workflow state before launching. For extraction, a local `ready` artifact still needs host publication; for dates, only an `audited` result counts. Preserve ignored recovery directories during disk cleanup. OpenRouter's free model may be weaker than paid lanes: never loosen candidate coverage, chronology, editorial, or independent-review gates to improve throughput. Keep one shared checkout and isolated artifact directories; no per-chapter clone or worktree is needed.

## Architecture for other inference lanes

The record-writing protocol is a better common interface than asking any model for a chapter-sized JSON object. Provider adapters should differ only in transport, model availability, quotas, and response replay; they should share the sealed source readers, bounded `write_records`/`save_records` operations, validator feedback, independent review, and host-only publication. The OpenRouter lane reuses the existing people tool harness and introduces the corresponding date record harness. This change does **not** switch the running Cursor or Grok workers to it; their current checkpoints and reservation semantics need migration tests before such a cutover.
