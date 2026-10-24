# Jinshu 129 middle-range date checks — research only

This is a partial independent source check, not an audit report, a repair,
an approval, or permission to change canonical inputs. The assigned range was
`s0090`–`s0178`, with surrounding context; the findings below identify only
specific issues checked against the source, not comprehensive coverage of that
range. Claim IDs refer **only** to the research candidate packet, not necessarily
to the canonical extraction or any sealed worker job.

Packet file SHA-256:
`e12dc796a3a3fb504f1959fc9f0a0b2d7d479055020f776d6eda699c5888a341`.
Packet `sourceHash`:
`sha256:b67618d76725994ac36717b3fdd27228b2e23ba1ddf60cb9d7c9bd62972c1318`.
Packet `extractionHash`:
`sha256:66c4e7e7eb5cb030aca7c35b2488bc75efc325dcdc7f7ef4b3bf9a1f800fa754`.
Candidate file SHA-256:
`507b0c22fb43f63401f29ad3684d49e26210e12f15e40cdaee6be4ecb4bcba89`.

## Appointment of Zhengde: a conflicting year witness

In local source `s0150`, Mengxun becomes King of Hexi in `義熙八年`; in
`s0153`, the source says `立其子政德為世子，加鎮衛大將軍、錄尚書事`.
The latter unit does not itself say the appointment occurred in the same year.
Candidate claims `claim-674`–`claim-677` and `claim-731`, and
`hints-p087`, place the appointment in AD 412. `claim-715` groups both
`s0150` and `s0153` under 412; its evidence for the accession should be
assessed separately from its evidence for the appointment.

The independently checked *Zizhi Tongjian* 116 presents the same appointment
under the heading `晉安皇帝　義熙九年（癸丑　公元413年）`: its account
reads `河西王蒙遜立子政德為世子，加鎮衛大將軍、錄尚書事。` The
heading, Western-year parenthetical and appointment appear on the [same
page](https://www.wenlinshe.com/tw/chapter/zhongguolishi/zi-zhi-tong-jian/juan-yi-yi-liu-jin-ji-san-shi-ba.html),
accessed 2026-10-19 UTC. This witness contradicts the candidate's confident
same-year attribution; it does not establish how to resolve any discrepancy
without independent review of the witnesses and year conversion. Do not
automatically carry its 413 into the earlier accession claim.

Exact UTF-8 SHA-256s, without a trailing newline:

- `s0150`: `780a60c93079b8a415a3c0cd61cb710c723045ac24d2903bfe20e2cacbcc9be7`.
- `s0153`: `52e382e1bcf613d314ae85715316376e18496a8290fac0bf1e8a86d6d0bfa431`.
- External heading as quoted: `3901bf67e518dbc57eab4a99f9196e4e32f9d545965c80c347e499e2d4646aa3`.
- External appointment as quoted: `0e851c6a84590981abad8e555d2d93462fbe5df3799ae082929aa8a802891755`.

## Lady Che's death: a conflicting year witness

The local text says in `s0170` that Mengxun's mother Lady Che was seriously
ill, and in `s0177`, `俄而車氏死` (soon afterward Lady Che died). Neither
unit states a Western year. Candidate `claim-767`, `claim-806` and
`hints-p095` assign AD 415–416. The *Zizhi Tongjian* witness cited above
places `蒙遜母車氏卒。` under its heading for 義熙九年 (AD 413), immediately
after the account of Wang Huaizu's attack that corresponds to local `s0169`.
The candidate's 415–416 window therefore excludes the year of this relevant
witness. Research the conflicting chronology and preserve the witnesses; do
not infer the year merely from proximity to the different campaign in `s0178`.

Candidate `claim-773`–`claim-775` and `claim-800`, plus the 415–416 portion
of `hints-p096`, also date Mengxun's separate illness-related actions to that
window. Their actual timing needs independent review; the Tongjian's date for
the death alone is not a precise direct date for each act. Similarly, the
later campaign's dates should be checked on their own rather than changed by
association.

Exact UTF-8 SHA-256s, without a trailing newline:

- `s0169`: `6f5868779b17eafd1912a1f265785fd3f7d7593fea30ef1d2375ab5877be1a64`.
- `s0170`: `6b49f2cef6ea522a1b8048ad149cece5bd6eb9dc84c900cf3cd7985845f91172`.
- `s0177`: `d62bab0397e1c6dfe3fec2ac286951f3dad4e099319e42cef81ed59de14babf3`.
- External death sentence as quoted: `41a99fb91e5643f3f2ffc93e324c260ef43424de00d109042a9ce6e2dc254863`.

## Nu's death: excessive precision in elapsed time

Local `s0149` says `旬餘而挐死`: Nu died after **more than ten days**.
Candidate `claim-658` says `died within a fortnight of appointment`, which
imposes an upper limit not present in this wording. Preserve the source's
relative interval rather than asserting a 14-day maximum; review the related
date bounds separately. A separate reviewer verified that both English fields
also say “within a fortnight”; they require independent editorial review and
correction alongside the claim. The UTF-8 SHA-256 of the entire Chinese unit, without
trailing newline, is
`96062b0e0a0f6279a6503bb407a610c4b760477e0b3cc9d4c2290a52ecbb38db`.

For an editorial decision on this exact candidate, a minimal proposed opening
for **both** English fields is “More than ten days later Nu died;” with the
rest of each field preserved. The corresponding claim should likewise remove
the unsupported upper bound. This is a proposal for the coordinated repair,
not an applied change, date bound, or approval of the rest of the translation.
An independent reviewer checked the two fields and s0148–s0150. Although the
preceding sentence describes Nu's appointment, the Chinese does not explicitly
identify that appointment as the interval's anchor; do not turn the narrative
sequence into a separately asserted exact starting event.

All three findings require reconciliation on the actual source/extraction
fingerprints, then a fresh, complete independent review. They do not establish
whole-chapter completion, identity resolution, or publication readiness.
An independent reviewer checked the local-unit and quoted external-string
hashes, the affected claim values, the external year placement, and the elapsed
time wording. The Western year in the cited edition's heading is a modern
parenthetical; the chronicle is a conflicting witness, not a resolution by itself.
