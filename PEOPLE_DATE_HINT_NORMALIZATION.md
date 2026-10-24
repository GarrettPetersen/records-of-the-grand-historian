# Automatic Western date-hint formatting

Use deterministic normalization before spending a model turn on formatting-only
validation failures. This does not research or approve chronology.

## Automatic use in lanes

The existing extraction CLI now normalizes active-date hints when `--normalize`
is requested, before production validation. It logs exact before/after hints and
writes only if the entire extraction validates successfully:

```sh
node scripts/validate-people-extraction.mjs ASSIGNED_ARTIFACT.json --packet SEALED_EXTRACTION_PACKET.json --normalize
```

Cursor workers already instructed to run this command receive the fix without
another instruction. Other lanes and host importers should use it on their owned
staged extraction before acceptance and before sealing date-review packets.
Use `--out NORMALIZED_ARTIFACT.json` to retain the original submission separately.
This CLI path also performs its existing span normalization; it is not the
formatting-only command below. Library validation and CI do not mutate inputs.

## Preview and apply existing artifacts

```sh
npm run people:hints:normalize -- --book jinshu --chapter 025
npm run people:hints:normalize -- --file /absolute/staged-extraction.json
npm run people:hints:normalize -- --all --check
npm run people:hints:normalize -- --book jinshu --chapter 025 --apply --receipt /absolute/new-hint-receipt.json
```

Default mode only previews. `--check` exits 1 if supported formatting corrections
remain, and 0 otherwise; it does not certify that chronology is valid. Select one
of `--file`, `--book [--chapter]`, or `--all`. No matches or malformed input fail
loudly. Apply requires a new receipt path and checks the original file's byte hash
immediately before each atomic write. The receipt includes exact person IDs,
hint indices, before/after strings, original byte hashes, and candidate semantic
JSON hashes. Exclusive receipt creation does not replace an existing file.
Preserve it for recovery; a batch
interruption may leave earlier files applied and later ones untouched.

Only the host may apply to canonical extractions, after checking queue ownership
and ensuring no active worker uses those inputs. Do not run an indiscriminate
`--all --apply` over an active campaign. Afterwards run the normal scoped
production validator before checkpointing. The formatting-only script does not
claim extraction validation, date approval, publication or completion.

## Transformation contract

Both compact schema 2 `people[*][4].a` and expanded schema 1
`people[*].identityHints.activeDateHints` are supported. Only existing hint strings
change. People, claims, date values, evidence, qualifiers and endpoint order remain
unchanged. Examples:

- `682 BC` → `BC 682`
- `682–650 BC` → `BC 682–BC 650`
- `20–30 AD` → `AD 20–AD 30`
- `2 BC–1 AD` → `BC 2–AD 1`
- `before 682 BC` → `before BC 682`
- `AD onOrAfter 307 (after Yongjia 1)` → `on or after AD 307 (after Yongjia 1)`
- `AD onOrAfter 318 onOrBefore 320` → `on or after AD 318 and on or before AD 320`

Exact leading-era bound forms support `before`, `after`, `onOrBefore`, and
`onOrAfter`. A paired lower/upper form explicitly shares its leading era across
the two supplied years. Bound directions, year values, endpoint order, and an
optional parenthetical explanation retain their meaning; no missing year or
era is inferred from historical context. Reversed or impossible pairs, malformed
years, conflicting eras, unsupported qualifiers, and mixed trailing text remain
unchanged for validation or review. A hint linked to sealed external-primary
chronology cannot be normalized without reconciling that evidence.

## Date-repair handoff

The host date workflow normalizes supported hint formats in its materialized
repair candidate before production validation. It preserves the worker's raw
proposal and records exact before/after strings, proposal and candidate hashes,
and the staged candidate path in an immutable receipt under `hint-formatting/`.
Recovery verifies that receipt, its proposal, and the staged output before another
worker turn. This avoids spending a model turn solely on known formatting forms.

Normalization does not edit an old sealed packet or approval, change a claim or
date value, or approve chronology. The resulting candidate still needs production
validation and a fresh independent date audit before canonical publication.

The normalizer is idempotent. It does not convert calendars, infer missing era
labels, reorder ranges, convert BCE/CE, or turn unresolved research into a date.
Zero, negative and oversized years and conflicting duplicate era labels are left
for validation/review rather than repaired speculatively. A shared trailing era
applies to both range endpoints only when no first-endpoint era is explicit.
If an external-primary chronology record links a hint requiring formatting, the
normalizer fails without writing: that exact-linked, sealed evidence needs
explicit reconciliation and must not be silently changed.

Hash-bound approvals become stale if a canonical extraction changes, even for
formatting. Never edit an approval/report hash to retain acceptance. Keep old
sealed packets and reports immutable and use the existing host reconciliation
and fresh-review procedure. Normalize before creating independent audit packets
to avoid this rework.

## Tests

`npm run people:hints:self-test` covers single years, ranges, cross-era endpoints,
qualifiers, malformed/unsupported hints, both extraction layouts, no unrelated
changes, dry-run/check/apply, receipt preservation and idempotence, and the
staging validator CLI's write-after-validation behavior. The required
`master-build` check runs these offline tests.
