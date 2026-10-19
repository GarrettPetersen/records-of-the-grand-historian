# Jinshu 108 retained date repair: revised handoff — incomplete

This note supersedes the **“Proposed implementation, not yet adopted”** section
of `jinshu108-sticky-date-recovery-handoff-20261020-incomplete.md` without
changing that historical note. The supplement implementation already exists on
staging revision `0b40ec5bdcd6859b7eb776f044a468a3c46b3ae3`. Its current
implementation and tests must be assessed at the actual execution revision;
this note does not itself approve or invoke it.

## Independently checked retained evidence

Read-only reconstruction of the local retained state found round 2, repair
index 1, frozen plan `002-46f1c395ad55b4617423` with nine findings, and
retained Cursor agent `bc-0aafa8d5-9ca8-4f06-b78b-7a06e7967d4f` with returned
run `run-08a4bdee-74be-4edc-8970-7d28a9153f23`. The proposed
`jinshu108-gao-zhan-research-supplement-20261020-incomplete.json` binds:

- Job `repair-2-002-46f1c395ad55b4617423-d31cb56612a3`.
- Original source `sha256:d15a364ee7cefa821da0202907743d2a5a8830523c9a1cfd13d158eeeec7f101`
  and extraction `sha256:ad6690b52cc4ef5057a0b0411628c2456bc2fb1ffa5a058f459befc555c26f27`.
- Active repair source `sha256:d15a364ee7cefa821da0202907743d2a5a8830523c9a1cfd13d158eeeec7f101`
  and extraction `sha256:d31cb56612a356f822d219c1a9caa423bd80c7721ef7b827bb01641b7bd66292`.
- Actual blocked artifact bytes `sha256:78015aa4928f8bd719f873ee2852724dbb23e30aa255ba671ebde8b6c1852035`,
  also matching the retained job's artifact hash.

Using the staged worker's `dateWorkerInput` and staged prompt, the full
continuation message reconstructed from current retained evidence was 33,678
UTF-8 bytes, including all nine findings and the supplement, within the
original 65,536-byte ceiling. With the differing dirty local prompt it was
34,288 bytes. Both observations assume the current null validation error and
the local packet builder; the runner must check its **actual complete message**
and packet fingerprints again before sending. This measurement is not a
model invocation, production validation, or date approval.

The research is narrowly scoped: it contests an unsupported Gao Zhan death
upper bound but does not establish a death year or resolve the other findings.
The independent source review and detailed packet check remain in the adjacent
`jinshu108-gao-zhan-supplement-independent-review-20261020-incomplete.md` and
`jinshu108-gao-zhan-supplement-packet-check-20261020-incomplete.md`.

## Safe continuation requirements

Recheck the remote shared queue, stable owner, current process and lease, all
hashes, and execution revision before any resumption. The host's existing
date-workflow lock remains protected by the user's instruction: this note is
not permission to delete, move, reclaim, or bypass it, or to take over a live
lease. Preserve the original blocker, all subsequent blocker artifacts,
retained conversations, frozen plan and recovery state. Continue the retained
conversation first, with the supplement attached to its exact job; an unchanged
blocker is not an approval. Do not substitute a different worker or infer that
every research blocker was an active-hint issue.

Before any future invocation, independently assess the staged implementation and
its offline recovery, byte-ceiling, provenance, blocker preservation, and
reviewer-independence tests. Any resulting repair still needs production
validation and a complete fresh independent date review. The separately
prepared s0090 source correction is not canonical; applying it changes the
sealed fingerprints and requires coordinated new review, not repinning old
approval. Identity and publication gates remain outstanding.
