# Jinshu 020 owner apply of independent editorial (not chapter completion)

**Staging draft:** #5488 @ pre-apply `9faf511034`  
**Independent decisions:** `3090cd32b68fe0f770af2fe5dd52968acaa7bb64`  
**Owner PR context:** #5413

## Applied

- Landed exact independent schema-v3 decisions (83 accept + 14 revise, 0 reject) at `data/people/editorial-decisions/jinshu/020.json` with **reviewer identity preserved** (`bc-ca56fb16-d4fd-4ced-a2fb-3640376ab1df`).
- Prepared sealed candidate-review dossier (38 new English surfaces).
- Authored candidate resolution (32 not-person + 6 person assignments) and ran native applier:
  - `npm run people:apply-editorial -- --book jinshu --chapter 020`
- Result: **97/97** repairs applied; both English fields checked on touched units; revise `after` strings exact.

## Changed dependencies

See `changed-dependency-receipt.json`:

- `data/jinshu/020.json` (English fields)
- `data/people/extractions/jinshu/020.json`
- `data/people/editorial-decisions/jinshu/020.json` (new)
- `data/people/editorial-candidate-decisions/jinshu/020.json` (new)

## Non-actions

No self-approval · no dates record · no full registry · no other chapter · no merge
