# Jinshu 025 s0444: independent focused editorial review (incomplete)

This is an independent, narrow review of the proposed four-string correction;
it is neither a complete chapter editorial review nor date approval. No source,
candidate, report, claim, lock or queue entry has been modified.

## Inputs inspected directly

- `data/jinshu/025.json`, actual Chinese and both English translations of
  s0439–s0445; current source byte SHA-256
  `e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60`.
- `data/people/generated/date-workflow/jinshu/025/candidate-3.json`, byte
  SHA-256 `7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`;
  all compact claims citing s0444 and candidate strings matching `demot`,
  `lower ranks`, or `卑下` were inspected.
- `data/people/generated/date-workflow/jinshu/025/review-3.json`, byte
  SHA-256 `31e45db21d6da52c14a98bf8f6b01c0aeb4936be8c1b784703db2d8dbcb54ae9`;
  it records status `needs-revision`, source semantic hash
  `sha256:203991b1b2be3d79f3922f8b95aa4118c8165d82eb0d8c11fb5c232c6ca79062`
  and extraction semantic hash
  `sha256:bc3347abec36331dba442f304d8ab15e8051e4c19d85a8d074b9ba460a700260`.
- The proposed text in `cap-redesign-editorial-finding-20261020-incomplete.md`.

## Verdict on the four strings

**Supported as a focused editorial correction**, subject to the normal host
repair and validation workflow. The preceding units establish 高山 as the
high-mountain cap, and s0444 attributes to 《傅子》 the statement `魏明帝以其制似通天、遠遊，故改令卑下`. In context this describes
lowering the cap's form because it resembles the tongtian and far-roaming caps;
it does not say that the cap was reserved for lower ranks. Both current English
translations likewise say it was made lower. The event attribution is to Cao Rui
as Emperor Ming of Wei; the statement itself is attributed to the Fu Zi.

The proposed replacement for claim-162's `event` supplies the physical change,
agent, and two named comparanda; the revised `unresolvedReason` removes the
misleading demotion wording without asserting a calendar date. The proposed
claim-163 `action` makes the same supported correction, and its proposed
`dateContext.unresolvedReason` removes the same misleading wording while
retaining the existing uncertainty. Claim-162 is candidate compact array element
161; claim-163 is element 162 (zero-based). Their cited unit, subject, claim type,
certainty, source text, and `unresolved: true` remain unchanged in the proposal.
No other occurrences of the literal defective English wording were found in
the candidate. This inspection does not independently establish the validity of
every other claim in the chapter.

## Additional issue not fixed by the four edits

Claim-160, also citing s0444, says its event is `Fu Zi attributed to Fu Xuan;
AD 217-AD 278 (outside-knowledge conversion)`, while the same record is marked
`undatedSourceAttestation: true`. The unit cites a work, not the author's birth
or death. Review-3 itself says the cited passage does not date Fu Xuan and that
the imported lifespan must not be installed as life dates. The event prose
nonetheless carries those years and could confuse downstream presentation or
be mistaken for source-supported chronology. This is a separate editorial/date
representation concern, not proof those externally supplied biographical years
are false. Independently inspect its publication path and decide the appropriate
source-backed representation before relying on it; do not simply attach those
years to the event or author without evidence. The four-string proposal leaves
this issue in place. Other s0444 claims and mentions exist, including authorship
and inferred sex; their wholesale validity has not been adjudicated here.

## Date and publication implications

The unit provides no numbered reign year for the redesign. The four corrections
do not resolve either claim's date, authorize a reign-length activity range, or
justify reclassifying the act as undated. Review-3 specifically marks claim-162,
claim-163 and p052 research-blocked; its other holds are unaffected. Existing
review-3 is already `needs-revision`, not an approval. If the candidate changes,
its fingerprint changes: preserve all sealed artifacts, use the host's permitted
editorial mechanism (the date-only interface excludes non-date event/action
changes), validate and reseal the candidate, and obtain a fresh independent
date audit on matching fingerprints. Identity and publication gates also remain.
This note authorizes no direct edits or publication.
