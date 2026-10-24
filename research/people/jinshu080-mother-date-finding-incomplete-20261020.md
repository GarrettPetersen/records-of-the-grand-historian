# Jinshu 080: independent partial chronology finding, not an audit approval

Review scope: one person's chronology only; no candidate extraction, complete
chapter review, approval, owner handoff, or publication is implied. This finding
is independent of the original extraction and the dated report inspected below.
The material inspected is pinned to staging commit
`89296b9f9da8683bcd807c78b0cf27f94d129865`.

## Exact fingerprint and current report

- `data/jinshu/080.json`: raw SHA-256
  `ef27f98c1a64dbe8a1dee18c8905d75baa26f3b5d939df1674a00975fb30cac8`.
- `data/people/extractions/jinshu/080.json`: raw SHA-256
  `e13ffc6fd640f7018bf044b2e846e54c146c69ac31f1f1a2499ed05f6d580759`.
- The date packet's SHA-256 over `JSON.stringify(contentUnits(...))` is
  `sha256:78efc236952724ac19b16e86ab77616208432d87d2d71eb2c25e79a7b6a2dc4b`;
  SHA-256 over `JSON.stringify(extraction)` is
  `sha256:44e7f63b247f9a0c4460a79eddb6c9bbbb578ef3fe3a69bbd82fe2634e051632`.
  These equal the hashes on the canonical audited report and queue claim. The
  packet source hash was recomputed with the local `contentUnits` implementation;
  raw byte hashes above are also supplied to detect byte-level differences.
- The staged `data/people/date-audits/jinshu/080.json` raw SHA-256 is
  `c5d18ca017beae087c5c2c681c791bc0702dffc8c4578e31b135605fd6b835a1`.
  Its status is `audited`, findings are empty, and references are empty. It
  marks `claim-396`, `claim-397`, and `hints-p050` supported with the same
  generic reason; the hint check cites `s0001` 王羲之, not the woman's name or
  a dated event. A fingerprint match and the status label do not resolve the
  source discrepancy below.

## Finding

Extraction person `p050`, "Mother of Wang Shu" / 王述母, has active hint
`AD 353-355`. `claim-396` (attestation) and `claim-397` (death) both record
the interval AD 353–355 and cite `s0153`. Their source-date label
`東晉永和前後` is not a literal quote from that unit. The dates imply a tighter
and differently timed event than the unit establishes.

The direct witness in Jinshu 080 `s0153` reads
`述先為會稽，以母喪居郡境，羲之代述，止一吊，遂不重詣。` It places
Shu's mourning for his mother when Wang Xizhi succeeds him in Kuaiji. It
does not give an era-year, date the death to 353–355, supply a birth date,
or assign an age. `s0155` says this situation continued for years, and
`s0156` places Shu's appointment as Yangzhou governor afterward. Jinshu 008
`s0157` opens year ten and `s0163` reports his appointment after removal of
Yin Hao, explicitly calling him former Kuaiji administrator. The chapter is
in the Yonghe reign; conventional conversion places Yonghe 10 in AD 354.
This is compatible with the death and succession preceding that appointment,
but does not alone establish an exact death year or a lower bound. The raw
SHA-256 of the staged Jinshu 008 witness is
`953abc9ec81394b686434fdf881497a6965dd395044a93efd51fe990882da721`.

A named secondary chronology, the Shandong local-history archive's
*Wang Xizhi and Wang Xianzhi Chronicle*, assigns the bereavement and
succession to Yonghe 7 (AD 351), and Shu's appointment after mourning to
Yonghe 10 (AD 354):
https://shandong-chorography.org/database/zzmj/section/11/article/73/ .
This is contrary evidence to the extraction's 353–355 death interval, not
independent proof that 351 is certain. Its explanatory notes acknowledge
reconstruction from sources and possible error, and the chronological entry
does not itself identify a direct dated witness for this particular year.
Therefore do not silently replace the interval with 351. Check the underlying
chronology and report the evidence and conversion if an exact date is proposed.
No age, year-of-birth, fixed length of mourning, or alive-during-353–355
inference is supported by the cited unit. A source reference to mourning after
death is not a personal life attestation.

## Ownership and next step

On queue revision `4aca09929f40d88b55271e75e780d6423d494b2c`,
`jinshu/080` remains an active sticky date claim owned by
`jinshu-release-dates-cursor-sdk`, source and extraction hashes as above, with
four returned and twelve interrupted jobs. Its stored executor expiry is
2026-10-09, but this note does not establish a live process or grant authority
to take it over. Preserve claim, leases, lock state and retained artifacts.
Deliver the discrepancy to the existing owner using the supported handoff;
evaluate `claim-396`, `claim-397` and `hints-p050` together, with fresh
independent re-audit after any actual repair. Until then, treat the staged
`audited` label as contradicted for this point, not as release readiness.
Identity, person-page, backlink, ebook and full-chapter editorial/date gates
were not established by this limited review.
