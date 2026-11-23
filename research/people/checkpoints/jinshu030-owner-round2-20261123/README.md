# Jinshu 030 owner round 2 — editorial witness gap + outside-knowledge chronology

Exact draft **#5479** @ `a8c157f5611b0ced987f361262fb6173725f0571`.  
Independent review evidence **`59b25738210e49cee8aeeb0b782a659ef065ece1`** (reviewer `bc-ab2acfed-77c9-4601-afc7-18feb78285d3`).

## Editorial (44 accepts) — not applied

Reviewer verdict is **accept all 44**, but decisions lack mandatory `sourceWitness.{source,citation,excerpt}`.

- Owner did **not** fabricate witnesses.
- Proposed repairs remain `proposed` / unapplied.
- Residual: `missing-editorial-witness-bindings.json` (exact `jinshu:030:r0001`–`r0044`).

## Chronology — outside-knowledge Western attestations

Diagnosis: **188** attestation rows carried Western `sourceDate` / `westernInterval` labeled outside-knowledge conversion; **0** of those Western strings appear in Chinese evidence (systematic false precision).

| Group | Count | Action |
|-------|-------|--------|
| Unique native era-year in evidence | 3 | Keep `sourceDate` as Chinese era-year + qualitative; drop Western conversion |
| No unique bindable era-year | 185 | `undatedSourceAttestation` with cleaned event |
| Western active-date hints | 188 people | Cleared; **p044** keeps `polity: ["Eastern Han"]` |
| Office `dateContext` Western leftovers | 2 | Stripped |

## Preserved

- All 208 local people / resolution membership refs
- p044 Eastern Han attribution
- 44 proposed English repairs (pending witness bindings)
- No queue edits, date self-approval, or merge

## Validation

`npm run people:validate -- --book jinshu --chapter 030` → PASS (208 people, 44 proposed / 0 applied).
