# Jinshu 108 s0090: source-preserving correction proposal

This is an **unapplied proposal**, not an editorial approval or a complete
chapter review. It depends on an independent reviewer accepting the reading,
wording and footnote, followed by host-controlled reconciliation. It does not
decide which reading is historically original. Do not overwrite the sticky
date-workflow candidate, edit sealed input, alter the queue or remove locks.

## Exact inputs and scope

Checked 2026-10-19 against these unchanged local byte hashes:

- `data/jinshu/108.json`: `8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb`.
- `data/people/extractions/jinshu/108.json`: `03128355667288fe2c91695a7e4a5372c5e758623277f420ac57d7c37e493576`.
- `data/people/generated/date-workflow/jinshu/108/candidate-2.json`: `c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413`.
- `data/people/generated/date-workflow/jinshu/108/state.json`: `7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152`.

This source-preserving route is distinct from an emendation. Chinese s0090
remains `廆懼，首服。` It explicitly names Hui (廆), although the preceding
and following sentences make the alternate reading Tao (燾) plausible. For
details and witness caveats, retain the prior independently checked reports
`jinshu108-s0090-witness-and-link-hold-20261019-incomplete.md` and
`jinshu108-s0090-independent-witness-review-20261019-incomplete.md`.

## Proposed s0090 translation fields and visible note

For review, replace the existing English values, which both name Tao:

- Literal: `Hui was afraid and confessed.`
- Idiomatic: `Frightened, Hui confessed.`
- Translation `footnote`: `The Chinese text here names Hui (廆). A version labelled as the Siku Quanshu text reads Tao (燾), which fits the surrounding account in which Hui confronts Tao.`

The Taiwanese Ministry of Education's historical-language dictionary defines
the relevant verbal sense of [首服](https://dict.revised.moe.edu.tw/dictView.jsp?ID=130255&la=0&powerMode=0)
as confessing and admitting guilt. The proposed unqualified “confessed” avoids
inventing a specified offense or physical action: “groveled” is not established
by the word. This dictionary supports the sense in isolation, not the identity
of the subject in this particular narrative. The wording is provisional and
requires editorial review; the odd subject is intentionally retained, not
presented as a historically certain account.

The [Siku-labelled transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B7108)
reads 燾; the [ordinary Wikisource transcription](https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7108)
reads 廆. The label describes the digital text, not verified manuscript
provenance. The footnote must not assert either witness's priority or imply
that the two are independent manuscripts. `generate-static-pages.js`
`addFootnote` currently renders `translation.footnote` as a numbered reader
note; verify rendered output and ebook behavior before publication.

## Link and fingerprint consequences

In both pinned extraction and retained candidate, the Chinese 廆 occurrence
already belongs to `p001` Murong Hui. Existing English `Tao` at s0090 belongs
incorrectly to `p050` Cui Bi; it must not remain linked to Bi. After the two
English fields are changed, regenerate the source packet and candidate set.
Review and reconcile the new `Hui` occurrence to `p001`, and remove the
obsolete s0090 English `Tao` occurrence from `p050` only when that occurrence
is absent in the regenerated source. The existing `p001` English Hui surface
currently has s0089 and s0091 but not s0090; its occurrence and candidate
accounting should be derived from the fresh packet, not assumed from this note.
Do not reassign the unchanged Chinese 廆 to `p052` Cui Tao, or silently count
the footnote's discussion of Tao as a textual mention by the source.

The current extraction retains earlier `applied` repair rows Bi → Tao in both
fields. Preserve their provenance and reconcile the new correction through the
supported reviewed workflow; do not falsify their past status or simply rewrite
the old rationale. Any changes to chapter or extraction fingerprints invalidate
downstream evidence where applicable. Revalidate against a fresh packet, obtain
independent editorial and date reviews, reconcile identity, and verify rendered
links and ebook output before counting or publishing the chapter. No such
approval or verification is claimed here.
