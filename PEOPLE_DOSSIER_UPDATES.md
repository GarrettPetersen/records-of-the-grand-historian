# Incremental canonical dossier updates

Use `npm run people:identity:update -- --registry ABSOLUTE_BASE --out NEW_ABSOLUTE_GENERATION --source-revision FULL_GIT_SHA`
after independently reviewed source/extraction corrections have an exact Git
snapshot. Run the resource guard first. The host owns this command and its
resolution lock; chapter workers must not update the registry.

The updater checks the retained generation's original source seal, current native
construction/configuration contract and exact changed source chapters. It validates
those chapters normally, compares every member contract, then materializes all
accepted members of only the affected canonical dossiers. It writes an immutable
delta containing changed dossiers, versions and affected name postings. Other
dossiers are read from the hash-pinned parent generation. No name pair graph is
generated. Identity preparation and recording accept either a full generation or
an incremental generation through the same registry reader.

This updates evidence, not canonical membership. Changed person inventories,
explicit same/different-person constraints, resolution documents or construction
contracts require normal accepted membership replay or registry regeneration;
the updater fails rather than inferring a merge or split. Retain each parent
generation while a descendant uses it. A chain is bounded to sixteen generations;
compact through a normal validated registry build before exceeding that bound.

An updated registry does not make an old independent identity report current.
Preserve the original packet, plan, report and actual producer hashes. Revalidate
unchanged source proofs and independently review changed assignments. Chapter
source/editorial, chronology, identity, website, ebook, CI, deployment and live
checks remain required. Interrupted generations and stale proofs are recovery
evidence, not approvals.

## Reusing captured independent reviews

`people:identity:reconcile` takes `--current-plan FILE --history FILE --registry
DIRECTORY --source-revision FULL_SHA --out NEW_DIRECTORY` (all paths absolute).
The history is an array of `{ packet, report, transport, job, transportPolicy }`
for exact retained captures. Every part entry must include `aggregateJob`.
Legacy direct parts need a verified, explicitly derived partial journal; never
guess omitted authors. Author exclusions include packet, part and aggregate authors.
The host verifies original packet/report/transport
bytes and producer/run identities, compares normalized person evidence and full
primary Chinese, and revalidates each unchanged assignment through the native
case gate. The output preserves original report text and original plan hashes.
Remaining cases, changed proofs and concrete holds are explicit. This command
cannot write canonical approvals or approve dates.

After normal current source/editorial/date gates pass, use `people:identity:prepare`
with `--retained-composition FILE`. It transports only the remaining cases while
retaining the full indexed chapter plan and complete target Chinese. When all
proofs are reusable, preparation returns a complete composition without a model
assignment. Recording the captured remaining parts combines their actual reports
with retained components; `--composition FILE --source-revision FULL_SHA` can also
record an already complete composition. Both paths use the same normal recording
and publication gates. Incomplete coverage, self-review, changed primary context,
incorrect attribution and still-current false-merge holds cannot qualify a chapter.

Registry update and proof reconciliation run through the shared resource monitor,
so synchronous source sealing does not prevent the regular host measurements.
