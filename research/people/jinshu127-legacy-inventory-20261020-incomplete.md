# Jinshu 127: legacy editorial re-review inventory — incomplete

`scripts/people-legacy-editorial-inventory.mjs` is a read-only preparation
tool. It rebuilds the source packet, runs strict extraction and applied-history
validation, and inventories each retained review decision and claim action with
the production JSON-hash convention and exact input byte hashes. It writes only
to standard output and always labels its result `NOT_APPROVED`. It does not
verify source-witness conclusions, reviewer independence, or publication
readiness, and does not alter the combined-curation verifier.

For staging revision `b6258cea3d4861fdd56439215479a5ca7048073f`, invoke:

```sh
node scripts/people-legacy-editorial-inventory.mjs --source data/jinshu/127.json --extraction data/people/extractions/jinshu/127.json --history data/people/editorial-decisions/jinshu/127.json
```

The source, extraction, and history byte hashes are, respectively,
`1b0ed1664bdf27f77ff5a9f1cb635d82e2dd9772f5ede7d3c18e0ed558b93f99`,
`e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`, and
`5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e`.
The single legacy component has 11 decisions, one claim retraction, and two
claim revisions; its recorded reviewer agent and run IDs are null. The tool
preserves that fact and does not invent provenance.

Six offline tests passed locally. An independent test using staging scripts
and reference files also passed all six, then compared every action, proposal,
and normalized component hash against production `documentHash` on real
Jinshu 127 schema-v3 and Jinshu 037 schema-v4 histories. The temporary
scripts-only snapshot was removed; the existing local dependency installation
was used. This is not a full-build or publication test.

Use the inventory to prepare a genuinely independent, source-witnessed review
of all actions and current effects. Such a review still needs a separately
implemented, tested and independently reviewed sealed-attestation contract;
the current publisher intentionally rejects the anonymous legacy reviewer.
Known issues in prior decisions, full editorial coverage, fresh independent
date and identity reviews, and all publication gates remain open. Preserve
all existing history, claims, locks and recovery artifacts.
