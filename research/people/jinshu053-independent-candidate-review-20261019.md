# Independent Jinshu 053 draft review — needs revision, not chapter approval

Reviewer conversation: `review_053`; proposal author identifies itself as
`finish_path_20261019`. This review is limited to the six proposed changes and
one visible adjacent name error. It is not a full date audit or identity review.

## Pinning and scope

On inspection, remote staging was `837d6292433b50c8f1c0d752a3723df778b814ec`.
I independently read its four blobs and reproduced the byte hashes in
`jinshu053-chronology-research-20261019.md`: source 053 `85bc5ea5…`, source 004
`9399721c…`, extraction `464b3ed3…`, and held date report `d3bb12db…`.
Comparing staged extraction with `candidate.json` shows only p004's hints,
claims 101, 102, 110 and 116, and one appended claim changed. I did not
independently execute the transform or validators: the receipt's claimed
validation is useful evidence but is not my independent reproduction. Exact
hashes must be rechecked before any future publication.

## Source and calendar check

[Jinshu 053](https://zh.wikisource.org/wiki/晉書/卷053) indeed describes Wu's
affection without a year and describes the fire with the prince aged five;
the same biography reports his killing followed by age 23. [Jinshu 004](https://zh.wikisource.org/wiki/晉書/卷004)
places that killing in the third month of Yongkang 1. On the conventional
Yongkang 1 = AD 300 and inclusive Chinese-year age assumptions, the arithmetic
300 − 22 + 4 = 282 is correct. The cited [calendar reconstruction](https://sangokushi-biyori.com/reference-gregorian-calendar-282)
places Chinese Taikang 3 in proleptic Gregorian years 282–283; it is a secondary
reconstruction, not proof of the biography's age convention or of the event.
Accordingly the interval is plausible *conditional inference*, not a date
explicitly stated in s0007. It does not justify date precision beyond the
broad interval, or a continuous activity assertion.

## Row findings

- 101 and 116: the source-specific undated events accurately retain the
  affection statement without importing the fire's date. No objection to the
  substantive replacement, subject to normal production validation.
- 102 and 110: the five-sui event and age are accurately represented, and the
  conditional calculation above is arithmetically consistent. However, the
  candidate records an unqualified 282–283 interval, retains respectively
  `explicit-event-contextual-date` and `explicit`, and cites only s0007; the
  essential age-at-death, separately dated annal, sui convention and calendar
  assumptions appear only in the draft proposal/research note, not in the
  candidate's source evidence. Confirm how the production report and rendered
  data preserve the conditional derivation before accepting these rows. The
  certainty of an explicitly stated age is distinct from confidence in its
  inferred date. The intended system describes derived chronology and its
  inputs in `PERSON_GLOSSARY_SYSTEM.md`; do not silently represent a derived
  year as an explicit event date. A concrete proposal and independent review
  of its supported schema/provenance are still required.
- Added p004 attestation and p004 hint: the emperor's presence follows s0006–7;
  `strongly-inferred` is a legal certainty value, and the bound is conditional
  on the same chain above. Treat `AD 282-283` as a bound for this event, not
  the emperor's lifespan or continuous reign. Its supporting derivation must
  remain accessible for future auditors and person-page consumers.
- The draft text's `sourceDate.text` for the added event combines adjacent
  source units; it matches their consecutive wording, but the underlying
  derivation is not itself in those units. Passing structural validation does
  not establish the age convention or an independent date audit.

## Adjacent blocker discovered

p004's unchanged names include `{"kind":"temple-name","zh":"武帝"}`.
This is historically misclassified: [Jinshu 003](https://ctext.org/wiki.pl?chapter=854352&if=en)
and [Taiping Yulan's quotation](https://ctext.org/text.pl?if=en&node=368667)
identify 世祖 as his temple name; 武帝 is a posthumous imperial appellation.
A separately reviewed schema-valid alias correction is needed. Do not alter
the sealed candidate silently or count this scoped review as whole-chapter
extraction/editorial/identity approval. Replacement may invalidate affected
resolution decisions and must follow the owner-controlled workflow.

No canonical files, queue claims, locks, history, Git state or recovery
artifacts were changed by this review.
