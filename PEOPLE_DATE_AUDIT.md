# Independent People Date Audit

## Migration

The September 12, 2026 baseline marks all 4,099 source chapters `un-audited`.
`data/people/date-audit-baseline.json` is an immutable migration record, not live
status. Existing extractions, editorial decisions, identity resolutions and worker
recovery state remain intact. Extraction prompt version stays 7: do not re-extract
the existing corpus merely to audit dates.

Live status comes from `data/people/date-audits/BOOK/NNN.json`. Missing reports mean
`un-audited`, including for future chapters. Reports can be `audited`,
`needs-revision`, or `research-blocked`. Changes to source, extraction, audit
protocol or pinned local references make approval `stale`. Malformed reports fail
loudly. Replaced reports are archived in `data/people/date-audit-history/`.

A valid extraction certifies capture, not historical accuracy. Independent date
approval is now required for glossary completion and publication-ready ebook
glossaries. Public people pages remain available as work in progress; migration
does not certify their unaudited dates or discard prior work. The existing progress
layout gains a date-review state without changing the extraction queue.

## Rollout Plan

1. Calibrate on a small cohort spanning biography, annals, genealogies, tables and
   retrospective introductions, across books and extraction models. Measure
   accepted cost, packet size, time, findings and reviewer false positives before
   expanding paid work. Include ordinary chapters, not just suspicious ones.
2. Prioritize known event-ownership failures, shared family date windows,
   dynasty-length activity ranges, age-derived births, source emendations,
   one-sided language encoded as point dates, and cross-record contradictions.
   These are triage signals, never automatic historical corrections.
3. Eventually review every extracted chapter, including ones with no date claims:
   checking supplied claims alone misses omitted births, deaths and ages.
   Unextracted chapters get their audit after extraction, not an empty approval.
4. Give a separate reviewer the temporal claims, active hints, person identities,
   Chinese evidence and narrative context. Read all Chinese units for omissions,
   including preceding headings and dates. Do not repeat name/mention extraction,
   family-tree construction or translation. Research only unresolved questions.
5. Persist specific failed checks promptly. Repair only affected claims and hints;
   preserve unrelated extraction work. Independently verify replacement dates,
   rebuild the packet, and audit the repaired version against new fingerprints.
6. Approve only after every source unit, temporal/hint item and person is checked,
   all findings are resolved and no research hold remains. Spot-check accepted
   cohorts independently and retain negative controls. Improve the process when
   reviewer errors recur before scaling the lane.

This is a targeted review, not a guaranteed cost reduction: it avoids the large
name/mention output and full extraction loop, but source reading and research still
cost tokens. Initial manual audits used no paid external calls. The packet,
record, scan and test commands remain offline. `people:dates:run` now implements
the worker loop; Cursor execution requires explicit `--run` and `--model`.
Do not launch a paid cohort until capacity and spending are authorized.

For large chapters, split source reading into bounded owned ranges with adjacent
read-only context. Retain completed check IDs across interruptions; assemble a
complete report only after all ranges and cross-range dependencies are reviewed.
Partial reports may retain findings but cannot approve. The packet command emits
the whole chapter; the worker runner partitions it into disjoint review jobs,
fingerprints their ownership and assembles the complete report. A person's check
also receives their other temporal claims as context. Oversized indivisible
evidence fails before inference: inspect that chapter and deliberately adjust the
packet ceiling instead of silently truncating source or skipping checks.
Measure packet size before choosing concurrency; do not restart completed work.

## Resumable Worker Loop

`people:dates:run` runs audit, scoped repair, fresh independent re-audit and host
publication. An existing current failed report can seed repair immediately; it
does not need a redundant initial review. Every candidate still gets a complete
new review. New extractions enter the same queue once proposed translation repairs
are closed. The managed campaign now runs extraction, editorial, dates, then
identity resolution, with a catalog rebuild after dates. Calibration starts with
five date chapters at concurrency two; these are caps, not spending targets.

Reservations use `dateAudits` in the existing Git-backed ledger on
`codex/people-work-queue`, separate from extraction claims but mutually exclusive
with active extraction. Each chapter has a stable lane/worker owner, fingerprints
and retained job/conversation IDs. A local process lock plus an exclusive shared
executor token prevents duplicate executors, including across local checkouts.
The execution lease renews at checkpoints and is released on normal exit, while
chapter ownership stays sticky. After a hard crash, wait for that lease to expire
or confirm the executor stopped before explicitly taking over. Moving execution
to another machine requires stopping the old executor
and explicitly using `--takeover`; this reuses ownership and remote conversations.
Never delete an interrupted reservation to assign its work elsewhere.

Local job artifacts, rejected outputs, candidate rounds and state live under
`data/people/generated/date-workflow/`. They are ignored recovery assets, not
disposable caches. Review-phase ceilings and exact job IDs are pinned locally and
in the shared queue; changing invocation limits cannot replace retained ownership.
Cursor resumes each retained conversation and downloads any
completed artifact before asking for another turn. Run limits stop that job;
account usage limits stop all new launches and drain active work. Record usage
and inspect accepted cost, tokens and failures before raising concurrency.

The host accepts only fingerprinted changes to temporal claims and active hints,
plus `add-reception-event` for a separately evidenced posthumous or retrospective
`event-participation` claim about an existing person. Correct or remove the
misleading life claim separately; an undated later reference need not gain a date.
Required companion records belong in the proposal's validated `changes`, not a
side list of unimplemented host work. Such incomplete proposals cannot be staged.
Use `date-context` to add missing chronology to an existing non-life claim without
changing its subject, predicate or non-date value fields. Newly dated claims enter
the fresh review packet; attaching a date does not approve it.
It runs the production extraction/editorial validators before independent review.
Non-temporal event content, people, names, mentions and family edges cannot be
rewritten by the date repair interface. A repair conversation cannot approve its
own candidate. Attachment lanes must declare their actual worker identity too;
identity declarations do not replace the operator's responsibility to use a fresh
review context.

Only complete independent approval permits the canonical extraction to change.
`data/people/date-repairs/` retains the exact proposal, repair rounds and approval;
the durable receipt allows recovery if publication stops between its file writes.
Failed re-audits stay staged. Research holds and exhausted repair-round limits
remain unfinished and return a nonzero exit status. Changed active inputs fail
loudly; completed generations are archived when later edits require a new audit.

```sh
# No queue mutation, credentials or inference.
npm run people:dates:run -- --all --dry-run --limit 5
npm run people:dates:run -- --all --order calibration --dry-run --limit 5
npm run people:dates:workflow:self-test
node --test scripts/test-people-date-worker.mjs scripts/test-people-campaign-dates.mjs

# Only after capacity/spending approval and model selection.
npm run people:dates:run -- --all --worker cursor-dates-01 \
  --lane cursor-sdk --model grok-4.6 --run --limit 5 --concurrency 2

# Retained artifact recovery remains available during the Cursor blackout.
npm run people:dates:run -- --all --worker cursor-dates-01 --recover-only

# Trusted host: export the next sealed job for a separate Grok Bot conversation.
# No Cursor SDK calls. Return the exact requested *.result.json, then rerun.
npm run people:dates:run -- --book BOOK --chapter NNN --worker grok-dates-01 \
  --lane grokbot --attachment-dir /absolute/path/to/date-handoff
```

The attachment runner emits `*.input.json` and stops while the result is absent.
Review results identify `jobId`, the exact packet hashes and owned checks; repair
results contain exact before-values, source-based reasons and author identity.
After a repair, send the next review input to a **different** conversation.
The host validates all artifacts; a bot does not commit, publish or approve itself.
Use `--retry-blocked` only after obtaining the missing research. Explicit
`--release --book BOOK --chapter NNN --worker ID` frees an abandoned assignment
without deleting local recovery files and does not require paid execution.
The direct Cursor runner also enforces the campaign capacity calendar. An explicit
`--cursor-capacity-start` or `PEOPLE_CURSOR_CAPACITY_START` override must represent
verified available capacity, not a way to bypass the pause. Inspect the printed
calibration cohort for genre and source quality; size quantiles and distinct books
avoid an all-empty-header sample but do not replace operator judgment.

## Rules for Every Lane

- Identify **whose event** is dated. A child's appointment is not the father's
  activity; later editions, allusions and commemorations are not evidence that
  their subjects were alive. Keep posthumous reception separate from life events.
  Preserve the later event, its own date, source unit, and the subject's role as
  honoree, quoted author, or recalled example. Use `event-participation` with
  `kind: "posthumous-commemoration"`, `"posthumous-reference"`, or
  `"retrospective-reference"`; a narrower honor/work claim can instead carry
  `receptionType: "posthumous"` or `"retrospective"`. The latter does not assert
  that the subject was dead. These classifications concern the dated event,
  not when its source was written: a biography written later may still supply
  genuine birth/death/activity evidence. Never copy a reception date into living
  attestations or active-date hints. Do not infer a precise death from it.
  Existing unclassified references require source review, not a date-based
  bulk relabelling. Later reception remains visible separately on person pages.
- Justify each endpoint. A reign/dynasty window can bound an event, but does not
  show the person active throughout that period. Prefer narrower verified evidence.
- Preserve ruler, polity, reign, regnal year and finer calendar wording. Verify
  the correct era, including reused names and interrupted reigns. Arithmetic
  alone cannot identify the reign. Pin references and explain the conversion.
- Distinguish conventional historical year labels from Gregorian event dates.
  Lunar years cross Western-year boundaries. Do not invent Gregorian months or
  days. BC/AD has no year zero.
- For a dated event with a verified month/day, normalize Western years and
  bounds using the proleptic Gregorian calendar and state the convention in the
  conversion evidence. Some converters, including Academia Sinica's default,
  return Julian dates before 1582. Check that setting; preserve the Chinese date
  and identify any Julian witness explicitly. A Julian December date can fall
  in the following Gregorian year. Do not apply a fixed offset across centuries
  or reinterpret a reign-year-only label as an exact Gregorian event date.
- Preserve stated age and reckoning. Traditional inclusive age is not a modern
  birthday calculation. Do not borrow a sibling's age: `同生` in a maternal list
  does not establish twins or a shared birth year.
- Read for omitted births, deaths and ages. Distinguish chapter evidence from
  supplementary research. Preserve conflicting witnesses and emendations explicitly.
- Never invent a date to pass validation. An attestation with `sourceDate`,
  `unresolved: true` and a substantive `unresolvedReason` preserves extraction work
  but blocks date approval. Its hint should say `research required: ...`.

### One-Sided Chronology

Use exactly one of `westernYear`, `westernInterval`, or `westernBounds` per date
container. Bounds allow `before`, `onOrBefore`, `after`, and `onOrAfter`, each
holding a positive BC/AD year object, at most one per direction.

```json
{
  "sourceDate": { "text": "After the Qi accession" },
  "westernBounds": {
    "onOrAfter": { "era": "AD", "year": 479, "precision": "year" }
  },
  "event": "The death follows the accession; its year is otherwise unstated."
}
```

This example assumes the accession year has been independently verified. Death
after an accession may occur within that same year: **on or after** 479 is not
**after** 479. Preserve the finer sequence in the source wording. Do not turn this
into a point death at 479 or invent an upper endpoint. A before-date likewise
does not justify an arbitrary start year. Bounds work inside `dateContext`,
`startDate` and `endDate`; person summaries retain direction and do not use bounds
as exact life dates for birth-year inference.

## Commands and Reports

```sh
# Already run; refuses to overwrite the migration baseline.
npm run people:dates:init
npm run people:dates:status -- --out data/people/generated/date-audit-status.json
npm run people:dates:scan -- --out data/people/date-audit-preflight.json
npm run people:dates:packet -- --book songshu --chapter 090 --out /tmp/songshu-090-dates.json
npm run people:dates:record -- --report /tmp/songshu-090-date-review.json
npm run people:dates:verify
npm run people:dates:self-test
```

`verify` rejects malformed/stale reports, but does not certify pending or failed
chapters. Completion and ebook gates require `audited`, not a zero exit code.
The deterministic `scan` reports reversed intervals and invalid bounds without
changing claims. Initial scanning of 1,127 extracted chapters found 21 reversed
intervals in 12 chapters. The committed preflight file is a dated triage snapshot;
rerun after repairs. Approval refuses these defects even if a reviewer marks all
checks supported. Raw capture remains readable so old defects can be audited.

Reports carry schema/audit version 1, book/chapter, packet `sourceHash` and
`extractionHash`, reviewer name and `independentOfExtractor: true`, ISO
`reviewedAt`, summary, `reviewedUnits`, `itemChecks`, `personChecks`, `findings`
and `references`. Independence is an attestation, not machine proof: use a separate
review context. Each check names its packet ID, verdict (`supported`, `incorrect`
or `research-blocked`), substantive reason and exact Chinese `{unit, quote}`
evidence. Item checks also identify the `event` and owner. Findings identify
affected item/person IDs, the problem and a concrete action. Approval requires
complete coverage and no findings. Committed reports provide examples.

Local references use `{book, chapter, unit, quote, sourceHash, reason}`, with a
SHA-256 hash of the entire Chinese unit. Edits invalidate approval. External
references use `{kind: "external", url, title, quote, sourceHash, accessedAt,
reason}`: a short checked excerpt, its SHA-256, access date and interpretation.
Keep quotations copyright-compliant. The recorder checks excerpt integrity, not
remote-source truth; verify sources before recording them. External changes need
deliberate re-review, not silent network access during builds.

## Initial Manual Audits

- `qingshigao/120`: **audited**. All 17 available Chinese units, ten temporal/hint
  items and three people checked. Yao, Shun and Yu retain legendary antiquity
  instead of inheriting surrounding Qing fiscal chronology.
- `songshu/090`: **repaired and independently audited**. Removed Ming's borrowed
  appointment dates, corrected maternal/event ownership, preserved traditional
  ages without twin or birthday inference, and supplied supported one-sided
  bounds for undated deaths. The source-completion terminus for two early deaths
  is explicitly not personal activity in the compilation year. All 33 units,
  105 temporal/hint items and 22 people checked.
- `houhanshu/001`: **repaired and independently audited**. Northern Song
  republication no longer becomes personal activity for Fan Ye or Sima Biao, and
  the false living-owner publication event is removed. Supplementary dates are
  source-qualified; Li Xian's conflicting reported ages are explicitly preserved
  without inventing a harmonized birth. All 16 units, 19 temporal/hint items and
  four people checked. The first candidate's additional failure is retained.
- `mingshi/034`: **repaired and independently audited**. The Zhizheng-to-Zhiyuan
  emendation is independently sourced. Competing death-year witnesses remain
  explicit within AD 1281-1283 bounds; compilation uses supported sequence and
  presentation bounds instead of a circa point. All 22 available units, seven
  temporal/hint items and two people checked. Omitted tables are not certified.

These diagnostic selections do not estimate the corpus error rate. Original
negative reports and repair-round evidence are retained; the three initially
failed pilots have now been repaired and independently re-audited. Date approval
alone does not certify translations, exhaustive extraction, identities or
publication readiness. Paid worker transport is covered by offline adapter tests;
no Cursor, Grok Bot or DeepSeek inference was purchased for this implementation.
