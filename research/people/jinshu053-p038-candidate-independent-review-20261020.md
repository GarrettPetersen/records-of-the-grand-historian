# Independent review of Jinshu 053 p038 research candidate

Reviewer: `/root/disposition_guard`. Scope is the exact candidate diff and the
source support for this partial noncanonical repair, not whole-chapter editorial
approval, independently completed date audit, identity resolution, genuine
editorial decisions, or publication authorization. **Decision: support as a
bounded research candidate with explicit outstanding semantic holds; do not
publish or treat as closed.**

## Exact inputs and checks

At inspection remote staging was `8fbbf016d7c3cc4e89d7914b44c6df0272c007ea`.
The staging `data/jinshu/053.json` byte SHA-256 was
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407` and
`data/jinshu/096.json` was
`be8370803176c863317a6ec0bf918bea32f05c0c0f31168f6c5978c9bac60be2`.
The independent source review was
`data/people/generated/death-bound-review-20261019/jinshu053-p038-independent-source-review-20261020.md`
(claimed SHA-256 `67541f00f74781233b5fd5ec16b68c68091f4e8f44c8314188d3b1387681cb44`).
The candidate's `manifest.json` SHA-256 is
`2203c3d13b0451a33b199f9894a22652082a84bec61f61a8f379c1ab421e83fd`;
its exact source, compact extraction, and history hashes respectively are
`d7a16811f2ded3f7ec283eaf09219048fc9971f34f1813bc79acf9b71f20939a`,
`ac482159e165f669fcbefd5aaee74cad5606485dbde8f73f9c68201860fe8545`,
`201f44fefe758038e144c1570794c39d6a71f7779eb2b65d0155bce9bd4699b9`.
The manifest's parent is `jinshu053-middle-supported-v1-incomplete-20261020`.
Comparing parsed candidate JSON to that parent found changes only in the p038
`people` entry and two p038 family-relationship rows in the `claims` array;
source and editorial-history files are byte-identical to the parent. No 096
unit was inserted in 053 claim evidence. Existing source/date and other person
records are unchanged, which does not independently validate them.

Using the existing staging-pinned isolated fixture, I rebuilt the packet and
reran strict compact extraction and applied-editorial consistency validation:
209 units, 376 preflight candidates, 71 people, 520 mentions, 540 expanded
claims, 81 repair rows, 152 dispositions, zero alias-disposition conflicts.
These are structural checks; the inherited editorial history includes
synthetic draft components and is **not** an authentic approval receipt. The
shared-checkout schema compatibility remains unresolved.

## Support for the exact repair

053 s0035 identifies the crown prince's betrothed as Wang Yan's younger
daughter 惠風; it does not explicitly categorize 惠風. 096 s0098–s0099 names
the consort 王惠風 and says `字惠風`, explicitly making it a courtesy name.
In 053, s0065 identifies `太子妃王氏`, s0073 refers to her father 王衍 and his
request to dissolve the marriage, and s0177 directs that `妃王氏` return to
stand as mother to the grandson-heir. Together with the 096 account, these
support a strong contextual identification, not independent proof that every
occurrence is the same person or biological motherhood.

Against this evidence, the changes are reasonable as a *partial* correction:

- Remove the s0035 claim that 惠風 is explicitly a personal-name; remove the
  misleading `Wang Huifeng` / `王氏` full-name equivalence. The replacement
  `Wang` / `王` surname claim citing s0065 and s0177 is a normalized substring
  of the actual `王氏` designation, not a claim that 王氏 is a complete
  personal name. Preserve both title and actual mention surfaces.
- Replace the normalized English title with `Taifei of the Grandson-Heir`,
  matching the candidate's s0177 title mention; the Chinese is `太孫太妃`.
  This is a defensible transliteration, not proof of a uniquely established
  institutional translation, and does not assert biological motherhood.
- Cite s0065, rather than the betrothal in s0035, for the explicit consort
  role. Treat p001 spouse-of as `strongly-inferred` using s0065/s0073 and
  remove the unsupported `divorced` state and other union/sex-role qualifiers.
  A divorce request in s0073 or 096 s0101 does not establish its success.
- Remove `parentage: biological` for p038 child-of p037; s0035 explicitly
  supports younger daughter/parent relationship but does not by itself prove
  biological parentage. The sibling assertion discussed below is separate.

The source review correctly treats 096 as cross-chapter corroboration for a
review dossier, not as a permissible 053-local evidence ID. No dates were
changed or approved by this identity-focused repair.

## Material holds and required downstream work

1. **Name category and current identity presentation remain unresolved.** The
   candidate removes the unsupported explicit personal-name claim but retains
   `personal-name` mentions of 惠風/Huifeng at s0035 and the preferred label
   `Wang Huifeng` / `王惠風`. These retain the occurrence and a conventional
   cross-chapter designation, but the mention kind, label provenance, possible
   implications in the compiled page, and 096's courtesy-name evidence need a
   schema-supported, independently reviewed cross-chapter identity treatment.
   Deletion of the bad claim alone is not a complete courtesy-name repair.
2. **The sibling claim still asserts `sharedParentage: full`.** p039's
   strongly inferred `sibling-of` p038 uses s0035/s0036, which identify Wang
   Yan's younger and elder daughters but do not identify a shared mother. This
   qualifier remains inherited and is not justified by those cited units.
   Review/correct it through a separate scoped handoff rather than assuming
   this candidate fixed it.
3. **The chronology hold remains.** p038's s0035 attestation retains
   `元康中` / AD 291–299, although the wording is absent from s0035; other date
   hints are also unchanged. Preserve the hold and require contextual-source
   investigation and a fresh full independent date audit; don't silently
   assign a replacement date or reinterpret this as date approval.
4. **Expanded claim IDs shifted.** Removing one compact name claim renumbers
   later expanded claims: previous p038 attestation c0418 is now c0417;
   old spouse c0337 is now c0336 and the old c0337 identifier now designates
   the p038 child-of claim. The old p039 name c0152 is now c0151. Any old
   date reports, editorial references, generated outputs, or identity evidence
   referring to IDs must be fingerprint-bound and freshly reconciled; blindly
   reusing them could refer to a different assertion.
5. Actual independent editorial provenance, all other source and translation
   holds, complete refreshed identity comparisons, fresh date approval, site,
   search, backlinks, ebook and publication gates remain open. This note does
   not authorize mutation of any canonical file, queue, lease, or Git index.
