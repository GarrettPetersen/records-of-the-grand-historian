# Separate editorial adjudication: Jinshu 025 s0537 (incomplete)

Scope: independent review of the two exact strings proposed in
`jinshu025-s0537-editorial-independent-proposal-20261019.md`, against the
Chinese of s0536–s0540 and the combined incomplete source and extraction.
This is not application, a date audit, identity review, or chapter approval.

## Inputs and verdict

I verified the proposal's input byte hashes: combined `source.json` is
`2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`, and
combined `candidate.json` is
`ee2528391c5ac3daa3b675c517f7701903925abd699131c9e5b10e9d83a0564c`.
The old translations match the proposal. On those inputs I **accept both exact
proposed replacements** as editorially supported, subject to the host's
fingerprint checking and required reconciliation:

- Literal: “Han Gaozu wore it; later generations called it the seal of state transmission. Together with the sword used to slay the white serpent, it was treasured by the imperial court.”
- Idiomatic: “Emperor Gaozu of Han wore it. Later generations called it the Seal of State Transmission; together with the sword used to slay the white serpent, it was treasured by the imperial court.”

In `漢高祖佩之，後世名曰傳國璽，與斬白蛇劍俱為乘輿所寶`, s0536 supplies the
seal as the referent of 之; 佩 reports wearing it; 後世 supplies the later
attribution of the name; and 俱 makes the seal and sword both objects of
imperial treasuring. 乘輿 is a metonym for the emperor or imperial
establishment, so “imperial court” is a defensible idiomatic rendering, not a
literal carriage. Neither the joint acquisition in the old idiomatic version
nor a date for the action is supplied. The sword is described by an alleged
deed, which this text alone does not establish independently. The nearby text
traces the sword's loss in s0538 and the seal's later transfers in s0539–s0540;
it does not justify making the joint treasuring a contemporaneous act by Han
Gaozu or importing a precise date. The references to Emperor Hui of Jin and
the armory fire also occur in an independent textual witness, [Yiyuan as
quoted in Taiping Guangji](https://ctext.org/taiping-guangji/232/jinhuidi),
but that parallel is not an independent proof of the legendary sword's history.

## Required reconciliation before acceptance

The combined compact candidate currently has an English `p072` s0537
`personal-name` surface `Liu Bang` and a Chinese `temple-name` surface
`漢高祖`. The proposed idiomatic text removes the first exact surface and
introduces `Emperor Gaozu of Han`. The literal text also changes. Rebuild the
scanner packet on the amended source; replace or reconcile affected English
mentions, scanner IDs and dispositions against the new text, retaining the
Chinese mention where valid. Check actual scanner output and mention kinds
rather than assuming either a surface span or scanner candidate ID.

The p072 descriptive string currently says `Han Gaozu; claimed transmission
seal and snake sword`; this repeats the English error independently of the
mention surface. Replace it with a source-supported description, without
asserting acquisition of both objects. Its `Liu Bang` / `劉邦` personal-name
claim is marked `explicit` and cites only s0537: the amended English will no
longer literally contain that personal name, while the Chinese gives the
temple/title reference 漢高祖, not 劉邦. Independently assess its evidence and
confidence under the actual extraction schema; do not mechanically discard a
correct alias or represent historical identification as explicit in this
sentence without support.

Rebuild the input fingerprint and unit digest; record separately reviewed
editorial history; validate the complete amended extraction against the
current staging rules. Temporal research, any date repairs and a fresh
independent audit, source and identity review, and publication/backlink/ebook
gates remain separate. Existing approvals cannot be carried over by changing
hashes. I made no changes to source, extraction, queue, locks, or the Git index.
