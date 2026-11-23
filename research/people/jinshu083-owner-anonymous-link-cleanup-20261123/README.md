# Jinshu 083 anonymous-link cleanup (not approval)

**Status:** identity **needs recheck** — not sealed.  
**Draft:** PR #5474 @ `62941898c31e1e5802f67940af14408961db4871`  
**Triage:** PR #5480 @ `963ee5293a57602bfd6fb45db19b2ff78d542032`

## Removed fabricated locals (0 surfaces)

| ID | Entailment only | Named witnesses kept |
|----|-----------------|----------------------|
| p030 | mother of 皇太后 via 舅 | p027 尚, p029 皇太后 |
| p071 | child between 猷 and 孫宏 | p069 猷, p072 宏 |
| p073 | brother of 從祖準 | p075 準 |
| p074 | father of 猷/瑰 | p069, p070/p037 |
| p097 | father of 從弟灌 | p093 逌, p098 灌, p096 濟 |
| p130 | grandfather between 曾祖浚 and 父育 | p129 浚, p131 育, p128 胤 |

## Preserved stated kinship

- 尚–皇太后 `舅`
- 猷–宏 `孫` (ancestor-of, generationDistance 2)
- 準–猷 `從祖`
- 逌–灌 `從弟` (intermediary p096 kept)
- 浚–胤 `曾祖`; 育–胤 `父`

## Validators

- extraction PASS (167 people)
- `people:validate --book jinshu --chapter 083` PASS

See `dependency-receipt.json`.
