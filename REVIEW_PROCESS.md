# Review Process

This project uses a manual editorial review pass for translated chapters. The goal is to improve translation quality without drifting away from the source text.

## When To Review

Review chapters that are translated but still need editorial cleanup. The manifest `reviewed` flag tracks chapters that have already been checked.

The quickest way to find the next chapter is:

```bash
make extract-next-review
```

To limit the search to one book:

```bash
make extract-next-review BOOK=shiji
```

## Review Loop

1. Extract the chapter for review.
2. Edit the generated review JSON by hand.
3. Apply the reviewed text back into the chapter.
4. Run the automated quality checks.
5. Mark the chapter reviewed in the manifest.

Important: `make apply-review` does not perform editorial rewriting by itself. It
expects you to have already made the wording fixes manually in the review JSON.

The usual commands are:

```bash
make extract-next-review
make apply-review CHAPTER=data/shiji/001.json
```

You can also extract a specific chapter directly:

```bash
make extract-review CHAPTER=data/shiji/024.json
```

## What Good Review Looks Like

A good review improves clarity and prose while preserving historical meaning.

Focus on:

- Semantic fidelity: keep the original meaning intact.
- Consistent proper nouns: use the same English form for names, offices, places, and titles across the chapter and, when possible, across the book.
- Flowing English prose: sentences should read naturally, not like a line-by-line gloss.
- Complete grammar: use proper articles, verb tense, and sentence structure.
- Tone discipline: keep the translation scholarly and restrained.
- Terminology consistency: preserve repeated technical terms, rank titles, ritual names, and institutional terms once a form is established.
- Punctuation and spacing: keep English punctuation clean and readable.

## Common Issues To Fix

- Literal translations that sound unnatural in English.
- Idiomatic translations that drift away from the source.
- Inconsistent names or titles inside the same chapter.
- Fragments that should be full sentences.
- English that is too terse, too ornate, or too modern for the passage.
- Leftover placeholders, empty fields, or Chinese characters in English text.

## After Applying Review

`make apply-review` now:

- applies the edited review JSON,
- recalculates translated sentence counts,
- runs the translation quality checks,
- marks the chapter reviewed in `data/manifest.json`,
- rebuilds the corresponding book.

If the chapter still needs work after the automated check, keep editing the review JSON and apply it again.

## Source Repair Queue

The source repair queue tracks differences between local Chinese source text and
external witnesses. Use the triage command before working item by item:

```bash
npm run quality:repair-triage
npm run quality:repair-triage -- --book beishi --packets 3
```

The triage report groups pending items into safe variant no-ops, punctuation
work, table-structure reviews, likely omissions, local extras, structural
heading no-ops, and major replacements. Packet output is written under
`data/quality/repair-packets/` and is gitignored working material.

Start with the fast lanes:

```bash
npm run quality:repair-triage -- --class section-heading-noop --limit 20
npm run quality:repair-triage -- --class source-layout-marker-noop --limit 20
npm run quality:repair-triage -- --class table-cell-repeat-noop --limit 20
npm run quality:repair-triage -- --class table-numeric-residue-noop --limit 20
npm run quality:repair-triage -- --class local-ui-artifact --limit 20
npm run quality:repair-triage -- --class local-source-note-marker --limit 20
npm run quality:repair-triage -- --class source-private-use-glyph --limit 20
npm run quality:repair-triage -- --class local-heading-markup --limit 20
npm run quality:repair-triage -- --class probable-source-omission --packets 3
```

For the large remaining manual queue, use the workbench instead of opening
single items one at a time. It finds repeated patterns, surfaces likely
graph-variant pairs, and writes editable decision packets:

```bash
npm run quality:repair-next
npm run quality:repair-next:packet -- --dry-run
npm run quality:repair-next:packet
npm run quality:repair-fast
npm run quality:repair-fast -- --apply
npm run quality:repair-workbench
npm run quality:repair-workbench:text
npm run quality:repair-workbench:tables
npm run quality:repair-workbench:omissions
npm run quality:repair-workbench:punctuation
npm run quality:repair-workbench:packet -- --group <group-id> --packet-size 80
npm run quality:repair-workbench:graph-packet -- --group <graph-group-id> --packet-size 80
npm run quality:repair-workbench:packet -- --book houhanshu --chapter 007 --packet-size 80
```

The plan output is a lane board: each repeated pattern now includes a lane
kind, risk level, review hint, and packet command. Prefer this order:

1. run `npm run quality:repair-next`; it shows total pending work, safe
   resolver dry-runs, optional pattern no-op net impact, and the highest-yield
   next packet lanes;
2. run `npm run quality:repair-fast -- --apply` when the preview shows
   metadata-only stale completions. This only marks queue records already
   verified against the current corpus; it does not change Chinese or English
   text;
3. use `npm run quality:repair-next:packet -- --dry-run` to see the selected
   high-yield packet, then run it without `--dry-run` to write the packet;
4. clear low-risk no-op lanes after sampling;
5. review graph-pair lanes by repeated character pair; these are not
   automatically no-ops, because pairs such as `云/雲` can indicate real source
   character errors. For graph-only fixes where the upstream graph should be
   accepted and the English still fits, use `quality:repair-next:graph-packet`
   or `quality:repair-workbench:graph-packet` after sampling the packet;
6. review table lanes by chapter/table context, especially raw `wikitable`
   markup or cell-separator residue;
7. work source-omission lanes only when ready to add manual English
   translations.

`quality:repair-fast` intentionally keeps source-changing cleanups separate.
By default it runs only metadata resolvers for already-fixed current-corpus
items. Add `--include-pattern-noops` to inspect the older broad pattern resolver
from the same command. If that pass would reopen older automatic denials, the
script refuses `--apply --include-pattern-noops` unless `--allow-reopen` is
also supplied; reopens increase queue size but may be correct when an older
automatic denial hid a real punctuation/source issue.

The packet JSON is written under `data/quality/repair-packets/workbench/`.
Packets include the current corpus units, neighboring source text, and current
literal/idiomatic English so a repeated lane can be reviewed without opening
every chapter file separately. Edit only the packet's `decision`, `notes`, and
`manualTranslations` fields unless you are using the documented top-level
defaults below.
Some upstream discrepancies have repeated identical snippets and therefore
non-unique queue `id` values. Workbench packets include the queue index so the
reviewed row can be copied back precisely; do not re-approve packet-scoped
source applications by bare `id` outside the workbench flow.
For repeated same-decision packets, set the top-level `defaultDecision` and
`defaultNotes`; item-level decisions override that default.
For low-risk no-op lanes that you have sampled, packet generation also accepts
`--prefill-default`; it copies the lane's suggested default into the packet.
For reviewed graph-pair source fixes, `quality:repair-workbench:graph-packet`
sets `defaultDecision: "approve"`,
`defaultPreserveExistingTranslations: true`, and a default translation review
note. This is only for cases where you have checked the included English and it
still fits after the graph correction; set an item's
`preserveExistingTranslations` to `false` and add `manualTranslations` if the
English needs to change.
Explicit `manualTranslations` override preserved English, so use them whenever
the source repair reveals an existing mistranslation.
Use:

- `deny` when the local corpus should be retained and the queue item rejected.
- `approve` when a source-correspondence item should be applied. If this adds
  or changes Chinese text, add manual English `manualTranslations` first.
- `applied` when the source and English translation were already fixed by hand
  and only the stale queue item needs to be marked complete.
- `skip` to leave the item untouched.

Then copy the reviewed packet decisions back into the tracked queue:

```bash
npm run quality:repair-workbench:apply -- --decisions data/quality/repair-packets/workbench/<packet>.json
npm run quality:repair-workbench:finish:dry-run -- --decisions data/quality/repair-packets/workbench/<packet>.json
npm run quality:repair-workbench:finish -- --decisions data/quality/repair-packets/workbench/<packet>.json
```

If the apply step reports approved source-correspondence items, run the printed
`npm run quality:source-correspondence:apply -- --queue ...` commands only
after the relevant manual translations are present. The source apply script
will refuse to create untranslated Chinese source units.

After sampling a safe no-op class, it can be batch-denied:

```bash
npm run quality:repair-triage -- --class section-heading-noop --apply-safe-denials
```

Do not batch-translate. If a queue item changes or inserts Chinese source text,
add or revise the corresponding English translation manually in context before
marking the item applied. Local UI artifacts and source-note markers are corpus
fixes, not no-op denials: remove the bad Chinese unit and its English
translation, then mark the item applied/repaired. Local heading markup such as
`=人物名=` is also corpus cleanup: strip the markup from the Chinese heading
before deciding whether the cleaned heading should be retained as a structural
no-op. Private-use glyph and kana-placeholder source artifacts need upstream
lookup; do not guess the Chinese replacement.

For those local artifact and heading-markup lanes, use the dedicated cleaner.
It dry-runs by default:

```bash
npm run quality:repair-clean-artifacts
npm run quality:repair-clean-artifacts:apply
```

For source-correspondence punctuation items, first clear items already proven
fixed in the current corpus. This only marks queue metadata after verifying
that the upstream leading close mark is already on the previous local unit:

```bash
npm run quality:repair-resolve-punctuation
npm run quality:repair-resolve-punctuation:apply
```

Then clear stale source-correspondence records whose current chapter JSON
already matches the upstream span after approved graph variants and punctuation.
This does not accept any new source text; it only catches queue records created
against an older local snapshot:

```bash
npm run quality:repair-resolve-current
npm run quality:repair-resolve-current:apply
```

After the apply step, run `make update BOOK=<book>` for every touched book so
the public JSON, HTML, search corpus, OG sidecars, and progress data stay in
sync. After queue-only status changes, regenerate dashboard progress with:

```bash
node generate-progress.js
```

## Related Files

- [QUALITY_STANDARDS.md](./QUALITY_STANDARDS.md)
- [BOOK_PUBLICATION_QA.md](./BOOK_PUBLICATION_QA.md)
- [EBOOK_PUBLISHING_PLAN.md](./EBOOK_PUBLISHING_PLAN.md)
- [README.md](./README.md)
- [Makefile](./Makefile)
