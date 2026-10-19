# Jinshu 022 original date generation and categorical drift — incomplete

Research only: no approval, publication, claim transition, or permission to
overwrite any canonical or sealed artifact. The source-context reviews below
concern the retained round-4 candidate and its own preview; they are not a
blanket assessment of every other field in an earlier extraction.

## Fingerprints and provenance

`state.json` and the `jinshu/022` date claim in queue revision
`4aca09929f40d88b55271e75e780d6423d494b2c` pin source semantic hash
`sha256:851915ffde8d18ff168794b13c6b900354ec593d983aa6fde461ffc82f9a7ce2`
and original extraction semantic hash
`sha256:3c9b7490f95d01f8923f7683d7f9bd6911c741187013e9cd99552cf2f173aa58`.
The exact extraction in Git commit `a20371bc0c5c40fa328cdda3b05802a3625910ee`
matches that extraction hash. `audit-0` jobs and `review-0.json` also pin it.
The current checkout's canonical source byte hash is
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`;
the combined-curation inspect command reports the same source semantic hash
as the date claim. Source hash equality alone does not approve the extraction.

The current canonical extraction, live staging revision
`66c920ba8cfeb10ccc1c728c13e2d2277774447e`, and extraction in commits
`aea743b9e3b1d47a5a560b3cc352857142215941` and
`6aca0a78b9f3d7bb0b953de9e843a38efe087047` all have semantic hash
`sha256:ee27cc8c8ee5aedac8773fd32f2355327e0ea15dc7d41082261c51c525a5cf9e`.
At inspected master revision `26ebf8c830a43c3eb0a15e361c72436bd946c83e`,
that extraction path is absent. Recheck remote refs before further action.

The semantic hash here means `sha256(JSON.stringify(JSON.parse(bytes)))`,
not the byte hash. Recursively comparing parsed old and current extractions
shows only the following 44 leaf changes, in 41 claim rows; several rows have
both a kind and a reception change:

| Count | Field | Before | After |
|---:|---|---|---|
| 23 | claim value `kind` | `posthumous-commemoration` | `retrospective-reference` |
| 2 | claim value `kind` | `posthumous-reference` | `retrospective-reference` |
| 21 | claim value `receptionType` | `posthumous` | `retrospective` |

No other parsed JSON field differs. The local round candidates have distinct
semantic hashes: round 1 `295a2bd7bda5407e4afd6c95068e665219247e897473ae4d606e13ed0b2bde9a`,
round 2 `c77f387557c0b99ee562904548e931fc3d246590710c5e4021179b0c11573089`,
round 3 `2bfabee4a345854a49d33c8d52734f6c2f140422b53dd4fcbd398b212fc70d26`,
and round 4 `39c756f0deff06281d9f8ae1d8e2a9e56b38b20bc17cf8771064f802357c9826`.
State remains `phase: repair`, `round: 4`; these hashes do not establish
approval or precisely explain every repair made between rounds.

## Review implications

Changing an invalid controlled label is not, by itself, evidence that the
underlying classification is true. Separate source-context reviews of the
41-row round-4 preview explicitly reject row 1 (`claim-112`): Ming is the
living officiant, not the later-reception subject. Rows 35 and 37 must be held
because a later hymn reference does not establish a noble title as an action
received; rows 22 and 24 also require reworking an unsupported received-honor
interpretation. Several other rows retain identity, claim-type, and date
questions. See `retrospective-review-rows-01-21-independent-incomplete.md`,
`retrospective-rows-22-41-independent-review-incomplete.md`, and
`selected-receptions-handoff-incomplete.md`. Supported classifications in
those documents are explicitly limited and do not constitute date approval.

Do not repin a receipt to the later hash merely because it is present or
restore the older invalid labels into canonical files. Reconcile the actual
original generation and retained repairs, independently review the corrected
current candidate including the s0130 false-person and translation issue, then
complete the fresh independent audit and required identity, validation and
publication gates. Preserve both generations, the claim, and the sealed jobs.

## Reproduce read-only

Run from the repository root. Git objects must be present locally. The script
compares exact pinned commits rather than a moving branch; it prints leaf-delta
counts and file fingerprints without writing any files.

```sh
node --input-type=module <<'NODE'
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const base = 'data/people/extractions/jinshu/022.json';
const readGit = ref => JSON.parse(execFileSync('git', ['show', `${ref}:${base}`]));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const original = readGit('a20371bc0c5c40fa328cdda3b05802a3625910ee');
const current = readGit('aea743b9e3b1d47a5a560b3cc352857142215941');
console.log('original', hash(original), 'current', hash(current));
const counts = new Map(), changedRows = new Set();
function diff(a, b, path = []) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], [...path, k]);
    return;
  }
  const label = `${path[0]}.${path.slice(2).join('.')} ${JSON.stringify(a)} => ${JSON.stringify(b)}`;
  counts.set(label, (counts.get(label) ?? 0) + 1);
  if (path[0] === 'claims') changedRows.add(path[1]);
}
diff(original, current);
console.log('changed claim rows', changedRows.size);
for (const [label, count] of counts) console.log(count, label);
for (let round = 1; round <= 4; round++) {
  const file = `data/people/generated/date-workflow/jinshu/022/candidate-${round}.json`;
  console.log(file, hash(JSON.parse(fs.readFileSync(file, 'utf8'))));
}
NODE
```
