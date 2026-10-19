# Independent check of Yingchuan working-source candidate — incomplete

This is an artifact and narrow textual check, not an editorial approval, full
chapter source review, date audit, identity decision, or authorization to apply
the translation. I read the preview script but did not execute it, since it
writes research artifacts. I recomputed the scanner output in memory directly
from the pinned current source and candidate.

- Current `data/jinshu/022.json` byte SHA-256:
  `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- Working candidate byte SHA-256:
  `7a722b2f0163d66e2339b8ffb82b8771988562040323257808545a323463f4fc`.
- A recursive parsed JSON comparison found exactly four changed leaves: the
  literal and idiomatic English fields of s0232 and s0233. No Chinese, source
  order, metadata, other translations, or other JSON fields differ. The
  preview script checks the source byte hash and Chinese text, requires exactly
  one English translation per target and uses exclusive output creation.
- The separate working-evidence note correctly warns that unchanged source
  translator/model metadata is illustrative only, not authorship attribution
  for the new wording. Production authorship and editorial provenance require
  their own review under repository conventions.
- Rebuilding both extraction packets in memory with the actual scanner exactly
  reproduces every before/after fingerprint and target-candidate array in
  `yingchuan-source-working-scanner-delta-20261020-incomplete.json`. The changed
  unit digests are exactly s0232 and s0233; the Chinese fingerprint is
  unchanged; all scanner candidates outside these two units are identical.
  Both full packets happen to contain 749 candidates, but identical totals do
  not mean identical entries. The old `Bright` and s0233 `Heaven` candidates
  disappear; new `How` and `Radiant` candidates appear. The retained s0232
  `Heaven` candidate has changed code-point offsets. Rebuild and review exact
  dispositions and mentions rather than transplanting old accounting.

The corrections remove an unsupported “queen mother” and feminine pronoun,
and the s0233 idiom no longer asserts a founder or an arrival “here.” The
working alternatives remain interpretive: “our” and singular “lord” choose
number/referent; “attending to” and “serves” settle an ambiguous relation to
Heaven; and “the Lord's blessings” chooses an interpretation of 帝 and its
relationship to 祉. “First arrive” can suggest a more exact temporal assertion
than 肇臻 alone warrants. The added possessive and plural are English choices,
not explicit genealogical or chronological evidence. The existing hymn
heading and related Jinshu evidence make a particular ancestor plausible but
do not establish that the epithets uniquely identify that person. A Shijing
parallel was supplied by another reviewer; my attempt to inspect that specific
ctext page returned HTTP 403, so I do not independently certify it here.
Retain the previously documented lexical and identity uncertainties and do
not present this preview as a final wording determination.

Source edits change downstream fingerprints and candidate surfaces. An
independent editorial decision with source witness, coordinated extraction
reconciliation, independent fresh identity/date reviews, production validation,
and the normal publication and cross-chapter identity gates remain required.
No canonical file, queue, lock, lease, Git index, or worktree was changed by
this check.
