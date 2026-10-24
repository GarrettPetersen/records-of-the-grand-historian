# Jinshu 127: independent Murong De identity review (incomplete research)

This is an independent review of the seven local IDs in the research-only
`jinshu127-murong-de-resolution-proposal-20261020-incomplete.json`. It is not a
production identity decision, a whole-chapter review, or a full-corpus identity
audit. The reviewed candidate is not the current canonical extraction.

## Pinned evidence and source identity

- Recomputed SHA-256 of the proposed source: `cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264`.
- Recomputed SHA-256 of the proposed extraction: `5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8`.
- The seven IDs are `jinshu:127:p001`, `p020`, `p045`, `p066`, `p078`, `p114`, and `p154` (the latter six abbreviated here; all carry the same `jinshu:127:` prefix). Their mention groups advance through a single biography, rather than representing seven separate people.
- Unit s0003 identifies 慕容德, courtesy name 玄明, as 皝's youngest son. At the p001/p020 boundary, s0037 names 德 to command from Ye and s0038 continues with 德 dispatching troops from Ye. For p045, s0083 says 鍾, who had advised 德 to claim a title, sent word to him, continuing the narrative after s0081. For p066, s0111 describes 德 taking the field personally and s0113 refers to 辯 hoping 德 would do so. For p078, s0139–s0141 continue the same ruler's southern campaign. For p114, s0197–s0198 continue the narrative about 德. For p154, s0243–s0244 introduces Jin fugitives fleeing to 德, and s0271–s0273 continues the biography through his illness, nephew 超, and a dream of his father. Units s0276–s0279 finish the death and posthumous title. These transitions support the proposed same-person interpretation; this is not a finding that each individual mention or extracted claim is accurate.
- `p002` and `p164` separately denote the father, Murong Huang, in the candidate. Their separate identity resolution remains outstanding; this proposed seven-person merge does not resolve those IDs. His dream appearance and the identity of `先帝` are represented in the extraction and should receive normal source/claim review; this observation does not independently approve all associated assertions or dates.

## Preservation and simulation

- Independently rebuilt the extraction packet from the pinned source and ran strict compact validation on the pinned candidate: 278 units, 165 people, 690 mentions, 916 claims, 18 repairs, and zero alias-disposition conflicts. This is structural validation, not editorial, chronology, or exhaustive identity approval.
- Independently compared every one of the seven subject snapshots with the freshly normalized extraction, including the subject's claims and mentions; all match. Recomputed all exact string-reference paths to the seven IDs and compared them with the recorded paths: 343 match, including 158 mentions and 122 subject claims. No selected subject has a family-relationship claim targeting another selected ID. This verifies the input and reported local snapshots, not the behavior of a complete publication pipeline.
- Re-ran the saved generator. It reproduced its existing proposal and delta bytes without overwriting them. Its isolated resolver simulation goes from seven singleton clusters to one seven-ID cluster, leaving the other 158 chapter-local clusters unchanged. The simulation's canonical and retired IDs are provisional only; it does not load current cross-corpus decisions, constraints, candidate blocks, redirects, or name overrides. It performs no publication and cannot prove no conflicts in the current full catalog.
- The candidate source/extraction and independent editorial/date review are still incomplete. Any source or extraction change invalidates the evidence fingerprints; any production identity action requires the normal separately authenticated, current-fingerprint review and current full-corpus consistency checks. Do not count this research as an identity-cleared or complete chapter.
