# Jinshu 022, candidate 4: independent focused triage, incomplete

This focused source check is not a whole-chapter audit or permission to publish.
The preserved review-4 remains the controlling failed review. No canonical file,
claim, lease, date packet, or Git index was changed.

## Sealed evidence

- Local source bytes SHA-256 `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- `candidate-4.json` bytes SHA-256 `6525bc9dd9c94b2fbfca5132e4005b29ca3383dcdced01cca8dfa60ec4bb2419`.
- `review-4.json` bytes SHA-256 `e6d5d13e47f372a493615cbc55682bb64c0dd61250bcf86e0a73fbf04a09e1e6`.
- The current source and candidate reproduce the review's semantic fingerprints,
  respectively `sha256:851915ffde8d18ff168794b13c6b900354ec593d983aa6fde461ffc82f9a7ce2`
  and `sha256:39c756f0deff06281d9f8ae1d8e2a9e56b38b20bc17cf8771064f802357c9826`.

## p012: an undated anecdote and a conflicting reviewer hold

s0018's `魏文侯聆古樂而恐臥` describes the music listening and does not itself
state a reign year, calendrical date, or relative temporal clause. Its nearest
primary parallel in the [Book of Rites, Music Record](https://ourartnet.com/sikuquanshu/ziku/Ru_jia/Rujia_060/042.asp)
also gives the conversation without an explicit date. This does not establish a
year or resolve wider historical chronology. s0014–s0018 surround the anecdote
with an account of Zhou decline and other historical examples; a reviewer must
assess whether this broader sequence supports a defensible one-sided bound
before accepting an undated representation. Claim 73 already expresses an
undated source attestation; claim 74 adds a `sourceDate` whose text is just the
event wording, then marks that artificial date unresolved. It is plausible to
retain the exact event without a date context while keeping the undated
attestation. This interpretation conflicts with review-4's explicit instruction
to keep the unresolved hold, so a different independent date reviewer must
adjudicate it rather than automatically upgrading it to approval.

`triage-undated-marquis-proposal-incomplete.json` contains a fingerprint-bound,
replayable before/after proposal to remove only that event's dateContext.
The associated `.mjs` uses the host proposal applier, checks sealed hashes and
reports actual validation; it produces no canonical candidate or publication.
The derived candidate is **not validated**: the integrated scoped extraction
validator reports 22 legacy `receptionType` enum violations, and date diagnostics
report 48 vocabulary errors across 41 claim IDs. These are independently
pre-existing in the input and must be source-reviewed/reconciled before normal
review. The script exits nonzero and the JSON records the diagnostics.

## p046: potential false person and mistranslation

The retained s0130 reading `時邁其猶，昊天子之` does not necessarily make
`天子` a separate actor. The transmitted [Shi Mai commentary](https://www.shidianguji.com/zh/mid-page/7534839645948051494)
parses the parallel `昊天其子之` as Heaven treating the ruler as its son.
This supports the previous focused finding that both local English translations
are suspect and that p046's only title and surface cross a likely word boundary.
An independent Jin-hymn editorial reading and the standard false-person workflow
are needed; the parallel does not settle all interpretation of `其猶`. It is
unsafe to remove only the two dated claims while leaving the person and the
English text. Separately review all dependent names, mentions, claims, identity
decisions and candidate dispositions; preserve other honorees.

## p111: dubious retrospective classification as well as date span

s0562–s0566 dates Xun Xu's reform to Taishi 9 and subsequently introduces the
two dances and Zhang Hua's lyrics. s0580 and s0584 say only the hymn is by Zhang
Hua and praise `我皇`; s0588 says the Dayu dance is made to display virtue.
Nothing in these lines states the extracted explicit `泰始九年至咸甯元年`
closed interval; the later Xianning adoption is in a separate later passage.
The parallel [Song shu music treatise](https://zh.wikisource.org/zh-hant/%E5%AE%8B%E6%9B%B8/%E5%8D%B720)
transmits the same hymn. The review-4 request to retain
`kind: retrospective-reference` also needs independent scrutiny: in the hymn's
own voice `我皇` is the sovereign who currently possesses rule, and we have not
established a separately later reception event. The report's proposed
retrospective label must not be assumed merely because a later history quotes
the hymn. Claim 795 already expresses the sovereign's undated hymn action and
claim 797 records an undated source attestation. Decide whether claim 796 is a
duplicate or needs a properly evidenced non-retrospective representation; do not
invent a new category or date. The date-repair interface cannot change non-date
event fields, so editorial/identity coordination is needed before fresh audit.

All links were consulted for this triage, not copied into a machine-accepted
audit report. Editorially approved source and extraction changes require a new
complete independent date audit, identity reconciliation, and remaining release
gates.
