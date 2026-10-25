# Certified people website publication

A normal build publishes the currently qualified chapter subset. `catalog.complete`
retains its global meaning: every authoritative source chapter and every global
blocker must pass before it becomes true. A partial website has `complete: false`
and an explicit `publication.mode: certified-scope`; it is never a preview promoted
into publication. There is no bypass or scope override. `PEOPLE_SITE_PREVIEW=1` and explicit
`allowPreview` still run the same fresh qualification. Their result is always a
`preview: true`, `publication.mode: diagnostic-preview` context with zero published
chapters/people, even if the stored global catalog says complete. Diagnostic shards
remain version 2 and the production handler refuses them because their status is
not published. A stored global completeness flag cannot authorize stale evidence.

## Qualification and evidence

Qualification first uses sealed compiler prompt/identity exclusions and cheap date
report status/version to shortlist candidates. Missing/legacy/unresolved scopes and
unapproved dates get explicit holds before packet reconstruction. Only prospective
qualifiers run full extraction/date/editorial validation; a hint never grants approval.
`publication.qualificationWorkload` records scope/candidate/validated chapter counts.
The static renderer loads one scope per process, not once per book. Identity input
seals and final source/date/editorial evidence drift checks remain mandatory; no
corpus speed or memory claim is made before full CI measurement.

The website and certified ebook loader share `people-qualified-scope.mjs`, including
the established chapter gate policy. Each selected extraction is freshly validated
with strict alias accounting and the current prompt, its independent date approval
is checked against current complete source/extraction/reference evidence, and all
applied translation repairs require the complete valid independent authorization
history. Proposed repairs, rejected/self-reviewed/unauthorized applied repairs,
legacy/stale source, and global identity ambiguity touching a selected person block
that chapter. Global identity membership is reused only from the ordinary compiler's
current hash-sealed catalog/index generation. A missing/stale identity seal fails
the invocation; it does not fall back to global records or preview output.

The established editorial gate permits no-repair chapters without an empty people
review document. A valid empty-proposal independent review is accepted, but this
refactor adds no manual no-change approval requirement. Source translation reviewed
flags and full-source SDK semantic review remain separate quality evidence under
`REVIEW_PROCESS.md`; absence of repair proposals does not assert a new full-source
review, and source review never authorizes an unreviewed people repair. Ebook
manifest scope, ordered chapter coverage and certificate contracts are unchanged.

`projectPeopleProduct` reconstructs facts only from qualified source members while
retaining sealed global IDs, slugs, conservative merges and retired-ID redirects.
Slugs are opaque stable global identifiers and can retain a historical name lexeme
from a held member. This deliberate URL-stability exception never authorizes a held
name in display aliases, labels, descriptive/search metadata, or biographical facts.
Outside aliases, roles, descriptors, life dates, family facts and curation cannot
enter a published person through its global merged record. Outside-only preferred
name/description overrides or unsupported family targets fail explicitly; operators
must resolve the source/curation hold, never drop the override or import outside facts.

## Builds, checks and counts

Run `npm run people:disk:check` before local work. The normal compiler produces the
global identity seal; then `npm run people:site`, `npm run people:site:verify` and
the normal sitemap build qualify, generate and check the subset. The full `npm run
build` remains the deploy gate. Do not run a full local corpus build for this code
review: use tiny offline fixtures, then run the existing full CI build once after
review. No per-person HTML or generated people shards should be committed.

`public/data/people/site-status.json` separates:

- `complete`: truthful global completion;
- `publication.qualifiedChapters`: chapters passing the established current gates;
- `publication.publishedChapters` and `publishedPeople`: the built publication;
- `sourceChapters`, `extractedChapters`, `missingChapters` and `globalBlockers`:
  unchanged global coverage and blocker metrics;
- `certificate`: exact authoritative scope, selected gate/source hashes, identity
  generation, projection and explicit chapter holds.

The progress page's existing `completeChapters`/`glossaryState: current` values are
**data-gate progress**, not a count of generated pages or deployed chapters. Do not
report these values as publication. Use the verified site's separate publication
counts; a deployed claim additionally needs the successful deploy and URL checks.
Nothing in this refactor equates the reported 15 data-ready chapters with 15 pages.

All person, chapter, search, browse, sitemap and redirect targets come from the same
projection. Unqualified chapter HTML has no ready person links. Static chapter
rendering checks the exact source object against its certificate; the verifier
checks both actual-language anchors and excludes stale links in held chapters.
An empty qualified subset keeps the existing closed behavior and removes owned
people output. Partial `--person`/`--limit` production generation is rejected.

Generation stages the entire owned artifact, requalifies evidence, then replaces
owned files with rollback on local rename failure. The status is installed last;
Cloudflare publishes the successful complete deployment atomically. Version-2
person shards are bound to the status certificate; missing/stale certificates and
redirect targets fail closed with 503, unknown people return 404, and retired IDs
redirect only to a currently published target. Uncertified version-1 transport is refused by the production handler. Normal and
diagnostic producers both emit version 2; diagnostic status is always unpublished,
and production still forbids preview builds.

## Offline validation

`node --test scripts/test-people-qualified-site.mjs` authors three tiny extracted source
chapters plus 64 outside current-extraction chapters, ordinary extraction/date/editorial evidence and a curated cross-book
identity. It runs the ordinary compiler, real static chapter renderer, normal
person generator, actual Cloudflare handler, search, sitemap and production
verifier. It checks two qualified chapters while the global catalog stays
incomplete, outside fact exclusion, actual links/SEO/citations, retired redirects,
unknown/missing people, missing/stale certification, current expected-input pins,
self-review, missing dates/identity/source evidence, explicit curation rejection,
no-repair editorial-policy equivalence, post-render gate changes, local rollback
empty-scope closure, and the formerly-complete-catalog preview promotion regression. Existing certified ebook tests cover independent applied
repair authorization, family leakage, unresolved global identity and scope gates.
CI runs these focused checks before its existing full build.
