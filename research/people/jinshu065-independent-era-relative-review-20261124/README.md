# Jinshu 065 — independent era/relative source-precision review (2026-11-24)

Independent final reviewer on **#5426** @ `2be94cbbc9d1984c605eedac5934265253aa9075`.

Pins: prior scoped approval `a6e1739a` (44 rows + 10× 咸康五年/AD 339) · owner `jinshu065-owner-era-relative-repr-20261124/` · chronology `f0ab1ebe`.

## Verdict

**Source shapes approved for all 20 retained unresolved claims; Western conversion remains an open constraint (not a source contradiction).** Chronology still **not** approved.

| Count | |
|--|--:|
| Claim representation edits inspected | 20 |
| Approved source shapes | **20** |
| Rejected claim edits | **0** |
| Source contradictions | **0** |
| Unsupported-Western holds (open) | **20** |
| a6 44 optional rows byte-stable | true |
| 咸康五年 / AD 339 witnesses preserved | true |
| Orphan hints cleared (accepted; creates debt) | 18 |
| Era hints related to claim groups | 7 |
| **Missing active-date-hint coverage** | **19** |
| Missing Western-pin coverage (claims / era hints) | 20 / 7 |

## Approved source shape (per claim ID)

Exact native form allowed by current runtime:

- `sourceDate.text` = exact owned Chinese era/relative wording
- `qualitative` = nonempty source-only qualitative string
- `unresolved: true` + reason stating Jin→Western concordance unpinned
- **no** `westernYear` / `westernInterval` / `westernBounds`
- evidence includes the unit(s) that actually quote the wording (context group now includes `s0310`)

IDs: claim-583, claim-645, claim-585, claim-682, claim-586, claim-588, claim-592, claim-730, claim-731, claim-589, claim-590, claim-591, claim-733, claim-736, claim-737, claim-738, claim-739, claim-740, claim-742, claim-743

## Shared primary evidence (person/event scope preserved)

- **s0254** 「卒，子恢嗣，義熙末，爲遊擊將軍。」→ claim-583 (p087/attestation); claim-645 (p087/office)
- **s0286** 「昇平二年卒於官，年三十六。」→ claim-585 (p090/attestation); claim-682 (p090/death)
- **s0281** 「穆帝詔曰：「敬和清裁貴令，昔爲中書郎，吾時尚小，數呼見，意甚親之。」→ claim-586 (p092/attestation)
- **s0310** 「隆安初，國寶用事，謀黜舊臣，遷珣尚書令。」→ claim-588 (p093/attestation); claim-592 (p106/attestation); claim-730 (p093/office); claim-731 (p106/status); claim-591 (p104/attestation); claim-733 (p104/event-participation); claim-736 (p108/event-participation); claim-737 (p109/event-participation); claim-738 (p110/event-participation); claim-739 (p104/event-participation); claim-740 (p106/event-participation)
- **s0318** 「二年，恭復舉兵，假珣節，進衞將軍、都督琅邪水陸軍事。」→ claim-589 (p093/attestation); claim-742 (p093/office); claim-743 (p093/material-association)
- **s0309** 「俄而帝崩，哀冊諡議，皆珣所草。」→ claim-590 (p101/attestation)

## Open constraints (not contradictions)

All 20 are **unsupported Western conversion** holds. Finishing requires pinned Jin→Western concordance in native date-audit `references[]` per group (see JSON). No blind inference of Western years.

## Missing coverage

- 19 people with empty active-date hints: hints-p023, hints-p028, hints-p029, hints-p030, hints-p031, hints-p032, hints-p034, hints-p035, hints-p036, hints-p037, hints-p039, hints-p040, hints-p041, hints-p042, hints-p043, hints-p044, hints-p045, hints-p046, hints-p054 (18 orphan clears + p054)
- 20 claims + 7 related era hints still lack Western pin

## Non-actions

No owner edits, whole audit, blind inference, or canonical writes.
