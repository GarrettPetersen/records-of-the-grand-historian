# Jinshu 025: independent editorial adjudication of two scoped passages

Reviewer: `/root/runner_status`, 2026-10-19 UTC. This is a bounded source and
extraction assessment, not an approval of the chapter, a date audit, an
identity decision, or an authorization to publish or overwrite any artifact.

## Evidence pins and scope

- Staging commit `c357dbed7c97a98f0a6f07858631610239cff70f`, chapter source
  semantic unit hash `sha256:203991b1b2be3d79f3922f8b95aa4118c8165d82eb0d8c11fb5c232c6ca79062`,
  computed from `contentUnits` using the production date-packet fields.
- Retained `candidate-3.json` byte SHA-256
  `7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981`.
  Claim numbers below are one-based; the referenced array indices are zero-based.
  The candidate is not the canonical extraction.
- I inspected staged s0441–s0447 and s0541–s0547, candidate people p052,
  p078 and p079 and claims 162–163 and 212–213, and the cited later textual
  parallels. The source and candidate hashes match the proposal's pins.

## The Duke of Zhou and King Cheng (s0544)

The immediately preceding sentence describes senior ministers' purple pouch,
attached outside the garment at the left shoulder. The target says 昔周公負成王，
制此服衣，至今以為朝服. The grammatical subject of both 負 and 制 is the Duke
of Zhou: he is reported to carry King Cheng on his back and make this item of
dress. 此服衣 refers back to the dress just described, but it does not say the
pouch was a sling for carrying a baby. Nor does the unit specify Cheng's age.
The next sentence gives a different account, associated with Han use for
memorials, and explicitly says the account is uncertain; it does not establish
the first account's historical accuracy. The proposed idiomatic sentence is
substantively supportable; the following wording keeps the referent broad and
avoids making the item an entire robe or asserting a manner of wearing that
the target sentence itself does not specify:

**Literal:** “Formerly the Duke of Zhou carried King Cheng on his back and made
this item of dress; down to the present it is used as court dress.”

**Idiomatic:** “Long ago, the Duke of Zhou carried King Cheng on his back and
made this item of dress, which is still used as court dress today.”

This is a reported origin, not an adjudication that the event happened.
“And made” avoids the existing literal's “making this robe,” which may suggest
simultaneity and an entire robe not established by the sentence. The proposed
idiomatic's “garment” and “worn” are reasonable contextual alternatives, but
the narrower wording above is preferable. “Myth,” “baby-carrying sash,” and
the current extraction's “infant” are not stated here.

Claim 212, p079, can describe the *source mention*, without implying an
independently established life event: **“King Cheng is named as the person
whom the Duke of Zhou carried in the account of the origin of this item of
court dress.”** This remains an undated source attestation; it does not assert
an age or an independently observed carrying. Claim 213, p078, describes the
reported *old action*, not a separate event of later reception. Suggested
action string: **“is said to have carried King Cheng on his back and made this
item of court dress.”** The role should describe the Duke as the reported actor,
not merely a recalled example. Do not use `retrospective-reference` for that
old action solely because the passage recounts it later, and do not invent a
date; any separate reception claim needs its own actually supported event and
date. A precise schema-valid event kind and uncertainty representation still
require the host's production validation and editorial/date review. The p078
person description also says “court pouch sash”; its unsupported “sash” should
be independently reconciled with the corrected claims rather than left behind.

I independently read [Hanshu 68](https://zh.wikisource.org/wiki/%E6%BC%A2%E6%9B%B8/%E5%8D%B7068):
it depicts the Duke carrying Cheng to receive the lords in a painting bestowed
on Huo Guang. This is a later representation, not s0544's text and not direct
evidence of Cheng's precise age or a date for the reported Zhou action. Its
Han chronology must not be assigned to the earlier action.

## The high-mountain cap (s0444)

The surrounding paragraph identifies the high-mountain cap and records views
that officials and, at times, the emperor wore it. The *Fuzi* quotation says
Emperor Ming of Wei thought its design resembled the tongtian and yuanyou
caps and therefore altered it, making it 卑下. The verb's object is the cap,
not officials. I independently read [Sui shu 12](https://zh.wikisource.org/wiki/%E9%9A%8B%E6%9B%B8/%E5%8D%B712),
which describes alteration of the cap's form, and [Tongdian 57](https://zh.wikisource.org/wiki/%E9%80%9A%E5%85%B8/%E5%8D%B7057),
which expands the comparison as 卑下於通天、遠遊 and then describes material
changes to the cap. These later compilations may share evidence: they are
context, not independent confirmation of every proposed detail or of a year.

Both staged English fields already render 卑下 as “made lower”; that is a
reasonable physical reading in this cap-design context, particularly in light
of the longer parallel. Its precise comparative dimension is not conclusively
fixed by the short quotation alone, so I do not require replacing either
translation merely to encode “lower ranks.” Neither field says the cap was
reserved exclusively for lower-ranking people. The idiomatic `Fu Xuan says`
personally identifies the cited *Fuzi* with its author; an optional cleaner
source-attribution edit is **“The Fuzi says: ‘Emperor Ming of Wei, because its
design resembled the tongtian and yuanyou caps, ordered it made lower.’”**
For the literal field: **“The Fuzi says: ‘Emperor Ming of Wei, because its
design resembled the tongtian and yuanyou, therefore ordered it altered to be
lower.’”** These suggestions do not import the longer witness's design details
or assert its exact comparison as if the Jinshu quotation gave it.

The candidate's p052 claim 162 incorrectly says he reserved the cap for lower
ranks; claim 163 repeats that unsupported exclusive allocation. Suggested
source-faithful replacements:

- claim 162 event: **“Emperor Ming of Wei is named in the Fuzi account as
  ordering the high-mountain cap altered because its design resembled the
  tongtian and yuanyou caps.”**
- claim 163 action: **“ordered the high-mountain cap altered, making it lower,
  because its design resembled the tongtian and yuanyou caps.”**

Retain the source attribution and the fact that 卑下 has been rendered
physically rather than as a rank restriction; a deliberately less committed
action string can omit “making it lower” if a future reviewer cannot settle
the sense, but should not silently add an exclusive-wearer rule. Both current
unresolved reasons also call the change a “demotion”; that loaded wording
needs coordinated correction, not just the action strings. The examined
quotation gives no numbered year. These wording recommendations do not resolve
the existing date hold or validate any proposed Western bound.

## Required next steps

Use the documented combined-curation route for any source and non-temporal
extraction edits, first reconciling the exact staged extraction and all retained
date work. A source edit changes the review fingerprint. A replacement candidate
requires fresh independent, complete source/identity review and a complete date
audit against the final fingerprints, with author/reviewer independence checked.
Other 025 findings and holds are outside this assessment. No canonical source,
candidate, Git index, claim, lease, queue, or lock was modified in this review.
