# Jinshu 078 owner residual continuity (delta `13b3225f`)

Base candidate: `820d95223c` (PR #5425)  
Independent residual findings: PR #5438 / `13b3225fb9` (`residual-mono-full-splits.json`)

## Applied

1. Adjudicated the seven residual chapter-local continuity groups from exact Chinese and independently demonstrated antecedents.
2. Added reciprocal `same-person` links via `node scripts/link-local-person-records.mjs` (star from earliest local id):
   - `p002=p037`, `p003=p041`, `p004=p044`
   - `p006=p091` (with preexisting `p006=p114`)
   - `p007=p113` (with preexisting `p007=p172`)
   - `p065=p160` (with preexisting `p065=p089`)
   - `p066=p106`, `p066=p165` (with preexisting `p066=p139`)
3. Preserved the prior 33 accepted undirected links (now 41 undirected / 82 reciprocal claims).
4. Affirmed **p002 ≠ p166** (Kong Wang vs Tao Wang); no link added.
5. English surfaces and chronology/attestation evidence left intact.

## Local scope

Residual identity-local continuity for this delta is closed. Chapter is prepared for exact retained chronology review:

```bash
npm run people:dates:packet -- --book jinshu --chapter 078 --out /tmp/jinshu078-dates-packet.json
```

See `dates-packet-summary.json` for hashes. No native `date-audits/jinshu/078.json` seal is claimed here.

## Validators

- `npm run people:validate-extraction -- data/people/extractions/jinshu/078.json --normalize` → ok
- `npm run people:validate -- --book jinshu --chapter 078` → scoped pass
