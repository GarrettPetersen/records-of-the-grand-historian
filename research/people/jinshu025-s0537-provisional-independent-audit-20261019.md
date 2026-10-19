# Independent audit of the Jinshu 025 s0537 provisional candidate

**Bounded review only; not editorial receipt, date approval, identity review,
or publication approval.** I reviewed the generated materializer and saved
outputs against the separately approved exact editorial replacements, Chinese
unit and preceding seal reference, the prior three-date-holds candidate, and
the stage-pinned extraction validator. No canonical file or claim was changed.

## Inputs and scope

The input source and candidate have SHA-256 respectively
`2f1980cd20d124b450e4e1eecfa7319a610a5fbe0669851206442603eed43ab4`
and `44406e5534b6a0e42ae3df7eba1741421e338ecf01d46cc8eac23053b92b93b5`.
The reviewed materializer has SHA-256
`b03585cf923747407f1ec4898ebbca115a7add1d8bf9030b1d94814c6863141a`.
Saved output source SHA-256 is
`02c4c78e636051d3e81397d696443984f3963ebaad881805befcc60a92c6be78`;
saved candidate is
`dd188fcbd462afc518e040d4bd2d75f48142de6ce6e4d9476e32458569ad1fc9`.
The saved editorial history has unchanged SHA-256
`e71d9ff6edc7067b90e11e2b35c8cbe16467203cdb0fa92536d043d0cfd11c2c`.
These are byte hashes, not review-packet fingerprints.

The Chinese says `漢高祖佩之，後世名曰傳國璽，與斬白蛇劍俱為乘輿所寶。`
The changed literal and idiomatic strings exactly match the separate editorial
adjudication. The antecedent is the seal in s0536; the verbs distinguish
Gaozu's wearing, the later naming, and joint imperial treasuring. Their
language does not attribute acquisition of both objects to Gaozu or invent a
date. This supports the provisional translation, not the historicity of the
legendary sword or the factual transmission narrative.

The p072 description now says he was reported to have worn the seal, without
claiming he acquired the sword. The personal-name claim remains `Liu Bang` /
`劉邦`, with confidence reduced from `explicit` to `strongly-inferred` because
the amended sentence supplies `漢高祖`, not the personal name. The
[Hanshu and its commentary](https://zh.wikisource.org/zh-hant/%E6%BC%A2%E6%9B%B8%E9%A1%8F%E5%B8%AB%E5%8F%A4%E8%A8%BB/%E5%8D%B7001%E4%B8%8A)
identify Gaozu with surname Liu and name Bang, supporting the historical
identification, while not making it explicit in Jinshu s0537. This is a
conservative local description, not a global identity adjudication. The
pre-existing `temple`/`temple-name` characterization of 高祖 was unchanged;
whether that particular label should be retained deserves identity review,
since [Quan Han Wen](https://zh.wikisource.org/zh-hant/%E5%85%A8%E6%BC%A2%E6%96%87/%E5%8D%B7%E4%B8%80)
gives 太祖 as temple name and also says 高祖. Do not assert that this note
resolves that nomenclature question or make a cross-chapter merge from it.

## Checks and limitations

Using the `e02a499df802b8c0eaa8f5cf9f06397c397fad11` Git-pinned code loader
and a separate 16-file data fixture independently checked against that
revision, I ran `test-jinshu025-s0537-provisional-20261019.mjs`. It passed:
strict extraction over 607 units, 683 scanner candidates, 80 people,
173 mentions and 448 claims, zero alias-disposition conflicts; all three
input hash mutation tests rejected, output re-materialized identically, and
an existing destination was not overwritten. Reversing the allowed edits
reproduced the complete prior source and extraction, including every claim
and the three earlier date revisions; the three date revisions were preserved,
not independently endorsed here. The prior history was unchanged.

I separately tested four mutations against the same staging-pinned strict
validator. Removing the new English mention left its three detected
substrings unaccounted for; restoring `Liu Bang` as an English mention failed
the exact-surface occurrence check; removing the Chinese `漢高祖` mention
left its two name candidates unaccounted for; removing the `傳國璽` object
disposition left that candidate unaccounted for. All four were rejected.
The new English full-span surface is `Emperor Gaozu of Han`; the Chinese
surface is unchanged. These are negative controls, not proof of complete
identity or historical correctness across the chapter.

At observation, staging `6651857d41d5d88ea397d22806b1ecdfe03917fe` had no
diff from the pinned revision in scripts, packet schema/configuration,
chronology, glossary, source chapter, or the named editorial decisions path.
Recheck immediately before production use. The prior history does **not**
contain the newly applied s0537 decisions: the normal host-controlled,
fingerprinted editorial receipt must still be generated and validated. The
saved artifact's existing history validating is not proof of acceptance of
this new edit. Date holds, fresh independent date audit, identity and
publication/ebook gates remain open; no chapter may be counted complete.
