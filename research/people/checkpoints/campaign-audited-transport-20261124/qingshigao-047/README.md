# Qingshigao 047 audited transport identity — owner handoff

**Worker:** `cursor-nov24-audited-recovery-1` (`bc-b1b4cecc-160a-4940-add4-09b11b527691`)

**Scope:** 3 identity review cases (Tycho Brahe, Ptolemy, Hipparchus) after source/editorial/chronology packets.

## Artifacts

| File | Role |
|------|------|
| `preparation-receipt.json` | Native identity packet preparation receipt |
| `transport-packet.json` | Scoped review plan (SHA-256 `99d3d180…`) |
| `owner-evidence.json` | Source-backed owner dispositions (**not** independent approval) |
| `owner-handoff.json` | Exact handoff pins and reviewer instructions |
| `validation-receipt.json` | Scoped `people:validate` receipt |

## Reviewer

Read `transport-packet.json` (`requiredReport`) and `owner-evidence.json`. Quote primary Chinese from listed units; confirm or hold each case. This owner packet is **not** approval.

## Validate

`npm run people:validate -- --book qingshigao --chapter 047` → see `validation-receipt.json`.