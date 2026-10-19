# Jinshu 127 extraction and editorial provenance — incomplete research

Read-only provenance inspection. This is not an approval, proof that the
original reviewers were independent, or a whole-chapter editorial review.
Do not fill unknown IDs from model or worker labels.

## Fingerprinted retained evidence

Hashes are SHA-256 of exact file bytes:

- `data/people/generated/grokbot/grokbot-34/jinshu-127/assignment.json`:
  `7f4deee6c3e6db2106fb4f588e1bd77edfe73905928d2a03f087f2134df18bbf`.
  It identifies lane `grokbot`, worker `grokbot-34`, a chapter branch and seven
  chunk ranges, but no conversation or run ID.
- `data/people/extractions/jinshu/127.json`:
  `e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6`.
  Its declared model is `Grok Bot-chunked`, with seven `Grok Bot` chunks;
  extraction-level and every chunk's `agentId` and `runId` are null. The
  version in commit `deddbe54eaaa8390ed247ae4bf360a9db0528e25` has byte hash
  `9e95aae91f0b9a9112ecbbfc5bad882f61c56cb99d20d3f78dd3d544841cd17d`;
  this hash difference is not a claim that their run metadata differ.
- `data/people/editorial-decisions/jinshu/127.json`:
  `5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e`.
  Its 11 decisions declare `cursor-agent`, name `Codex`, model `GPT-5`, and
  null reviewer `agentId` and `runId`. The file's bytes match that commit.
- `data/people/generated/editorial-review/jinshu/127.json`:
  `1304dd54c264e3acb609f62e50e33e45c02c252bcecc3829a7deebde3ed52a50`.
  This retained dossier is proposal-centered; it is not proof of full-chapter
  coverage.

The commit's timestamp is 2026-09-09 01:26:28 UTC, while the already-present
decision file declares reviewer completion at 01:34:00 UTC, a difference of
7 minutes 32 seconds. This is a metadata discrepancy, not proof of misconduct
or of the true review time; clock or recorded-time error is possible.

## Search scope and later separate review

The local Codex session files dated September 8 and 9 were searched for
`jinshu 127`/`jinshu:127` variants and `grokbot-34`; no matching session was
found. This bounded search does not prove no other conversation existed.
The local remote-tracking queue ref
`4aca09929f40d88b55271e75e780d6423d494b2c` was inspected: it has no current
`jinshu/127` extraction claim or date audit claim. A current queue is not a
complete history of the original work and cannot establish reviewer identity.

[PR #4421](https://github.com/GarrettPetersen/records-of-the-grand-historian/pull/4421),
merged October 6, identifies Cursor background agent
`bc-e7f95d0d-a6c9-41f1-881b-6c59b1e176a4` and describes a whole-chapter
translation review. Its commit `f5718bb7b02689a7f5620eecef73e1512225279d`
changes the source chapter and generated HTML, not the earlier eleven
glossary-decision records. It is later than those decisions and predates the
current reconciled research candidate; its description does not prove the
earlier decision reviewer's identity, the independence of all original
decisions, or approval of the current exact fingerprints.

The separately retained `jinshu127-original-eleven-independent-source-review-20261020-incomplete.md`
reviews those eleven items as research, not as a replacement historical ID or
publication approval. Whole-chapter review and the date, identity, and
publication gates still apply. No claims, locks, canonical files, or recovery
artifacts were modified in this investigation.
