# Jinshu 022: correction to retained drift count

This is mechanical evidence, not a source review, date approval, identity
decision, or permission to publish. The original-generation reconciliation
note reported **44** changed fields; its own breakdown (23 + 2 + 21) sums to
**46**. Do not replace or alter that retained note: this addendum corrects its
count while preserving its evidence and review history.

The read-only `scripts/people-curation-drift.mjs` comparison of the original
extraction at Git commit `a20371bc0c5c40fa328cdda3b05802a3625910ee` and the
current local extraction produces **46 replacement rows across 41 claim rows**.
The original bytes hash to
`8bc52f48690ff313a95b7a44d6a130d79e6dae3a58a3999a73382e89f4cf56ae`, and
the current bytes hash to
`303d6e25bf1cf7d9bf3550eb00b7bc78b1c3ab1a01f3f3f11b0bfbb59a550918`.
An independent recursive comparison confirms 23 commemoration-kind changes,
2 reference-kind changes, and 21 reception-type changes. Inputs must be
re-pinned at use; this comparison does not decide whether any change is
historically sound. The original sticky claim, local workflow, and all
independent editorial, identity and date gates remain unchanged.

For another read-only comparison, run the CLI with two JSON file paths:
`node scripts/people-curation-drift.mjs BEFORE.json AFTER.json`. It prints
the inputs' byte hashes and an inventory wrapper. To check a previously saved
inventory, pass `--verify INVENTORY.json`; that file must contain the
`inventory` array, not the whole wrapper. These rows describe differences;
they are **not** a replayable JSON Patch. In particular, do not apply array
removal rows as sequential patch operations. This tool does not verify that
the supplied files are the historically correct snapshots, that a reviewer
is independent, or that the current or final extraction is approved.
