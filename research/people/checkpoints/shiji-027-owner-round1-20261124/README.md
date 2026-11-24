# Shiji 027 — owner round 1 (editorial recovery)

**Owner:** `cursor-nov24-editorial-recovery-1` (`bc-340a6bc1-9a52-4e4e-88fd-a75cb8c3b429`)

**Staging base:** `284051c488f61dcfac2bb59284a10ddff0db3110` on `codex/people-glossary-staging-v2`

## Sealed inputs (bytes at owner checkout)

| Path | SHA-256 |
| --- | --- |
| `data/shiji/027.json` | `18c86c1f94acb8eb54843afd89c5d0ba091d70a7f3c7a5af46f80604edfda8b4` |
| `data/people/extractions/shiji/027.json` | `fd48b3c65c3da7ebb2b4955401d0607bfec389ad76794faab9a5d86628113375` |
| `data/people/date-audits/shiji/027.json` | `676ccc96a39bef0f5eecf5fb992f0d017d54e0a6b5bc3c6fc60178ca2406837d` |

Coordinator pins in the launch message differ from these byte hashes; owner work uses the blobs present at the staging revision above. Date audit is **reused unchanged** (`status: audited`, 0 findings).

## Gates

- `npm run people:validate -- --book shiji --chapter 027` — pass (7 proposed repairs, 0 applied, 0 editorial decisions).
- `npm run people:dates:verify -- --book shiji --chapter 027` — audited.
- Identity dossier preparation — **blocked** until independent editorial accept + native apply clears `translationRepairs` proposals.

## Next independent reviewer

1. Review `pending-editorial-proposals.json` (7 repairs, proposals fingerprint `sha256:53334c6faec5a526d0b5d72ccfb56aae80ee7bcf3a6ee0dfc9ded4f8ad242720`).
2. Record accept/revise decisions in `data/people/editorial-decisions/shiji/027.json` (schema v3); do not self-approve as chapter owner.
3. Apply accepted repairs to `data/shiji/027.json` and reconcile extraction; then identity review.

Owner did **not** modify source, extraction, or date-audit bytes.