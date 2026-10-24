# Jinshu 109 partial date report: noncanonical recovery artifact

The adjacent `jinshu109-partial-date-audit-candidate-incomplete-20261019.json`
is an independently authored, partial source-evidence report, **not** an
installed audit, a complete review, a repair or a chapter approval. Its raw
SHA-256 is `72c1cff75c3e8e4c815258c86e706a575df8c1a7ed88f45e364f06d36a63c9b2`.
The author `/root/disposition_guard` is not among the six recorded extractor
chunk agent IDs. Machine-checked identity strings are not proof of reviewer
independence or historical correctness; preserve the actual reviewer context.
The report's three `incorrect` verdicts concern **source-date attribution**,
not a claim that AD 317 is historically impossible. The hint is unresolved.
Its four reviewed units do not represent whole-chapter coverage.

The packet was reconstructed in memory from staging commit
`086df682bb5a31498f0deb403b3f07496256e637`, with source byte SHA-256
`aa15f4935b0154841972a9b61f6ecfbaee031bf3db500c5cf6888bc47a71f888`
and compact extraction byte SHA-256
`e42c9e04d3b850076f96dc1c94721f2ad71cc819bc27cdb21187f55e84135c97`.
The recorded report fingerprints are the date-packet algorithm's source-unit
and extraction semantic hashes, not these raw-byte hashes. The existing
staging-pinned `validateDateAuditReport` accepted the retained candidate
against the reconstructed packet. Four negative controls—stale source hash,
relabeling this partial as `audited`, an invented source quotation, and
removing required findings—were all rejected. Validation is structural and
does not verify historical interpretation, reviewer independence or workflow
ownership. No full build or checkout was needed.

The two independent source notes already on staging are
`research/people/jinshu109-staging-date-evidence-triage-incomplete-20261020.md`
and `research/people/jinshu109-independent-date-review.md`. The latter also
distinguishes claim 130 (cites both units) from claims 61, 62, and 136 (cite
s0006 alone). Do not silently extend this targeted finding to other claims.

## Publication is not yet safe

- At observation, the shared queue ref was
  `4aca09929f40d88b55271e75e780d6423d494b2c`; it had no 109 extraction or
  date claim. That observation is not a lock and does not exclude a new claim
  or another host. Preserve all existing owners, jobs and leases.
- The shared checkout has no `data/people/date-audits/jinshu/109.json` even
  though staging contains the old report, raw SHA-256
  `0fb2dcc5bf9462a5e9c3fb2864c29905051a1ffc2769274883e5ad5ef7c04808`.
  Running the ordinary recorder in this checkout would not archive that staged
  report. Do not install the candidate by calling it here.
- For these exact old bytes, `recordDateAudit`'s pretty JSON reserialization
  happens to be byte-identical. Its content-derived history filename would be
  `data/people/date-audit-history/jinshu/109/f2aaf1154c6efd1eaf384fb3be09a29f169b143bf2d07f65ea76f206920e84cc.json`.
  Independently verify exact bytes and absence of a conflicting history file
  before any future host-controlled publication; do not overwrite a different
  existing artifact. The shared checkout is not the staged snapshot.
- The local date-runner lock records PID 32459, Jinshu 006 `--recover-only`;
  `kill(pid, 0)` returned ESRCH at inspection. That does not establish remote
  quiescence. The lock was not modified. The stock lock acquisition helper
  automatically unlinks a dead-owner lock, so do not invoke it while the
  instruction to preserve locks remains in force.
- The standalone recorder has no queue lease or local runner-lock enforcement;
  the runner's report-fingerprint check is a local check-before-write, not a
  cross-host atomic report compare-and-swap. A one-time empty-queue check or
  non-force Git push alone cannot rule out a later stale writer. Before any
  publication, either coordinate quiescence of every writer or implement and
  test a shared lease plus report-generation CAS honored by all writers.
  Freshly check source, extraction, prior report, retained workflow state and
  live ownership; preserve the old report byte-for-byte and archive it in the
  same owner-controlled staging checkpoint. Do not take over a live lease or
  remove a sticky reservation. If these conditions cannot be established,
  retain this candidate without changing the active report.

Even if installed, the partial report cannot approve or complete the chapter.
After source-specific repair, a different reviewer must perform a complete
fresh audit on the new fingerprints; editorial, identity, backlink, search,
ebook and publication/CI gates remain outstanding.
