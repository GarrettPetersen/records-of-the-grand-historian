# Jinshu 053: age-five chronology check discrepancy

This is a narrow, independently reviewable research finding, not an approved
repair, complete date audit, or chapter-completion claim. Inspected staging
revision `e29dc9e5cdda6f73f9709ef0778af2b47d3e2a37` (the remote staging ref
matched at inspection). Byte SHA-256 values of its exact Git blobs:

| File | SHA-256 |
| --- | --- |
| `data/jinshu/053.json` | `85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407` |
| `data/people/extractions/jinshu/053.json` | `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69` |
| `data/people/date-audits/jinshu/053.json` | `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073` |

The date report's semantic hashes are source
`sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
and extraction
`sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`.
The extraction identifies `p001` as Sima Yu, the crown prince.

In source unit `s0007`, `太子時年五歲，牽帝裾入暗中。` gives the prince's
age as five in the incident but states no calendar year in that sentence.
The preceding `s0006` identifies Emperor Wu as present during the palace
fire. Neither sentence, taken alone, supplies Western-year endpoints.

- Report item `claim-102` refers to extraction array index 101, the prince's
  `attestation` of the age-five incident. It preserves the source wording
  with `unresolved: true` and no Western year or interval. The report marks it
  `research-blocked`, explaining that the cited wording supplies no era,
  year, reign-year, or independently pinned event date.
- Report item `claim-110` refers to extraction array index 109, the same
  prince's `age` of five, with `reckoning: "sui"` and a `dateContext` citing
  the same unit and phrase. That context retains a Western interval from
  AD 266 to AD 290. The report marks it `supported`, giving a generic reason
  and quoting the same sentence without a specific derivation of either
  endpoint.

The report's finding and summary say the identified childhood and affection
contexts no longer assert the AD 266–290 interval, and the finding's item
list omits `claim-110`. This is a discrepancy in the recorded review: the
age claim's dated context remains and its cited justification does not explain
the bounds. The presence of Emperor Wu could potentially inform a bound if
separately substantiated; this observation does not prove the interval false,
that a separate age claim necessarily asserts continuous activity, or that
the auditor performed no other investigation. It does establish that the
existing recorded checks do not reconcile the two treatments.

The previous narrow candidate review,
`research/people/jinshu053-independent-candidate-review-20261019.md`, also
discusses `claim-110` and a proposed conditional inference from age at death;
it did not approve the unqualified proposed replacement because the essential
assumptions and derivation were not preserved in the candidate's evidence.
That proposal is not a reason to substitute a new date here.

Before any canonical replacement or approval, independently verify both
claims, source context, the interpretation of the interval, age reckoning,
supporting witnesses and provenance; preserve the finding and existing report
through the owner-safe date workflow. Review any proposed correction in a
separate context and perform a fresh complete date audit on the final current
fingerprints. The existing report is already `research-blocked`; this note
does not change its status or settle the chapter's editorial, identity, or
publication gates. No source, extraction, date report, queue claim, lease,
lock or recovery artifact was modified.
