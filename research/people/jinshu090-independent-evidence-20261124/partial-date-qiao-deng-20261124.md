# Jinshu 090 — 喬智明 + 鄧攸 (s0277–s0376)

**227 → 316** cumulative unique IDs (+**89**). **50** editorials and all prior partial findings unchanged. No canonical install.

## Native counts

| | |
|--|--:|
| This tranche | **89** checks (**23** supported · **66** research-blocked) |
| Cumulative | **316 / 553** (**237** remaining) |
| Cumulative verdicts | **152** supported · **163** research-blocked · **1** incorrect (`claim-60`) |

## Concrete source issues (major)

1. **Event labels with AD import (30+ IDs):** 穎之敗趙王倫, 惠帝之伐鄴, 鐘會伐蜀 on biography lines **without** Western years — AD 301/304/263 is annal inference, not cited Chinese.
2. **永嘉之亂 / 永嘉末:** narrative chaos frames with `westernInterval`/`westernBounds`, no regnal year on sentence (喬智明 under Liu Yao; 鄧攸 career).
3. **Southward flight:** 過江, 江東, 新鄭 clauses — migration bounds not in text.
4. **Kinship childhood bounds:** 攸七歲喪父, 喪母及祖母 — qualitative only.
5. **Supported explicit reign years:** **太寧二年** → AD 324, **咸和元年** → AD 326 where those phrases appear on cited units.
6. **claim-911:** death typed against s0283 停其獄 with no death wording — inference hold.

## Owner repair batches

Added to `chronology-owner-defect-groups-20261124.json` (schema v2 tranches); prior **pan-fan-ding** groups untouched.

## Next scope

- **吳隱之** `s0377–s0428` (~43 items), first unreviewed **`claim-1176`** (`s0397`)
- Then **【史論】** `s0429+`

Rebuild: `node research/people/build-jinshu090-partial-date-qiao-deng-20261124.mjs`