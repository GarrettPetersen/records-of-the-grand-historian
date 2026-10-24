# V8 reconciliation analysis: research only

Patch `reconciliation-guard-303b4e0-review-v8-analysis-only.patch`, SHA-256
`ccede79339897d9dcfc3be84d0f386c4bede37cd13f1417ee70bc5918dcd29c3`, is
based on commit `303b4e0fe883d4d305d84987b656322a91e5c3a4` and passes
`git apply --cached --check` against a separate temporary index at that
commit. The v7 patch and its evidence remain unchanged; neither is deployed.

V8 adds a separate pure diagnostic entry point that returns a cloned
reconciliation marked `analysisOnly`, unresolved scanned candidate IDs and
unscanned question packet together. It never marks questions approved or
mutates its arguments. The existing CLI uses the normal reconciliation path,
which still throws before any canonical writes when unscanned questions
remain; untrusted review replay remains disabled. The analysis result is not
publication-authoritative and must not be used as an approved extraction.

The existing apply-repairs self-test now uses that diagnostic path on its
fragment fixture and asserts its six unresolved scanned candidates **and** the
two `Prince of Anping` questions (s0017 and s0024). No review decisions or
source links were fabricated. The full self-test passes. Four focused offline
suites pass 39 tests, including input non-mutation, mixed and zero occurrence
CLI exports, refusal of normal write/replay while questions remain, and
no-overwrite checks. Tests requiring the real chapter must use the explicit
fingerprinted script-only fixture, not the shared checkout.

Scope remains narrow: source-supported exact aliases only in locally
contextualized units are examined. This is not proof of complete name
coverage, resolved identities, an authenticated independent review or a
publishable chapter. Host dispatch verification and safe review replay are
not implemented. Independent review of this patch and all normal editorial,
date, identity, validation and publication gates are still required.
