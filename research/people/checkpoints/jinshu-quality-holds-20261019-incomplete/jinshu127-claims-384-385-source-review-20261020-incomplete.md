# Jinshu 127: focused source review of claims 384 and 385 — incomplete

This is a focused evidence review by `/root/repair108`, separate from the
earlier `/root/date_slice` reviewer and the retained date-repair workers. It
is not a complete date audit, identity decision, repair approval or publication
authorization. No canonical data, claim, lock, queue, or Git index was changed.

## Exact inputs

Staging revision `d6bd86f2a00a63672a6e581d137eb350bee1227e` contains the
following exact byte-SHA-256 inputs (the local chapter and extraction also
matched these bytes when checked):

- `data/jinshu/127.json`: `ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a`.
- `data/people/extractions/jinshu/127.json`: `e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`.
- `data/people/date-audits/jinshu/127.json`: `7a499e0d0157395b1f6a8676e0a78f9f7e621732696dae6a24edabb648f9ede5`.
- `data/jinshu/128.json`: `8b301825b81b5df574732ea81b2ec17ee1fa25a4761e39775df575ea9505f35b`.

The staging report is the later **needs-revision** report, not the older
local audited report. Claim numbers are positions in the exact date packet for
this generation, not durable identifiers across extraction changes.

## Claim 384: Chao's father

In s0272, `初，德迎其兄子超于長安，及是而至。` identifies Chao as De's
elder brother's son and says Chao arrived. It does not date the father's
own living activity; `義熙前後` is absent from the sentence. The extraction
attestation for p163 nevertheless attaches that text and an AD 403–405
interval, and its active hint says AD 405. I concur that the reference alone
cannot support those as the father's living-attestation dates.

The adjoining chapter provides stronger contrary evidence without requiring a
guess at a Western year. Jinshu 128 s0003 says `德兄北海王納之子`, naming
Na, Prince of Beihai, as Chao's father and De's brother. Its s0006 says Fu
Chang seized and executed Na and De's sons; s0007 says Na's wife was then
pregnant, and s0009 reports the birth of Chao after her escape. Thus this
history presents Na as already dead before Chao's later arrival in s0272.
The [online Jinshu 128 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7128)
also preserves this sequence. This textual comparison supports investigation
of p163 as Na, but does not authorize a cross-chapter or local identity merge.
The existing chapter-subject duplicate review correctly cautions against
merging generic brother records solely on the kinship label.

Safe repair direction: retain the evidenced kinship and Chao's later arrival,
but do not attach the arrival as Na's living activity or retain the AD 405 hint
without independent support. A later familial reference is not by itself a
dated historical action by the father. If the repaired schema uses a
retrospective reference, its content and any event date must be reviewed and
supported separately; do not turn the later reference date into a life date.
Any specific date or bound for Na's activity/death needs separately verified
chronological evidence. An unresolved placeholder preserves uncertainty but
cannot pass the independent date audit.

## Claim 385: De's father in a dream

Jinshu 127 s0273 says `德夜夢其父曰` and then represents the father's speech
inside De's dream; s0274 calls him `先帝` in De's account of that dream.
This supports the dream-attribution already recorded for p164, not the claim
that the father lived or personally acted in AD 337–348 during this event.
Those two endpoints do not occur in s0273 and `先帝` itself is not a date.
The existing p164 hint has the same endpoints and needs a separately sourced
check rather than automatic removal or uncritical retention.

S0003 says De is `皝之少子`; read with s0273 it supports comparing p164 with
p002 (Huang), as the existing independent duplicate-review note observes.
The identity is contextual, not a personal name explicitly written in s0273.
No identity merge or inference about whether a separately sourced reign range
is an activity range is approved here. In particular the p002 attestation also
attaches AD 337–348 to `皝之少子` at s0003, so the same date-evidence issue
must be checked for p002 as well, not simply copied across a merge.

Safe repair direction: preserve the dream's attribution to De as dreamer and
his father as represented speaker; remove or replace the unsupported
living-attestation interval only through the reviewed repair workflow. A
separately supported retrospective reception record may represent the dream,
without implying the father physically spoke then. Its chronology requires its
own evidence, not a fabricated exact year.

## Remaining gates

This review does not decide other attestations, hints, relationships or
identities. Prepare exact candidate changes with preserved history and author
provenance; review those changes independently, rebuild fingerprints and run
the complete fresh independent date audit. Editorial, identity, validation,
rendered links, ebook, publication and CI gates remain. The new evidence does
not make the chapter complete.
