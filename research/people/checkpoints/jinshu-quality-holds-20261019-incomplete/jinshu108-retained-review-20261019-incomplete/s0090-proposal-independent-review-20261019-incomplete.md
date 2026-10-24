# Independent focused review: Jinshu 108 s0090 proposal — incomplete

This review is limited to the specified sentence, the isolated source preview,
and the chapter candidate-scan delta. It is not a whole-chapter editorial,
identity, chronology, source-emendation, or publication approval. No canonical
file, queue, lock, shared index, or retained workflow was changed.

## Pinned inputs

All hashes are byte SHA-256, not semantic packet hashes:

- Proposal `research/people/jinshu108-s0090-conservative-correction-proposal-20261019-incomplete.md`: `d931655a19509bf066fa3f0bce75bcb312df931013f5c1e7f25b94ee8a8fb574`.
- Current `data/jinshu/108.json`: `8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`.
- Current `data/people/extractions/jinshu/108.json`: `03128355667288fe2c91695a7e4a5372c5e758623277f420ac57d7c37e493576`.
- Retained `candidate-2.json`: `c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413`; retained `state.json`: `7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152`.
- Isolated `s0090-source-preview-20261019-incomplete.json`: `244366caf41ad98a45cec3005ee5b29c077eb19b2be1dc90137d9ea3f60935ce`.
- Isolated `s0090-source-preview-20261019-incomplete-scanner-delta.json`: `954ea1bc9bc8909281f393c98b7db7d42ab0714d8201118197c39de9cd614e55`.

## Reading and footnote

The displayed local Chinese explicitly reads `廆懼，首服。`; both old
English fields instead name Tao. The [ordinary online Wikisource
transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7108)
also displays 廆 in the immediate passage. Direct retrieval of the
[Siku-labelled online transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B7108)
shows 燾 there. Its contextual account has Hui confronting Tao and then
sending Tao away. This favors Tao as a plausible subject by inference; it does
not prove the original reading. These online transcriptions are not verified
independent manuscript witnesses, and their textual ancestry and priority have
not been established. The wording should identify the alternate as a reading in
the Siku-labelled *digital transcription*, rather than suggest that the
underlying manuscript has been examined. It would also help readers to make
the digital source identifiable in the final note or supporting citation.

The [Taiwan Ministry of Education dictionary](https://dict.revised.moe.edu.tw/dictView.jsp?ID=130255&la=0&powerMode=0)
gives 首服 a sense involving self-report and admitting guilt. “Confessed” is
a plausible concise rendering, though the dictionary does not resolve who
acted in this sentence; “groveled” is not established by that definition. I
find the proposed source-preserving translation defensible as a provisional
focused correction, with the explicit variant note and the above cautions.
It is not a decision that 廆 is historically original.

## Exact changes and scanner accounting

Independently comparing parsed source with preview and undoing only the two
proposed English field changes plus removal of the new footnote reproduces the
entire original source object. Thus no other field changed. The preview
inherits `translator: Garrett M. Petersen (2026)` and `model: Composer 2`
unchanged; inherited metadata alone does not identify the author or reviewer of
this new proposed correction. Preserve accurate amendment provenance through
the supported editorial workflow rather than treating inherited metadata as
approval.

Recomputed `scanPeopleCandidates` on all 213 source units for each input:
490 candidates before and after. The sole removed candidate is English `Tao`
in s0090, `jinshu:108:cand_82b7f03d9b1db47f`, code points 0–3; the sole
added candidate is `Hui`, `jinshu:108:cand_5486a811059db62f`, code points
12–15. No candidate with a common ID changed. These exact arrays equal the
saved scanner delta. This scanner uses idiomatic English, not a separate scan
of literal text or footnotes; unchanged count alone is not evidence that the
new mention is linked to the correct person. A fresh packet, explicit mention
and disposition reconciliation, and independent production validation remain
necessary.

## Rendering and remaining gates

Code inspection shows `generate-static-pages.js` uses `translation.footnote`
to create a numbered note and escapes its text. In `scripts/generate-ebook.mjs`,
paragraph handling collects that field and emits an EPUB footnote and noteref.
**Neither an actual rendered web page nor an ebook was generated or tested.**
Verify reader-visible output and links after an approved materialization;
the note’s two people must not silently become source-text mentions.

Do not rewrite the existing applied-repair history or sticky claim. Coordinate
any source change with the retained date workflow and perform fresh independent
review and validation for the resulting fingerprints. This focused review
does not make the chapter complete or release-ready.
