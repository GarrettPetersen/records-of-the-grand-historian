# Ebook preview relabel finding — unapproved research

Candidate baseline: staging `e3c5907719d662323a69a3347011f8f467d268d6`.
This report is not a release approval, does not authorize promotion, and does
not claim that any chapter has passed independent editorial, chronology or
identity review. The staging manifest at this revision contains no Jinshu ebook
product; the 130-chapter Jinshu product in the shared dirty checkout is not
staged evidence.

## Reproduction and finding

The isolated candidate under `/tmp/ebook-glossary-gate.YDzrVBgh/` adds a
`--require-people-glossary` release-shaped validation mode. It requires a QA
record with an active, ready, non-preview glossary and no reported blockers,
and checks explicit EPUB and QA-report descriptors for expected paths, byte
counts and SHA-256 hashes. Default ebook QA and direct manual signoff invoke
that mode; preview mode and release mode cannot be combined.

The candidate's `real-preview-fixture.test.mjs` uses an existing ignored Shiji
preview bundle. In an isolated temporary copy it verifies that the genuine
preview passes `--allow-people-preview` and fails the release-shaped mode. It
then changes **only** that copy's `qa-report.json` people readiness fields to
`ready: true`, `preview: false`, empty missing/legacy/date arrays, and zero
identity-review blockers; it updates the QA-report descriptor in the copied
publication manifest to match. The EPUB bytes remain unchanged. The candidate
release-shaped structural validator then passes that altered bundle. The test
labels this fabricated metadata as synthetic, and must never be used as an
actual release. The independently rerun candidate suite passed 11/11 tests,
including this reproduction.

Therefore the release-shaped mode establishes necessary structural and
sidecar-consistency checks, **not** the independent qualifications it claims
to require. Hashing a modified QA sidecar inside a modified manifest binds the
two files to each other; it does not bind them to independently verified
chapter review evidence. Since the new default ebook QA and direct manual
signoff would rely on the same structural validator, a bundle that passes
their other checks could receive a misleading release success. The test directly
reproduces structural validation only; it does not demonstrate a successful
full QA run, manual signoff or external publication.

## Limits

The existing Shiji preview and source files are from the ignored working
checkout, not a clean, generated copy of the pinned staging revision; the test
runs the candidate validator with that checkout as its current directory. It
demonstrates the metadata trust boundary, not stage-qualified content or a
current release. The test itself uses a temporary copied bundle and does not
modify the original. This report does not require making another EPUB copy.
The candidate is isolated and not integrated into staging or master.

## Required next step

Before a release or signoff can be called verified, the release path must
independently validate a current, scope-complete qualification for every
product chapter: fresh source and extraction fingerprints, production
extraction validation, genuine independent editorial review and applied repair
evidence, current independent date audit, and reviewed identity/candidate
resolution. The immutable qualification and the filtered public/ebook
projection must be bound to the specific EPUB and validated again at release;
missing, stale or unverified provenance must fail closed. An editable `ready`
flag, a matching checksum, or the present progress metric is insufficient.
Preserve explicitly requested draft/preview structural checks as such, without
letting them satisfy release signoff. Add end-to-end tests for current and
stale evidence, relabeled previews, artifact changes, valid independently
qualified content and explicit draft/preview paths. Do not promote the
isolated candidate as a sufficient publication gate before these requirements
are met.

Independent review: `ebook-preview-relabel-independent-review-e3c5907-20261019.md`.
It confirmed the retained test's structural-only scope and noted that the
candidate's `/tmp` paths are transient. A future qualification contract also
needs a defined trusted evidence authority and invalidation mechanism.
