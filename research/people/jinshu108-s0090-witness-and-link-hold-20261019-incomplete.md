# Jinshu 108 s0090: source variant and wrong English person link

This is a focused research hold, not a proposed source emendation, accepted
editorial correction, complete chronology or identity audit, or publication
approval. No canonical source, extraction, queue, lock or retained workflow
artifact was changed. Evidence inspected 2026-10-19 against staging
`c2b994cbd4b3868446b43561610f38a7a2e3b4db`.

## Pinned inputs

- `data/jinshu/108.json`: byte SHA-256
  `8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`.
- `data/people/extractions/jinshu/108.json`: byte SHA-256
  `03128355667288fe2c91695a7e4a5372c5e758623277f420ac57d7c37e493576`.
  Both byte hashes match the staging blobs at the stated revision. Its sealed
  extraction input records chapter fingerprint
  `sha256:97fc1fec13a75a9f3ab671652e064b0d16b2eedcbf436466c90e64aee6d43611`
  and s0090 unit digest `fecc0a72441dd0869d11ba01`; these are not byte hashes.
- Retained date workflow `candidate-2.json`: byte SHA-256
  `c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413`.
  Workflow state byte SHA-256
  `7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152`
  identifies phase `repair`, round 2 and records source hash
  `sha256:d15a364ee7cefa821da0202907743d2a5a8830523c9a1cfd13d158eeeec7f101`
  and extraction hash
  `sha256:ad6690b52cc4ef5057a0b0411628c2456bc2fb1ffa5a058f459befc555c26f27`.
  These workflow fingerprints must not be conflated with the byte hashes or
  the extraction's older input fingerprint above.
- Staging date report byte SHA-256
  `5d664d2ce69e486cda682de74dc757af5f5091899a6796e72b23b8fe426e6bbf`
  is `needs-revision`, not approval.

## Text and witnesses

The local Chinese in s0090 is `廆懼，首服。` Both current English fields
identify **Tao**: literal `Tao in terror submitted.` and idiomatic `Tao groveled
in terror.` The preceding s0089 says Hui confronts Tao with troops and asks
why he falsely congratulates him; s0091 says Hui then sends Tao to Cui Bi.
Thus the narrative context favors Tao as the person who is frightened and
submits, but the *local character* 廆 names Hui, not Tao. The present English
is an unmarked reading of a different Chinese text, not a literal rendering
of the displayed source. Its language also should not be presumed final:
`首服` may need closer editorial consideration than the idiom “groveled.”

The ordinary [Wikisource Jinshu 108 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7108)
reads 廆, like our source. The separate [Siku-labelled Jinshu 108 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B7108)
and [Shidianguji Jinshu 108 transcription](https://www.shidianguji.com/zh/book/HY2499/chapter/1kpb3qico63oz)
read `燾懼，首服`. A [Zizhi Tongjian 91 transcription](https://www.xuoda.com/ls/zztjf/091.htm)
also names 燾 in the parallel story. These online transcriptions and the later
parallel are evidence for competing readings and context; their edition
provenance and textual dependence were not independently established. They are
not a count of independent manuscript witnesses. The existing applied repair
rationale says CText supports 燾, but this focused check did not verify that
specific CText Jinshu page; do not repeat that claim as independently checked.

Two already-applied repair rows changed the English subject from Bi to Tao
while explicitly noting the 廆/燾 discrepancy. They do not change the Chinese
or document an accepted source emendation. Both the original Bi and the current
Tao differ from the literal named subject in our current Chinese; reverting to
Bi would not fix the alignment. Determine a supported text policy through
independent editorial and witness review: either preserve 廆 and translate it
faithfully while exposing the strong alternate reading, or adopt a properly
documented 燾 emendation through a supported, provenance-aware source workflow.
Do not silently decide between the readings or edit a sealed input.

## Extraction and publication consequences

The staging extraction and retained candidate both map the Chinese s0090 廆
surface to `p001` (Murong Hui), while their English s0090 surface `Tao` is
mapped to **`p050` Cui Bi**. The candidate's `p052` is Cui Tao; it has another
English Tao surface elsewhere, but not the s0090 English occurrence. Thus the
current English mention can link to Cui Bi even though it says Tao. This is a
separate concrete identity/backlink defect from the textual discrepancy.
Inspect the final accepted extraction's mention and candidate accounting under
whichever source and editorial decision is independently accepted. A source
emendation would also alter the source fingerprint and potentially candidate
coverage; a link correction must not silently transfer the Chinese 廆 mention
to p052 while that text remains unchanged.

The retained review-2 and candidate-2/repair-candidate-2-1 artifacts remain
sticky recovery work. The latter has byte SHA-256
`34e3dfb3ec6f2bf53782c435023f70cb97b8418d153a340adcfe58ac72268022`;
its presence does not mean an approved repair. Preserve existing ownership and
coordinate before changing inputs. This one-sentence review does not establish
chapter-wide editorial fidelity, complete extraction validation, current
independent date approval, identity clearance, person-page/backlink correctness,
ebook verification or release eligibility. Any material source/extraction
changes require the applicable fresh validation, independent date re-audit,
identity reconciliation and host-controlled publication gates.
