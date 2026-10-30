# Implementation checkpoint — 2026-10-30 22:05 UTC

LATEST USER expressly says IMPLEMENT the bounded canonical-person dossier process,
including production scheduler, shared publication gate, proof reuse, normal checks
and timed Jinshu053 live release. Do not stop at another proposal. No new extraction
or fresh pair wave. No O(k²) fresh identity work. Preserve reviewed cross-chapter
uncertainty; false merges/wrong chapter attribution stay held. Full corpus goal stays
active, but zero chapters are published by this checkpoint.

Work in the same dirty primary checkout, no reset/switch/pull/broad stage/new checkout
or native subagents. One heavy local job, 3GiB Node heap; guard before/after and every
<=60s, ideally outer watcher45s because sync Node work blocks internal timers. Last
measurements ~36.3GiB free, swap1.58GiB, backend~0.5GiB, pressure1. All jobs in this
batch are terminal, no live paid run. Preserve original053 owner and086 date owner,
round3/circuit, all sticky state/claims/locks. Queue refs were read only, not altered.
Normal staging remains1f031602cf7aa15090b26ec997097d46dd2ef09f, master0be83fa27e6a03058cc5bebda5061610c3899c15. Recovery parent before this new checkpoint8b07374deb36fbc1e162c0e34cb1d27bdf74d8ca. Use host temp Git index for exact files.

## Achieved REAL pilot identity proof
- source-review-revision-2/identity-acceptance-receipt.json: native accepted72cases,
  all73Jinshu053locals,63explicitly reviewed uncertain cases; 106primary witnesses.
- Source/editorial/extraction/date four byte pins remain EXACTLY unchanged.
- Actual independent source reviewer bc-eb50bc5f-79e8-4411-9dc6-d2d1d24eea63,
  run65ebf5e8-f235-44e6-ac69-054c47c59575 (prefix run-). ~7minutes, raw$1.932249.
  One citation-only SAME reviewer followup run-898aa314-73d9-45ea-b4f6-29a8adf402eb,
  raw$0.249698. Total2.625572million tokens and raw$2.181947 within original$3/4M.
- Original report72approve preserved. Citation supplement changes ONLY037p182
  witness from real but unregistered name unit0368 to0366 quote 子孝王略.
  report.with-citation-supplement.json + citation-reconciliation-receipt.json retain
  exact old/new hashes; do not edit raw reports. Current validated bundle is in
  candidate/data/people/identity-reviews/jinshu/053.json (and original artifact dir).
- Native witness validation initially rejected two GOOD abbreviations/kinship
  citations (壽 and 長女) by wrongly requiring full reconstructed names. Fixed to
  accept freshly native-validated person-linked Chinese mention spans; still rejects
  arbitrary Han, unsupported source/people and changed primary context. Real bug,
  not permission to relax source identity. Tests cover contextual kinship vs 美.
- Three English proposals are OPTIONAL STYLE, independently dispositioned by code
  reviewer in independent-name-proposal-disposition.json: Wu Di and Hui Di already
  valid source-backed aliases; do NOT rewrite them or stale approvals just to impose
  Emperor Wu/Hui consistency. No semantic omission demonstrated; no extra repairs.
- Preparation native-validates14source/anchor chapters, preserves837claims/704mentions
  and325primaryunits. Full source packet2MB; compact transport629198bytes retains
  all claims/mentions/primaryunits, candidate headers explicitly metadata only.
  No new pairs. Don't resend old source job or repeat72reviews.

## Candidate implementation (NOT active production)
candidate/ now has engine, immutable store, compact native constraints, target source
loader, chapter-proof validator, shared qualified-scope changes, compiler/schema/seal
v2, scheduler entry guards, uncertainty in website/ebook/JSON-LD/search, progress
backend and initial progress-test migration, policy and real proof/history artifacts.
Root PEOPLE_COMPLETION_PROCESS.md and AGENTS.md were intentionally updated locally
with the new policy only. Previous local docs preserved here. Code modules were NOT
overwritten onto stale dirty primary files; use candidate + exact pinned Git baseline.

resolveAcceptedPeopleClusters uses compact branch constraints, no pair expansion:
real-compact-resolution-equivalence.json proves EXACT all258210local memberships,
228270canonical groups/258212known IDs across307accepted docs,4.025seconds,266098
constraint incidences,34111label visits,0pairs. 3000random old/new cases match,415
held,2585accepted. 10k-member split stores10kentries, not49,995,000pairs. Historical
resolvePeopleClusters adapter still expands ONLY for retained recovery APIs; ordinary
compiler uses compact function. Old deadline resolution phase AND direct SDK CLI now
refuse fresh pair work (SDK permits --recover-only). Verify all leftover callers are
recovery-only; no ordinary command should generate a complete same-name pair graph.

Shared gate validates preserved independent report, all own/anchor full current
person/context fingerprints, source witnesses, complete protected accepted membership
and lineage, actual extractor/reviewer independence. Current source/editorial/date/
family/artifact/CI checks remain. It removes the global outstanding-pair veto; old513
pairs remain historical unresolved research debt, not silently cleared.

LATEST post-review addition: explicit identity-proof reuse after metadata envelope
changes. validateRetainedDossierReview remains fresh-record strict; common
validateDossierIdentityEvidence checks preserved identity evidence. Shared wrapper
checks ALL original full person/Chinese context dependencies before producing a NEW
aggregate with reviewedInputs/originalBundle/currentInputs, never rewriting old hashes.
Current independent editorial/date gates still apply. Individual changed-person proof
mixing/re-review is not implemented yet; change one person still requires a newly
assembled complete chapter report. This extension NEEDS final independent recheck.
Catalog assessment can explicitly represent missing date report without crashing;
actual prepare/qualification still requires current audited dates.

Current tests: final-integration-smoke.log24passes (18engine+6chapter-proof) plus
native legacy resolver script passes. Unchanged store6tests previously pass. New
compiler-self-test.log passes migrated person-case/stat/output contract. Smoke loads
shared site/ebook/render modules. No full normal build/CI or actual shared-scope
end-to-end test yet. Do NOT call this production adopted, data-qualified or published.

## Independent code reviewer and exact remaining work
Same code reviewer bc-d53b452f-3667-4606-ad22-14c47a712839. Earlier prototype recheck
run-6c3ac61f-1bb7-458d-9488-d82404f754f7 approved0findings. Integration review
run-a9e7c6d5-a254-4d87-a014-a61e97793866 returned changes-required5findings;
packet54175dd3f529acea727ea757118cd4d4990ff774110a683cc3a727e1d1dd817a,
raw$0.555824 /402986tokens. Original packet/report preserved. Medium findings:
1. Compiler own self-test still pair era: NOW migrated and PASS.
2. Uncertainty omitted from lede/JSONLD/search: NOW patched; add meaningful output
   assertions and recheck. Ebook already had note. Do not remove evidence aliases.
Low findings: anchor strictAliasDispositions=false; confirm it only ADDS error checks
and cannot transform normalized identity keys/witnesses. Native validator733-739
only pushes alias-disposition errors; external chapters are identity evidence, not
completion assignments. Keep target stricttrue. Historical adapter import now removed
from compiler. Workflow state paragraph updated. Post-review changes including proof
reuse still need SAME reviewer recheck after normal fixtures are migrated.

NEXT critical work, in order:
1. Migrate required native CI fixtures (especially test-people-qualified-site.mjs,
   test-ebook-certified-people.mjs, test-ebook-certified-cli.mjs and other catalog/seal
   fixtures) to actual independently validated synthetic person proofs. Never restore
   all-pairs veto or weaken date/editorial/family/preview tests to make them pass.
   Old assertScopedIdentity(corpus,catalog,oldSeal) API intentionally changed to current
   validated certificate coverage; use actual validateChapterIdentityBundle then its
   WeakSet authority, not fake serialized certificates. Compiler self-test is fixed.
2. public/progress.js STILL reads removed unresolvedCandidateBlocks,
   unresolvedPeople, identityCleanChapters etc. Migrate it AND per-book aggregation/
   tests to identityReview fields and distinguish reviewed uncertainty, zero-person,
   qualified nonempty, published nonempty. Backend generate-progress candidate has
   new fields; UI integration remains unfinished. Check no false zero counters.
3. Complete normal registry build/update and proof RECORD commands. Existing prepare
   CLI builds packet only, no generic sticky source-review scheduler/recorder yet.
   Current real job was host-controlled specific artifact runner. Need proper normal
   command routes, immutable input provenance, resumable exact handles and locks.
   Avoid copy/pasting credential loaders/SDK recovery logic. Reuse repo helpers.
4. Reuse existing accepted pilot bundle as canonical source of review; do NOT pay
   another full review. New registry queries max8dossiers,16keys,8reads/key. Plan29ms.
   Update affected dossier evidence, keep prior immutable generations/unchanged proofs.
5. SAME independent code reviewer recheck sealed exact final delta + tests; old
   integration verdict is NOT adoption approval. Budget$3/4M/20min per normal run;
   no allowance exhaustion known, don't expand spend without authorization.
6. Adopt through clean reviewed code/normal PR+CI, run ACTUAL shared qualification,
   person pages/backlinks/inverse snippets/search/sitemap/ebook contribution checks,
   normal CI/build/deploy/live checks and timed NONEMPTY receipt. Existing approved
   dates/editorial/source unchanged. No preview flag and no zero-person shortcut.

Base staging differs from master by253paths (147resolutions,9extractions,3source,
27scripts,49research etc). Necessary identity baseline is the307accepted documents;
prepare clean release dependencies deliberately, no broad stage. Current primary
index/HEAD is ancient and dirty (13kpaths), misleading git diff may show file deletion
although it exists. Use exact blobs/temp index, not checkout/reset. All native source
runtime reads use pinnedREF; overlay adds candidate code only. Guard and 3GiB heap.
Full global canonical fact compilation MAY exceed local3GiB; don't retry with raised
heap. Existing CI uses6GiB; consider identity-metadata/scoped projection streaming if
needed, preserving full source/family validation. Don't blindly build allsite locally.

LOCAL ONLY: registry/318MiB, registry-revision-1/643MiB and old171MiB f85corpus cache.
Never commit/copy them or private .env/tickets/probes. Recovery checkpoint script must
use current remote parent, excludes these stores and scans actual secret values.
Latest publication receipt identifies the new recovery commit. Preserve all source,
reviews, profiles, original claims/locks/086state and unrelated English work.
