# Independent review of fail-closed prototype (incomplete)

This is a research-only review, not approval to apply or deploy the prototype.
The examined staging revision was `fce861bb48533eeb388dc5573a60000f14167984`.
SHA-256 of the examined prototype patch is
`50c1f47b42a84d14e4db3f525be034f4e7ce27ec9b5bac4899613a4129874ad2`;
the negative-controls script is
`1bfcedaf8e6b7fbb7c214041aeea434da7f7f0c6fa2479a371e50c923ed0163e`;
and the handoff is
`03edf7e64694c885b801dfa64830d88aeb49ba71ea0cb6026a128679de9778d4`.
Tests ran offline in a disposable scripts-and-evidence snapshot, not a corpus
checkout. The patch applied only inside that fixture.

## Reproduced results

- The three negative controls fail against unchanged staging and pass with the
  isolated patch. Staging preserves the prior `Yi` / `polity: Jin` disposition
  after a contextual edit, copies an earlier Xuanyuan asterism disposition to
  a new occurrence, and copies a synthetic Chinese disposition to an English
  candidate based on a shared glossary ID. The prototype leaves all three
  candidate IDs unresolved. Their altered or synthetic contexts require review;
  this result does not prove the new classifications would necessarily be wrong.
- The staging translation-repair applier self-test passes unmodified. The same
  test with the prototype fails immediately with `Fixture left unresolved
  candidates`. The handoff's later 31-candidate fragment result followed an
  additional fixture modification and was not independently reproduced here.
- On the pinned Jinshu 129 extraction, packet and unchanged source, prototype
  reconciliation with the previous packet supplied returns 0 unresolved
  candidates; without a previous packet it returns **453 unresolved**. The
  digest fallback retains qualifying dispositions, but previously attached
  mention candidate references are cleared and the prior candidate map is
  empty. This is conservative rather than silent acceptance, but is a major
  recovery/`--reconcile-current` usability regression that needs an explicit,
  tested contract; do not simply force these candidates to pass.

## Limits and remaining safety work

The two homograph controls construct synthetic candidate arrays instead of
running the scanner on real chapters. In this fixture the Xuanyuan failure is
copying a non-person asterism classification, not a demonstrated person link.
The controls test candidate accounting only: they do not certify unscanned
spans, stale-span remapping, claim changes, person deletion, exact mention
geometry, compact expansion, historical approvals, or publication. The
prototype still runs stale-span/mention and later claim/person mutation paths;
changed-unit evidence and all resulting facts and spans need an independently
reviewable before/after contract. Recheck unresolved accounting after all
mutations, and validate the complete resulting extraction and downstream review
fingerprints.

Without a previous packet, matching unit digests plus a surviving candidate ID
does not independently establish the old candidate's full metadata, scanner
version, or reviewed ownership; this path also needs explicit tests and
provenance requirements. No tests here establish crash safety, concurrency,
historical audit validity, or end-to-end publication. The existing offline
fixtures must be redesigned with source-justified explicit decisions and the
unchanged editorial, date, identity and publication gates retained.
