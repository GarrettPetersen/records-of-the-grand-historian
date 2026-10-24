# Jinshu 022 Yingchuan hymn: source-bound correction proposal (incomplete)

Research and editorial proposals only; not an extraction, identity, editorial,
date-audit or publication approval. No source or extraction file is changed.

## Inputs and evidence

- Five-kinds composed extraction byte SHA-256:
  `f038366b75123182a45e1f217f0a9b736a779da8d1ec77f6deaee68c39ab59b4`.
- Local Jinshu 022 source SHA-256:
  `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- Jinshu 001 SHA-256:
  `b4a4013c4359a9eba1a251b329a0f182e8f13ee03e9fe64c6df403627f25594f`;
  Jinshu 019 SHA-256:
  `88b5e895e2ee88c8e86098f14280c57b827d3d859effffdaea4718384e113718`.
- Prior independent ancestor-context review SHA-256:
  `3ec44b8ddb0365cdb86654cdc93d33b5f0dedaa6f5ae4827647a877991ba53e3`.
- [樂府詩集, original text](https://photoapps.yd.chaoxing.com/MobileApp/GDSL/pdf/gddj/1315480.pdf),
  page 68 in the digitized text, independently reproduces the Yingchuan
  hymn and the adjacent ancestor-hymn sequence. This strengthens the
  heading context; it is not independent evidence that every epithet
  necessarily designates the same individual.
- [尚書正義, 卷八](https://ctext.org/wiki.pl?chapter=381780&if=gb), in
  commentary on 有夏先後, glosses 先後 as 先君 and explains the reference
  there as earlier Xia kings. This is evidence that 後 can denote a ruler,
  not a direct commentary on this particular Jin hymn, and does not mean
  that the Yingchuan honoree actually ruled. It does not settle the number
  or identity of referents here.

Jinshu 022 s0231 identifies the hymn as 祠潁川府君登歌, immediately before
s0232 于邈先後，實司於天 and s0233 顯矣皇祖，帝祉肇臻. The next hymn
heading begins at s0236. The current p056 and p057 notes say the preceding
title lies outside the chunk, which is misleading for whole-chapter review.
Jinshu 019 s0510 includes 潁川府君 in the retrospective rites, and Jinshu
001 s0011 names 潁川太守儁, 字元異, as part of the same familial sequence.
These are meaningful identification evidence, but the evidence does **not**
prove that 先後 and 皇祖 each refer to the dedicatee; nor does uncertainty
prove that either referent is nonexistent or a different person. Preserve
the two surfaces and an unresolved referent until independently adjudicated.

## Translation proposals for independent editorial review

The current s0232 literal is “Ah, remote queen mother—she truly holds
Heaven’s charge.” Its idiomatic is “Far-shining queen mother—she indeed
ministers for Heaven.” No explicit feminine pronoun appears in the Chinese,
and 先後 alone does not establish a queen mother. Candidate alternative,
deliberately gender-neutral:

- Literal: “Ah, distant former lord, truly attending to Heaven.”
- Idiomatic: “How distant our former lord, who truly serves Heaven.”

This reads 司於天 as service directed to Heaven. “Serving in Heaven” is a
plausible alternative if 於 is read locatively; the short stanza itself does
not settle the nuance. “Former lord” is an interpretation supported by the
lexical parallel and sacrificial setting, not an explicit assertion that the
honoree held kingship. Editorial review must decide the preposition and
best natural English before applying either field.

Current s0233 literal reads “Manifest is royal ancestor—imperial blessing
first arrives.” Idiomatic reads “Bright our royal founder—Heaven’s luck
first settled here.” 皇祖 states ancestor, not founder; “here” is not
explicit. Candidate alternatives:

- Literal: “Manifest is the august ancestor; the Lord’s blessings first
  arrive.”
- Idiomatic: “Radiant is our august ancestor; the Lord’s blessings begin to
  arrive.”

帝 in 帝祉 can be understood as an exalted/divine lord, but its exact
referent requires editorial review; these alternatives are proposals, not a
claim that this translation is proven uniquely correct. Both English
fields must be repaired together and source-bound approval independently
recorded before editing the chapter. Do not copy “royal founder”, “queen
mother”, or the unsupported feminine pronoun into replacement names or
claims.

## Extraction dependencies, not an automatic patch

All references below are exact rows in the pinned five-kinds extraction.

- p055 (Yingchuan Prefect Lord) is an individual indicated by the hymn
  heading, and its s0231 Chinese and English surfaces must remain covered.
  Its attestation incorrectly says the hymn body is outside the chunk;
  replace that phrasing when producing a reviewed draft. Its 'official' and
  posted-to claims should be considered with the Jinshu 001 genealogy,
  not silently presented as deriving directly and unambiguously from the
  heading alone.
- p056's sex=female, consort/royal-family-member roles, queen-mother names,
  and `minister for Heaven` occupation are unsupported by s0232. The hymn's
  exalted language should not be tagged as the historian's own judgment.
  Its Chinese 先後 mention must be preserved; replace its old English
  surface after a source repair. Claim 359 uses the obsolete
  `posthumous-commemoration` kind. Do not merely rename the kind while
  retaining the fabricated occupational or feminine facts.
- p057's s0233 皇祖 is a human-ancestor reference, but its ruler role and
  'royal founder' epithet go beyond that expression. Claim 364 likewise
  uses the obsolete `posthumous-commemoration` kind. Claim 365 is a summary
  of unspecified descendants, not a named genealogy, and depends on how
  本枝 is interpreted. Claim 366 calls hymn praise a historian's judgment.
  Keep the 皇祖 mention and the uncertainty of its referent; do not delete
  or merge a person without the required independent identity decision.
- No other person's claim points to p056 or p057 in this pinned extraction;
  this is a dependency observation, not evidence that deleting either
  individual would be justified. A coordinated correction must review
  names, roles, surfaces, claims, source translations and regenerated
  candidate coverage together.
- The s0234 candidate `cand_950495d7e5a244f7` is categorized
  `not-person/reign-period`, while its own note says 開元 is hymn diction
  and **not** a dated era name. Review for the appropriate non-name category
  and rebuild the packet; do not preserve a contradictory category merely
  because a validator accepts it. All s0231–s0235 candidate dispositions
  must be rechecked after translation edits because candidates and offsets
  can change.

Independent editorial and identity reviewers should examine these specific
proposals and source context. Any accepted changes invalidate existing source
and extraction fingerprints, so rebuild the packet, revalidate the whole
chapter and obtain a fresh independent full date audit and all normal
publication gates. This report provides no authorization to repin a sticky
claim or overwrite sealed review artifacts.
