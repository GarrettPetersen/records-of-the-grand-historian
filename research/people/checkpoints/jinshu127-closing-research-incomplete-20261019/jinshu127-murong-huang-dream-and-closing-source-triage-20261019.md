# Jinshu 127: dream chronology and closing translation triage

Focused source research by `/root/jinshu_ready`, 2026-10-19 UTC. This is not a
complete audit, approved correction, identity decision, or authorization to edit
the canonical chapter. Inputs: staging `4b9022c6fb104404f6e12c91c1e1081a93a5ae1d`;
Jinshu 127 source byte SHA-256 `ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a`,
extraction byte SHA-256 `e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`,
and partial date report byte SHA-256 `7a499e0d0157395b1f6a8676e0a78f9f7e621732696dae6a24edabb648f9ede5`.
The separately retained s0173 v5 candidate has byte SHA-256
`44f98126487a079ee1776a9b76eb5f6ebfd04427ef731b38b3c6096b44e79a99`;
it is incomplete and must not be conflated with the staged extraction.

## Murong Huang and the dream

Jinshu 127 s0003 explicitly identifies De as the youngest son of Huang. In
s0273 De dreams of his father speaking; s0274 calls the apparition the late
emperor's spirit. Separately, [Jinshu 109, biography of Murong Huang](https://zh.wikisource.org/zh-hant/%E6%99%89%E6%9B%B8/%E5%8D%B7109),
reports that Huang died in Yonghe 4 and was aged fifty-two by traditional
reckoning. The corresponding staged `data/jinshu/109.json` byte SHA-256 is
`aa15f4935b0154841972a9b61f6ecfbaee031bf3db500c5cf6888bc47a71f888`;
its unit s0147 contains `以永和四年死，在位十五年，時年五十二。` Its s0056
attributes Huang's assumption of the kingship to Xiankang 3. The local s0147
English renders Yonghe 4 as 348 CE; the calendar conversion is a conventional
year-label reading, not a specific day established by this note. The traditional
age should not be turned into an exact Gregorian birthday.

This cross-chapter evidence reinforces the existing partial report's distinction:
the dream is De's later account involving a deceased father, not a personal
living attestation of Huang in 337–348. An independent evidence-based identity
review must still decide the relation between local p002 and p164 and any
cross-chapter records. A safe candidate should retain the relationship and
dream-speech attribution, but must not present the dream as Huang's living
attestation, make its date equal to his reign, or cite Jinshu 127 s0273 as the
source for a 348 death. Any new factual claim from 109 needs provenance that the
actual publishing schema can faithfully represent, rather than laundering an
external assertion as an s0273 statement. Rebuild the packet after edits: the
staged claim number 385 is not stable after removal/reordering.

## Additional translation and date issues for independent review

* s0277 says more than ten **coffins** were made at night and sent out by four
  gates, followed by a secret burial in mountain valleys whose actual location
  remained unknown. The literal translation reflects the coffins; the current
  idiomatic translation says “coffers”, drops the count and final uncertainty,
  and claims “his true burial” was hidden. Suggested meaning to review: “That
  night they prepared more than ten coffins and sent them out through the four
  gates, burying him secretly in the mountain valleys; in the end, no one knew
  where his body lay.” The source describes multiple coffins but does not
  explicitly call any particular coffin a decoy. Preserve the translator's
  interpretive space and check both fields through normal editorial review.
* s0279 `偽諡獻武皇帝` describes a posthumous title and contains the
  historiographer's delegitimizing `偽`. The idiomatic “temple posthumous title”
  conflates a temple name with a posthumous title; the literal omits the
  delegitimizing qualifier. A possible rendering is “He was given the
  posthumous title Emperor Xianwu, which the Jin historian treated as
  illegitimate.” The treatment of `偽` is interpretive and needs an independent
  reviewer to select a historically accurate, consistent English rendering.
* s0278 says `在位五年` (he held the throne for five years), not that the
  accession itself lasted from AD 400 to 405. Staged extraction p154 has an
  `accession` claim with `westernInterval` AD 400–405 citing s0278. Duration of
  rule, inferred start, and accession are distinct; do not use this sentence
  alone to assert an exact accession interval or continuous attested activity.
  Examine adjacent chronology and external sources before a schema-valid repair.

These are source-based review leads, not approved new repair rows. The two
translation proposals should be coordinated with the already-reviewed s0232
materialization before final packet sealing. Resolve all claims, uncertain
chronology, identity and old editorial provenance separately; obtain fresh
independent complete audits for the exact final fingerprints. No canonical,
queue, lock, Git-index, or branch changes were made for this note.
