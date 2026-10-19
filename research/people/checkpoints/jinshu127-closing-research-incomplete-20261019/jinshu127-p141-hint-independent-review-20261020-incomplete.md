# Jinshu 127 p141 activity hint: independent focused review

Research-only, incomplete; reviewer `/root/independent_combined_127`, independent of proposal author `/root/reconcile_127` and source researcher `/root/gaozu_hint`. This review concerns only the removal of p141's `BC 206-195` activity hint, not the full chapter or its date audit. No canonical data or coordination state was changed.

## Evidence and judgment

The exact sealed Jinshu source has s0173 `通遇漢祖而蒙恕` and s0232 `漢祖祭信陵之墳`, neither furnishing a Western-year interval. I independently hashed the local Shiji 77 source and verified its three exact witness sentences in the receipt: s0150 notes that Gaozu had heard of the prince while young and humble; s0151 says that after he became emperor, he regularly sacrificed when passing Daliang; s0152 separately recounts the provision of five tomb-keeper households in his twelfth year. The text makes the latter provision distinct from the earlier general description, and neither Jinshu passage establishes both endpoints of the retained activity span.

The proposed removal is a defensible conservative source-coverage repair: it removes an unsupported unqualified range without inventing a replacement. It does **not** prove that 206–195 BC is historically impossible or that it is necessarily wrong as externally sourced general biographical chronology; such a claim would require qualified independent evidence and endpoint semantics. Deleting this hint also does not validate any other date or identity.

## Independent verification

All four sealed combined-input SHA-256 hashes, four proposal-output hashes, and the Shiji source hash match the receipt. The Jinshu chapter source is the same sealed research draft, not canonical source. A recursive whole-extraction comparison found exactly one change: removal of `BC 206-195` from p141's activity-hint array. Every person record otherwise, every claim and date value, surfaces and mentions, dispositions, translation repairs, coverage, and all other metadata are unchanged; no new reception label appears.

Rebuilding both date packets with current-checkout production code produced exact equality with their saved packets; applying the fingerprint-bound proposal reproduced the saved candidate exactly. The only packet differences are the extraction fingerprint (`sha256:d6e2f464b5f83be72c51978e8474e42acd534ad3b5684a7be293a9600aae5f99` to `sha256:feb9d7dea0aebf0de17d19e2444b441236ae28baa00324eb3e2ce68ebd47bade`) and removal of that hint from both the p141 person summary and `hints-p141` item. The source fingerprint remains `sha256:fbb4449bb164f5ae031e51442437cdc00efc8f9b339d91c003fd01792ae7ca90`; packet IDs otherwise remain unchanged. Existing date approvals do not transfer to the new extraction fingerprint.

For both the before and candidate extraction, the current-checkout strict compact extraction validator and applied editorial-history validator pass: 278 units, 817 candidates, 165 people, 690 mentions, 916 claims, 18 repairs, 479 dispositions, and zero alias disposition conflicts. This is structural validation, not substantive approval of all claims.

## Remaining work

The combined source and extraction remain research-only. A separate full independent date audit must cover all evidence on the final source and extraction, including s0177's contextual AD 400 conversion; editorial closure, identity resolution, chapter backlinks, person pages, search, ebook verification and publication gates also remain. The pre-existing chapter metadata title `Volume 12` versus 卷一百二十七 still needs correction with affected fingerprints and approvals reconciled. Do not mark the chapter complete or transfer a prior approval on the basis of this focused review.
