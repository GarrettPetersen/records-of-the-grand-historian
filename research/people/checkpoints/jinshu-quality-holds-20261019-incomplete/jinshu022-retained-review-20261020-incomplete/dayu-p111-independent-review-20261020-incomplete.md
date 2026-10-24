# Independent review: Jinshu 022 Dayu / p111 proposal (incomplete)

This is a focused source and implementation review, **not** a complete date
audit, editorial approval, identity decision, candidate validation, or
publication authorization. It reviews proposal file SHA-256
`97fb1b0358bc48c0fe100b93a78fb5df006aa3bd292a2223280137a658bc36d1`,
five-kinds candidate SHA-256
`f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`,
source `data/jinshu/022.json` SHA-256
`813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`,
and retained `review-4.json` SHA-256
`e6d5d13e47f372a493615cbc55682bb64c0dd61250bcf86e0a73fbf04a09e1e6`.
These byte pins were independently computed. Claim number and array index are
only valid for this candidate; compare complete rows on any subsequent draft.

## Evidence and dates

The proposal accurately quotes candidate index 783 as p111's undated/dated
conflict: `retrospective-reference`, `honoree`, praise in Zhang Hua's Dayu
hymn, with a putative `泰始九年至咸甯元年` and AD 273–275 bounds, citing
s0580 and s0584. Review-4's finding `claim-796` refers to its own earlier
candidate, not index 795 of the five-kinds candidate. Its finding expressly
rejects this window and says retain `retrospective-reference` while removing
or properly sourcing its date.

Reading Jinshu s0562–s0566, s0580–s0588, and s0613 independently confirms:
泰始九年 directly dates Xun Xu's pitch-pipe inquiry; after the pipes were
completed Xun Xu took charge of music and had two dances created, with lyrics
attributed to Zhang Hua; s0584 says `我皇紹期，遂在璿璣`, without an era
year or a named emperor. 咸甯元年 directly dates the later decision to use
the dances in temple music. The account supports a historical sequence, not
the asserted literal source-date expression `泰始九年至咸甯元年` for this
individual's honor. Agree with withdrawing **both** sourceDate and bounds as
the proposed date for the lyric; do not treat the dates as life dates, copy
them into active hints, or manufacture an alternative endpoint. Do not erase
the original report or its evidence. A freshly independent audit of the final
exact fingerprint must reconsider any independently supportable relationship
between composition, subsequent use, and a specific emperor, not simply assume
no temporal inference is ever possible.

The corresponding [Yuefu shiji 52 transmission](https://xuoda.com/hj/yfsj/052.htm)
attributes the same poem to 張華 and retains 我皇 in the Jin praise context;
it does not identify the 我皇 by name in that line. This later collection is
a textual witness, not proof that an event of retrospective reception of a
particular identified individual occurred. Its transmission does not establish
a date for the purported praise event either.

## Category, event and scope

The lyric presents 我皇 in a celebratory text after references to Great Jin
and previous sovereigns. On the evidence cited, there is no demonstrated
later reception of a known individual as opposed to praise expressed by the
lyric's voice. `PEOPLE_DATE_AUDIT.md` distinguishes an event of *later*
allusion/commemoration from a later historian merely quoting a source; the
fact that Jinshu was compiled later does not itself make this an event of
`retrospective-reference`. Thus I agree a source-focused editorial review may
question review-4's category; however, that is a genuine disagreement with
its explicit instruction, not an authorization to override or carry forward
the old review. Other evidence might show a later reception, and the person
behind the lyric still needs source-based identity review.

`artistic` is a descriptive `event-participation.kind`, not a newly invented
`receptionType`. The current reception helper recognizes only the explicit
retrospective markers; it does not prohibit this descriptive kind. Its use for
the poem is plausible **conditional on p111 being a supported individual and
the inclusion of this separate event being warranted**, but its passage in a
validator alone would not establish either point. I do not endorse the exact
proposed row unchanged: “the reigning sovereign” asserts more certainty about
the lyric's referent at composition or performance than s0584 alone proves.
If a separate source-based identity review retains the record, a more precise
candidate action would be `praised as "our sovereign" in Zhang Hua's Dayu
hymn` with the existing s0580/s0584 evidence, no date and no new life facts.
Have an independent reviewer adjudicate whether it is a meaningful literary
event or duplicates the existing attestation before inserting it. Do not
record a historical public performance, audience, honored person's presence,
or definitive Jin emperor as established by this line.

The adjacent attestation, `The Dayu hymn attests the reigning Jin emperor when
Zhang Hua wrote its lyrics`, similarly asserts an individualized referent and
composition-time status not established by s0584 alone. The p111 historical
status, polity, ruler/title and political-event rows also depend on resolving
the hymn's lyric voice and generic 我皇 reference. The local person's
undated attestation should be reviewed as part of that identity/editorial work,
not treated as independently verified solely because the proposal leaves it
in place. No merge, deletion of a potentially valid person, or identity guess
is recommended by this focused review.

Important gate consequence: in `scripts/lib/people-date-audit.mjs`,
`dateAuditItems` includes undated `retrospective-reference` claims, but an
undated `artistic` claim with no reception marker is not itself a date-audit
item. Changing kind and removing date therefore changes audit item coverage;
the chapter-wide source units and p111 undated attestation remain in the
packet, but this event would not receive a dedicated claim check. Do not use
the reclassification to hide the earlier date finding or imply it was audited.
Explicitly carry the dispute and the original complete row into independent
full-review instructions/evidence, and verify the final audit checks the
relevant source units, p111's surviving chronology and any new event/date.
If the workflow cannot support that coverage without compromising sealed
ownership, retain the hold until it can. Editing the source or extraction
invalidates approvals; regenerate the packet and obtain a fresh independent
complete audit, including all other findings.
