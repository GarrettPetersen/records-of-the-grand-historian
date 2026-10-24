# Jinshu 053: source restoration and Jiang Jun's rank

Status: isolated research and proposed wording only. This is not a canonical
edit, an editorial approval, a full identity/date audit, or a publication
receipt. Source and extraction fingerprints and review ownership must be
rechecked against the live host and staging before any application.

## Two missing characters in the project transcription

The canonical source currently has `太子三子：、臧、尚，並與父同幽金墉。`
at s0170 and `字道文，永康元年正月，薨。` at s0171. The English literal
already supplies Bin, but the local Chinese does not. The [Jinshu 053
transcription](https://zh.wikisource.org/wiki/晉書/卷053) has `虨` in both
positions; the [Siku transcription](https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷053)
also lists 虨 and gives the biographical reading. These digital presentations
do not establish independent manuscript ancestry. The [Zizhi Tongjian kaoyi
transcription](https://zh.wikisource.org/wiki/Page:Sibu_Congkan0179-司馬光-資治通鑑考異-6-1.djvu/103)
reports the imperial-annals reading 霖 and prefers the biography's 虨; that
page is explicitly marked unproofread, and its underlying scan was not collated
here. Treat 霖 as a reported textual variant, not automatically as an alias.

The existing independent source review supports restoring exactly one 虨 in
each unit, while retaining local punctuation. The proposed Chinese and English
repairs, subject to an appropriately independent source/editorial review and
the approved host workflow, are:

| Unit | Proposed Chinese | Proposed literal | Proposed idiomatic |
| --- | --- | --- | --- |
| s0170 | 太子三子：虨、臧、尚，並與父同幽金墉。 | The crown prince had three sons—Bin, Zang, and Shang—all confined with their father at Jinyong. | The crown prince's three sons, Bin, Zang, and Shang, were confined with their father at Jinyong. |
| s0171 | 虨字道文，永康元年正月，薨。 | Bin, courtesy name Daowen, died in the first month of Yongkang year one. | Bin, whose courtesy name was Daowen, died in the first month of Yongkang's first year. |

The list by itself does not establish birth order or the brothers' respective
mothers. The independently reviewed s0172 English also needs to convey 追封
(posthumous enfeoffment), but any overlapping proposal must be reconciled
against the exact current review rather than applied twice. Western date
conversion and whether fourth month inherits the preceding year belong to a
fresh independent date audit.

## Jiang Jun: a rank mistranslated as an office

Canonical s0065 reads `澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊。`
The current literal calls the latter person “heir guardian Jiang Jun.” The
[Taiping Yulan, juan 149](https://zh.wikisource.org/zh/太平御覽_(四部叢刊本)/卷之一百四十九),
under the heading 保林, cites Wang Yin's Jinshu describing `太子所幸保林蔣俊`:
Jiang Jun was the crown prince's favored baolin, an inner-court/consort rank,
not a guardian of the heir. The same compilation's entries on crown-prince
inner ranks supply additional context, though they concern later dynasties and
should not be assumed to prove every detail of Jin institutional practice.

Proposed s0065 English for independent editorial review:

* Literal: “Dan used armed guards to escort Crown Princess Wang and the three
  imperial grandsons to Jinyong City; Consort Xie and the crown prince's baolin
  Jiang Jun were interrogated to death.”
* Idiomatic: “Dan escorted Crown Princess Wang and the three imperial grandsons
  under guard to Jinyong City. Consort Xie and Jiang Jun, a consort of the crown
  prince, were interrogated to death.”

These retain the passive for the deaths instead of inventing who ordered them;
the second uses a readable role description while the first retains the rank.
Review the proper rendering of 淑妃 separately. The existing p027 English title
claim `Heir guardian Jiang Jun` must be reviewed and corrected along with the
English mention and offsets. The wrong English is not evidence that Jiang Jun
is a different person from the favored Jiang consort.

The [Zizhi Tongjian, juan 83](https://ctext.org/wiki.pl?chapter=290824&if=gb)
explicitly calls Jiang Jun `虨母保林蔣俊`, strengthening the mother/son
identification from an external historical account, though the local s0017
alone leaves that particular son unnamed. This is additional research evidence,
not permission to misquote s0017 or upgrade a local-source-only claim without
recording its provenance and an independent identity review. It also does not
establish which of the other sons shared her maternity, or birth order.

## Safe downstream path

`PEOPLE_COMBINED_CURATION.md` expressly excludes Chinese emendations. A generic
approved source-correspondence mechanism exists in
`scripts/apply-source-correspondence.mjs` and requires explicit bilingual
manual translations; it rewrites chapter/queue files directly and is not a
people-campaign transaction. It has no people date/editorial/identity
invalidation or cross-worker fencing. Do not run it unguarded in the shared
checkout or manufacture a combined-curation receipt that omits the Chinese
change.

Before a supported host-owned transition: preserve the exact prior source,
extraction and genuine editorial/date/identity reviews; recheck live queue and
worker ownership without interrupting or taking over any leases; pin exact
before bytes and the independently reviewed source/English amendments. Build a
final isolated candidate with complete mention spans, claims, and dispositions,
review p028's names and family links on actual evidence, and reconcile the
overlapping English review. A source change makes source-bound fingerprints
stale: never substitute hashes to retain an approval. Rebuild packets and
reconcile affected identity decisions under supported policy, run scoped
extraction validation and a fresh independent complete date audit, then the
full people and publication checks. Treat all old genuine reviews as preserved
history, not current blanket approval. No chapter completion is implied by
this note.
