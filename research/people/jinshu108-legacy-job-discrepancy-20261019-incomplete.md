# Jinshu 108: retained job discrepancy (incomplete)

This is a read-only, independently checked recovery handoff, not a date
approval or authorization to change the existing claim. Queue revision:
`4aca09929f40d88b55271e75e780d6423d494b2c`. Original worker:
`jinshu-release-dates-cursor-sdk`. Preserve the host lock, sticky claim,
retained conversations, all candidates and rejected artifacts.

The shared claim and local state agree on original source and extraction
fingerprints, but their job maps are not identical: local state contains 73
jobs, versus 25 in the queue at this revision. One shared job has an
especially important status difference:

`repair-1-001-dcf944d8531ef093941c-6e9f904092be` is `rejected` locally but
`returned` in the queue. Both identify the same agent, run and raw artifact
SHA-256 `96b9bdfc04cdb316d3ae438045d4eed4b6f0e92b0b580775e3860bef48f9943a`.
The local validation error reports invalid `receptionType` values at compact
claim indices 282 and 289. The preserved pre-reconciliation candidate contains
`posthumous` at exactly those indices; the later `candidate-1.json` has
`retrospective` there. This supports the rejection against the old candidate;
it does not establish why or when the remote status diverged.

The raw-byte SHA-256 values observed under
`data/people/generated/date-workflow/jinshu/108/` are:

- `state.json`: `7e5276a61f60c482bf32c0b30a0091423de38105626877c07436b7d8d75db152`
- `candidate-1.pre-reception-reconcile-6e9f904092be.json`: `3cdb055af913d75702a292772de0ed9eb7ca373104e36ce58951229183a9548a`
- `candidate-1.json`: `36cae91842100fe86b889c52f7560d197e73c49dc109bcad5bffc06bd5528919`
- `rejected-repair-1-001-dcf944d8531ef093941c-6e9f904092be-9be3da8499c66d525e4022f42c3a0fd326c2265bd2d91a975ac91f23db540a41.json`: `96b9bdfc04cdb316d3ae438045d4eed4b6f0e92b0b580775e3860bef48f9943a`
- `repair-1-001-dcf944d8531ef093941c-612738db5e8f.json`: `1f18866a505959a0b4afa850f136839982e9748ef18da03334ca96c93443e097`

The old candidate's compact semantic extraction fingerprint is
`sha256:6e9f904092beaafb1893438e8d7dff72331f1d2fb4dad6cc629c26cac85b365b`;
the reconciled candidate's is
`sha256:612738db5e8f65c634c87aab628de0ce18ef2b0f4ffe00ee73bd2cace6088d74`.
These semantic fingerprints are not the raw-byte hashes above. The later
round-1 job is separate from the rejected job, and the retained workflow has
since advanced to round-2 repair. Neither the older `returned` status nor
the later output proves a current approval.

Independent conversation `/root/history_reaudit_design` checked the job,
hashes, candidate labels, and later progression. Reconcile local and remote
histories explicitly before any generation migration; never overwrite one
with the other or restart the rejected job merely because the queue says
`returned`. A fresh complete independent date audit remains required.
