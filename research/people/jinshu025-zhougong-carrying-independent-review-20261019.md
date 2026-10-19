# Independent review: Jinshu 025 Duke of Zhou carrying King Cheng

Reviewer `/root/safe_publication`, 2026-10-19 UTC. This checks the source
research note, not a date repair, extraction approval, complete chapter audit,
or publication decision. No canonical data, sealed candidate, queue, claim,
lease, or lock was modified.

## Source and retained artifact checks

- Staging and the [Jinshu 25 digital text](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7025)
  agree that s0544 says `昔周公負成王，制此服衣，至今以為朝服`.
  The source does not say Cheng was an infant or give a Western year. It
  then presents a different Han explanation as uncertain.
- Retained `candidate-3.json` byte SHA-256 is
  `7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`.
  Its compact row 213 describes an infant and is marked
  `kind: retrospective-reference` with `unresolved: true`. Row 212 separately
  calls him an infant in an undated source attestation; both cite s0544 only.
  A future editorial assessment must examine both descriptions without using
  the date-only repair path to alter non-temporal content.
- Staging's s0544 idiomatic English also calls it a `baby-carrying sash`,
  whereas its literal field says King Cheng without specifying age. The
  idiomatic wording introduces an age not expressed in the source unit;
  evaluate it through independent translation review rather than edit the
  sealed source as part of the date audit.
- [Hanshu 68](https://zh.wikisource.org/wiki/%E6%BC%A2%E6%9B%B8/%E5%8D%B7068)
  narrates an image ordered and bestowed on Huo Guang, then a later conversation
  in 後元二年 recalling that image. The [Taiwan MOE reign index](https://dict.revised.moe.edu.tw/appendix.jsp?ID=43&ver=0)
  has 後元 88–87 BC, so year 2 corresponds to 87 BC. The cited conversation
  gives the image's latest narrated existence, not its exact commissioning
  year, not a date for the alleged Zhou action, and not proof that the Duke
  lived in 87 BC. None of this Han episode is asserted by s0544 itself.
- Chang's [article](https://www.litphil.sinica.edu.tw/newsletter/127/127-7-32.pdf)
  does interpret the Han image as showing an infant-sized Cheng; it also
  characterizes the swaddling-child account as a tradition, not proof. The
  original draft's page citation was off by one: that discussion is on
  printed page **10**, third PDF page (zero-indexed P2), not printed page 9.

## Retrospective interpretation

`PEOPLE_DATE_AUDIT.md` applies `retrospective-reference` to the later event
of reception, allusion or commemoration, distinct from a past action described
in a later biography. The note correctly leaves open whether the candidate's
reported carrying action and its reception are conflated and calls for actual
editorial/date review rather than imposing a label mechanically. `retrospective`
is the sole approved reception category; no new posthumous category is needed.
The mere telling of an old origin story does not itself establish a separately
dated later reception event or date the supposed carrying.

## Disposition

The author corrected the printed-page citation and added the verified claim-212
and translation observations. I re-read the complete corrected note, byte
SHA-256 `f89e2078e3a8e6bcb44bdb4832316e6c09960715463804f5ceef94a38a2898c4`.
The finding is resolved and I found no further issue in the checks described
above. This accepts the corrected *research note only*. It supports a careful
unresolved assessment, not a precise date or an inferred age; a fresh complete
independent audit, remaining holds, and current-fingerprint checks remain
required. No repair, chapter completion, or publication is approved here.
