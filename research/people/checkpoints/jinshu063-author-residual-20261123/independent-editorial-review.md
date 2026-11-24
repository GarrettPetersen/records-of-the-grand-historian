# Jinshu 063 independent editorial review

Independent reviewer for staging candidate PR #5487 at `d8ad75ef1b702fdf3a76bb848b3b0f2c9498577c`, distinct from owner work #5410 (agent `bc-64160cca-fb61-4c6e-ba29-27cd0fc0ada1`).

This records editorial decisions on **66 proposed translation repairs only**. It does **not** approve chronology, identity, publication, or application of owner extraction deltas.

## Verification method

- Read all 342 Chinese units and both English fields from the pinned source packet.
- Confirmed each repair `before` text matches the current literal or idiomatic (`en`) field on the exact chapter fingerprint.
- Judged each proposed `after` text against the linked Chinese excerpt; grouped themes below.

## Repair decisions

| Group | Units | Repairs | Decision |
| --- | --- | ---: | --- |
| 文鴦 → Wenyang transliteration | s0017–s0212 (seven units) | 32 | accept all |
| 河內 Henan → Henei | s0089, s0272, s0278 | 6 | accept all |
| s0091 Tuge / invitation subject | s0091 | 2 | accept (Li Ju invites Zhang Zhao; 屠各 supply context only) |
| Guo Song agency / s0133 | s0133 | 2 | accept all |
| Panzhi placename | s0136 | 1 | accept |
| s0150 其必留之 | s0150 | 2 | accept all |
| s0172 quotation | s0172 | 2 | accept all |
| Horse collapse s0192 | s0192 | 1 | accept |
| s0203 歸罪 | s0203 | 1 | accept |
| Dong Commandery / 揚威 / Shiliang / 無他 | s0223, s0227, s0229, s0247 | 5 | accept all |
| Appointment vs enfeoff; Gan Zhuo | s0263, s0264 | 2 | accept all |
| Yin Qiao / Han Chao names | s0289, s0299 | 4 | accept all |
| Wang Dao titles / amnesty | s0321 | 2 | accept all |
| Historian epithets 玄明 / 世龍 | s0331, s0337 | 3 | accept all |

**Blockers on translation repairs:** none.

Native artifact: `independent-editorial-decisions.json` (schema v3) passes `validateEditorialDecisions` against the pinned compact extraction.

## Apply verification (`92b6c31f`)

Independent replay vs `changed-dependency-receipt.json`: decisions hash match, 66/66 repairs applied to accepted `after` text, `npm run people:validate` pass, nine dependent deltas verified (see `apply-dependency-independent-verification.json`). No apply blockers.

## Chronology scope 1 (`independent-date-audit-scope-001.json`)

Units **s0021–s0028** read once. Ten packet items checked; **no Western years invented**; four **太興初** holds on s0026 retained; no scope blockers. **Chapter date approval remains false.**

**Scopes 2–12** completed (see `independent-date-audit-manifest.json`): **201/414** packet claim-items reviewed, **0** conflict blockers, **10** era research holds unchanged (太興初×5, 永嘉初×2, 建武初×2, 永嘉末×1).

**Scope 13:** remaining **213** items — **123** passage groups; **203 approved**, **10 genuinely-held** (nonempty active-date hints corroborated to era claims), **0** proposed source-only patches; **414/414** packet items now reviewed. Chapter date approval still **false** (host calendar + formal date report).

## Staging delta `11cb2c7a` (PR #5487)

Independent replay on pinned extraction at `11cb2c7ae6024949c65651a49617fc0d7f0d35ea` (chapter English/source unchanged vs post-apply `92b6c31f`):

- **Ten era hint/claim pairs** (`tenEraHintClaimPairs`): all five Chinese witnesses present (s0026, s0073, s0170, s0226, s0288); each pair keeps `sourceDate.text` only, adds qualitative English without Western years, and clears the old `unresolved` flag — **verified, not approved for chapter `audited`** (host reign calendar still external).
- **Six grokbot-27 chunk producers** restored on unchanged ranges 001–006; semantic extraction matches `92b6c31f` aside from the era round above (`independent-date-audit-11cb2c7a-verification.json`).
- **414/414 item judgments** rebound: **394 invariant**, **20 refreshed** (10 claims + 10 hints).
- **190/190 person checks** filed in five blocks (`independent-date-audit-person-checks-001.json` … `005.json`); coverage receipt lists exact IDs (`independent-date-audit-person-coverage-receipt.json`).
- **342/342 unit coverage** attested (`independent-date-audit-unit-coverage-receipt.json`).
- Native report checkpoint: **`audited`** at `11cb2c7a` fingerprints (validate passes); **414 item checks** unchanged; **190 person reasons** aligned to witnesses (46-row pass, no regeneration). **p183/p001** identity crosswalk in `independent-date-audit-identity-p183-p001-hold.json` (s0330–s0339 appraisal — not a chronology merge). Checkpoint-only; no `people:dates:record`.

## Pending actions (not approved here)

1. **Chronology** — continue scoped passes; owner `date-packet.json` on d8ad75ef fingerprint retained as historical seal.
2. **Identity** — 文鴦 triple p011/p100/p110 membership question.
3. **Coverage** — 304 units had no proposed repair; not a full-chapter editorial seal.

## Prior proof retained unchanged

Owner checkpoint files are not modified: `residual-independent-review.json`, `source-review-findings.json`, `date-packet.json`, `README.md`.
