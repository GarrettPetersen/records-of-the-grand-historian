# Jinshu 022 Dayu hymn / p111: held event research (incomplete)

This is a focused independent source check and proposed representation, not a
date audit, extraction approval, identity decision or publication. No canonical
files, prior review, claim, lock or queue were modified.

## Pinned evidence

- Local Jinshu 022 source byte SHA-256:
  `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- Five-kinds composed candidate byte SHA-256:
  `f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`.
- Retained review-4 byte SHA-256:
  `e6d5d13e47f372a493615cbc55682bb64c0dd61250bcf86e0a73fbf04a09e1e6`.
- Earlier focused triage SHA-256:
  `264a192e21b19dd3a90d08de6282cb7b40db08fb382d9f9e609e4efebf820c90`.

The item numbered `claim-796` in review-4 is the 784th claim (zero-based
index 783) in the pinned five-kinds candidate; its preceding political claim
is 783rd and its following undated attestation is 785th. Always match the
complete row, not a numerical position alone, after later edits.

## Reading the whole context

At s0562–s0566, 泰始九年 dates Xun Xu's pitch-pipe investigation; following
completion of the pipes, he oversees music and assigns two dances, whose
lyrics are attributed to Zhang Hua. s0580 is the heading for the Dayu song
by Zhang Hua. s0584 speaks in the hymn's first-person plural voice of 我皇;
s0588 explicitly presents the Dayu dance as displaying virtue and merit.
The hymn praises a sovereign as ruling; no specific sovereign is named in
that line, and it gives no birth, death, age or era-year. Its representation
must preserve an unnamed person/reference and a separate unresolved identity
question, not infer an identity merely to tidy the event.

The separate s0613 says 咸甯元年 temple music adopted two dances made by
Guo Xia, Song Shi and others under Xun Xu. This is evidence of a dated temple
adoption, not an explicit date for the act of praising 我皇 in s0584 or a
death date. Even though the text connects dances with the same titles and
Zhang Hua lyrics earlier, turning those temporal markers into a tight date
span for this specific lyric praise requires an inference about the temporal
relationship between creation, lyrics, praise and later temple adoption;
the cited units do not explicitly state 泰始九年至咸甯元年. Review-4
rejects that interval, and this focused reading finds no basis to overrule it.
Nor does this report establish a separate one-sided date for the honor.

Review-4 correctly rejects the asserted 273–275 interval, but explicitly
requests retaining `kind: retrospective-reference`. Its rationale treats
the object of praise as an earlier recipient rather than the lyric's own
reigning sovereign. This source does not itself establish a *later* reception
of a previously existing person or work; a historian's later quotation of a
hymn is not sufficient by itself to establish a later reception event.
Conversely the hymn's voice is rhetoric and does not provide an independently
dated reign or establish an identity. An independent full reviewer must
adjudicate this classification disagreement rather than treating this focused
research as a reversal of review-4.

## Exact source-conservative proposal for consideration

Present complete row, reproduced from the pinned candidate:

```json
["p111","event-participation",{"kind":"retrospective-reference","role":"honoree","action":"praised as the reigning sovereign in Zhang Hua's Dayu hymn","dateContext":{"sourceDate":{"text":"泰始九年至咸甯元年","polity":"晉","ruler":"武帝"},"westernBounds":{"onOrAfter":{"era":"AD","year":273,"precision":"year"},"onOrBefore":{"era":"AD","year":275,"precision":"year"}}}},"explicit",["s0580","s0584"]]
```

A candidate, not an approved edit, is to keep the act of praise and both
source citations, remove the unsupported whole date context, and represent
it as artistic rather than later reception:

```json
["p111","event-participation",{"kind":"artistic","role":"honoree","action":"praised as the reigning sovereign in Zhang Hua's Dayu hymn"},"explicit",["s0580","s0584"]]
```

This does not say that the sovereign performed or witnessed the song, was
born or died in 273–275, or was specifically Emperor Wu. Nor should a date
be inserted in p111's active hints. The adjacent political claim about the
lyric's sovereignty imagery and undated attestation already preserve the
underlying source; the proposed row adds the distinct fact of authorship and
praise context rather than inventing a chronological event. The literary
category and whether this row is redundant with the attestation are editorial
questions for the independent reviewer. If that reviewer finds a genuinely
later performance or reception, it needs separate cited evidence and its own
precise relation to the sovereign, not an assumed retrospective label.

The date-repair interface preserves non-date event fields, so a date-only
patch cannot adopt this classification proposal. Coordinate editorial and
identity handling first, then regenerate fingerprint-bound evidence, run the
full extraction checks and obtain a fresh independent complete date audit.
Prior failed findings remain in force; this report does not clear them.
