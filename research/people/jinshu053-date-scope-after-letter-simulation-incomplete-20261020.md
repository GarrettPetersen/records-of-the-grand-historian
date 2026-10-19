# Jinshu 053 date scope after the genuine-letter simulation

This is a focused research finding and handoff, **not** an independent complete
date audit, a canonical repair, or chapter approval. No source, extraction,
date report, queue reservation, lease, lock, or existing artifact was changed.

## Exact inputs

The read-only remote check found staging
`4003d498cb88f0545ea478513c40a4f2585d2f37` and shared queue
`4aca09929f40d88b55271e75e780d6423d494b2c`. Local canonical source,
extraction, and report have the following byte SHA-256 values, matching the
previously documented staging chapter blobs:

| File | SHA-256 |
| --- | --- |
| `data/jinshu/053.json` | `85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407` |
| `data/people/extractions/jinshu/053.json` | `464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69` |
| `data/people/date-audits/jinshu/053.json` | `d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073` |

The separately simulated six-decision source and extraction in
`jinshu053-real-letter-simulated-v1-incomplete-20261020/` have respective
byte hashes `26f2169267b866e9203dd05f902044aa6c7839d7b780bba10ce4a1b0066c7e78`
and `90ba9a264753eafb79043d615e74fcc7153b6d80dee9f18dd649b1a99d64ede5`.
They are not published inputs and leave the date claims discussed below
unchanged. The current report's semantic source and extraction fingerprints
are `sha256:fab0a59c5d375ac889d03e7530b083fed82c11b4521823e1330e8840637b84f1`
and `sha256:a23f128f1371dc93275fa0f54af14e3d5952530b3e0e57975ccded564208c3b9`.
Source and extraction changes require a fresh audit, not amended hash fields.

## Lady of Yicheng: letter is later reception, not proof of activity

The simulated candidate still gives `p056` the active hint `AD 299`; its
`claim-180` is an attestation with source date `自宜城君亡` and Western
year AD 299, citing `s0077`. The existing report marks both `claim-180` and
`hints-p056` supported, quoting `s0077` but providing the same generic reason
used across many items. That explanation does not derive the Western year or
show why an account after the Lady's death is an active-year attestation.

In the pinned source:

- `s0044` introduces a ninth-year, sixth-month episode: `九年六月`.
- `s0066` begins a next-year first-month episode: `明年正月`.
- `s0068` places the prince in confinement at Xuchang: `更幽于許昌宮之別坊`.
- `s0074` introduces his letter after arrival: `太子至許，遺妃書曰`.
- `s0077` says: `自宜城君亡，不見存恤，恆在空室中坐。`

The text therefore describes the Lady's death as preceding the letter; its
mention in the letter cannot by itself show that she lived or died in the
letter's year. The relationship and identification of this person also have
separate open research holds; this chronology finding does not resolve them.
The source does not state an explicit Western year for her death. Establish
the letter's regnal-year chronology independently, consider calendar
boundaries, then assess whether a one-sided death bound or an undated
retrospective reference is supported. Do not turn the letter date into a
precise death date or living activity, and do not assume a date is necessary
for the historical statement to remain visible. The auditor must determine
whether the schema and evidence support the appropriate event attribution.

## Other retained date issues

The same simulated candidate retains the age-five `claim-110` AD 266–290
interval. The existing review says it is supported but does not derive its
endpoints from `s0007`, while the same incident's `claim-102` is unresolved.
The earlier isolated unresolved proposal and independent check are preserved in
`research/people/jinshu053-age-five-retrospective-proposal-20261019.md` and
`research/people/jinshu053-age-five-unresolved-independent-review-20261019.md`;
they do not establish an event year or approve this chapter.

For `p068`, `s0183` says Sima Zang was killed after Yongning 1's first-month
usurpation; `s0184` says `太安初，追諡曰哀`. The simulation retains an
AD 302 active hint, `claim-124` as an ordinary attestation for the later
honor, and `claim-251` without retrospective classification. Earlier source
research and independent check are in
`research/people/jinshu053-zang-posthumous-date-audit-discrepancy-20261020.md`
and `research/people/jinshu053-zang-posthumous-date-independent-check-20261020.md`.
They require independent chronology of the award and retrospective handling;
neither proves that 302 is the exact award year.

`p038`'s `claim-162` in the prior report assigns `元康中` / AD 291–299 to the betrothal while
citing only `s0035` (`為太子聘王衍小女惠風`), whose wording contains no
date. The sequence could give context, but the report and any repair must
justify that context and each endpoint, distinguishing a broad event window
from an active interval. Do not infer a date solely from row order.

## Safe route forward

1. Complete and independently review pending source/editorial corrections,
   including the separate `p056` and `p038` questions, before sealing the
   actual date packet. The six-letter simulation is not full editorial closure.
2. Preserve the current research-blocked report and prior proposals. On the
   checked shared queue revision 053 had no extraction or date reservation;
   recheck live ownership before any host action. Never disturb another
   chapter's sticky work, lease, or local executor lock.
3. Seed the owner-safe date workflow from the recorded failed report, add the
   independently established discrepancies, and create exact fingerprinted
   date-only proposals. A separate reviewer must examine each claim, person,
   reference, evidence and endpoint, including every source unit, not just
   these examples. Preserve unresolved uncertainties; they block approval.
   A repair author cannot independently approve their own candidate.
4. Validate through the production and editorial gates, conduct a new full
   independent review of the final source and extraction, and only then apply
   the normal identity, page, backlink and ebook checks. Existing report
   coverage is 209 units, 188 temporal/hint checks and 71 people, but the
   report is `research-blocked` and its generic reasons and discrepancies
   cannot certify the remaining checks.

The formatting-only normalizer was previewed against both the canonical
extraction and simulated candidate: each returned zero changes and zero writes.
It is not a chronology validator or approval. No fresh model turn was spent.
