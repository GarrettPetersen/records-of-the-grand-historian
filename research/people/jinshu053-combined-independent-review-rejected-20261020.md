# Independent review: Jinshu 053 combined editorial research candidate

**Decision: reject this assembled artifact for publication, editorial closure, or
identity approval.** This is a candidate-specific, partial review, not a complete
chapter review, date audit, or curation receipt. Reviewer conversation:
`/root/review053_combined`; I did not author the candidate. The original
sentence-level review identifies `audit_053` as reviewer and `editorial_crosscheck`
as proposal author, but I have not independently verified their retained
conversation IDs or that those conversations are distinct. The compiled component
explicitly has null reviewer agent ID and an assembly timestamp; it is not a real
production reviewer record.

## Exact inputs and checks

Candidate directory `jinshu053-supported-editorial-combined-v2-incomplete-20261020`:
source SHA-256 `dfe2c9cc0ab91d7423d75655f310e473ed08267286fe4b1f382d9273eeb21bb1`;
compact candidate `eaf3ba81b9ad1e3968f555dd51ae7d505102411cdc0a21386b2e70df374ea93f`;
draft component `9f1a0ca1e36bb6f7b95e58a29f59834d3616c58cb53ccd896ecfdb7bd74ad8d0`;
editorial history `285afe692c2c9bd7909003972b65146bc5096040c35787a6b0e0c569105f9c9f`.
Source baseline is staging commit `89296b9f9da8683bcd807c78b0cf27f94d129865`;
remote staging at inspection was `25306a869a7ad480560c08abead071f310f3e555`.
The 053 source, extraction, editorial decisions, scripts, glossary, schema and
people config had no changes between those revisions. This is not a lease or a
guarantee against subsequent changes. Original reviewed draft and review hashes
are checked by the materializer; the independent review is SHA-256
`43c8b280b0409a18dc69b5a9f2c19462ecc15a7d60d7a0a6bf5229436fd431cd`.

Exact comparison against the pinned source found only 43 literal/idiomatic field
changes in the 22 listed units, no Chinese or other source changes. All eight
previous repair rows and every compact claim match the checkpointed claim-110
candidate. That candidate changes the prior five-sui age claim by removing an
unsupported AD 266–290 interval and recording that event year is unresolved; it
does not establish a replacement date. The eight preserved repairs are not
independently re-approved here. For these 22 rows the retained `audit_053` review
provisionally supports both renderings subject to quote continuity and final
candidate review; s0176 literal was already unchanged, so 43 fields changed.
The review expressly excludes the held neighboring units.

I rebuilt a 209-unit packet using the isolated production fixture, reran strict
compact extraction and applied-editorial consistency validation (pass: 515
mentions, 541 expanded claims, 51 repairs, 148 dispositions). A changed chapter
fingerprint was rejected. Rerunning the materializer against its existing
destination failed `Refusing existing destination` and all five artifact hashes
remained unchanged. These are structural/tamper checks, not evidence that the
semantic defects below are acceptable.

## Blocking semantic defects

1. **s0179 contradictory disposition.** Source `趙王倫` is Lun, Prince of Zhao;
   the added English personal-name span `Lun` refers to p054 and is appropriate
   in isolation. But scanner candidate `cand_c558ac3414829511` is simultaneously
   classified `not-person/title` for that very `Lun` token. The strict validator
   accepts this contradiction. Remove/reconcile that disposition with the actual
   person link and candidate reference and add an adversarial regression; do not
   merely mark this contradiction resolved by the current validator.
2. **s0047 wrong disposition.** In unchanged s0047, `cand_e52f72d263aa7470`
   classifies English `Crown Prince` as `not-person/place`. The source `太子`
   and surrounding biography identify the subject as the crown prince, not a
   place. The new disposition arose during broad reconciliation outside the
   selected source units. Review its actual p001 linking and candidate geometry;
   a generic title must not become an independent false person. Inspect all
   automatically introduced/removed dispositions, including unchanged units,
   before accepting a regenerated artifact.
   The inherited s0063 candidate `cand_fdd511178dddc9f8` already mislabels
   `Crown Prince` as a place; it is also a reference to the deposed crown prince.
   `reconcileExtractionAfterRepairs` transfers a single previous disposition by
   exact English surface across different units (currently around lines
   1608–1623), before evaluating local mention containment. That context-free
   transfer explains the s0047 propagation and is unsafe beyond this chapter.
3. **p054 inherited title is wrong and backlinks incomplete.** The candidate
   retains a p054 name claim `Prince Zhao of Lun`, Chinese `趙王倫`, sourced
   to s0063, s0108 and s0179. That reverses the title and personal name: `倫`
   is Lun and `趙王` is Prince of Zhao. The wrong expression remains in s0063
   literal, both s0108 fields, and s0111 literal. The unaltered idiomatic s0063
   already says `Sima Lun, Prince of Zhao`; newly reviewed s0179/s0183 say
   `Lun, Prince of Zhao`. A separately reviewed repair should correct all
   affected fields and the p054 title claim coherently; do not silently change
   them as part of the 22-row acceptance. Current s0108 English surface also
   retains `Prince Zhao of Lun` as a p054 title reference. In s0183, `Zhao`
   alone is linked to p054; it is the territorial component, not a standalone
   person name. Prefer a source-faithful full title span if the mention geometry
   and overlap policy permit, with independent review; resolve scanner
   accounting without treating a territory as an independent person.

## Remaining source and review scope

The new Lun links at s0180 and s0183 refer in context to p054; p001 `Minhuai`
in s0180 is a posthumous name, as s0167 confirms. P068 `Prince of Puyang` in
s0183 refers to the grandson-heir (Zang), not Lun. The changed s0179 `Lun`
mention is contextually correct but cannot be accepted alongside the conflicting
disposition. The source editor's s0133–s0140 and s0175–s0179 quotation runs
remain open through neighboring held fields; the selected rows do not add
premature closing quotations, but the overall English must be reviewed after
those held fields are repaired. In particular s0134, s0139–s0141, s0177,
s0186 and the corrupted Chinese s0170–s0171 remain unresolved. The retained
review does not confer source-edition verification on any correction.

The broader reconciliation also removes and adds candidate dispositions in
unchanged units; a passed scanner completeness count does not prove every
disposition correct. No claim is made here that every other old or new surface
has passed a complete chapter-wide semantic review. Preserve this noncanonical
candidate and its research-blocked date state. A corrected fingerprint-bound
candidate needs an independent source/identity/geometry review, authentic
reviewer provenance, complete editorial coverage, owner-safe publication, fresh
independent date audit, identity resolution, and web/ebook verification.
