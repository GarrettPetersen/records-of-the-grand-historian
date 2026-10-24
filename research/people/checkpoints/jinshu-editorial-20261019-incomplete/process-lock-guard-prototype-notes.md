# Process lock research prototype — incomplete, not deployed

`scripts/lib/process-run-lock.mjs` at staging `4b9022c` checks a lock owner,
then unlinks the pathname without serializing other contenders. Two contenders
can both read an expired owner; the slower can unlink a successor created by
the faster. The release token check has the analogous read/unlink gap if an
uncoordinated writer can replace the file.

The adjacent Python prototype serializes every acquire, stale reclaim, and
release with an exclusive kernel `flock` on a persistent sidecar guard. It
creates complete lock contents in a unique temporary file and publishes that
inode using `link`, so termination during creation does not leave a partially
written owner file. A terminated guard-holder loses its OS lock. Invalid JSON,
invalid PIDs and invalid owner tokens fail closed; a reused live PID is also
treated as busy. `test-process-lock-guard-prototype.py` tests simultaneous
stale reclaims, invalid owners, and termination of a guard holder; run it with
`PYTHONDONTWRITEBYTECODE=1 python3 .../test-process-lock-guard-prototype.py`.

This is **not production code**. The proof assumes every participant obeys the
same guard protocol, nobody deletes or replaces the guard inode, a single host
uses a filesystem with working advisory flock and hard links, and a process's
PID is meaningful on that host. A legacy process ignores the guard and can
still break the protocol. Do not deploy or claim safety until every existing
legacy lock user naturally exits, all call sites have been migrated together,
and independent review establishes a safe transition. The prototype lacks a
Node interface, the existing `failIfExists` semantics, crash/communication
handling at the Node/Python boundary, output/diagnostic behavior, and tested
support for all deployment platforms. It is not a power-loss durability proof;
an interrupted creation can leave an orphan temporary file, which must not be
mistaken for the owner file. This work did not touch a live lock or claim.
