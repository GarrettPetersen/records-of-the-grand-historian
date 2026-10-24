# No-packet recovery provenance — incomplete

Diagnostic evidence only; not a production change or approval of any candidate.
Reproduced against staging `8bfd06b65c815884cf91ba206d3617629e7569d0` with
`jinshu129-compact-provenance-regression-20261020-incomplete.mjs` in a small
isolated scripts-and-fixture snapshot. No canonical source or extraction was
changed. The synthetic edit exists only in memory.

Pinned byte SHA-256 values:

- `data/jinshu/129.json`: `bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800`.
- `data/people/extractions/jinshu/129.json`: `91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8`.
- `jinshu129-compact-provenance-regression-20261020-incomplete.mjs`: `af84ac28068d2b36be579414c0e96fc72d17f8c802f30f102afdd824c11b93b5`.

The regression proves the fingerprint replacement and unchanged candidate ID
on this one exact chapter plus a synthetic English-context edit. The broader
scanner and review-contract observations follow from code inspection; they
are not an end-to-end publication test, a reviewer approval, or evidence that
every other chapter is affected.

## Fingerprints lost on expansion

In `scripts/apply-people-translation-repairs.mjs`, `--reconcile-current` calls
`expandPeopleExtraction(storedExtraction, currentPacket, {allowStaleSurfaces:
true})`, then passes that normalized extraction and current packet to
`reconcileExtractionAfterRepairs` without a previous packet. In
`scripts/lib/people-compact.mjs`, `expandPeopleExtraction` sets the expanded
`input` to **the current `packet.input`**. Its full per-field unit hashes are
not the historical compact input.

The regression starts from byte-pinned Jinshu 129 source and extraction, checks
that the compact input matches the rebuilt original packet, then changes the
context of the English text in s0184 without changing the token `Yi` or its
occurrence. The compact original per-unit digest changes from
`277b55873475f45ffa4159a6` to `62476ee72c8c404c0e0065f9`. The old full English
hash is `sha256:2827133ad8f6df2d1359d3fb71d9900bb7cfb5148490f46b48083e50e2551d25`;
the new and expanded-input English hashes are both
`sha256:7ada738c0e08e1f7025d67f157ed14cfe8a6e235a6f81ecb7ac08d5d32ff7345`.
The candidate ID `jinshu:129:cand_8a551c2a741c2b24` survives and both scanner
versions are 2. Thus comparing the expanded input with the current packet
cannot detect this edit. The pre-expansion compact input must remain separately
available and pinned; do not overwrite historical fingerprints with current
ones or preserve approvals by changing their hashes.

`buildCompactInput` constructs each truncated combined digest from hashes of
Chinese, idiomatic English and literal English. A matching original compact
digest is useful evidence that those exact displayed texts have not changed;
it is not proof that the stored conclusions were correct or that the same
scanner candidates were reviewed.

## Candidate ownership is not recoverable from this digest alone

`scripts/lib/people-candidates.mjs::scanPeopleCandidates` uses chapter-wide
capitalized-name frequency and a glossary-backed proper-noun matcher. A unit
can remain unchanged while another unit changes that frequency, or while
glossary data changes without a scanner-version increment. The compact format
does not pin the full old scanner input, detector metadata or old packet.
Candidate IDs hash unit, language, exact text and occurrence, not context or
detectors. `expandMentions` then attaches *current* candidate IDs to stored
person surfaces using current geometry. These reconstructed refs are not a
record of a prior reviewer explicitly approving those candidate-to-person
relationships. In particular, an unchanged broad person span can still cover
an unrelated place, as Jinshu 129 s0183 demonstrates.

## Minimal safe contract to investigate

For no-packet recovery, preserve the exact original compact bytes and their
unit digests, source fingerprint, scanner version and all retained history.
Build the new packet separately and prepare a read-only per-unit dossier that
enumerates every current candidate and disposition, every stored and proposed
mention span including spans without scanner candidates, all implicated
claims/person records, and all before/after changes or removals. Existing
source text and exact source quotes, ownership identities, byte hashes, and
candidate geometry need to be visible; unknown old scanner data must be marked
unknown, not reconstructed as historical fact.

Require independently authored, explicit, complete decisions for ambiguous
candidate ownership and changed-context mention/claim effects, bound to the
exact dossier and current fingerprints. Existing strictly unchanged compact
content may be retained only under a separately reviewed rule that states what
prior evidence is actually authenticated; do not relabel absent historical
packet evidence as an approval. Fail closed on missing, duplicate, stale,
incomplete or conflicting decisions. Validate before writes; preserve history,
sticky claims, date locks, and downstream audit fingerprints. Fresh date and
identity review remain mandatory after relevant changes.

This is a design boundary, not an implemented contract. Before production,
test scanner/global-frequency and glossary changes, same-ID changed context,
ambiguous and unscanned spans, changed claims, omitted/deleted people, no-packet
recovery, independent authorship, crash/retry, and all production validators.
