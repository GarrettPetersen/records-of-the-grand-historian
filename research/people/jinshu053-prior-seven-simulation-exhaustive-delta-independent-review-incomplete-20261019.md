# Jinshu 053: independent review of the prior seven-decision simulation delta

Status: **incomplete research; not canonical application, full editorial approval,
date approval, identity clearance, or chapter completion**. Reviewed 2026-10-19
UTC. This review examines the old seven-decision simulation, not the later
reassessed translation decision document. Do not transplant its candidate IDs,
spans, or hashes into a different source packet without rechecking them.

## Evidence and method

Compared retained reviewed V2 extraction
`jinshu053-source-reviewed-reconciliation-v2-incomplete-20261020/reconciled-extraction.json`
(SHA-256 `badd6a43e26940d85d3e3673a1533287fda4c9ab9dd78fea6afc970de756b4cb`)
with old simulation
`jinshu053-seven-reviewed-simulation-20261019-incomplete/proposed-reconciled-extraction.json`
(SHA-256 `2eac6cd56f93ccf4590b1ae756881971daa5c9808e372ca7172e4914af825788`).
The latter used the original decisions document SHA-256
`c009fe89a8d501132b56a96895e8ad1d2e4979627eb9de2b520f4b5b23a48175`,
not the later reassessment. Its source SHA-256 was
`8c97585a324c7e8ee539083672dad7911638e7d6386418f814287d2c9e31496f`.
Built the prior simulation's packet with the retained pinned fixture
`/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs`;
compared every candidate-disposition delta and every mention by unit, person,
kind, and exact surface, not unstable renumbered mention IDs. Inspected the
Chinese and English context for every changed Jia candidate. This was not an
independent review of every unchanged claim or of the whole chapter.

## Twenty-three former mention references newly auto-disposed

Every row below was a candidate reference on a V2 mention. The prior simulation
removed that reference and added a non-person disposition, even where its
mention survived. IDs are abbreviated to the suffix following
`jinshu:053:cand_`; titles and occurrences are as in the prior packet.

Eleven `Prince` fragments occur within these longer title mentions, so preserve
their respective reviewed person links if the final packet confirms the same
text and geometry:

| Unit | Candidate suffix | Person | Reviewed mention |
|---|---|---|---|
| s0199 | 194668bbf5e9ac56 | p001 | Prince of Guangling |
| s0063 | 200b2d13ba5a3bd6 | p051 | Prince of Liang |
| s0063 | 6b8390c3b5e7e7f5 | p052 | Prince of Huainan |
| s0108 | 53e4f0d3d4cdc1db | p054 | Lun, Prince of Zhao |
| s0111 | 9e13cb8aefd7aadf | p054 | Prince of Zhao |
| s0172 | 64a2c5fedcc5df96 | p028 | Prince of Nanyang |
| s0174 | 6f06d15ca1c4a827 | p068 | Prince of Linhuai |
| s0179 | 789300eaa5a46e24 | p054 | Lun, Prince of Zhao |
| s0183 | a9b9b1b7929dc11c | p054 | Lun, Prince of Zhao |
| s0183 | b0652f53467c579a | p068 | Prince of Puyang |
| s0207 | 5021a0321e0edaa8 | p069 | Prince of Xiangyang |

Additionally s0047 `e52f72d263aa7470`, `Crown Prince`, was p001's
title-reference; its new `not-person/place` disposition is incorrect. The
Chinese 太子 and the actual English title identify the prince.

The following eight `Jia` candidates refer in their English context to Empress
Jia p026, not a family or faction; retain/correct the person mentions and
candidate references after exact final-packet review:

| Unit | Candidate suffix | Context |
|---|---|---|
| s0027 | 1ee0b9e064af05cf | Jia was not his mother; 賈后 |
| s0038 | 324a4fd5aa853ebc | second `Jia`, after `Jias`: Jia died; 皇后萬歲後 |
| s0045 | 79629cfec13898b9 | Jia feigned illness; 賈后 |
| s0084 | 3b116eef00559636 | possessive Jia's halls, contextual reference to her |
| s0085 | e229e07affec07a9 | Jia was sick; 中宮 |
| s0088 | a48c019e8d36bd29 | Jia recalled earlier order; 中宮 |
| s0091 | e2a1ffa5fd047b62 | Jia taunted; 中宮 |
| s0119 | 94a69fde6c59ef80 | Jia heard and ordered; 賈后 |

Three other `Jia` candidates are collective English expressions, not
individual name uses: s0037 `2f82781097ad8a15` (`Jia clan`, 賈氏), s0039
`1ff92634eb5f2a97` (`Jia kin`), and s0189 `60911611b781fdae` (`Jia kin`,
corresponding in the English summary to 外戚). Their former isolated `Jia`
mentions attached to p026 should not be blindly restored simply because V2
contained them. Review the underlying Chinese/English translation independently
and preserve valid individual mentions elsewhere in those sentences.

## Mention and candidate deltas beyond those references

An exhaustive comparison by unit, person, kind and exact surface found four
V2-only English mention surfaces and one simulation-only surface. The old
s0065 p037 `Wang` was transformed into p037 `Crown Princess Wang`, an incorrect
father-to-daughter identity assignment; the crown princess is p038. The three
removed s0132 English mentions were p002 `Hui`, p004 `Wu Di`, and p001 `Yu`;
the rewritten text does not contain those surfaces, so they must not be
restored as stale exact spans. This observation does not by itself decide
whether contextual references such as 先帝 require other supported mentions.

The old simulation's revised s0065 still has two unaccounted candidates and
must distinguish the destination Jinyong City from individuals. Prior retained
independent review identifies Consort Shufei Xie as p003, Jiang Jun as p027,
and the crown princess as p038; their exact new spans, occurrences and
candidate IDs must be regenerated against the **reassessed** actual source.
The two removed old dispositions (`4dc7ee073fe1e294` and
`21ec1530f0b812ef`) also require inspection against the fresh packet; do not
recreate obsolete detector IDs merely to preserve prior counts.

## Handoff and gates

Rebuild from the latest independently reassessed source and packet. Compare
all semantic person/mention/candidate/claim changes, validate exact spans and
candidate coverage, and independently review source-based corrections; a
green structural validator cannot detect a wrong-person association. Preserve
only source-supported prior decisions whose context and geometry still match.
Editorial closure, current-fingerprint date re-audit and identity resolution
remain separate downstream requirements. No canonical state was written.
