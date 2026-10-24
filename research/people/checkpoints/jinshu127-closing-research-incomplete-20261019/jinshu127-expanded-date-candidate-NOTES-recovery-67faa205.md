# Jinshu 127 expanded date candidate — artifact only

Prepared by `/root/recovery_review`; **not reviewed, published, or approved**. The candidate starts from the independently reviewed but still uncommitted editorial materialization, not the source and extraction currently recorded on staging. See the earlier `jinshu127-materializer-independent-review-recovery-67faa205.md` for its verification and caveats. No queue, lock, canonical, index, or branch changes were made.

Artifacts are in `jinshu127-expanded-date-work-tRX7ee/`. The SHA-256 byte hashes are:

- `proposal.json`: `af3a68ae67733d4c451acf73558d89e80933ba5cd5ce1509526fb96551e138ba`
- `pre-repair-packet.json`: `96798e081901995ba4143ba56cdc2f11c8a4aba4d2ec33be51c2fb13354865cf`
- `candidate-extraction.json`: `59ed9d7f0738108fb1e587c861382a583ba8bf2e44dc63fc853e06777cd31301`
- `candidate-date-packet.json`: `ac50ab12525ec6c4123ca56c9bce8f6acce550ecaa17f0399e0e2d536c81f645`
- `receipt.json`: `0b4a568be4aea5e5f953e87167816a7dae31795a6237b8b1a1b2057f3b5d8cd8`

The fresh pre-repair date packet has source fingerprint `sha256:14d01bcccbaa64c7b778a8e554138a9b5e12ff7e00b31cc8f7d4805e342ee019` and extraction fingerprint `sha256:5faa4a6641a87da3f8d73d806cc2007a34045d299f2b346239bbecf558ba7abc`. The candidate packet's extraction fingerprint is `sha256:c0ff60c109dab416784e5135583a6227408596249c409192f34367c02890e35b`. These semantic packet hashes differ from the byte hashes above. Existing partial reports concern the **pre-editorial** fingerprints and cannot be silently rebound to these inputs.

The proposal carries the earlier five-change draft, retaining each original `before` row or hint. It additionally removes original packet `claim-337` (p142's living attestation with BC 206–195) and adds an undated `retrospective-reference` naming Lord Xinling as honoree and preserving Sui's recollection of Han Gaozu's grave sacrifice. IDs in the resulting extraction shift after removals; do not use pre-repair claim numbers against the rebuilt packet. The existing p142 hint `BC 275-243` remains unchanged and **research-blocked**, not endorsed or supplemented. Removal of the p139/p140 hints is only a reviewed preliminary proposal; preserve their original values in old reports and extractions and research their provenance, as detailed in the independent five-change review. Also examine neighboring claim 336's range and source wording.

The staged `applyDateRepairProposal` transformer generated the candidate in memory. Production strict compact extraction validation and applied editorial-decision validation passed against a fresh extraction packet; the new date packet was then built from the candidate and materialized source. The validator result was 278 units, 817 candidates, 165 people, 686 mentions, 910 claims, 13 editorial repair rows, and zero alias disposition conflicts. This is a mechanical check, not historical validation or date approval.

The preparation script pinned the editorial source and extraction byte hashes, old proposal, and expanded partial report; it compared five direct harness modules to staging Git blobs. It read the separate merged editorial history (current byte SHA-256 `002ae46183e3d6528c0f8e6908344f2259e291385762863c24cb6cb4f10029a5`) but did not independently pin that file before its validator call; a separate reviewer must recheck it against the reviewed merged history. Transitive imports, the harness runtime, and full external evidence were not pinned by this script. The source input copy in the small isolated artifact directory is not a checkout or a worktree.

Next: independently review the exact seven-change proposal, both packets, evidence and historical hint holds; preserve the prior staged and earlier audited reports; follow live ownership and stale-reference reconciliation. Any eventual candidate publication requires the normal reviewed workflow and a fresh **complete independent** date audit of exact final source/extraction bytes, plus identity and publication gates. A partially checked or mechanically validated candidate is not a completed chapter.
