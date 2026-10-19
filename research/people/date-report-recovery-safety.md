# Date-report recovery safety checkpoint

An isolated review of the date runner at staging `9d298a5` reproduced two
ways an independently amended failed report could be lost: an old approved
publication receipt could overwrite it during `publish` recovery, and a
retained repair could proceed from an earlier review that omitted its
findings. The later tested safeguard holds when retained provenance is
ambiguous, requires the installed report to match the state-linked review or
publication history where applicable, and checks for changes during workflow
publication. The independent four-suite run passed 130 tests; both isolated
overwrite reproductions held without calling a worker or changing the report.

This is an additive, fail-closed safeguard, not an atomic cross-process
compare-and-swap or a completed-generation reconciliation protocol. Only the
host may publish reports, and it must respect existing locks and leases. A
crash after reservation can leave a sticky claim or lease requiring owner-safe
reconciliation. Do not take over or release a claim based on this patch.
In particular, the retained Jinshu 127 generation and its failed report remain
on hold until a separately tested transition preserves all findings, old
generation state, receipts and ownership. Passing these tests does not approve
any chapter or authorize a live worker run.
