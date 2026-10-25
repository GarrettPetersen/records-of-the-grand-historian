# Certified book glossary v2 — unadopted review draft

Base: exact master `81240df60b45d748f7b951c41810ef8cac9c7a3d`. V1's code, hashes and independent review remain untouched in the sibling directory. All v2 files are individual changed/new code, tests, workflow and review artifacts; no repository/corpus/runtime copies were created. Disk preflight passed at 51.16 GiB free.

This retains v1's scoped canonical projection, hash-sealed global identity mapping, independent current chapter gates, per-product generator context, shared actual glossary rendering, embedded scope certificate and exact current-source artifact verification. Global site publication guards and preview rejection remain intact. See the v1 review notes for the original design and its explicitly unperformed real-book integration work.

## Independent P1 repaired

The provenance reviewer reproduced a source-current, strictly production-valid extraction containing independently approved r0001 plus applied r0002 absent from history. V1 accepted it because its shared validator checked history → repairs but not repairs → authorization. V1 must not be adopted.

V2 adds the converse check to `validateAppliedEditorialDecisions`: **every applied repair must match an independently authorizing accept/revise decision's exact unit locator, field, before text, approved after text and reasoning**. Repair IDs are deliberately not the contract: normal reconciliation may resequence them. Existing document validation, self-review rejection, historical rejection/later-approval logic, history preservation and the v1 empty-proposal pending-review fix remain in force. Neither extraction freshness nor date approval substitutes for editorial authorization.

The regression first passes production `validatePeopleExtraction(..., {strictAliasDispositions:true})` on the current synthetic source, then proves that both the shared validator and certified gate reject the extra unreviewed r0002. It also checks an independently completed empty history against an applied repair, valid approved-only history, changed unit/field/before/after/reason, and same-agent review. Existing accept/revise/rejection-history tests still pass. No existing editorial document was altered or automatically blessed.

This strengthens all consumers of the shared applied-history validator. If legacy applied repairs lack exact independent authorization, their gates must now fail until legitimate independent review/reconciliation occurs. V2 does not hide, grandfather or rewrite such failures.

## Required CI

`.github/workflows/master-build-gate.yml` now runs the portable new certified ebook suite and the existing readiness/current-date/date-audit/editorial-rejection suites in the required `master-build` job, before the full site build. Its existing Cursor recovery command still includes `scripts/test-people-date-preflight-diagnostics.mjs`; job name, triggers, permissions and other steps remain unchanged.

## Focused validation

```sh
node data/people/generated/code-drafts/verified-book-glossary-20261024-v2/run-focused-tests.mjs
```

Results: **39 Node checks passed**, compiler self-test passed, all **10 source/test modules** syntax checked. The workflow's five-suite command is the same suite set exercised by the isolated runner. Workflow YAML parsing and preservation of the required job/date-diagnostics command also passed; `ci-validation.json` records that check, without claiming a GitHub execution. The runner verifies unchanged imported code and schema/config/chronology/role data against master and keeps temporary fixtures inside v2. ZIP fixture verification is a focused people-artifact transport test, not a complete standards-qualified production EPUB.

The proposed patch now contains **11 files**, including required CI wiring. Exact file/base/patch hashes are in `patch-envelope.json`; exact test commands/output and verified dependency hashes are separate artifacts. The v1 sealed-file checksum verification also passed after v2 changes.

## Review and adoption status

**Unadopted; focused independent v2 review reruns are pending.** V1 filesystem review found no blocking defect and exercised the real loader/verifier boundary, but that evidence is not automatically treated as approval of the changed v2 gates/code seal inputs. No primary code, Git index/branch, canonical source/extraction/catalog, live runtime, current claim/lease/recovery state or date workflow was changed. No paid/model call, global build, real Jinshu qualification or production EPUB generation occurred.

The original integration limits remain: the new global identity seal must come from a normal successful compiler run; actual real-book CLI/full-filesystem loader and publication EPUBCheck need host integration validation after independent review; global inventory hashing and repeated scoped gate checks have unbenchmarked IO cost; unsupported outside curation/family targets fail rather than importing unqualified facts.
