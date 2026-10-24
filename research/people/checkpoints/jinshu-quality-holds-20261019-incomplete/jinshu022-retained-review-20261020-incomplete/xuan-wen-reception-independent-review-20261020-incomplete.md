# Jinshu 022: independent narrow review of Xuan–Wen reception labels

This is a review of the category change only, not chapter approval. I compared
the actual Chinese in the whole source sequence and both complete candidate
objects. All hashes below are SHA-256 of exact file bytes:

- `data/jinshu/022.json`: `813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38`.
- `cumulative-ritual-hymn-candidate-20261020-incomplete.json`: `01d03455ea8ebadd823b7edbc63eccae5bd24150995efa4d809767a2aabdcfe3`.
- `xuan-wen-reception-candidate-20261020-incomplete.json`: `3ce2f2888c1b86a29c22d3d92ed8853e9987ff42756851de04d2cc0cc3ecb695`.
- `xuan-wen-reception-proposal-20261020-incomplete.mjs`: `754c62a6803768cb7842cbce4e071f3b42b6efa369c7bb965dda33fd63af1509`.
- `xuan-wen-reception-evidence-20261020-incomplete.md`: `97631bec6b97b63e74c1812386654c57e94bb227f4967ce3b3928dc8c18e3f80`.

The source at s0109–s0110 places the edict commissioning Fu Xuan's lyrics in
the early Jin and s0124–s0125 place the hymn after Jin's succession from Wei.
In s0136 `宣文惟後，克配彼天` names Xuan and Wen in sovereign praise;
the following s0137–s0141 praise achievements and posterity. The retrospective
classification is justified for the hymn's praise **if** the two extracted
people are correctly linked to these ancestral sovereigns. It is not itself
proof of death or a date for any achievement. Consistent with
`PEOPLE_DATE_AUDIT.md`, `retrospective-reference` and `retrospective` are the
appropriate supported category names, not the removed `posthumous` forms.

Deep comparison confirms that only `kind` and `receptionType` on zero-based
rows 915 / p047 and 916 / p048 differ; both arrays still have 920 claims.
No date, action, role, citation, other-person link, confidence, person record,
or other field was changed. This is a conditional narrow-label endorsement,
not a finding that the whole retained rows are true.

The AD 266 context remains a substantive hold. s0110 dates the edict and
commission, not explicitly the completion or performance of this particular
hymn; the exact application of the dated source context to a retrospective
claim requires a fresh independent date audit. The companion extracted
attestations currently assign the same 266 context to the subjects and are not
validated here. s0137–s0140 have no explicit singular pronoun in the Chinese,
while both English translations of s0137–s0138 introduce “he”; the exact
subject/distribution of achievements remains an editorial and extraction
question, not settled by this label change. `otherPersonId` may present a
pairwise relation beyond the text's collective formulation, and `宣文` as an
individual alternate name plus the suggested cross-dynastic identities need
separate verification. Preserve these holds and the existing date-bearing
fields until a reviewed repair; do not treat passing vocabulary checks as a
resolution of them.

This review neither resolves earlier conflicting decisions about associated
claims nor authorizes canonical writes, identity merges, publication, or reuse
of any old approval on the altered extraction fingerprint.
