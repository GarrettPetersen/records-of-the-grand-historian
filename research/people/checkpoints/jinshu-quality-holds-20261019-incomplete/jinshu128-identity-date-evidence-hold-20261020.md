# Jinshu 128 identity and date evidence: incomplete

Read-only examination of staging `1da4e6a2ca9df03d780ab18762e43e5e50b787a2`.
No canonical data, reports, claims or leases were changed. These observations
do not establish publication readiness or prove any historical date false.

## Inputs and date evidence

- Source file byte SHA-256: `8b301825b81b5df574732ea81b2ec17ee1fa25a4761e39775df575ea9505f35b`.
- Extraction file byte SHA-256: `d4986ae4036b5eb25eecaac66122d9419ac0da5ba17372ad2fda0cc8889eba1c`.
- Date report byte SHA-256: `29e939e37f98fb6609d991d2db4dd7900a1853343a661e3cd628a39660063acd`.
- Report content fingerprints: source `sha256:a37da153ece3a93370eb3756b14bb9a432de7eeee581e8b999b5e1dbad491496` and extraction `sha256:f9bc3bd5cc89f6b68c4048aa55f00dc7afd81cd8001c7f8e48246219c5c1bb01`. Both match current staging, and `validateDateAuditReport` accepts the reconstructed packet.

The extraction identifies `p002` as Murong Na (慕容納) with active hint
`AD 370-384`, and `p003` as Murong De (慕容德) with `AD 384-405`. The report
marks both `hints-p002` and `hints-p003` supported; the only citation on each
is s0002 `慕容超`. The complete Chinese text of s0002 is exactly `慕容超`
(Murong Chao): it names neither Murong Na nor Murong De, and gives no dates.
The report records zero external references. Thus those two displayed citations
do not substantiate their specific support assertions. This is not a finding
that the underlying dates are incorrect. Retain the historical report and
recover any actual sealed review evidence or perform a fresh independent
source-based audit before treating the chapter as release-ready.

## Identity history and retained work

Staging's `data/people/resolutions/cohort-2026-09-09-jinshu128-refresh.json`
has byte SHA-256 `4e708829b05f7f90d096927461d62013536cda72272c94c622d15ec607ea06f6`.
It contains 112 decisions involving 71 distinct Jinshu 128 local people:
41 merges, 49 keep-separate decisions and 22 possible-same-as decisions. It
was last changed in commit `4375b02af27ce435cddcf7908fbeb7f77159f21e`.
The chapter extraction has not changed since that commit; the chapter source
diff is only removal of the final newline. However, 12 of 64 chapter
extractions referenced by those decisions have changed semantically since then,
affecting 42 decisions. This comparison flags work requiring fingerprint-aware
reconciliation; it does not by itself prove that all 42 outcomes are wrong.
Newly added corpus records may also introduce unresolved comparisons.

There is also a retained local, untracked dossier and ignored response at:

`data/people/resolution-dossiers/jinshu-release-identity-001-final-remainder-002/jinshu-release-identity-001-final-remainder-002-shard-021.json`

`data/people/generated/resolution-shards/jinshu-release-identity-001-final-remainder-002/jinshu-release-identity-001-final-remainder-002-shard-021.json`

Their byte SHA-256 values are respectively `76166a3a1f6b35d72132e72c0213ee3070d03728d7e0dec308c92dbf34b24763` and `ad42973f2654828b0882969c10e066595e2517991169469b5e1d6ff9ef6edf43`. The response contains two decisions involving `jinshu:128:p138`; its manifest pins the current staging bytes for the Jinshu 128 source and extraction. This is useful recovery material, but the full dossier's source fingerprints, publication status, reviewer independence, and current remaining candidate graph have not been verified. Do not assume these results are publishable or claim they clear the chapter.

Next: preserve the retained shard and old 112-decision batch; validate the
complete dossier manifest and current global candidate graph before resuming
or commissioning independent review of remaining pairs. In parallel, resolve
the cited-date evidence gap through the normal source audit and repair gates.
