# Jinshu staged date-review triage — incomplete

Read-only triage at 2026-10-19 03:54 UTC. The remote staging ref resolved to
`41aa511d3c0d1312c42f299e946efd2d997bf74d`. These are not completed-chapter
counts and are not a full semantic review. The shared checkout is extensively
modified; local and staged files must not be assumed interchangeable.

## Local-versus-staged observations

Local `dateAuditStatus` on all fifteen locally present Jinshu reports, using
the *local modified* `scripts/lib/people-date-audit.mjs`, returned stale for
001, 002, 004, 013, 014, 022, 024, 045, 052; needs-revision for 025, 101,
108; research-blocked for 041 and 053; and audited for 127. The last result
is misleading if used as staging status: the local 127 report is an older
audited report, while staging 127 has a later `needs-revision` independent
partial report, dated 2026-10-19 and recording seven findings. Do not publish
or count the old local approval in place of that staged report.

At the exact staging commit the stored reports marked `audited` are 072, 080,
093, 101, 109, 117, 119, 123, 128, and 130. A byte comparison via `git show`
and SHA-256 found staged and local source, extraction, and editorial-decision
files identical for all of these except 123: its local source matches, while
its extraction, report and editorial decisions are absent locally. Reports
for 072, 080, 093, 109, 117, 119, 128 and 130 are absent locally; 101's
local report differs from staging. These comparisons are byte comparisons,
not application fingerprint checks, and do not prove anything about other
required input files or canonical ownership.

For each staged report except 123, I independently read the report directly
from the Git object, rebuilt a date packet from the byte-matching local source
and extraction using the local modified date-audit module, ran
`validateDateAuditReport`, and called `dateAuditReferencesCurrent` against
local reference sources. All nine structurally validated and returned true
for reference-current. These checks show compatibility with this local code
and local reference bytes, not validation with a clean staging dependency
closure, sound historical review, or approval for release. 123 could not be
checked by this route because its local extraction is absent; no files were
materialized to fill the gap.

The scoped local `people:validate -- --book jinshu --chapter 072` and `080`
commands also passed against byte-matching source, extraction, and editorial
decisions. They verify specific extraction/decision structures, not all-gate
editorial, identity, chronology, site or ebook completion.

## Reliability limitation and viable next work

All nine inspected staged `audited` reports repeat exactly one item-check
reason and exactly one person-check reason-plus-evidence pair for every
person. For example, 128 cites only `s0002` `慕容超` for every person,
including p002 `慕容納` and p003 `慕容德`. A repeated quote naming one
person cannot by itself substantiate the others' identities or life dates.
This does not prove the reviewer performed no other research, but the stored
record does not show person-specific evidence for those checks. Fingerprint
and schema validation are therefore insufficient evidence of a reliable
independent whole-chapter chronology audit.

There is already source-backed contrary evidence: the separately retained
`jinshu080-independent-date-finding-20261019/INCOMPLETE.md` questions the
unsupported 353–355 death interval for p050; the 093 source-and-date hold
and independently reviewed follow-ups question retrospective dates and local
identity; the `jinshu109-staging-date-evidence-triage-incomplete-20261020.md`
identifies p002 claims attributed to an era phrase in another person's sentence;
and the 072 sticky-audit handoff investigation preserves a date finding and
unfinished owned workflow. These observations require separate independent
assessment and a safe owner-coordinated correction/re-audit; they do not prove
all claims false or authorize changes to audit artifacts.

128 is a plausible independent review target due to 284 units and 162 people,
but no evidence currently ranks it closest to full completion: 072 has fewer
people but a retained sticky workflow; 127 has extensive reviewed repair
work but its staging report has seven findings. A complete current identity
graph, full editorial evidence, actual chronology review, source corrections,
and site/backlink/ebook verification must still be assessed. Do not treat
the repeated boilerplate reports as adequate evidence or reassign live or
sticky work. Recheck refs and ownership before host action.

The remote queue ref was independently checked at
`4aca09929f40d88b55271e75e780d6423d494b2c`: 128 already has an active
sticky date claim for stable worker `openrouter-local-dates`. Its retained
audit-0 plan has 40-unit/57,344-byte ceilings and eight job IDs, with saved
interrupted responses including a free-tier 429. A ledger state is not proof
of a live process or permission to take it over. Resume only its existing
owner through the supported workflow after current capacity and process
ownership checks; preserve all jobs, the sealed inputs and original ceilings.
This independent note is not a supported injection into its sealed jobs.

### Specific 128 review packet for a separate reviewer

The exact staged byte SHA-256 hashes are: source
`8b301825b81b5df574732ea81b2ec17ee1fa25a4761e39775df575ea9505f35b`,
extraction `d4986ae4036b5eb25eecaac66122d9419ac0da5ba17372ad2fda0cc8889eba1c`,
report `29e939e37f98fb6609d991d2db4dd7900a1853343a661e3cd628a39660063acd`,
and editorial decisions
`2b530cb25e24b832a1f760b68477fd32dee67b60ba6108318a59828bf6cad107`.
The locally rebuilt packet's semantic hashes are source
`sha256:a37da153ece3a93370eb3756b14bb9a432de7eeee581e8b999b5e1dbad491496`
and extraction
`sha256:f9bc3bd5cc89f6b68c4048aa55f00dc7afd81cd8001c7f8e48246219c5c1bb01`.
Source, extraction and editorial bytes match the local files; the staging
report is absent locally.

`hints-p002` assigns Murong Na `AD 370-384`. The report's supporting check
quotes only s0002 `慕容超`, the name of a different person, and gives a
generic reason; its p002 check cites the same quote. The actual s0003
identifies Na as Chao's father, not an absolute life or activity interval.
Independently verify both interval endpoints and what event they date before
acceptance; this observation alone does not show the interval is false.
Similarly, p003's `AD 384-405` hint is justified only by the same s0002 quote,
not a dated event of Murong De.

`claim-39` assigns p001, Murong Chao, an attestation interval AD 385–410,
with source-date label `生於羌中`. Its report cites s0009's account of his
birth among the Qiang and s0006's account of relatives' deaths following
Chui's uprising. Neither quotation contains `生於羌中` verbatim or an
absolute year. The quoted evidence alone does not establish the interval's
two endpoints or demonstrate that it is appropriate as a single attestation
interval; contextual and independent source evidence may exist. Check the
dates and ownership of birth, death, and activity independently rather than
assuming this finding makes those years wrong. Retain the old report unchanged,
research exact evidence and uncertainty, and use a new complete independent
audit against final repaired fingerprints if any correction is approved.

No source, report, claim, lock, worktree or Git index was changed in this
triage. This note is research only and does not assert a complete chapter.
