# Independent recheck: Jinshu 116 (PR #5429 @ d04279d)

**Status:** `partial-progress` — native editorial accepts recorded; chapter **not** fully approved.  
**Candidate revision:** `d04279d2736afc07d9069dd44b5656de92b68af1`  
**Prior findings:** #5436 @ `2e6a4f369a72bdd5cf005155fb48bd4a6aee73d6`  
**Reviewer agent:** `bc-96175e3c-9233-480b-8bdd-ac02689d9be2`  
**Lookup generation:** `cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac` (reconfirmed)

Same independent reviewer rechecked only the #5436 correction batch. Owner branch was not modified in place; this follow-up carries review-only artifacts plus the native editorial accept file.

## Gate update vs #5436

| Gate | Prior (#5436) | Now |
|------|---------------|-----|
| 70 English repairs | source-correct; no native accept | **Native accept recorded** (`data/people/editorial-decisions/jinshu/116.json`) |
| F1 alias/claim sync | blocked | **Surfaces/pinyin/Jiqiu label OK**; residual claim/descriptor English leftovers remain |
| F2 continuity merges | blocked | **Listed merges applied**; 舜 still unresolvedIdentity hold |
| Sun Ce simile | blocked | **Hold present** (cleared AD 175–200; unresolved attestation) |
| Chronology | stale audit | **Still blocked** — packet prepared; audit still stale/research-blocked |
| Canonical identity | blocked | **Still blocked** — native identity review + sealed packets; registry baseline run `45217700448` noted, not fetched |

## Outstanding owner/host blockers

1. Fix residual English leftovers: claim statements / descriptor still say Lan Niu, Gu Chengshan, Suo Luyao.
2. Fresh independent date audit on current extraction fingerprint (preserve research-blocked unless newly evidenced).
3. Native identity certification of merges + 舜 hold against pinned lookup / later registry baseline (do not regenerate full registry here).
4. Host publication gates.

See `consolidation.json` for changed findings only; unchanged #5436 English-repair content proof is reused.
