# Independent review: ebook preview relabel finding

Reviewed `ebook-preview-relabel-research-e3c5907-20261019.md`, SHA-256
`ad9ac8bd8c7fd3c4835c5ef503c8960d962207778a0bf00741d2601f093252f9`, against
the retained DO-NOT-USE candidate and test source. No additional EPUB copy,
test build, canonical write, claim, lock, Git operation or staging occurred
for this review.

The research's central finding and its limited scope are supported. The
retained validator and realistic test are byte-identical to the temporary
candidate and test used in the prior run. The test copies the ignored Shiji
preview bundle to a temporary directory, validates its preview mode, asserts
release-mode rejection, then changes only that copy's QA readiness fields and
the QA descriptor in its publication manifest. It asserts that the same
copied EPUB then passes the candidate's release-shaped structural validator,
and that the original EPUB's hash is unchanged. The prior observed execution
passed; I did not re-run it for this review because that would create another
EPUB copy. The candidate's default ebook QA and manual-signoff paths both
invoke the same release-shaped validator, but the realistic test does not
itself establish that the remaining steps in either full workflow would pass.

The claimed staging revision is the preserved candidate's construction basis;
this review did not re-fetch or independently re-inspect that Git revision.
The test uses an ignored locally generated preview and current working-tree
source, not an independently qualified chapter or a clean staging build.
The saved copy of the test still names its old `/tmp` validator path; if that
directory disappears, restore the small fixture and dependencies as described
in the DO-NOT-USE README before attempting reproduction. The reported 11 tests
support the described prototype behavior, not historical accuracy, reviewer
independence, or release readiness.

The recommendation is appropriately fail-closed: separately verified,
current chapter evidence and a provenance-safe projection must be bound to the
actual EPUB at release, and missing or stale proof must not be replaced with
editable QA flags or matching hashes. A trusted proof's authority and its
invalidation rules must be established; immutability alone does not establish
that the underlying review was genuine. A successful structural test is
necessary but insufficient. No candidate is approved for promotion, and no
chapter, ebook or deployment is asserted to be complete.
