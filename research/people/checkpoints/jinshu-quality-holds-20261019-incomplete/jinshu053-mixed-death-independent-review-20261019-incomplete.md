# Independent review of mixed death chronology — incomplete

This is a focused code investigation, not an independent historical audit,
production approval, or claim that chapter 053 is complete. Reviewer: separate
Codex conversation `/root/jinshu101_research`.

## Pinned materials

- Staging revision reviewed: `e81771ea7294b8e5a0bab8e75458022ff00fe962`.
- Expanded research findings SHA-256
  `158b5117ace44f3e10b46d731b4ba2302d9e7f6ef4effa8e32c4dad79d2d0ff3`;
  companion self-test amendment patch SHA-256
  `67a26b500b08d070d7b7658a8493fa361eed31cd64fa323148f9c02208c8346f`;
  expanded offline test SHA-256
  `bd2a758ff2b20edc655ff1a22f77f1fe203da95ad5ad426f334f3e849d2322ad`.
  All are under `data/people/generated/jinshu-identity-ref-64521198-20261018/`
  with the names in the corresponding parent handoff.
- The unpatched isolated validator matched staging's validator byte-for-byte,
  SHA-256 `33b59627388be1735eae3a05fb0b36b4580eb8b2c4924b063f2f7ad66e1af2c6`.
  The patched fixture validator, with the proposed exception and separate
  self-test amendment, SHA-256
  `3bbb854d6e744a06cd72f5b8f0f99a0115bfb119724a1d13d3546a777d8de086`,
  differs in exactly those two hunks. This check did not independently pin
  every transitive fixture dependency.
- The synthetic mutation below starts from the retained v3 source and
  extraction, SHA-256 `a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d`
  and `9fd9057a444fef6b50119009fe7e113c1956ea0abc8f74217e9998ef052938ec`.

## Independent reproduction

In memory only, for `p027`, I replaced attestation `c0543` with a substantive
explicitly undated source attestation. I retained death `c0528`'s unresolved
dateContext and added a **synthetic**, not historically endorsed, separate
`endDate` with source text and Western year AD 299. Both the staging-identical
unpatched validator and the validator with the research patch accepted the
expanded extraction with strict alias checks and no active-date hint.

Using each fixture's `dateAuditItems` and `validateDateAuditReport`, I then
created an entirely synthetic packet and complete supported report with all
item and person IDs. **Both rejected the report** with `Unresolved chronology
cannot be approved`. These synthetic reports were never saved or recorded.
This is a targeted in-memory demonstration of the unresolved-report guard,
not a real source audit or a current-fingerprint end-to-end ebook test.

A separate control retaining the unresolved death and undated attestation but
removing the synthetic endDate was accepted by the unpatched prompt-v5
validator and rejected by prompt v7 for missing Western-year attestation.

## Why it happens

`deathOnlyChronology` treats each dated death predicate as death evidence,
even if a row has multiple temporal containers. The source-backed-death
helper requires a death row, but applies `.every()` only to *dated*
attestations: with an undated attestation that set is empty and the predicate
is vacuously true. Therefore `deathOnlyEvidence` bypasses the no-active-hint
check. Separately, `hasSourceBackedLifeChronology` finds the concrete
`endDate`, bypassing the v7 Western-attestation check. The original research
patch changes the separate `unresolvedOnlyEvidence` test, not this older path.
Its comment about the all-holds test is literally scoped to that test, but
should not be interpreted as a global guarantee that all mixed shapes fail.

## Severity and safe design

This is a pre-existing **extraction semantic/invariant and test-coverage risk**:
acceptance alone does not prove that a concrete endpoint is supported or that
the unresolved context and other date describe the same event. In the tested
shape, it is **not an observed date-approval bypass**: the unresolved flag is
captured in a death packet item and the audited-report validator rejects it.
False citations and historical entailment remain an independent-audit risk;
structural checks cannot prove they are true. No claim is made about all
possible malformed values or every production path.

Do not blindly require a Western *active* hint for a person known only from
death: that would conflate death with activity. Likewise, avoid a blanket ban
on multiple containers that could suppress legitimate separately sourced or
conflicting chronology. Before changing the existing helper, specify whether
it should simply allow death-only capture pending audit, or also enforce a
stronger source-to-death relation. If strengthening, inspect **every** temporal
container, require any concrete context to retain a valid source anchor and
ensure any dated death attestation matches the correct death/evidence; preserve
valid independent undated attestations and explicit unresolved conflicts.
Source relevance still needs an independent reviewer. Keep the final
unresolved-item audit rejection, fingerprint staleness, and ebook gates intact.

Add a permanent regression matrix for expanded and compact representations,
prompts 5/7, undated versus dated attestations, death-only resolved/held/mixed
containers, independent undated attestations, and unrelated concrete activity.
For each unresolved variant explicitly assert rejection of `audited`, and test
old-report staleness and regenerated progress/ebook readiness. Any chosen
extraction rejection must test legitimate death-only cases as controls. Full
suite and independent host review remain prerequisites for production changes.

No canonical file, Git state, queue, lock, lease, or existing fixture was
changed. The reviewer no longer needs either isolated fixture after this check.
