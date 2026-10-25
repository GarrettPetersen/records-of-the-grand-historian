# V2: certified people website publication

Artifact-only revision; no live adoption. Canonical base remains
`5d652c2cded7074ad5bfe3727cff639b1f07e1f1`. Exact 14-file base/draft hashes are
in `envelope.json`. Patch SHA-256:
`832280f61b0d0c51e7a408528f1109d2cafccea3301356df85bd8beff364c872`.

V1 remains preserved at `../qualified-site-publication-20261025` with both independent
review reports and proofs. `evidence/v1-preservation.json` confirms its patch, every
declared source hash and every originally sealed evidence hash remain unchanged.
The V1 reports are `independent-review/report.md` and
`independent-provenance-review/report.md` beneath that preserved V1 directory.

## Confirmed blocker and fix

Independent reviewers demonstrated that V1's raw-catalog preview branch could trust
a formerly complete catalog after a current date approval disappeared: it produced
`preview:false`, `published:true`, no certificate and version-1 shards; the actual
Cloudflare handler returned HTTP 200 for stale chapter evidence.

V2 removes that branch. Every active website context freshly qualifies its current
scope. Explicit preview always returns `preview:true`, mode `diagnostic-preview`,
and zero published chapter/person counts, including when the ordinary stored global
catalog says complete. Its facts still come only from the current qualified subset.
Normal generation requires current certificates; both normal and diagnostic shard
producers emit version 2. The production handler rejects preview status and all
uncertified version-1 transport with 503. Sitemap and verifier also require current
certified publication evidence rather than keeping an uncertified fallback.

The existing handler tests now model the actual version-2 producer while preserving
GET/HEAD 200, retired-ID 301 and unknown-ID 404 behavior, with an additional assertion
that uncertified version-1 shards receive 503. Required CI explicitly runs these
transport tests and the qualified-scope integration before its existing full build.

## Unchanged guarantees

The established zero-repair editorial contract, independent applied-repair history,
strict current-source extraction and date gates, global identity ambiguity gates,
scoped fact projection, unsupported outside-curation failures, atomic local rollback,
post-render evidence checks and empty-scope closure remain unchanged. The broad
fixture retains 67 current extracted chapters, exactly two candidates and two full
website validations. No new full-source manual review requirement was introduced.

Global canonical IDs/slugs/redirect IDs stay stable. The operator document explicitly
distinguishes an opaque stable URL containing a held member's historical name lexeme
from publishing that name as display aliases, descriptions, search labels or facts.
The URL exception does not authorize held factual or preferred-name metadata.
AGENTS retains the reviewed correction to the obsolete pending parallel-runner handoff.

## Evidence and remaining gates

All 26 focused tests pass on these source bytes, including existing certified ebook
unit/CLI tests, generated-data tests, actual website integration, existing transport
and presentation checks, and the new preview regression. Compiler self-test passes.
Logs are under `evidence/`; patch dry-run and application into an isolated source-only
base fixture reproduce every envelope draft hash.

The new regression constructs a genuinely complete ordinary two-chapter catalog,
checks even its explicit preview is diagnostic, removes one date approval without
rebuilding that stored catalog, generates preview output and invokes the actual
handler (503). Fresh normal production subsequently publishes only the surviving
qualified chapter (approved URL 200, stale URL 404). Missing identity evidence also
rejects diagnostic loading. It does not forge the catalog's complete flag.

Independent V2 review and the existing full CI build remain required. No primary
canonical files, runtime, queue, branch, Git index or deployment were changed; no
full local build, checkout, or paid inference was used. Reconcile approved exact-base
paths against the dirty shared checkout rather than blindly applying this patch.
