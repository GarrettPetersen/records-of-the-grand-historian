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
cost tokens. Initial manual audits used no paid external calls. The current CLI
is local and does not launch or bill workers. Before parallel paid audits, assign
each chapter to exactly one reviewer and persist resumable assignments. Extraction
queue completion is not a date-audit reservation.

For large chapters, split source reading into bounded owned ranges with adjacent
read-only context. Retain completed check IDs across interruptions; assemble a
complete report only after all ranges and cross-range dependencies are reviewed.
Partial reports may retain findings but cannot approve. The packet command
currently emits the whole chapter: paid chunk scheduling and assembly remain an
orchestration step, not an automatic lane. Measure packet size before choosing
concurrency; do not restart completed review work at a token boundary.

## Rules for Every Lane

- Identify **whose event** is dated. A child's appointment is not the father's
  activity; later editions, allusions and commemorations are not evidence that
  their subjects were alive. Keep posthumous reception separate from life events.
- Justify each endpoint. A reign/dynasty window can bound an event, but does not
  show the person active throughout that period. Prefer narrower verified evidence.
- Preserve ruler, polity, reign, regnal year and finer calendar wording. Verify
  the correct era, including reused names and interrupted reigns. Arithmetic
  alone cannot identify the reign. Pin references and explain the conversion.
- Distinguish conventional historical year labels from Gregorian event dates.
  Lunar years cross Western-year boundaries. Do not invent Gregorian months or
  days. BC/AD has no year zero.
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
- `songshu/090`: **needs-revision**. Ming's attestations borrow his sons'
  appointment dates. All source units read; only the affected person's checks
  completed. The remaining people are not certified by this partial failure.
- `houhanshu/001`: **needs-revision**. Northern Song republication is incorrectly
  treated as personal activity by the earlier authors Fan Ye and Sima Biao.
- `mingshi/034`: **research-blocked**. Verify the Zhizheng-to-Zhiyuan emendation
  and compilation-date precision against independent sources. The available
  chapter explicitly omits tables; this audit cannot certify missing content.

These diagnostic selections do not estimate the corpus error rate. Failed audits
are actionable debt, not already-applied repairs. Date approval alone does not
certify translations, exhaustive extraction, identities or publication readiness.
