# Independent check of Jinshu 053 partial date report: incomplete

This checks the seven selected checks and the scope note, **not** all 188 items, all 209 source units, any full independent date audit, or publication readiness. I authored the p056 repair underlying the candidate, so this artifact review must not be treated as an independent approval of that extraction or as the fresh independent final date audit. The date-scope author is a separate reviewer; the `independentOfExtractor` flag alone cannot establish independence or complete source review.

## Exact inputs and deterministic verification

I rebuilt the packet from the repaired candidate and its isolated source, compared the entire rebuilt packet to the retained packet, ran the pinned staging-fixture `validateDateAuditReport`, and confirmed that a deliberately mismatched extraction hash is rejected. Every checked claim index points to the candidate's corresponding compact claim, predicate, person, value and cited unit; every quote in the report occurs in its corresponding source unit. All nine `reviewedUnits` exist. This is structural and source checking, not a production date-approval run.

| Artifact | Byte SHA-256 |
| --- | --- |
| `jinshu053-real-letter-p056-v1-incomplete-20261020/source.json` | `26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78` |
| Same directory `candidate.json` | `35620e8c25541384a137c93eb7d2c6324f7777f5b142860ef8fb74d8bcf2c131` |
| `jinshu053-partial-date-letter-p056-v1-incomplete-20261020/packet.json` | `b032da3de9d1d341d18e93e4fb00df014faa4e275e978d9e7fd11119020edb6e` |
| Same directory `report.json` | `df9af06c4ec1bb5e6b0991ed7b2eb71fa9b2b64d2d3ebbf58118a0962c0fae36` |
| Same directory `validation.json` | `8186078da6b7f7c7f4d2263035a14baf9a0f06177690565d4e42e2124bff597f` |

The packet/report semantic source fingerprint is `sha256:2d7fc188904ca995b268bd4e91a7fd0e7ad6de296fad800a4575f2b171dc21dc` and extraction fingerprint is `sha256:69fe86cc329afd1b77c7307f161c0962c809e1e2f8976ab96793883b7fca1a23`; these are not byte hashes. Packet contains 188 items, 71 people, 209 units; report checks 7 items, 0 people and 9 units, status `research-blocked`. The scope note discusses the earlier pre-p056 simulation and its previous report IDs; the partial report uses the new compact indexes below. They must not be interchanged.

## Checked items and qualification

| Report item | Exact compact target and judgment |
| --- | --- |
| `claim-109`, zero-based index 108 | p001 age five with AD 266–290 context, evidence s0007. `時年五歲` supplies the age, not the two Western endpoints; the `research-blocked` finding is justified pending explicit era, contextual and age-reckoning work. s0007 alone does not date the fire. |
| `claim-179`, index 178 | p056 attestation `自宜城君亡`, AD 299, s0077. The source refers to an already deceased person and gives no year. Its classification as an ordinary dated personal attestation and its unsupported AD 299 need repair or evidence. The death being before the letter alone does not prove that the Lady was not alive during any part of 299 or that she could not have died in 299; do not turn the finding into a fact about the actual year. |
| `hints-p056` | p056 hint AD 299. s0077 is retrospective and cannot alone establish living activity in 299. **The report's unqualified `incorrect` verdict goes beyond the demonstrated evidence**: this partial check has not established that no other valid source supports the hint. Treat it as unsupported / research-blocked until all relevant evidence is checked; do not apply an unconditional deletion or claim a proven negative based only on this report. |
| `claim-123`, index 122 | p068 ordinary attestation, `太安初` / AD 302, s0184. s0183 says he was killed, and s0184 records a subsequent posthumous title; an ordinary living-activity attestation based only on that honor is inappropriate. The chronology and exact type of the repaired record require independent review. |
| `claim-250`, index 249 | p068 honor, `太安初`, `posthumous Ai`, AD 302, s0184. The source establishes the posthumous honor and relative era language, but not the Western conversion and exact year by itself. `research-blocked` is appropriate. The natural-language label “posthumous Ai” is not an invented temporal category; the permitted structured later-reception category is `retrospective`. |
| `hints-p068` | p068 has activity hints AD 300, 301 and 302. The posthumous honor alone does not establish living activity in 302. `research-blocked` and investigation of other evidence are appropriate; do not assume this single source disproves all possible support. |
| `claim-161`, index 160 | p038 attestation, `元康中` / AD 291–299, s0035. The cited unit says betrothal, not that era or its endpoints. A defensible contextual derivation is not in the partial report; `research-blocked` is justified, not proof that either endpoint is false. |

## Scope note and release cautions

The referenced source units accurately state the ninth-year sixth-month episode at s0044, next-year first month at s0066, confinement at Xuchang at s0068, letter after arriving at Xu at s0074, and Lady's prior death at s0077. The source does not independently state a Western year for the letter or death in these units. The note's observation that the old report used generic “supported” explanations for its corresponding checks is confirmed; those explanations do not disclose specific derivations. The scope note properly treats the findings as preliminary, but its `claim-180`, `claim-124`, `claim-251`, `claim-162` and `claim-110` labels belong to the earlier candidate, not this repaired candidate's packet.

Preserve the partial report as research with the above verdict qualification, not as a repair directive or canonical replacement. Before sealing a real date audit, finish source/editorial corrections, regenerate the packet and fingerprints, research exact chronology and all evidence, then have a separate reviewer check every claim, person and source unit. Preserve the original blocked report and queue ownership. Changes to source or extraction require fresh downstream identity/date evidence. No canonical source, report, queue, lock, shared index, build or worktree was modified by this check.
