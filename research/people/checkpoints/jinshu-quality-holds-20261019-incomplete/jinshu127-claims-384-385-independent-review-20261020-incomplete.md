# Independent review: Jinshu 127 claims 384 and 385

Reviewer `/root/jin_candidates`, separate from the focused evidence author
`/root/repair108`. This checks only the source assertions and proposed repair
directions in that note, not a candidate extraction, whole-chapter audit,
identity decision, or publication approval.

## Inputs and scope

The reviewed note `jinshu127-claims-384-385-source-review-20261020-incomplete.md`
has byte SHA-256 `7bd89db66e6b79a2edc39a3ee725d4de7807f8db68c5f7c5a078e9c3b395f4fc`.
I checked actual local sources and extraction, with byte hashes respectively:

- Jinshu 127 source: `ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a`.
- Jinshu 127 extraction: `e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`.
- Jinshu 128 source: `8b301825b81b5df574732ea81b2ec17ee1fa25a4761e39775df575ea9505f35b`.

These agree with the reviewed note's stated staging inputs; I checked the
remote staging ref still pointed at `d6bd86f2a00a63672a6e581d137eb350bee1227e`.
Claim IDs here are positional and cannot safely be reused against a revised
extraction.

## Findings

**384 / p163 — support with qualification.** Jinshu 127 s0272 has De summon
his elder brother's child Chao and says Chao arrives; it supplies neither
`義熙前後` nor AD 403–405. An event involving the child does not by itself
establish the father's activity; p163's separate AD 405 activity hint also
cannot be derived from this sentence. I agree with the proposed removal or
replacement of the unsupported life attestation, without guessing a new date.
Preserve existing kinship evidence and review the precise representation of
any later reference. A retrospective-reference is a possible reviewed
representation, not an instruction to assert an independently dated event.

The cross-chapter argument is meaningful but is not itself an authorized
identity merge. Jinshu 128 s0003 explicitly says Chao is the son of De's
elder brother Na, Prince of Beihai. In s0006–s0009 it reports Na's execution,
his wife Lady Duan's pregnancy, and Chao's later birth after the women escaped.
Read as the same Chao and De, this makes Na the natural cross-chapter
candidate for the intermediary represented as p163 and places Na's execution
before Chao's later arrival in 127. The sentence does not name p163 locally,
and separate resolver evidence must test whether this exact local record, the
De/Chao local records, and their cross-chapter counterparts refer to those
people before any merge. This sequence does not establish a Western death
year. It also does not disprove every possible independent basis for an
activity hint; inspect provenance before changing it.

**385 / p164 — support with qualification.** In s0273 De dreams his father
speaks, and in s0274 De refers to `先帝` in recounting the dream. The cited
s0273 does not itself say `先帝`, AD 337 or AD 348. It cannot support a
living attestation dated to the dream or a chosen reign interval. Existing
claim-358 explicitly attributes dream-speech to the father with De as dream
witness; retain that distinction. A separate review must establish any date
or bounds for the dream and any activity hint for the father; neither follows
from the dream alone.

S0003 identifies the named subject De as Huang's youngest son; s0273 calls
De's dream figure his father. This supports investigation of p002/p164 as
the same person, but neither an automated merge nor a specific date follows.
The paired local De records (p001 and p154) also need contextual identity
review. Original claim-70 attaches AD 337–348 to p002 and s0003, which does
not express those endpoints; independently review that claim and hint too.

I found no discrepancy in the focused note's source quotations or proposed
conservative direction. Its caveats are material: no exact repair was
validated here, and a fresh complete independent date audit after the final
reviewed source and extraction, plus editorial and identity gates, remains
necessary. No canonical file, claim, lock, queue, or shared Git index was
changed.
