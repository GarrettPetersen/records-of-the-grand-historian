# Jinshu 129 narrow cross-unit experiment — do not deploy

This is an engineering experiment, not an approved reconciliation fix, source
review, or chapter completion. The patch alongside this note was tested in a
small disposable scripts-and-fixture snapshot of staging revision
`4556a370572de46f7a83ffa5e6c6b374980d0755`; it was not applied to the shared
checkout or canonical chapter.

The patch removes the prior-surface branch that copies a disposition between
different units merely because the language and spelling match. Its same-unit
remap branch now requires identical Chinese, idiomatic and literal unit text,
and identical occurrence geometry. It does not remove explicit review choices.
The patch checks cleanly against the original staged file.

Results:

- The original staged applier self-test passes. The patched applier self-test
  fails with `Fragment reconciliation fixture left unresolved candidates`.
  A passing test would require independently justified explicit decisions or a
  reviewed workflow change, not simply suppressing the failure.
- The existing Jinshu 129 regression reaches and passes its first checks for
  the two original wrong cross-unit dispositions and the same-occurrence
  changed-ID remap, but fails its synthetic new `軒轅` occurrence: the separate
  global alias heuristic automatically links it to the Yellow Thearch p122.
  The regression aborts there, so its later checks did not run.
- Other paths remain unsafe, including retained surviving candidate IDs without
  proven unchanged context, same-unit bilingual glossary inheritance, global
  alias matching, stale span and claim/person mutation. The current patch does
  not establish fail-closed candidate accounting or reviewed provenance. It
  must not be used to materialize or publish the research candidate.

The regression is
`research/people/jinshu129-disposition-regression-20261020-incomplete.mjs`.
Further work needs a source-reviewed per-unit contract and revised production
fixtures, while preserving all editorial, date, identity and publication gates.
