# Jinshu 030 p154 — scoped date composition replay (2026-11-24)

Independent verification that staging apply **`8630bbad2df1b99862c45ef3dd9afded036ec92e`** (PR **#5479**) matches the approved witness repair without reopening unrelated date decisions.

## Pins

| Input | Pin |
| --- | --- |
| Prior date approval | `4250c15c07f1416179ea73b9645b87d009cf5a47` → `data/people/date-audits/jinshu/030.json` digest `sha256:2871fd8d…` |
| Pre-apply extraction (packet) | `sha256:3594560d44977bae24135912f92c975ea66bb4da0ed871a3e4f10b631859ebe7` |
| Post-apply extraction | `sha256:95477d6da1b56e4da158dcf05122921f22fbaf81cf40e76f8f6f9b6c0ce8a35c` |
| Post-apply source (English) | `sha256:8d15669b8dc40e65736a20b3ec6ca868d5e98cf7f2bd7919b82052da462a1710` (s0296 idiomatic only) |

## Artifacts

| File | Role |
| --- | --- |
| `date-packet-pre.json` | Native packet at sealed overlay |
| `date-packet-post.json` | Native packet after apply |
| `independent-date-audit-report.json` | Composed report bound to post packet (`validateDateAuditReport` PASS) |
| `composition-replay-receipt.json` | Explicit removed checks + 84 claim ID remaps by `claimHash` |
| `compose-date-replay.mjs` | Reproducible builder (read-only; does not write `data/people/date-audits/`) |

## Removed date scope only

- `personChecks:p154`
- `itemChecks:claim-586` (p154 attestation @ s0296)
- `itemChecks:hints-p154`

**p153** person check and all other verdicts/reasons/evidence preserved byte-for-byte. Chinese unit text unchanged across 575 units; English delta only **s0296**.

No identity approval, no queue merge, no chapter/extraction edits in this checkpoint.