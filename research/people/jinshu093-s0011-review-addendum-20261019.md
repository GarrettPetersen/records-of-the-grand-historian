# Jinshu 093 draft addendum — independent citation correction and hold path

The frozen `jinshu093-s0011-source-and-date-hold-20261019.md` incorrectly
attributes Shi Dan's `掩惡揚美` praise to Hanshu 83. Two independent reviewers
located it in [Hanshu 82](https://zh.wikisource.org/wiki/%E6%BC%A2%E6%9B%B8/%E5%8D%B7082).
Do not rely on the Hanshu 83 citation in the frozen draft. This addendum does
not itself approve the proposed reading, repair, or complete the chapter.

At staged commit `29469570bc6e35d27aae9cb9e75baea9d522abce`, the supported
date-report schema permits an independent `research-blocked` report with a
subset of reviewed units, people and item checks, exact source/extraction
fingerprints, source citations, substantive event ownership, and at least
one actionable finding. A later independent, complete audit is still needed.
The validator hashes external quoted excerpts but does not itself authenticate
their source, so reviewers must verify them independently.

The existing `recordDateAudit` implementation archives the previous report by
parsing and reserializing it, and writes via an unfenced separate caller; it
does not by itself ensure preservation of the original exact bytes under all
concurrent writer or crash scenarios. A safe future operational transition
requires host verification of current shared ownership and all relevant writers,
durable preservation and hash-verification of the original exact bytes, and a
reviewed serialization/recovery procedure. Do not execute `record` based solely
on this note or count a blocked report as approval. The local remote-tracking
queue snapshot contained no 093 entry, but it is not proof of current ownership.
No canonical files, ledger state, or prior approvals were changed.

The distinct combined-curation publisher is not a substitute for this
unresolved transition: its archive existence check followed by replace-style
installation can race the independent recorder, and the reviewed source-
amendment prototype does not yet establish independently sealed witnesses or
complete cross-chapter identity/reference dependency reconciliation. A pending
marker fence exists in the newer staged runner, but older live runners may not
honor it. No prototype has been approved for 093, and no runner should be
interrupted or lease taken over to attempt a transition.
