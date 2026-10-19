# Jinshu 053: incomplete s0177 title-link handoff

**Noncanonical draft only; not a completed chapter or approved handoff.** The
current candidate is in
`data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-edict-title-link-v1-incomplete-20261020/`.
Its exact artifact bytes have these SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `source.json` | `3f07b99d013aba2424358263146abb03f63d99d2dc223651f0c9aa2e35a3279c` |
| `candidate.json` | `df777cd31a2a552673c8d45ba22d222eb45bec8c28fc718dce73cb25c0589fc6` |
| `editorial-history.json` | `c23416ab0c15f07fec5dce8a5144c083e1f021a5fc2ebf1c8324cec8c12fa559` |
| `draft-component.json` | `3558337cb54c83794049538fe5b23f2c25a9d006dabfc60ebf65fa8ca8020631` |
| `manifest.json` | `ea1eb011780606805613411dfc1ca5cda016f50f5154d9e9305a2e755f735173` |

## Scope and provenance

The materializer
`data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-edict-title-link-draft-20261020.mjs`
checks its predecessor's exact bytes and changes only two compact surfaces:
s0177 `太孫太妃` and `Taifei of the Grandson-Heir`, each linked as a
title-reference to p038 at occurrence 0. The edict's `稱太孫太妃` styles the
consort named in the preceding clause; the title refers to her, not the
grandson-heir. The corresponding s0177 `王氏` and `Consort Wang` links remain.
Source, editorial history and decisions are copied byte-for-byte; all person
records, claims and candidate dispositions are unchanged.

The earlier combined draft manifest's generic `pins` referred to predecessor
**inputs**, not the adjacent draft's output files. The input hashes were valid,
but their labeling was ambiguous; this was not evidence of corrupted files.
The preserved byte-identical v2 draft's manifest explicitly distinguishes
`priorInputSha256` from `copiedOutputSha256`; its own SHA-256 is
`9b683ed378dfa320ca88e719355792e197f81c8bd8046180e297c66a1eaaa6f3`.
The latest title-link manifest likewise separates input and output hashes.
The independent reconstruction utility
`data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-manifest-correction-20261020.mjs`
reconstructed and deep-compared the prior source, candidate and history, then
reran strict compact and editorial structural checks. Prior artifacts were
preserved; no manifest hashes itself.

The s0177 English text was supported in the source-review notes
`jinshu053-s0177-edict-independent-source-review-20261020.md` and
`data/people/generated/death-bound-review-20261019/jinshu053-s0177-independent-review.md`.
That limited review is not a real decision document for this candidate or an
approval of the chapter. The existing editorial-history components include
synthetic reviewer placeholders, including inherited ones: do not mistake
their `accept` entries for actual independent decisions.

Strict compact extraction and applied editorial-decision structural checks pass
on the latest exact bytes: 209 units, 375 scanner candidates, 71 people, 520
mentions, 541 claims, 61 repair rows, 149 dispositions, zero alias conflicts.
These checks establish structure and consistency, not historical correctness.

## Outstanding holds and review

- An independent reviewer must assess the **exact latest candidate**, both new
  title spans and their attribution to p038, together with the earlier s0177
  `Consort Wang` span and the scanner disposition for enclosing `Bring Consort
  Wang`. A preferred institutional English rendering of 太孫太妃 is unresolved.
- The p038 explicit bilingual name claim `Wang Huifeng` / `王氏` cites s0065
  and s0177 although those units give only 王氏; the identification with 惠風
  is contextual. Its kind, evidence, certainty and person linkage need normal
  independent source/identity review. Its existing `Grand Heir Consort
  Dowager` title claim also remains held. Do not infer biological motherhood.
- The synthetic review history and all inherited proposed repairs require
  real independent exact-fingerprint decisions and complete chapter review;
  the separate s0203 quotation remains open through s0204, whose interpretation
  remains held. Other source-restoration and textual-variant holds—including
  s0170–s0171 and s0205—remain unresolved.
- Preserve the existing research-blocked independent date audit and ownership;
  changed source/extraction fingerprints require a fresh independent complete
  audit after editorial/source closure. Identity resolution, catalog, links,
  ebook and publication gates remain open. No partial checks count as completion.
