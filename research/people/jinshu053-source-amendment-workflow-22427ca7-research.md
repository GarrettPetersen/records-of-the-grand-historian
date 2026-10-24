# Jinshu 053: source amendment and downstream workflow research

This is a noncanonical research note, not an approval, publication receipt, or
authorization to mutate a chapter, queue, or retained review artifact. Checked
against staging commit `22427ca7ce2a94cce7408d8e5fb9c5d6045e4edd` and queue
commit `4aca09929f40d88b55271e75e780d6423d494b2c`. At the time of inspection,
`git ls-remote` agreed with both locally available remote refs. The chapter,
extraction, editorial decisions and date report are byte-identical between
staging `54eb5a3` and `22427ca7`.

Exact SHA-256 byte hashes obtained with `git show REV:PATH | shasum -a 256`:

| File | SHA-256 |
| --- | --- |
| `data/jinshu/053.json` | `85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407` |
| `data/people/extractions/jinshu/053.json` | `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69` |
| `data/people/editorial-decisions/jinshu/053.json` | `b0b4a054119e26645b957b10703559d0ba5041b47f0ae207bcc682708a4df45a` |
| `data/people/date-audits/jinshu/053.json` | `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073` |

These are file-byte hashes, not the logical packet hashes in reports. The
retained date report's logical source and extraction hashes are respectively
`sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
and `sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`.

## Proposed Chinese restorations

Two transcriptions supply the missing name 虨 in both places. See the source
links and detailed evidence in `jinshu053-independent-editorial-crosscheck-20261019.md`
and `research/people/jinshu-053-review-hold.md`. These are two digital witnesses,
not established independently collated editions; the evidence is not proof of
independent textual ancestry. Minimal proposed changes, retaining local
punctuation, are:

- `s0170`: `太子三子：、臧、尚，並與父同幽金墉。` →
  `太子三子：虨、臧、尚，並與父同幽金墉。`
- `s0171`: `字道文，永康元年正月，薨。` →
  `虨字道文，永康元年正月，薨。`

The existing compact extraction has 71 people and already identifies `p028` as
Sima Bin, with the Chinese name 虨 in an **uncertain** name assertion citing
these units. Its Chinese surfaces do not include 虨 at these two positions.
Restoration thus changes both source evidence and potential mention coverage;
do not merely replace hashes or automatically upgrade confidence. Rebuild the
packet against the proposed final source, assess candidates, aliases and exact
surface occurrences, and independently review any extraction changes. The
existing English s0171 idiomatic asserts “Eldest”, which that sentence alone
does not say; see the separately retained editorial review.

There is also an unresolved `s0205` source/identity question (`華暠` versus
`華廙` in another witness). It is not an authorized amendment; investigate it
within the whole-chapter review before sealing a final candidate.

## Existing editorial and date evidence

The existing version-3 editorial file contains eight accepted or revised
decisions by agent `bc-83725135-a43f-4a82-bf42-1773aa145950`; all eight
corresponding compact extraction repairs are already `applied`. Preserve this
entire prior review and its repair records exactly. In particular, s0063
idiomatic already equals the reviewed revision, not the old “imperial train”
text. Any new repair to an already repaired field must start from its present
reviewed value. The separate opening, middle and ending proposals and their
cross-checks in this recovery directory are drafts, with individual holds and
wording objections, not a complete independent approval.

The installed date report is `research-blocked`, not approved. Its reviewer
record covers 209 units, 188 item checks and 71 person checks; a finding retains
unresolved chronology concerning claims 101, 102 and 116 and p004's hint.
Changing source or extraction makes its source/extraction pins stale; archive
the exact report, never manufacture approval by substituting new fingerprints,
and conduct a fresh independent full audit of the final candidate. A complete
audit with unresolved evidence may correctly remain blocked. Resolve the
historical questions with evidence rather than inventing dates.

## Publication boundary and supported code

`PEOPLE_COMBINED_CURATION.md` describes a host-only reviewed English-repair,
identity and date workflow. It explicitly excludes Chinese emendations and
instructs against bypassing the boundary with arbitrary JSON patches. In
`scripts/lib/people-combined-curation-review.mjs`, `validateCombinedReviews`
replays independently approved literal/idiomatic repairs, optionally a pinned
reviewed whole-block reordering contract, and requires deep equality between
that replay and candidate source. It consequently cannot accept the Chinese
restorations. The staged documentation also says reordering is unsupported,
while the staged code has such a contract; that documentation/code discrepancy
does not provide a Chinese-emendation authorization. A prepared receipt cannot
legitimately cure the missing source-amendment protocol.

The combined path requires retained old editorial reviews plus exactly one new
independently approved component, preserves old repair rows and extractor
provenance, and checks whole candidate coverage, identity/date reviews and
reviewer exclusion from all extraction and amendment authors. It needs exact
before pins and an unfinished retained date generation with a compatible active
or research-blocked date claim; it is not a shortcut around these requirements.
Current shared queue revision has neither an extraction claim nor a date claim
for `jinshu/053`; this observation does **not** establish that no worker on
another host is active or has unsynchronized recovery artifacts. No local
`data/people/generated/date-workflow/jinshu/053` directory was observed. Recheck
fresh queue, process ownership, and retained state immediately before any
host-controlled work; do not take over leases or erase sticky evidence.

## Identity impact and proposed fail-closed design criteria

The earlier source-pinned identity inventory in
`jinshu053-publication-provenance-identity-assessment-20261019.md` found 80
resolution files containing 595 decisions referring to 45 chapter-local people.
These are potential dependencies, not proof that any individual decision is
wrong. Normal replacement extraction calls `invalidateResolutionReferences`
for the chapter; the combined publisher does not automatically clean up all
identity references when a person is removed or split. The latter's instructions
require preserving the prior decisions and approved curation receipt first,
then using the appropriate scoped pruning and the full people validator. Review
which decisions actually depend on amended identities; never blindly delete
them or count stale comparisons as freshly reviewed. Confirm the inventory at
the intended new staging revision before action.

A safe implementation would need an independently reviewed, tested protocol
for Chinese amendments, not a one-off edit: exact before source and target unit
pins; a limited replayable Chinese before/after contract with source witnesses
and author provenance; a separately independent source review; protection of
all unrelated content; old extraction/editorial/date and affected identity
decision preservation; final-packet coverage, aliases, mentions and person-ID
review; complete independent editorial, identity and date reviews of the final
bytes; and safe identity invalidation or reviewed retention. Publication needs
host-owned current queue claims, global lock and lease checks, a durable sealed
receipt, exact before/after and third-state rejection, crash recovery without
discarding sticky jobs, and current production validation before any complete
transition. Concurrency and all other writers must be fenced or explicitly
reconciled; a check immediately before a write is not atomic cross-process CAS.
This is a design checklist, not evidence that the existing publisher meets it.

After a supported independently reviewed transition, run scoped validation,
`people:dates:verify`, full people validation for identity changes, and verify
the resulting people pages, backlinks, search and ebook glossary. Stage exact
reviewed files and use the normal batched, CI-gated PR workflow. A source
candidate, validator pass, receipt, or partial review alone does not make a
chapter complete.
