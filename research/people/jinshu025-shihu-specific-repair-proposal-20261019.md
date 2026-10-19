# Jinshu 025, p076: source-attributed repair proposal (not an approval)

Scope: only the retained p076 Shi Hu chronology finding, not a chapter audit.
No canonical source, extraction, queue, lock, lease, or approval is changed.
This proposal is based on the retained candidate-3; recheck exact before-values
against the live sealed packet before assembling any executable proposal.
The candidate-3 byte SHA-256 is
`7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`;
its retained semantic extraction hash is
`sha256:bc3347abec36331dba442f304d8ab15e8051e4c19d85a8d074b9ba460a700260`.
The separately amended scanner-reconciled candidate is a different generation:
do not apply a proposal sealed for one generation to the other.

## Evidence and judgment

The local chapter s0540 says `及石季龍死，胡亂，穆帝世乃還江南`, i.e. Shi
Jilong's death precedes the disorder and eventual southern return; it gives no
year for either event. [Jinshu 8](https://zh.wikisource.org/zh-hant/%E6%99%89%E6%9B%B8/%E5%8D%B7008)
places the death in Yonghe year 5; the pinned revision is recorded in the
existing dossier. [Jinshu 107](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7107)
has a contradictory transmitted terminal phrase, `太和六年`, with fifteen
reign-years. The [Jinshu 107 collation note 3](https://skqs.dazhishi.com/show_gldrnrpkdz.html)
explicitly interprets `太和六年` as an error for `永和五年`, referring to the
annals and the inclusive fifteen-year count; the note also acknowledges the
same transmitted wording in Taiping Yulan. The wording was independently
checked in the online text on 2026-10-19. This is an editorial emendation, not
proof of the original manuscript or an independent contemporary eyewitness.
The [Taiwan Ministry of Education reign-title index](https://dict.revised.moe.edu.tw/appendix.jsp?ID=23&la=0&page=2&powerMode=0&ver=4)
lists Eastern Jin Yonghe as 345–356 and Taihe as 366–371; hence Yonghe 5 is the
conventional historical year AD 349 and Taihe 6 would be AD 371. The year is
not a verified proleptic Gregorian day, nor is 349 a date of the seal's return.

Source-attributed editorial judgment: prefer AD 349 for the death because of
the explicit annals, supported by the identified collation, while retaining
the conflicting transmitted Taihe 6 wording and attributing the emendation.
This judgment requires independent review, not merely schema validation.

## Exact proposed row values

Subject, predicate, `textual-variant` certainty, and `s0540` evidence remain
unchanged. Both rows must use the identical source-date and Western-year
objects, because the source-backed death-only gate requires matched evidence.
No active-life hint is proposed; death is not positive evidence of a later
living activity. The descriptions below preserve the actual chapter sequence
without assigning the year to the seal's return.

Replace claim-209's value with:

```json
{
  "sourceDate": { "text": "石季龍死" },
  "westernYear": { "era": "AD", "year": 349, "precision": "year" },
  "event": "Death recorded before the disorder and the seal's later southern return. Jinshu 8 places the death in Yonghe 5; Jinshu 107 transmits Taihe 6, which its collation note emends to Yonghe 5. The seal's return is not dated to 349."
}
```

Replace claim-238's value with the same value. Preserve its predicate `death`;
preserve claim-209's predicate `attestation`. In both cases the sourceDate text
is a local undated death expression; the Western year is an externally
corroborated conventional historical-year judgment, not a direct quote from
s0540. The earlier attestation description is corrected to refer to Shi Hu's
death, not to represent the later return as his living activity. Both rows'
source evidence is `s0540`; the additional external evidence must be cited in
the independent reviewer report, not falsely represented as a local source
unit.

## Required before any publication

1. A separately independent reviewer must verify the historical and textual
   judgment, the source citations and exact wording, and the proposed schema
   representation. Preserve disagreement if the judgment is not accepted.
2. A host must assemble an exact fingerprint-bound repair against the actual
   chosen candidate and current source, including exact before-values; verify
   the proposed `replace` operations and the actual staging-version validator
   with fresh packets. This document alone is not a repair submission.
3. Independently audit every unit, person and temporal check on the final
   fingerprint. Record the conflicting reading, emendation, external reference
   quotes and their hashes. Other outstanding research holds must also be
   resolved; a passing local extraction check is not date approval.
4. Independently verify the source editorial correction and backlinks, identity
   work, glossary and ebook gates. Never infer this chapter is complete from
   resolving p076 or change the retained sticky claim without its owner.
