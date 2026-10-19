# Independent review: Jinshu 025 Shi Hu proposed repair

Scope is the p076 historical claim and its isolated structural test, not an
independent audit of the chapter. No canonical source, extraction, review
receipt, queue, claim, lock, Git index, or worktree was changed.

## Historical evidence and ownership

The local unit s0540 reads `及石季龍死，胡亂，穆帝世乃還江南`. It attributes
the death to Shi Jilong and places the disorder and southward return later;
it does not give their Western years. [Jinshu 107](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7107)
identifies the subject in the heading as `石季龍〈虎〉` and in the ensuing
account records 季龍's death. It transmits `至此太和六年` together with a
reign of fifteen years, and states earlier that he ascended in Yonghe 5.
[Jinshu 8](https://zh.wikisource.org/zh-hant/%E6%99%89%E6%9B%B8/%E5%8D%B7008)
records `石季龍死` in its Yonghe 5, fourth-month entry. Its Yonghe 8 passage
separately reports the seal being sent south: this supports keeping the death
year separate from the return, but this review does not propose a return date.

I independently fetched and checked [the Jinshu 107 collation](https://skqs.dazhishi.com/show_gldrnrpkdz.html),
note 3. It says `「太和六年」自當作「永和五年」`, explains the annals and
15-year count, and notes Taiping Yulan also preserves 太和六年. This is a
source critic's emendation, not a claim that the underlying text actually
reads Yonghe 5 or that this proves original manuscript wording. The
[Taiwan MOE reign index](https://dict.revised.moe.edu.tw/appendix.jsp?ID=23&la=0&page=2&powerMode=0&ver=4)
lists Eastern Jin Yonghe 345–356, Taihe 366–371, and Xiankang 335–342;
their conventional year labels support Yonghe 5 = 349, Taihe 6 = 371, and
an inclusive Xiankang 1 to Yonghe 5 of fifteen named years. This is not a
day-level Gregorian conversion. Together, these sources make 349 a defensible
source-attributed editorial judgment, with the contradictory transmitted
reading and emendation expressly retained. They are not independent
contemporary eyewitnesses.

## Isolated staging-version extraction check

On 2026-10-19 I confirmed staging head `425d98d465c0873db29c887f6650dd90e0837bf1`
both locally and at origin. A test-only loader loaded repository script
modules directly from that tree; the fixture copied 16 tree-pinned
schema/config/chronology inputs to a temporary directory, not a checkout.
Node was v23.7.0 and the installed dependencies were local, not newly pinned.
The harness pinned source SHA-256
`2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`
and scanner-reconciled candidate SHA-256
`1c2fd4ede2d8804d1c26d5abea80c0a1027e85f19e52b1b54adf5974e7340fef`.
It verified both p076 before-rows were unresolved, `textual-variant`, and
anchored solely to s0540, then replaced only their value objects **in memory**
with the identical proposed sourceDate/year/event objects. This deliberately
tests the later scanner-reconciled generation; it is not authorization to
apply a repair sealed for candidate-3 to that other generation.

`validateCompactPeopleExtraction` with strict alias dispositions passed the
result: 607 units, 681 candidates, 80 people, 173 mentions, 448 claims,
four repair rows, 528 dispositions and no alias-disposition conflicts.
Changing only the death row's year to 350 caused the p076 active-date checks
to fail, as did replacing the attestation description by an appointment after
the subject's father's death. The attestation begins `Death recorded`, which
the current death-only structural guard recognizes; the date/evidence values
match the explicit p076 death claim. The event is not a retrospective
reception and no `receptionType` is introduced. This validator does not
independently establish historical truth or date approval.

## Decision and limitations

I find the bounded historical judgment and the exact in-memory representation
defensible for preparing a fingerprint-bound repair; I do **not** approve the
chapter. The proposal's `sourceDate` is the verbatim local undated death phrase,
not a claim that s0540 contains the year. The published audit must cite and
hash separately verified external excerpts, including the collation and
the reign conversion, preserve the variant as a variant, and bind both
the correction and the complete independent re-audit to the final source and
extraction hashes. The present event string identifies the texts and
collation but is not a substitute for those external-reference records.
The source and scanner edits still need their proper independently accepted
curation receipt; the many other research holds, date review, identity,
publication and ebook gates remain. No approval or sticky-work ownership
follows from this test.

Harness and loader: `jinshu025-shihu-review-harness-20261019.mjs` and
`jinshu025-shihu-review-loader-20261019.mjs` beside this report. The small
fixture was left in place rather than deleting an artifact.
