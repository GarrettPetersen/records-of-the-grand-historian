# Independent review: combined-curation lock preservation

Reviewed patch `combined-curation-failclosed-lock-20261020-incomplete.patch`,
SHA-256 `9391d54f56114135101d095ce6e02b5a33f02fc3959bbc7b069e46c03ffda250`,
against staging `a74f5ac76cdf5a6e3e19cbb4479d37993852ef58`. This is a narrow
code review, not a chapter approval or authorization to recover a live lock.

An independently created three-file snapshot of that staging commit passed
`git apply --check`. I verified the stage fixture's patched production and test
blob hashes matched the patch, and independently ran
`node --test scripts/test-people-combined-curation.mjs scripts/test-source-correspondence-fence.mjs`
in that fixture: 168 tests passed, zero failed or skipped.

The sole production change selects the existing `failIfExists` lock policy at
the combined publisher. Lock acquisition happens before queue mutation or
canonical publication. The patch does not remove the existing receipt, lease,
editorial, identity, date, schema, or generation checks. The new tests verify
that live, dead-PID and malformed locks are preserved alongside canonical data,
local workflow state and ledger, with zero queue calls. After a real simulated
child crash, a retry is refused while preserving the lock, receipt, state,
canonical files and ledger; a separate, fixture-only simulated host recovery
then checks that the active lease still blocks and that exact receipt recovery
works after lease expiry. The pre-existing publication-boundary and gate tests
remain in the suite.

Limitations: the test labeled unreadable uses malformed JSON, not a filesystem
permission denial. The underlying `failIfExists` branch does not read the
existing file, but this run did not independently simulate EACCES. As the
documentation correctly notes, non-cooperating writers are outside this lock's
protection. A hard crash now deliberately requires separately authorized host
lock recovery before resumption; this review does not grant that authority.
No blocking finding for the scope of this lock-policy change.
