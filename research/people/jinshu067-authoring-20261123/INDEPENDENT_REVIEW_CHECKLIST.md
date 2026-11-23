# Jinshu 067 — owner attestation repairs vs #5456

Owner: `bc-e9c3ed78` · Independent evidence #5456 @ `f00691b4c44ca99bb1f0582eb225530f342df190` · Base `73a655fb8523f92a12f58a5d1cd7cb0e815b3012`

## Done
- [x] Preserved 1,391 mentions and 3 editorial accepts (byte-identical editorial hash)
- [x] Preserved Xi Yin AD 384 (`claim-519` / `claim-699` / hints-p178) and continuity merges; Liu Xia p041/p166 split retained
- [x] Repaired all 61 #5456 attestation source-reference mismatches (8 repin / 43 correct / 10 uncertain)
- [x] Fresh native packet + grouped before/after receipts for same reviewer
- [x] Scoped `people:validate` + extraction validator passed; `dates:verify` remains **un-audited**

## Still required (same independent reviewer)
- [ ] Re-check the 10 uncertain attestation rows (false substring / office-title / verb misreads)
- [ ] Substantive checks for 170 empty `active-date-hint` rows left unreviewed in #5456
- [ ] Native date audit + identity certification (hosted baseline + p178 delta)
- [ ] Host publication
