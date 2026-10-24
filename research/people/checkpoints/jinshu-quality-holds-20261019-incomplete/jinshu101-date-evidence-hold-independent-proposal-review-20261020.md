# Jinshu 101 research-hold proposal: independent verification

This focused verification is not a complete audit or publication authorization.
Reviewer: separate Codex conversation `/root/provenance127`.

## Exact evidence and result

- Proposed report `jinshu101-date-evidence-hold-1da4e6a/report-proposal.json`:
  SHA-256 `51ce6422288d3f0694533c190c3832479f3d3802e70325e05f5a39a580c4a362`.
- Saved packet `jinshu101-date-evidence-hold-1da4e6a/packet.json`:
  SHA-256 `431ea2220376c5a21e366012ba3a40c0f75db43ad73a30c3cfae0cc6c78410c5`.
- Generator `build-jinshu101-date-evidence-hold-1da4e6a.mjs` names exact staging
  commit `1da4e6a2ca9df03d780ab18762e43e5e50b787a2`, byte-pins source,
  extraction, and old report, and refuses to overwrite different research
  artifacts. It does not call the audit recorder. It imports the **working**
  validator, not staging code, so generator validation alone is not proof of
  the behavior of the staged validator.

Separately, without running the generator or recording anything, I loaded the
date-audit, date-value and reception modules from the exact staging revision
in memory, using the byte-identical working `people-content.mjs`. The units,
people, items and both hashes reconstructed from the staged source/extraction
match the saved packet exactly. The staged `validateDateAuditReport` accepted
this exact proposal with status `research-blocked`, and its source/extraction
hashes match the current staged inputs:
`sha256:36504ddac4e4d3159b34f437c4790d0531c6a6df44b26dfd7a1e2b0a316e75b6` and
`sha256:ed366dd5d21d5675b6459e5be6622c239ba93116d29f0027320af7e85bb742a0`.

The three checked IDs and values agree with the staged extraction; the stated
prior support citation is exactly s0001 `劉元海（子和） 劉宣` for each. The
proposal correctly identifies why those citations do not establish the named
people or date endpoints; its current-source quotations occur in the named
units. The three findings request evidence or normal reviewed repair and a
fresh complete audit. They neither assert that the three dates are false nor
claim complete chapter coverage. The empty person-check array is consistent
with this expressly partial, unapproved status.

The declared reviewer `/root/near_complete_jinshu` is a separate actual Codex
agent conversation which reported preparing this proposal. The extraction's
six recorded chunk agent IDs are `grokbot-24`, distinct from that reviewer;
the extraction's top-level agent ID is null. The generator's string inequality
check is not, by itself, proof of identity or independence; this verification
does not infer unknown historical conversation IDs.

## Before any host-controlled record

The existing Jinshu 101 sticky workflow and its 139 returned jobs remain
separate and must not be taken over or discarded. Recheck live queue, lock and
process ownership immediately before any write; revalidate exact current
source, extraction, prior report and proposal bytes, and ensure no newer
report is overwritten. The recorder archives the previous report and then
replaces the live report in separate atomic writes, not one transaction. Normal
catalog/progress/ebook gates must be regenerated from the resulting revision;
this research proposal alone does not alter them. No canonical report, source,
extraction, queue, claim, or lock was changed by this verification.
