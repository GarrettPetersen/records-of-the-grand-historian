// Independent read-only verification of the unpublished date candidate.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { buildDateAuditPacket } from '/tmp/jinshu127-date-workflow.AoG1GpRH/scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '/tmp/jinshu127-date-workflow.AoG1GpRH/scripts/lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from '/tmp/jinshu127-date-workflow.AoG1GpRH/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu127-date-workflow.AoG1GpRH/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions, mergeEditorialDecisionReview } from '/tmp/jinshu127-date-workflow.AoG1GpRH/scripts/lib/people-editorial-decisions.mjs';
const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const dir = path.join(root, 'data/people/generated/jinshu-identity-ref-64521198-20261018');
const work = path.join(dir, 'jinshu127-expanded-date-work-tRX7ee');
const ref = '67faa20531f92381a2b192c72004a2ae043e1763';
const sha = b => createHash('sha256').update(b).digest('hex');
const read = f => fs.readFileSync(f);
const parse = b => JSON.parse(b.toString('utf8'));
const equal = (a, b, message) => { if (!isDeepStrictEqual(a, b)) throw new Error(message); };
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 128 * 1024 * 1024 });
const hashes = {
  'proposal.json': 'af3a68ae67733d4c451acf73558d89e80933ba5cd5ce1509526fb96551e138ba',
  'pre-repair-packet.json': '96798e081901995ba4143ba56cdc2f11c8a4aba4d2ec33be51c2fb13354865cf',
  'candidate-extraction.json': '59ed9d7f0738108fb1e587c861382a583ba8bf2e44dc63fc853e06777cd31301',
  'candidate-date-packet.json': 'ac50ab12525ec6c4123ca56c9bce8f6acce550ecaa17f0399e0e2d536c81f645',
  'receipt.json': '0b4a568be4aea5e5f953e87167816a7dae31795a6237b8b1a1b2057f3b5d8cd8',
};
for (const [file, expected] of Object.entries(hashes)) if (sha(read(path.join(work, file))) !== expected) throw new Error(`Changed artifact: ${file}`);
const sourceBytes = read(path.join(dir, 'jinshu127-s0232-materialized-source-67faa205.json'));
const beforeBytes = read(path.join(dir, 'jinshu127-s0232-materialized-extraction-67faa205.json'));
if (sha(sourceBytes) !== '984b1214a02bf06ba26c25db258a46652f0d17d11cbf56c4d96c01a3a8542d39' || sha(beforeBytes) !== '947b1fd8e41f859f26ef6959fc7580065f42ad3050dc9de645173ed0a1427e1b') throw new Error('Editorial baseline drift');
if (!sourceBytes.equals(read(path.join(work, 'jinshu/127.json')))) throw new Error('Artifact source differs from materialized source');
const historyBytes = read(path.join(dir, 'jinshu127-s0232-editorial-merged-history-disk-audit-67faa205.json'));
if (sha(historyBytes) !== '002ae46183e3d6528c0f8e6908344f2259e291385762863c24cb6cb4f10029a5') throw new Error('Merged editorial history byte drift');
const oldHistory = parse(git('show', `${ref}:data/people/editorial-decisions/jinshu/127.json`));
const review = parse(read(path.join(dir, 'jinshu127-s0232-editorial-independent-decision-disk-audit-67faa205.json')));
const history = parse(historyBytes);
equal(mergeEditorialDecisionReview(oldHistory, review), history, 'Editorial history does not replay');
for (const file of ['scripts/lib/people-date-audit.mjs', 'scripts/lib/people-date-workflow.mjs', 'scripts/build-people-extraction-packet.mjs', 'scripts/validate-people-extraction.mjs', 'scripts/lib/people-editorial-decisions.mjs']) {
  const actual = git('hash-object', path.join('/tmp/jinshu127-date-workflow.AoG1GpRH', file)).toString().trim();
  const expected = git('rev-parse', `${ref}:${file}`).toString().trim();
  if (actual !== expected) throw new Error(`Staging harness drift: ${file}`);
}
const source = parse(sourceBytes), before = parse(beforeBytes), proposal = parse(read(path.join(work, 'proposal.json'))), candidate = parse(read(path.join(work, 'candidate-extraction.json')));
const dateBefore = buildDateAuditPacket('jinshu', '127', { dataDir: work, extraction: before });
const dateAfter = buildDateAuditPacket('jinshu', '127', { dataDir: work, extraction: candidate });
equal(dateBefore, parse(read(path.join(work, 'pre-repair-packet.json'))), 'Pre-repair packet changed');
equal(dateAfter, parse(read(path.join(work, 'candidate-date-packet.json'))), 'Candidate packet changed');
equal(applyDateRepairProposal(before, proposal, dateBefore), candidate, 'Production repair replay differs');
if (proposal.changes.length !== 7) throw new Error('Unexpected proposal change count');
const expected = structuredClone(before);
const row334 = proposal.changes.find(c => c.id === 'claim-334');
const row335 = proposal.changes.find(c => c.id === 'claim-335');
const row337 = proposal.changes.find(c => c.id === 'claim-337');
equal(before.claims[333], row334.before, '334 before row mismatch');
equal(before.claims[334], row335.before, '335 before row mismatch');
equal(before.claims[336], row337.before, '337 before row mismatch');
expected.claims = before.claims.flatMap((row, index) => index === 333 ? [row334.after] : [334, 336].includes(index) ? [] : [row]);
const additions = proposal.changes.filter(c => c.kind === 'add-reception-event');
if (additions.length !== 2 || additions[0].after[0] !== 'p140' || additions[1].after[0] !== 'p142') throw new Error('Unexpected reception additions');
expected.claims.push(...additions.map(c => c.after));
for (const hint of proposal.changes.filter(c => c.kind === 'hints')) {
  const person = expected.people.find(p => p[0] === hint.personId);
  equal(person[4].a, hint.before, 'Hint before mismatch'); person[4].a = hint.after;
}
equal(expected, candidate, 'Unrelated extraction delta');
const p142Before = before.people.find(p => p[0] === 'p142')[4].a;
equal(p142Before, ['BC 275-243'], 'Unexpected research hold hint');
equal(candidate.people.find(p => p[0] === 'p142')[4].a, p142Before, 'p142 research hold changed');
const extractionPacket = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(work, 'jinshu/127.json') });
const validated = validateCompactPeopleExtraction(candidate, extractionPacket, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, validated.normalized);
console.log(JSON.stringify({ status: 'mechanically-verified-not-date-approved', sourceHash: dateAfter.sourceHash, extractionHash: dateAfter.extractionHash,
  oldClaimCount: before.claims.length, newClaimCount: candidate.claims.length,
  mapping: { old334: 334, old335: 'removed', old336: 335, old337: 'removed', old338: 336, additions: [candidate.claims.length - 1, candidate.claims.length] },
  p142Hint: p142Before, stats: validated.stats }));
