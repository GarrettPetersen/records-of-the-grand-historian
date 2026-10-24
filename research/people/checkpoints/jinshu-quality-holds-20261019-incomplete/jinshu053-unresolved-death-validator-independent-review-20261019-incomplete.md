# Independent design review: Jinshu 053 unresolved death — incomplete

This is a code/design review and offline check, not a complete date audit,
source approval, implementation promotion, or chapter-completion claim.
Reviewer: separate Codex conversation `/root/jinshu101_research`.

## Reviewed inputs

- Staging reference at review: `4968fed2e6ba5b712cb3910ac516d3bca5546365`.
- Research patch `data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-unresolved-death-validator-research-20261020.patch`,
  SHA-256 `566766ef54b540ecbd56f429028ffa0de7b6ce8768ebca03dc3c387c96548a2a`.
- Focused test `data/people/generated/jinshu-identity-ref-64521198-20261018/test-jinshu053-unresolved-death-validator-research-20261020.mjs`,
  SHA-256 `4ef9fc509651d6daea5ead74711f389beb3ad475cd3a261fe04733be9d95ba15`.
- Held v3 `source.json`, `extraction.json`, and `editorial-history.json`,
  respectively SHA-256 `a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d`,
  `9fd9057a444fef6b50119009fe7e113c1956ea0abc8f74217e9998ef052938ec`, and
  `da4433a63b8da668e271c27d9ab9714e00c22a155a7c6397ba2234c129291be7`.
- Patched isolated fixture validator SHA-256
  `369ab120a726b7e63caed9c0bc43a718eadbb0356432066857fa4e24b8ac2c9c`.
  A direct diff against staging's validator showed exactly the research patch's
  removal of the `death` predicate from the conservative all-holds exclusion.

## Result and scope

The held extraction's `p027` is Jiang Jun. Her `c0528` death row and `c0543`
attestation explicitly preserve `十二月` as an **unresolved** context and
give a substantive reason that the preceding heading's application needs
review; her active-date hints are empty. The patch does not decide whether
that December heading governs her death. It permits capture of this research
hold rather than fabricating a Western date or activity hint. The schema
allows generic claim values, and the validator already validates unresolved
date contexts with nonempty source text and reason. This proposed exception
is conceptually consistent with the documented independent-date-audit process.

The exception applies only when source attestations exist and are undated or
qualifying holds, and *all* date-bearing claims have one or more recursively
discovered temporal containers, each with source text, substantive unresolved
reason, and no Western year, interval, or bounds. The patch continues to reject
death-place and deceased-participation rows from this particular exception.
It does not prove that any quoted date applies to an event or that an evidence
unit semantically supports an attestation: the production extraction
validator checks referenced units exist, not historical entailment. Separate
source review is indispensable.

Staging `validateDateAuditReport` explicitly rejects status `audited` when any
packet item's recursive temporal containers contain `unresolved: true`.
`dateAuditItems` includes all death and attestation rows. `dateAuditStatus`
also compares source/extraction fingerprints and checks reference currency.
The ebook readiness path demands date status `audited`; the independent ebook
current-date verifier calls `dateAuditStatus` again. Thus extraction validation
of this hold is not, by itself, date approval, and a prior approval cannot be
carried forward after its inputs change. Cached site-index readiness still
depends on correct regeneration; the independent current-date check matters.

## Tests actually run

Against the existing isolated fixture, I reran the pinned focused test; it
passed the exact held draft plus applied editorial history, and rejected a
mixed concrete year, a Western date embedded in the unresolved death, short
or absent blocker detail, absent source-date wording or unresolved flag, and
missing supporting attestation. Its synthetic complete date report was
rejected because unresolved chronology cannot be approved. The test is not a
real independent audit. The fixture was not freshly reconstructed by this
review; only its validator was independently diffed against the pinned staging
file. Consequently this is focused evidence, not proof that all fixture
dependencies are staging-identical or that the full production suite passes.

Additional in-memory mutation checks against that same isolated fixture:

- Adding a separate concrete Western `endDate` alongside the unresolved
  `dateContext` was rejected for the missing active-date hint.
- Adding a second unresolved `endDate` lacking a substantive reason was
  rejected for both missing hint and inadequate unresolved reason.
- Replacing the attestation's evidence with a disjoint existing unit was
  **accepted**. The validator does not enforce semantic support or shared
  evidence for this research-hold exception; this is a real review limitation,
  not evidence that this candidate's actual evidence is unsupported.
- Replacing the attestation with a substantive explicitly undated one while
  retaining the unresolved death was accepted. That is consistent with the
  documented all-holds capture semantics, but needs a regression test so it
  remains an intentional case.

## Promotion conditions and test additions

The one-line policy change is suitable for further integration as a **capture
rule**, subject to a staging-pinned clean test run and normal host review; this
review does not certify it safe for production or publication on its own.
Before promotion add or run production regression tests covering:

1. Multiple temporal containers across nested `dateContext`, `startDate`, and
   `endDate`, including a Western interval, one-sided bounds, concrete date,
   missing source text and missing/short reason. A single mixed non-hold must
   not satisfy the no-hint exception.
2. A second unrelated life/activity claim, independently sourced undated
   attestation, and missing/cross-person or semantically unrelated evidence.
   Decide and document whether shared death evidence is required; do not
   silently infer that matching valid unit IDs proves source support.
3. Other still-excluded death-place and deceased-participation predicates,
   later reception, prompt versions 5/7, compact/expanded representations,
   and both historically dated and undated-only controls.
4. An actual current-fingerprint unresolved packet with a complete forged
   supported report rejected; a changed extraction making an old report
   stale; the reverse test where an unresolved hold is genuinely repaired and
   receives a fresh independent audited report. Recheck catalog/progress and
   ebook gates using regenerated data rather than only synthetic status mocks.
5. Run the relevant extraction/date-worker offline suites and inspect the
   exact staging patch and fixture dependency hashes. Preserve all existing
   recovery artifacts and live ownership. The v3 chapter remains unpublished
   and cannot count as complete until independently repaired and re-audited.

No canonical file, shared Git index, queue, lock or lease was changed by this
review. The reviewer no longer needs the isolated fixture after this report.
