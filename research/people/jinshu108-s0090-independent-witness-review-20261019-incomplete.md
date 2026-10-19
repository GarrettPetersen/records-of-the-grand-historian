# Independent review: Jinshu 108 s0090 witness and backlink hold

Focused verification only; this is not a chapter editorial, identity, date,
source-emendation or publication approval. No canonical file, retained
workflow, queue, lock or index was changed.

I checked byte SHA-256: hold
`464f94f3709b60617571df8dc0303442c145fe41d4a5cd80e84270249db545f9`, source
`8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`,
extraction `03128355667288fe2c91695a7e4a5372c5e758623277f420ac57d7c37e493576`,
retained `candidate-2.json`
`c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413`,
`repair-candidate-2-1.json`
`34e3dfb3ec6f2bf53782c435023f70cb97b8418d153a340adcfe58ac72268022`,
and workflow `state.json`
`7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152`.

## Exact source and person surfaces

The hold accurately quotes s0089–s0091. The displayed source has 廆 as the
subject in s0090, while both translations say Tao. Both original extraction
and retained candidate contain compact surfaces associating s0090 廆 with
`p001` (Murong Hui) and English Tao with `p050` (Cui Bi). `p052` is Cui Tao;
its English Tao surface includes s0089 but **not** s0090. Thus the pinned
extraction really does assign the wrong person to the English s0090 surface.
This verifies the data defect, not a claim that a particular production page
currently renders that link; deployment and catalog gating were not tested.

Both extractions retain the same two `applied` s0090 repair records: each
changed the prior English subject Bi to Tao, but neither changed the Chinese.
Their rationales claim CText supports 燾. I did not independently verify the
specific CText page, so do not treat that as established. Reverting to Bi
would still disagree with local 廆, and merely transferring the Chinese
surface to p052 would misidentify the character in the displayed text.

## Textual witnesses

The ordinary [Wikisource Jinshu 108 transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7108)
indeed reads 廆懼首服 in the same passage. The
[Siku-labelled transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B7108)
reads 燾懼首服: the page has an unpunctuated long paragraph, so a search for
the punctuated substring 首服 may fail even though the text is visible.
[Shidianguji's transcription](https://www.shidianguji.com/zh/book/HY2499/chapter/1kpb3qico63oz)
also reads 燾懼，首服. The [Zizhi Tongjian 91 parallel](https://www.xuoda.com/ls/zztjf/091.htm)
similarly names 燾 as the frightened person. The contextual reasoning for
Tao is persuasive: Hui has just confronted Tao with troops; Hui then sends Tao
back. It is still an inference about the episode and not permission to silently
overwrite the local Chinese. The online texts' edition provenance and mutual
dependence are unverified; they cannot be counted as independent manuscript
witnesses. Nor is the later Tongjian a direct, independent Jinshu manuscript.

The prior report correctly reserves a source-policy decision: either retain
廆 and faithfully translate it while documenting the contextual variant, or
adopt a documented, provenance-aware 燾 emendation with appropriate review.
The evidence here does not by itself select or approve a production route.
The rendering of 首服 and the paired English fields remain open for editorial
review. After a selected correction, regenerate the packet and reconcile both
language surfaces and candidate dispositions, then obtain applicable fresh
independent reviews and validation. Sticky artifacts and ownership remain in
place. Nothing here establishes whole-chapter correctness or release readiness.
