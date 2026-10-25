# Bounded Jinshu source integrity diagnostic

Read only the 130 Jinshu chapter source blobs and 61 Jinshu extraction blobs at Git 6f03021c25f441d002e0382d2f307556eca2df86 using one `git cat-file --batch` response in memory. No working-copy chapters, copies of the corpus, model calls, witnesses, builds, queues, or canonical writes were used. Output is restricted to this artifact directory. The source API, packet builder (`chapterData` from Git), and compact expansion are from the existing released production runtime; their hashes and all exact blob/raw hashes are in receipt.json.

Results:

- Zero `：\s*、` punctuation hits among the 130 pinned source chapters.
- Two review-only absent Chinese personal-name mononyms among the 61 pinned extractions, both in Jin032: p050 鄧 (claim c0209) and p051 梁 (c0213). Both cite s0089: `漢和熹、順烈，並亦臨朝，近明穆故事，以為先制。` The actual text uses epithets, so the absence alone cannot distinguish an externally supplied name from a source defect. No correction, certainty change, or approval is inferred.
- Old Jin053 at exact 58b2288ce65d8b57a461736dec0b21684cb45d37 flags s0170 `太子三子：、臧、尚，並與父同幽金墉。`; corrected Jin053 at 6f03021… has no list-gap hit. The punctuation rule does not detect the second old missing glyph at the beginning of s0171. A clear result is therefore not a completeness or approval rule.

The mononym check inspects only name claims with `kind: personal-name` and exactly one Han code point, requires that glyph to be absent from every chapter Chinese content unit, and records all cited-unit quotes. Other name kinds, multi-character names, inferred names, and metadata are outside scope. Production compact expansion succeeded for all 61 extraction objects; no adaptive data-shape fallback or omission was needed.

diagnose.mjs is reproducible against the pinned Git objects. hits.json contains exact local IDs, quotes, provenance URLs and source/extraction pins; known-case-demonstration.json seals the old/new comparison. These are diagnostic review candidates only, with no new enforcement gate or automatic fix.
