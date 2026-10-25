# Independent integration re-review — V2

Verdict: **APPROVED for host reconciliation and required CI. No remaining actionable findings.** V1's P1 is independently reproduced as closed. This approves only the sealed draft; it does not assert a canonical adoption, deployed publication, corpus completion or successful full CI.

Exact base: `5d652c2cded7074ad5bfe3727cff639b1f07e1f1`.
Exact patch SHA-256: `832280f61b0d0c51e7a408528f1109d2cafccea3301356df85bd8beff364c872`.
Independently verified all 14 base/draft file hashes against the envelope (`integrity.json`). V1's declared source and patch hashes remain unchanged (`v1-preservation.json`). Reviewed V2 changes against V1 and retained the complete V1 review/proofs in their original directory.

## Independent execution and closed P1

`focused-independent.log`: 26/26 passed. `compiler-self-test.log`: passed. Executed the actual ordinary compiler, normal static chapter renderer and person generator, actual Cloudflare GET/redirect transport, production verifier, search and sitemap. Existing certified ebook unit/artifact/real required CLI coverage reran successfully (18 tests), including EPUB generation/validation and wrong executable/source roots. Executable dependencies resolve to the sealed V2 source; fixture authorship and relocated regression outputs stay within this unique review path. Only individual required schema/chronology/config dependencies were copied, never repository/corpus/public/dependency trees.

`preview-closure-proof.mjs` builds an actual globally complete 2-chapter/2-person catalog, removes a current date approval without recompiling, then checks both contexts and actual generation/serving. Default qualification drops the stale chapter. Explicit preview freshly qualifies the surviving chapter, stays `preview:true`, `published:false`, published counts zero, emits noindex, and the actual production handler returns503. A new production generation serves the surviving person200 and removed person404. Downgrading an actual generated shard to uncertified v1 returns503. Thus no cached complete flag, legacy transport, or preview flag promotes that unapproved chapter. The old full certificate is rejected after the gate change.

## Integration, tamper, source and replacement checks

`integration-independent.mjs` independently extends the fixture harness and verifies:

- 67 current extractions, exactly2 candidate/full validations, 2 qualified chapters, 65 explicit holds, and unchanged false global completion.
- Only qualified display facts, aliases, dates, roles and references; outside curation/family support checks retain the established ebook policy. Stable global IDs/slugs/retired redirects remain intentional identifier exceptions; no URL migration or outside display facts are introduced.
- Real Chinese and English chapter links, English citation anchors, canonical/JSON-LD person HTML, search/sitemap counts, unknown IDs and retired redirects.
- A new valid approval after the identity compiler run enters scope without rebuilding it; the previous certificate invalidates. A stale sourceHash audit removes its chapter.
- The cached static renderer rejects an added unmentioned source unit, a foreign book/source object borrowing a qualified chapter context, changed chapter metadata, and changed translated source. It binds the complete loaded object rather than only person anchors. Existing required ebook CLI tests also reject executable/source split roots before publication writes.
- Actual v2 shard-generation tampering produces503 and verifier failure; missing/tampered status and stale certificate pins fail. Source/identity changes and missing seals fail loudly.
- Removing one approval fully replaces old person/search assets: removed page404 and search count1; stale links remaining in a held chapter cause production verification failure. Restoring approval regenerates/verifies2.
- Independent editorial actor rejection, proposed/applied repair authorization, post-render gate drift, unsupported outside curation, empty subset cleanup, and injected replacement rename rollback retain their protections. Failed publication preserves the previous good artifact.

The V2 shared loader again checks original catalog/index publication invariants before using sealed identity state. Both normal and diagnostic contexts take the same fresh qualification path; generation requires its certificate and rechecks before local replacement. Handler and verifier reject uncertified v1. No new mandatory no-op editorial history was introduced: the canonical no-repair/no-history policy and all independent authorization checks on applied repairs remain unchanged. Current extraction/date acceptance alone still does not grant identity approval or complete a chapter.

Disk preflight passed. No canonical code/data, Git index/branch, queue/date-runtime or production state was changed; no paid calls or full corpus build ran. Full required CI/build and deployment/URL evidence remain the host's next gates. These fixture tests do not establish full-corpus runtime/memory behavior.
