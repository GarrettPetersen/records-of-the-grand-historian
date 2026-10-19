# Jinshu 101 and 127: isolated date-hold release review

Research checkpoint only; not a completed-chapter claim or a CI result.

Reviewed master `e2a3f340d4e53aed243e989e8005007ba42d4f2b` and staging `aa06ee0f51a9ddd77d833468a231bdcf309b515e`. The two staging files are:

| File | Staging Git blob | Status | Source fingerprint | Extraction fingerprint |
| --- | --- | --- | --- | --- |
| `data/people/date-audits/jinshu/101.json` | `d8b21f58ba4d6b74e42b124719c4e8a8fd885102` | `research-blocked` | `sha256:36504ddac4e4d3159b34f437c4790d0531c6a6df44b26dfd7a1e2b0a316e75b6` | `sha256:ed366dd5d21d5675b6459e5be6622c239ba93116d29f0027320af7e85bb742a0` |
| `data/people/date-audits/jinshu/127.json` | `9c783cbb7f870665f9660f6e49450b6dc79dfa2f` | `needs-revision` | `sha256:48f235482a285d91bc99fb19f9e1ad0e602ed183d0dea305e756d084362fda2b` | `sha256:623eb92a46490b4ba9b7bddecf5401f0354bb937f55b8e43c6402bc9d38c1eee` |

I reconstructed both packets in memory from the exact master chapter and extraction Git blobs. The report fingerprints match those packets. The reports pass `validateDateAuditReport` from the exact master `scripts/lib/people-date-audit.mjs`, using master date-value and reception dependencies: 445 items for 101 and 379 for 127. The 101 report has no references; the two 127 references pass their master-source Chinese quote and SHA-256 checks. Master currently stores both reports as `audited`; these holds record partial contradictory review and do not establish corrections or full re-audit.

Master's build runs `compile-people-catalog.mjs`, `test-people-progress.mjs`, `generate-progress.js`, and people-site verification. The catalog records `dateAuditStatus` and counts every status other than `audited` as pending; progress maps non-audited current chapters to `date-review`; its consistency test rejects an unaudited chapter labeled `current` rather than rejecting a hold. The exact master report validator accepts both reports, so no date-status validation failure is expected from the holds themselves. This is a code-path assessment, not proof that the full build passes: the required `master-build` PR workflow runs `npm run build` against the proposed merge, and that check must actually pass. The existing master commit's `master-build` and Cloudflare checks were green when inspected; no proposed PR, full build, or deployment verification was run for these report replacements.

The results establish that an isolated correction is plausible at the pinned master revision, not that it remains safe after either revision changes. Recheck both blob IDs, report fingerprints, reference sources, concurrent ownership, required CI and deployed progress before publication.
