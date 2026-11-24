# Jinshu 090 independent chronology — 魯芝 (Lu Zhi), units s0016–s0057

Independent reviewer `bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8`. Pinned packet hashes match `date-packet-pin.json`. Status `needs-revision` (partial group only; not chapter approval).

## Coverage

- **50** packet item checks, **49** net-new IDs (overlap: `claim-59` also reviewed in preface on `s0008` 泰始受禪; here re-checked on `s0050` 武帝踐阼).
- Cumulative unique item IDs after preface + Lu Zhi: **76** (preface 27 + 49 new).
- Editorial evidence unchanged: **50** verified decisions retained from prior pass.

## Verdicts (this group)

| Verdict | Count |
|---------|------:|
| supported | 35 |
| research-blocked | 15 |
| incorrect | 0 |

## Supported highlights (Chinese witnesses)

- Career/regnal anchors with explicit wording: 宣帝起兵誅爽 (249), 高貴鄉公即位 (254), 毌丘儉平 (255), 諸葛誕以壽春叛 / 文帝奉魏帝出征 (257), 常道鄉公即位 (260), 五等建 (264), 武帝踐阼 (265), 泰始九年卒 / 年八十四 (273).
- Undated but correct: native place (`扶風郿人`), sui age seventeen at the Yong move (`年十七`).
- Rhetorical exemplars at `s0032`/`s0035` (黃霸, 伊周之位) marked supported as retrospective / speech context, not separate life dates.
- `claim-59` supported on biography sentence 武帝踗阼 (distinct witness from preface 泰始受禪).

## Research-blocked (no blanket certification)

Early career and imported intervals where the biography does not state Western endpoints:

- Guo Si father death bounds (`父為郭氾所害`) — `claim-180`, `claim-181`, `claim-183`
- Guo Huai / Zhuge Liang campaign spans — `claim-185`, `claim-190`
- **Cao Zhen cluster:** `真薨` / `宣帝代焉` without regnal year — `claim-194`, `claim-196`, `claim-206` (AD 231 is external inference)
- Wei Ming petition window — `claim-124`, `claim-212`
- Undated recommendations (`鄭袤薦`, `司空王朗`, `臨淄侯文學`) — `claim-201`, `claim-203`, `claim-199`
- Cao Shuang regency bounds — `claim-214`
- Yang Hu office span end — `claim-236`

## Carried forward from preface

- **incorrect:** `claim-60` (AD 265 on undated 而帝寬厚) — unchanged; not re-audited here.
- Preface **research-blocked** ancient / imported endpoints remain on the cumulative hold list in `chronology-cumulative-checkpoint-20261124.json`.

## Artifacts

- `partial-date-report-lu-zhi-20261124.json` — native `validateDateAuditReport` pass
- `chronology-scope-checkpoint.json` — group complete; next **胡威** `s0058–s0092`
- `chronology-cumulative-checkpoint-20261124.json` — unique ID manifest

Rebuild: `node research/people/build-jinshu090-partial-date-lu-zhi-20261124.mjs`