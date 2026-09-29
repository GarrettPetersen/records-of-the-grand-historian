#!/usr/bin/env node
// Read-only, deterministic verifier for the exact sealed JWD117 second candidate.
import fs from 'node:fs';
import { buildDateAuditPacket, dateAuditDiagnostics } from './lib/people-date-audit.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { sha256 } from './lib/people-content.mjs';

const book = 'jiuwudaishi';
const chapter = '117';
const handoffPath = 'data/people/date-repairs/jiuwudaishi/117/staged-candidate-53cf95a54325e3b2188c.json';
const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
const canonical = JSON.parse(fs.readFileSync(`data/people/extractions/${book}/${chapter}.json`, 'utf8'));
const packet = buildDateAuditPacket(book, chapter);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (handoff.kind !== 'date-repair-candidate-handoff' || handoff.book !== book || handoff.chapter !== chapter) throw new Error('Unexpected candidate handoff scope');
if (handoff.canonicalSourceHash !== packet.sourceHash || handoff.canonicalExtractionHash !== packet.extractionHash) throw new Error('Canonical source or extraction pin is stale');
if (!same(handoff.proposal?.sourceHash, packet.sourceHash) || !same(handoff.proposal?.extractionHash, packet.extractionHash)) throw new Error('Proposal pins do not match canonical packet');
if (sha256(JSON.stringify(handoff.proposal)) !== handoff.sealedCandidateHash) throw new Error('Sealed proposal hash mismatch');
const replay = structuredClone(canonical);
for (const change of handoff.proposal.changes) {
  if (change.kind === 'hints') {
    const person = replay.people.find(row => row[0] === change.personId);
    if (!person || !same(person[4]?.a ?? [], change.before)) throw new Error(`Stale hint operation for ${change.personId}`);
    person[4] = { ...person[4], a: change.after };
    continue;
  }
  if (change.kind !== 'replace' || !/^claim-[1-9]\d*$/.test(change.id)) throw new Error(`Unsupported operation ${change.kind}`);
  const index = Number(change.id.slice(6)) - 1;
  if (!same(replay.claims[index], change.before)) throw new Error(`Stale claim operation ${change.id}`);
  replay.claims[index] = change.after;
}
if (!same(replay, handoff.candidate)) throw new Error('Replay candidate differs from sealed handoff bytes');
if (sha256(JSON.stringify(replay)) !== handoff.candidateExtractionHash) throw new Error('Candidate extraction hash mismatch');
validateCompactPeopleExtraction(replay, buildPeopleExtractionPacket(book, chapter));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: replay });
if (dateAuditDiagnostics(candidatePacket).length) throw new Error('Candidate has temporal geometry diagnostics');
console.log(JSON.stringify({ handoff: handoffPath, sourceHash: packet.sourceHash, canonicalExtractionHash: packet.extractionHash, sealedCandidateHash: handoff.sealedCandidateHash, candidateExtractionHash: handoff.candidateExtractionHash, operations: handoff.proposal.changes.length, compactValidator: 'PASS', replay: 'PASS', geometry: 'PASS' }, null, 2));
