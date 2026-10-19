# Jinshu 053 childhood combined proposal: independent source review

**Narrow research judgment only.** I did not author the combined proposal; I
previously reviewed its claim-110-only predecessor, so this is not a blind
review. It is neither a recorded repair nor a complete independent date audit,
and does not authorize production publication or a change to the current hold.

Proposal byte SHA-256
`85d14c33d6abff5760b297518ece45a84487981cc9f4b175703d01a3eff1aa97`;
companion review byte SHA-256
`b8dc39aa880ee6a704468b9685582409841be16d32c538a2a3e61d229011fe65`.
The semantic source fingerprint is
`sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`,
and extraction fingerprint is
`sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`.
All five `before` fields match their exact rows or hint arrays in staging tree
`16114ce285ca2c48e0d154f8a89112a0eb8d4bf6`. These are byte/semantic fingerprints,
not interchangeable and not transferable to subsequently edited inputs.

## Common source and calendar reasoning

Jinshu 053 s0002 introduces crown prince 遹, local p001; s0003
`幼而聰慧，武帝愛之，恆在左右` says he was bright as a child, Emperor Wu
loved him, and he was continually kept close. This is a general relationship,
not a uniquely dated incident or a start-to-end time series. S0006 states that
Emperor Wu mounted a tower to watch a palace fire; s0007 says the prince, aged
five, drew the emperor into darkness. S0006 supplies the antecedent and event
context for s0007's 帝, and the children’s crown-prince designation is narrative
reference, not proof he held the title at that age.

[Jinshu 004](https://zh.wikisource.org/zh-hans/%E6%99%89%E6%9B%B8/%E5%8D%B7004)
explicitly dates 武帝's death to 太熙元年四月己酉; local Jinshu 003
s0635–s0636 independently locates the date context and death in its annals,
though both chapters are parts of the same history and are not independent
historical traditions. The [University of Mississippi era table](https://home.olemiss.edu/~gg/lidaijiy.htm)
maps 太熙 1 to 290; [Chinese Text Project](https://ctext.org/datawiki.pl?if=en&res=637909)
also maps Wu's cited death to that Western year. The fourth lunar month is not
the lunar-new-year boundary that might extend a named lunar year into the next
Western calendar year. This supports a year-precision **inclusive latest year**
on the reported occurrences, conditional on the text's identification and
historical narrative. It does not establish an exact day, the year of the fire,
a birth year, or an event's beginning. [Taiping Yulan 148](https://ctext.org/taiping-yulan/148)
quotes Wang Yin's Jinshu as saying six or seven for the fire anecdote; do not
silently reconcile that alternative with the five stated here.

## Separate decisions

| Proposed target | Judgment and scope |
| --- | --- |
| **claim-110**, p001, age five | **Support narrowly.** Replace the unsupported AD 266–290 interval with `onOrBefore AD 290`, retaining source `太子時年五歲` and age five. The existing `sui` convention is not separately spelled out in those characters; preserve it as the inherited reckoning, not independent proof of an exact birthday. |
| **claim-101**, p001, childhood affection | **Support narrowly.** The source expressly attributes Wu's affection and constant proximity to the child, so a latest year for that described relationship is defensible; 290 is not its start, its exact date, or a year-by-year activity range. |
| **claim-102**, p001, fire | **Support narrowly.** Five-year-old Yu is the actor; s0006 identifies the emperor drawn away in s0007 as Wu. The reason cites both units, even though the retained claim evidence list cites s0007 alone; a full auditor should inspect and cite s0006 for the antecedent rather than suggest s0007 alone explicitly names Wu. `pulled ... away` is a summary of drawing him into the dark, not a claim of the fire's year or that the fire was extinguished. |
| **claim-116**, p004, Wu's affection | **Support narrowly.** This is the same s0003 relationship from Wu's side, not a separate fire or year-wide activity assertion. Its upper bound depends on Wu's death, not a date explicitly stated in s0003. |
| **hints-p004**, Wu | **Support as a provisional, directional hint**, provided consumers preserve the words “on or before” and do not turn `AD 290` into an attested event date. The parenthetical accurately distinguishes an undated source description from the externally derived bound. Reviewer should verify downstream displays and identity workflows on the final candidate; a schema pass alone cannot establish that direction survives presentation. |

The supported one-sided values do not imply continuous activity from any
invented lower endpoint; their event descriptions also do not purport to give
the relationship's exact duration. The proposal's retained claim certainty
`explicit-event-contextual-date` should be understood as explicit event plus
contextually derived bound, not a claim that the Chinese prints `AD 290`.

This review did not reproduce the author's full candidate-validator test or
independently establish the accuracy of every inherited claim. The old
research-blocked report cannot approve the changed extraction; retain it and
its evidence, reconcile ownership without touching live leases, and require a
fresh separate complete audit of every item and source unit. Full editorial
and identity work, source-variant analysis, display, backlink, ebook and
publication gates remain open. No canonical source, extraction, decision,
audit, queue, Git index, lock, lease, build, or worktree was modified.
