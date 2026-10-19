# Jinshu 127 retained provenance chain — incomplete research manifest

Read-only inspection of staging `7769c3540e6ff4587077284f1b1c309bb222978d`
and queue `4aca09929f40d88b55271e75e780d6423d494b2c`. This manifest is not
an approval. All paths below are relative to this manifest's directory; all
hashes are SHA-256 of exact file bytes, not semantic packet fingerprints.
“Missing” means absent from the staging checkpoint, not absent locally. Preserve
the ignored files and recheck hashes and ownership before checkpointing or use.

## Starting point and editorial s0232

Staging `67faa20531f92381a2b192c72004a2ae043e1763` source/extraction/editorial
history byte hashes were respectively `ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a`,
`e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`,
`5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e`.
The older 11-decision reviewer has null agent/run IDs; the seven Grok extraction
chunks also have null agent/run IDs. Metadata suggests distinct lanes but cannot
prove their actual conversation independence or full editorial coverage.

These s0232 files are **missing from the staging research checkpoint**:

| Relative path | Byte SHA-256 | Role |
| --- | --- | --- |
| `jinshu127-s0232-editorial-candidate-67faa205.json` | `58d28332f160f761abc266ee0f4992180d0f5ae2abf33dd406e5203524e211c9` | Two proposed translation repairs on original extraction |
| `jinshu127-s0232-editorial-dossier-67faa205.json` | `be87fb47e5602d09d3036b9244a3ad9a1d526a2e114fd84f9f9fdd43541d1a9d` | Exact independent review dossier |
| `jinshu127-s0232-editorial-independent-decision-disk-audit-67faa205.json` | `9b7e34ed48c2ebc5f91679837d3f3231f4da8e74ffd9bc8f0fa793603d275567` | `/root/disk_audit` accepts exact two repairs |
| `jinshu127-s0232-editorial-receipt-67faa205.json` | `5043fdf272ea2a273c251f5dab7c0d165ca7bfb114f2f44b3682bce3efa3acca` | Source and candidate byte pins; blank seed is not review |
| `jinshu127-s0232-tomb-independent-review-disk-audit-20261019.md` | `7c8c58383097832d849a5cd65f110fdb10d86554514d811ebbac524fb6040921` | Source-backed narrow philology review |
| `jinshu127-s0232-materialized-extraction-67faa205.json` | `947b1fd8e41f859f26ef6959fc7580065f42ad3050dc9de645173ed0a1427e1b` | Output used as seven-change date proposal baseline |
| `jinshu127-s0232-materialized-packet-67faa205.json` | `9dd6c1af9b28167eeb7bed7888ad9ad0860224b799d8e1c4c11fc07a6e29a8e2` | Rebuilt source packet |
| `jinshu127-s0232-materialized-receipt-67faa205.json` | `8592c0a8f0dec8ca1c9d14792316740b6c47f174578f347a35beb914971909e0` | Input/output pin link |
| `materialize-jinshu127-editorial-67faa205.mjs` | `f6ae26502cbf6537df4bcc3687dac7538e9364a81937b37733bc9de1fe916c8f` | Research materializer; not a production transaction |
| `test-materialize-jinshu127-editorial-67faa205.mjs` | `295300ecd99105424ba6cfd4db524362739801e4079f0c86bd03717bd0c72594` | Focused offline tests |
| `jinshu127-materializer-independent-review-recovery-67faa205.md` | `0a3eb183e10293b3353c061eac8bd97ec5a5a73480fb3b7a7583f20e58600f7d` | `/root/recovery_review` separately reviews materialization and limitations |

The staging checkpoint already preserves materialized source byte hash
`984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39`
and merged-history byte hash
`002ae46183e3d6528c0f8e6908344f2259e291385762863c24cb6cb4f10029a5`.
The materializer review documents selected transitive code comparisons, not
permanent pinning of all runtime inputs, a crash-safe publication transaction,
or proof of the old anonymous reviewers' identities.

## Seven-change date draft and s0173 lineage

The seven-change proposal was prepared by `/root/recovery_review` and remains
an unapproved draft. Its exact **missing staging** evidence is:

| Relative path | Byte SHA-256 | Role |
| --- | --- | --- |
| `jinshu127-date-possible-repair-unreviewed-67faa205.json` | `809f420140b1d4c96863cbc6331fdb50fb238f0ebb56b97b9c69cd88f96b97b8` | Earlier five-change proposal |
| `jinshu127-date-five-change-independent-review-disk-audit-67faa205.md` | `729ae802c7b4cdae6e5587155b17e679930ee73cf99a371fd3438072443dd900` | Separate focused source review, with remaining holds |
| `jinshu127-expanded-partial-date-review-disk-audit-67faa205.json` | `8e287356340604c61844cb69626de49ab740cab87c2ad1446263c11409344c68` | Partial needs-revision report; not a full audit |
| `jinshu127-expanded-partial-date-independent-review-recovery-67faa205.md` | `f8d78e5c464be00e570cfef044bb18d09851747632324d841fb1c06e756ec975` | Separate partial-report review |
| `jinshu127-expanded-date-work-tRX7ee/proposal.json` | `af3a68ae67733d4c451acf73558d89e80933ba5cd5ce1509526fb96551e138ba` | Exact seven-change proposal |
| `jinshu127-expanded-date-work-tRX7ee/pre-repair-packet.json` | `96798e081901995ba4143ba56cdc2f11c8a4aba4d2ec33be51c2fb13354865cf` | Packet pinned to materialized s0232 inputs |
| `jinshu127-expanded-date-work-tRX7ee/candidate-extraction.json` | `59ed9d7f0738108fb1e587c861382a583ba8bf2e44dc63fc853e06777cd31301` | Exact candidate feeding callback v1 |
| `jinshu127-expanded-date-work-tRX7ee/candidate-date-packet.json` | `ac50ab12525ec6c4123ca56c9bce8f6acce550ecaa17f0399e0e2d536c81f645` | Rebuilt draft packet, not a review |
| `jinshu127-expanded-date-work-tRX7ee/receipt.json` | `0b4a568be4aea5e5f953e87167816a7dae31795a6237b8b1a1b2057f3b5d8cd8` | Pins original source, extraction, old proposal and partial report |
| `jinshu127-expanded-date-candidate-NOTES-recovery-67faa205.md` | `1d2cf6b8e3dcef8d594088ba5bdfd8a1d189704b08e4ae41ea142f2b80d02614` | Explicit draft and research-hold limitations |
| `check-jinshu127-expanded-date-independent-20261019.mjs` | `70bb366b09d8822347f5511ba8280bded5f465b80d8c301a79c1f22f29ce661d` | Mechanical replay, not historical approval |
| `jinshu127-p142-activity-hint-independent-research-disk-audit-67faa205.md` | `58ac5f0c5df276365c9123a4cbbf83abea194b7952dac8112a866524a014fe7d` | p142 hint research; start of range remains unsupported |
| `jinshu127-gaozu-callback-claim336-independent-disk-audit-67faa205.md` | `eec98d4555f662646034db353125487eb13d39626628afb0fa605f9af4a3e50a` | Distinct claim-336 and callback review |

The retained five-change review does not approve all seven changes; claim-336
and p142 hint remain separate research holds. Preserve prior dates as historical
evidence and independently review the exact seven-change draft and final
relative claim mapping. The p142 `BC 275-243` hint remains in that draft;
source support for the first endpoint was not found.

Callback v1 and v2–v4 candidates and focused reviews below are missing from
staging. Their scripts pin the preceding version; v5 and its narrow review are
already checkpointed. None of the focused reviews is whole-chapter approval.

| Candidate (relative path suffix after `jinshu127-s0173-`) | Candidate SHA-256 | Independent focused review SHA-256 |
| --- | --- | --- |
| `callback-candidate-20261019.json` | `19ee571d38886443c1ef5f4b8419e046b09b6aa251b89f2ef33500d241ebe349` | `5710af8dc6f00811f6a4c026ba45207c2fea98229124dd9979f754b456ab7172` (`callback-independent-review-disk-audit-20261019.md`; held kind and coverage) |
| `conservative-v2-candidate-20261019.json` | `f83dc71084efd3e1b1478ac23f1830d5b833a9aa617aeb24755f16c3e5a48b01` | `ee73aa84f534ad85d6602898a6ed35d94d9a58b1e96ff59a3469ba6b732db3cf` (`conservative-v2-independent-disk-audit-20261019.md`; held actor certainty) |
| `conservative-v3-candidate-20261019.json` | `6e0cf33fee3e56f36f303fa0d563e4f988107966774f55ada37aee7df67e1d87` | `5606091e4c21f74f4a07db9057bcfa10c70e00e3a38e930afc624720e90124e6` (`conservative-v3-independent-disk-audit-20261019.md`; held missing inference) |
| `conservative-v4-candidate-20261019.json` | `77de45d2e8fd7a2c0695f337df3904319b4fc02820c4da7ed31e3a6705a50f40` | `efc0cabc7bed8143fadbcd2cb3e58866270cd2ca8f977b8c1b87f119051a357f` (`conservative-v4-independent-disk-audit-20261019.md`; held reciprocal hints) |

The checkpointed v5 candidate is
`44f98126487a079ee1776a9b76eb5f6ebfd04427ef731b38b3c6096b44e79a99`;
its focused v5 review is
`ff9ce3ad5ae0a85f88663d57fa5c8953fe368f656ee2e9d5a3a0f3e39abed617`.
The separately reviewed closing decisions and materialized final draft are also
checkpointed, but they inherit all unresolved prior limitations.

## Shortest safe next path

1. Host verify and checkpoint the exact missing evidence, including proposal,
   decisions, packets and v1–v4 history; include associated scripts/tests if
   replayability is needed. Do not promote research artifacts as approvals.
2. Recover genuine original review provenance or independently review the
   complete final chapter and earlier decisions; separately review the seven
   date changes, claim-336 and p142 hint and reconcile all exact IDs.
3. Coordinate final source/extraction and any remaining corrections before
   sealing a new date packet; rebuild and strictly validate using the intended
   current production dependencies. Recheck queue, live workers, ownership,
   prior reports, stale identities and the publication/recovery mechanism.
   The combined publisher cannot be unlocked by fabricating an unfinished
   date claim; the ordinary editorial applier is not a cross-file transaction.
4. Use an independent complete date reviewer on the final source/extraction
   fingerprints and preserve old reports. A packet can be prepared without
   claiming the chapter is audited; unresolved research cannot be labelled
   approved. Identity, backlinks, person pages, search, ebook and release gates
   remain separate.

No canonical files, queue, locks, shared index, branch or model lanes were
changed by this inspection.
