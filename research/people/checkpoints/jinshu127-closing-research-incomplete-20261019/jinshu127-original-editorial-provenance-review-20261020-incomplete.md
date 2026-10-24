# Jinshu 127 editorial provenance and reviewer handoff — incomplete

This is source triage, **not** whole-chapter editorial approval or permission to
publish. The original reviewer has no retained agent or run ID in the decision
file; the extraction dossier also has a null extractor agent ID. Their declared
lane names do not prove conversation independence. The retained dossier has 11
proposal-centered items, not a whole-chapter review. A search of the local
generated evidence and Codex sessions located the dossier, decision history,
and later research conversations, but did not establish a September 9 review
conversation or its coverage. Absence from this search is not proof no such
conversation ever existed.

## Sealed reviewer inputs

Paths are relative to `data/people/generated/`; hashes are SHA-256 of exact
bytes, not application fingerprints. Verify them before review. These are
research artifacts, not canonical publication inputs:

- Full 278-unit Chinese and paired English source: `jinshu-identity-ref-64521198-20261018/jinshu127-closing-materialized-source-20261019.json`, `74698e41243b3fb1554471574a6ba180c58c8a4872ffbe0e9e2bea1023d3dc3c`.
- Corresponding extraction: `jinshu-identity-ref-64521198-20261018/jinshu127-closing-materialized-extraction-20261019.json`, `1516f2bba52ebd08956e35da39e0387e926c8cbac9b99398c185c7cb6ebb8529`.
- Applied-decision history, including the old 11 decisions and the separately reviewed later repairs: `jinshu-identity-ref-64521198-20261018/jinshu127-closing-materialized-history-20261019.json`, `7459b0af48cc85e1d095bcdfe2e420bb56edda1cf0fd422ab7b850b1af405190`.
- Original proposal-centered review dossier: `editorial-review/jinshu/127.json`, `1304dd54c264e3acb609f62e50e33e45c02c252bcecc3829a7deebde3ed52a50`.
- Original decision file: `../editorial-decisions/jinshu/127.json`, `5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e`.

The current research draft has later unresolved date and identity issues. Its
source fingerprint is `sha256:bd9a75d4cc72084b701fb6baf97845edada0fa16160eb37d1ecf7efc5c02c2bd`
according to the research extraction input; independently rebuild the packet
with the intended production code before using it. File hashes alone do not
constitute production validation.

## Original 11 decisions: exact focus for independent source review

The dossier supplies before/after text, adjacent context, related people and
claims. The history additionally records the old verdicts, one claim retraction
and two claim revisions. Review both English fields and affected claims, not
just the named field:

| Decision | Unit | Prior change to reassess |
| --- | --- | --- |
| r0001 | s0037 | 南夏: southern lands, not a season |
| r0002 | s0007 | Subject and 魏尹 office |
| r0003 | s0014 | 垂敗 and 免歸; avoid unsupported disgrace |
| r0004–r0005 | s0056 | 丁建 Ding Jian vs 丁通 Ding Tong; false-name claim retraction |
| r0006 | s0065 | 南夏, paired with s0037 |
| r0007 | s0105 | 慕容法、慕容和 and 等; office and name witness |
| r0008 | s0131 | 避閭渾 and 辟閭渾; name normalization and two claim revisions |
| r0009 | s0177 | Long'an fourth year, 僭, 行廟 and 奉策告成 |
| r0010 | s0243 | 將 is verbal, not a separate general |
| r0011 | s0271 | Commanders, force sizes and departure date |

### Specific additional holds identified in this inspection

1. Metadata in the final source draft says `Volume 12 Records 27: Murong De`,
   while Chinese says 卷一百二十七 and `meta.chapter` is `127`. The wrong
   English volume also appears in `meta.title.raw`. This is a concrete heading
   defect, separate from the 11 sentence repairs; review the source and any
   downstream fingerprint impact before applying a correction.
2. At s0177 the source's 遣使奉策告成 explicitly includes reporting
   completion; the idiomatic “sent envoys bearing the accession proclamation”
   does not explicitly convey this action. Assess the contextual meaning of
   策 and 告成 and the recipient without guessing. The literal preserves
   “report completion.” [Quan Jin Wen, juan 150](https://ctext.org/wiki.pl?chapter=400290&if=en)
   independently associates Murong De's accession with Jin Long'an 4 and
   Jianping, but does not by itself settle that envoy clause.
3. The old r0007 proposal says the name after 撫軍 was corrupted in the
   packet. The currently retained Chinese text instead explicitly reads
   `德遣其中軍慕容法、撫軍慕容和等距之`, and the old decision itself quotes
   `撫軍慕容和`. The corruption assertion is unsupported by this witness;
   that does not itself refute the translated name.
4. The old r0008 decision cites an unspecific “Jinshu annals parallel” for
   辟閭渾. [Jinshu 128](https://www.donglishuzhai.net/chapter/1258.html)
   names 辟閭渾 in the Feng Fu episode. Independently assess whether that
   parallel establishes the same person and preferred romanization, while
   preserving the current chapter's exact 避閭渾 spelling as a source variant.

### Exact metadata-only correction and fingerprint scope

At staging `07fb639`, chapters 126 and 128 have `meta.title.en` values
`Volume 126 Records 26: Tufa Wugu; Tufa Lilugu; Tufa Rutan` and
`Volume 128 Records 28: Murong Chao`; their Chinese titles likewise start
卷一百二十六 and 卷一百二十八. Chapter 127's `meta.chapter` is `127` and its
Chinese title is `卷一百二十七 載記第二十七 慕容德`. The supported, narrowly
scoped proposed changes are:

- `meta.title.en`: `Volume 12 Records 27: Murong De` → `Volume 127 Records 27: Murong De`.
- `meta.title.raw`: `卷一百二十七 載記第二十七 慕容德 Volume 12 Records 27: Murong De` → `卷一百二十七 載記第二十七 慕容德 Volume 127 Records 27: Murong De`.

An in-memory-only comparison of the exact final draft and its metadata-edited
clone using the current checkout's `contentUnits` and `buildInputFingerprint`
returned the same chapter fingerprint for both,
`sha256:bd9a75d4cc72084b701fb6baf97845edada0fa16160eb37d1ecf7efc5c02c2bd`,
and confirmed their `content` trees identical. Current date-audit code hashes
mapped content units and the extraction, so a metadata-only edit with an
unchanged source URL should also preserve these date inputs; that observation
has not been separately checked against the intended staging code and is not
proof that any existing report is substantively sound. Whole-file SHA-256 and
any exact source-document seals do change. Chapter OG fingerprints explicitly
hash raw JSON bytes; chapter HTML and ebook generators consume the English
title and need normal regeneration and verification. Recheck the currently
selected generation, exact-before pins, queue ownership and publishing
transaction before any host-controlled edit; do not overwrite the archived
draft, change stored approval hashes or infer editorial/date closure.

## Scope of next review

In a genuinely separate reviewer conversation, read every source unit and both
English fields in order, inspect the original 11 decisions and all related
claim changes, note all missing or incorrect translations, and record complete
coverage and source-backed decisions against the exact final fingerprints.
Check title and other metadata as well as the 278 units. A focused review of
the four holds above is not equivalent to whole-chapter closure. Source edits
must be coordinated before new downstream date and identity approvals; retain
all prior evidence and revalidate after any change.
