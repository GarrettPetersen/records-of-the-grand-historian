# Independent Jinshu 025 Wang Mang bound review — incomplete

Reviewer: `/root/seal_materialize`, 2026-10-19. This is a narrow review of
the proposed repair, not an approved date audit, chapter completion,
curation receipt, or permission to publish it.

## Source and interpretation

[Hanshu 98, revision 2180641](https://zh.wikisource.org/zh-hant/%E6%BC%A2%E6%9B%B8/%E5%8D%B7098)
reports Wang Mang changing black sable to yellow, and the dowager directing
her staff to use black; the following paragraph gives her death in 建國五年,
second month, 癸丑. This digital text identifies itself as revision 2180641.
The [Taiwan Ministry of Education's reign-title index](https://dict.revised.moe.edu.tw/appendix.jsp?ID=43&ver=0)
lists 始建國 as AD 9–13, making year five the conventional AD 13 label.
The statement that the change preceded her death is an inference **conditional
on the Hanshu narrative and attribution**, not an explicitly dated edict in
the Jinshu. The text does not justify an AD 9 lower bound or a precise Western
day for the change. Its stated death month and cyclical day are not assigned
as the change date.

The candidate's `westernBounds.onOrBefore` has one AD 13 year-precision
endpoint. In staging's `people-date-values.mjs` the label for this field is
"on or before", and it carries no lower endpoint; on this evidence that is
conservative for an inferred event before the terminal death year. The claim
retains `uncertain` certainty. The suggested activity hint, however, reads
"one reported yellow-sable change before Dowager Wang Zhengjun’s death: on
or before AD 13" without naming the account or stating the inference's
condition. Before canonical curation, qualify it along the lines of "if the
Hanshu narrative is accepted, the reported yellow-sable change preceded the
dowager’s death, conventionally AD 13"; maintain a normalized `AD 13` hint
and preserve the source and inference in the curation/date-audit record.
Do not imply a direct Jinshu date or an independently corroborated event.

## Materialization check

The saved candidate SHA-256 is
`8672e9e538402ebfa1070f903c5a98afac48665db0bf8e0d7b3b0c8fe2a8d012`.
The materializer pins the source, extraction and editorial-history byte
hashes, checks exact before-values, refuses an existing destination, and
reverses its intended changes to compare the whole remaining extraction.
I reran `test-jinshu025-wang-bound-20261019.mjs` with the e02a staging
loader and the 16-file stage-pinned fixture: it passed strict compact
validation (607 units, 681 candidates, 173 mentions, 448 claims, no alias
disposition conflicts), missing-hint and three tampered-input negative
controls, byte-identical source and history, and no-overwrite checks. The
only structural extraction changes are claim index 140's chronology and the
p047 active hint; no other date repairs or claims were altered. The test
uses the unchanged prior editorial history, not a new date approval.

Retain the candidate as incomplete. An independently reviewed qualified
repair, evidence-bearing curation receipt, complete fresh date audit on the
final fingerprints, remaining chronology work, identity review, and
publication and ebook checks are still required. No queue, lease, canonical
file, index, worktree, or build was changed in this review.
