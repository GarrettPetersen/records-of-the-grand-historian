# Jinshu 053: independent source-correspondence assessment (incomplete)

This is an independent research assessment, not a publication receipt or chapter
approval. It does not modify any source, extraction, review, queue, or lock.
The examined canonical source and extraction byte SHA-256s respectively are
`85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407` and
`464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69`.

## Source evidence and limited correction

The chapter metadata identifies the original scrape source as
[Chinese Notes Jinshu 053](https://chinesenotes.com/jinshu/jinshu053.html).
The existing local units omit the name in two places. The separately labelled
[Siku Quanshu transcription of Jinshu 053](https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷053)
reads `太子三子虨臧尚` and, immediately following, `虨字道文`. The ordinary
[Wikisource chapter transcription](https://zh.wikisource.org/wiki/晉書/卷053)
also has 虨 in the list and the opening of the biography. This confirms the
two very narrow proposed insertions, preserving the project's punctuation:

* s0170: `太子三子：、臧、尚，並與父同幽金墉。` →
  `太子三子：虨、臧、尚，並與父同幽金墉。`
* s0171: `字道文，永康元年正月，薨。` →
  `虨字道文，永康元年正月，薨。`

These are edition-labelled web transcriptions, not a direct inspection of
facsimiles or a verified stemma; do not claim the two readings have independent
manuscript ancestry. The earlier research
`jinshu053-lacuna-source-proposal-incomplete-20261020.md` also records a kaoyi
note concerning 霖 as an annals variant. It is not itself evidence for an alias,
birth order, or maternal relationship. A list's first position alone does not
establish that Bin was the eldest.

## Source-correspondence process and its people-work boundary

`REVIEW_PROCESS.md` documents source-correspondence review packets, source
decisions, manually reviewed translations, and the separate
`quality:source-correspondence:apply` command. The latter's implementation in
`scripts/apply-source-correspondence.mjs` permits approved queue rows and
manual Chinese-matched English translations, finds target ranges by IDs or
normalized text, and applies replacement and translation reconciliation. It
then reconstructs chapter content, adjusts metadata, writes each chapter with
`fs.writeFileSync`, and subsequently writes queue status. Its `--dry-run` avoids
those writes. This is a legitimate general source-repair workflow, but inspection
finds no people-ledger claim or date-process lock, complete source/extraction
fingerprint CAS, retained people editorial/date/identity evidence preservation,
or atomic multi-file publication/recovery transaction in this command.

The current `data/quality/source-correspondence-corpus-wikisource-jinshu.json`
has no item for `data/jinshu/053.json` whose local range includes s0170 or
s0171. Thus there is not an existing identified quality-queue decision to apply
for these units. Nor does the general source-repair workflow by itself make a
previously extracted people chapter safe to publish. In particular,
`PEOPLE_COMBINED_CURATION.md` explicitly disallows Chinese emendations in its
reviewed publisher and says not to bypass this with arbitrary JSON patches.
The corresponding combined validator replays English repairs, not these
Chinese changes. Host-controlled integration needs a supported, independently
reviewed source-amendment transition that incorporates the existing ownership,
preservation, evidence and recovery requirements; an ordinary source-queue
apply cannot establish those gates on its own.

After any supported reviewed amendment, rebuild the exact chapter packet;
independently reconcile new Chinese surface mentions of 虨 in both units to
the evidence-supported local person p028, relevant English spans and name
claims, and review all candidate dispositions. Reassess unsupported eldest,
birth-order, and paternal-half-sibling assertions rather than automatically
upgrading them. Revalidate extraction and source-pinned editorial history,
preserve the old date report, obtain a fresh independent complete date audit,
and reconcile source/extraction-dependent identity decisions. Verify normal
chapter, site, ebook and publication gates. No amount of source corroboration
alone authorizes replacing hashes or treating these downstream gates as passed.
