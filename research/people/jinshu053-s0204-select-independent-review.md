# Jinshu 053 s0204 select candidate: independent narrow review

Inspected `jinshu053-quote-s0204-select-v1-incomplete-20261020` against the
declared prior `jinshu053-edict-title-link-v1-incomplete-20261020`. The actual
source, extraction and editorial-history SHA-256 values match the output
manifest: respectively `87d50156cafc84c2d031824839926dd1c732993e94c8bb10b159f17dd660f193`,
`0656030ba8e87796923c8bd397e7e1f774941d4d19e6227d2ad43ce7353a5ce6`,
`4271708b0f19d092b950d96fcb5c1a94cb485bd9273d71f2a1912f0cc0c7e449`.

The Chinese reads `其遊處左右，宜得正人使共周旋，能相長益者。` The
immediately preceding s0203 opens the edict quotation and places the young
prince at the Eastern Palace. s0204 closes the quotation; s0205 then names
sons of officials assigned to guide and keep him company. Selecting suitable,
upright people rather than merely stating that existing attendants are upright
preserves 宜得正人. “Foster growth” need not decide the precise beneficiaries
of 相長益, a genuine interpretive hold. No additional quote mark is needed.

**Objection to the exact selected wording:** “For those in attendance and
keeping him company, upright people should be found…” can suggest that upright
people are to be found **for existing attendants**, rather than themselves
chosen to attend and keep company with the prince. It is awkward and admits
an unintended relationship. A candidate to assess separately is: “Let upright
people be chosen to attend him and keep him company, people able to foster
growth through their association.” This explicitly keeps both selection and
ability without deciding whether the growth is mutual. It is a proposed
alternative, not a materialized or approved repair.

The only changed source sentence is s0204 and its only changes are the two
English fields. Candidate changes are the rebuilt `input` and two new
translation-repair rows; `people`, `surfaces`, `claims`, dispositions and
coverage remain byte-semantically identical. The staging-pinned fixture's
strict compact validator passed: 209 units, 375 candidates, 71 people, 520
mentions, 541 claims, 63 repairs, 149 dispositions, zero alias conflicts.
There are no s0204 scanner candidates or person mentions. The s0203 `Yu`
mention remains occurrence 1 at [82,84), matching the earlier physical
quotation context. These are structural checks, not a semantic approval.

The draft's reviewer is a synthetic placeholder. All inherited holds remain,
including s0203's `師傅群賢` interpretation, s0205's textual variant, p038's
identity/claim evidence, independent editorial and date audits, complete
backlinks and publication. The prior report's current-checkout/schema
compatibility failure also remains unresolved; this result uses only the
specified staging fixture. No canonical data, locks, claims or Git state were
changed.
