# Jinshu 127, s0214–s0242: partial source and extraction review (incomplete)

This is research, not an editorial decision, a date audit, an identity resolution, or chapter approval. I read the Chinese and both English fields in s0214–s0242, and examined their linked surfaces and affected person records in the candidate. No canonical data was changed. The findings below are not exhaustive; the passage requires another reviewer and a complete current-fingerprint audit.

## Inputs pinned by SHA-256

- Proposed chapter source, `jinshu127-s0177-two-dates-reconciled-20261020-incomplete/jinshu/127.json`: `cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264`.
- Proposed extraction, `jinshu127-p141-hint-proposal-20261020-incomplete/candidate-extraction.json`: `5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8`.
- `data/shiji/074.json`: `85df228671eddc0ae20503961a68521cdea1bf4d06f11ff0c25b5d09f26af8bc`.
- `data/shiji/047.json`: `7ce3307ddaf6b60725aec029784ed2bdf41a97fd379fbf2d065876366f3b37f1`.
- `data/zizhitongjian/113.json`: `8bda099a76798a47db9c137da4ee17c19a76f2f7c4d5ce3a2384dfa2eee33388`.

These are local working-file bytes, not assertions about the committed version of any cited chapter.

## Identity: short name 接 conflated with 接輿/接予 (p133)

Jinshu s0231 lists 接、慎、巴生、淳于、鄒、田 among eminent men associated with Qi and Lu. Candidate p133 calls 接 “Jie Yu / 接予”, marks that expanded name strongly inferred, and assigns it BC 350–300. Shiji 074 s0047 instead names 接子 with 淳于髡, 慎到 and 田駢 among Qi's Jixia masters; this makes 接子 a well-supported candidate for the Jinshu 接, although the Jinshu passage itself supplies only the short form. Shiji 047 s0445 explicitly calls 接輿 a Chu figure who encounters Confucius, a very different historical setting. The candidate gives no source establishing that these are the same person, so the specific Jie Yu / 接予 identification and its date should be held for an independent source-based identity decision, not propagated or merged. The Shiji parallels support investigating 接子 rather than automatically replacing the preferred identity without review.

## Chronology: unjustified AD 401 assigned to Wang Shi and his family

Candidate people p143–p147 all carry `active` hints AD 401. The extraction's attestation claim array indices 335–339 repeat western year AD 401 with `sourceDate.text` `建平次年`, citing Jinshu s0234 for p143–p146 and s0238 for p147. Neither sentence contains that source-date text. s0234 begins `先是` (“previously”), an analepsis that cannot simply inherit the preceding `明年` as the episode's precise year.

Independent chronological counterevidence exists in the local Zizhi Tongjian 113: s0004 heads the year 元興二年 (AD 403 in the source heading), and s0032–s0033 describe Wang Shi raising forces and Murong Zhen capturing him. This contradicts treating the Jinshu account as sufficient proof of an AD 401 uprising/capture. It does not, by itself, establish the year of every individual relative's activity, death or whereabouts. Remove or reassess the five unsupported precise-year attestations and hints through the documented repair and fresh independent date review; do not mechanically replace every family member's hint with AD 403 or copy a non-verbatim date into `sourceDate.text`.

## Translation findings

- s0241: `崩即崩矣，終不改帝號` is the condemned Wang Shi maintaining the conceit of imperial status: 崩 is the euphemism for a sovereign's death, not a building/state “collapse.” Both English fields currently say “Collapse it may collapse, I will never change the imperial title.” A reviewable rendering is: “If I must die, then I die; I will never relinquish my imperial title.” Preserve speaker attribution and the preceding blow by the ring of the blade; no source change is authorized by this note.
- s0216: `慕容法及魏師戰…魏師敗績` describes Murong Fa fighting **against** Wei troops, who were routed. The literal field says “Murong Fa together with Wei troops fought,” falsely implying alliance; the idiomatic field correctly has him clash with Wei. A literal correction should reflect the adversarial relation and retain the place conservatively. In particular, independently investigate the local place string `濟北之摽榆俗` before endorsing the existing interpretation as a “ford.”
- s0227–s0229: the idiomatic fields omit source details rather than merely condensing: the three thousand cavalry, Zhen's title, Han Fan's several offices and the commandery/county inspection, and Han's fairness and integrity. Editorial review should restore these details, with title translation checked independently.
- s0234's idiom “a full family of bogus titles” omits the father's, elder brother's, and younger brother's distinct titles. It also adds “bogus” as narrator characterization where `自稱` and `號` themselves record Wang Shi's acts of claiming and conferring titles. Review an idiom that preserves the specific claims without adopting an unsupported judgment.

## Missing callbacks / named offices to investigate

In s0236 the question explicitly refers to Wang Shi's father and brothers, and his answer identifies the retired emperor and the east- and west-campaigning generals. The candidate's surfaces do not link these s0236 Chinese or English references to existing people p144–p146, although the immediate s0234 context gives the relevant family roles and titles. Review the spans and the collective brothers reference under the schema before adding links; do not invent individual names. Likewise inspect the s0234 title mentions: p143 has the Taiping emperor title in its names but no matching title surface in the reviewed span; p145/p146 have general roles but their specific titles `征東將軍` and `征西將軍` are not present in their name arrays. The English s0234 field currently loses these particulars, so editorial repair and extraction reconciliation must be coordinated.

No claim is made that every name, date, relationship, translated phrase, or earlier/later occurrence in this range is correct. Other independent source, chronology, editorial, identity, and publication gates remain open.
