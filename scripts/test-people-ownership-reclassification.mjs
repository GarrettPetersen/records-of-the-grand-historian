import fs from 'node:fs';
import assert from 'node:assert/strict';
import { baselineApi, hash, changedRecords, guardOwnershipDelta, prepareOwnershipPlan } from './lib/people-ownership-plan.mjs';
// Synthetic reviewer artifacts test the guard. They are NOT source approval.
const root = process.cwd(), commit = '30e2e9700c2494e6e7abcefeb53b19c24f7197c1', book = 'jinshu', chapter = '028';
const api = await baselineApi(root, commit), sourceBytes = api.read('data/jinshu/028.json'), beforeBytes = api.read('data/people/extractions/jinshu/028.json');
const candidatePath = 'data/people/generated/independent-identity-recovery/jinshu028-ownership-30e2e9-20261025/candidate.compact.json';
const candidateBytes = fs.readFileSync(candidatePath);
assert.equal(hash(candidateBytes), 'sha256:a0d95a87a9db42ea48f83bcd35faec68406c7453e7ac3b1b8ca53e6d2a435155');
const before = JSON.parse(beforeBytes), candidate = JSON.parse(candidateBytes), clone = x => JSON.parse(JSON.stringify(x)), bytes = x => Buffer.from(JSON.stringify(x));
const packet = api.p.buildPeopleExtractionPacket(book, chapter, { chapterData: JSON.parse(sourceBytes) });
const expandedBefore = api.v.validateCompactPeopleExtraction(before, packet, { strictAliasDispositions: true }).normalized;
const expandedAfter = api.v.validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true }).normalized;
const mappings = changedRecords(expandedBefore, expandedAfter), record = mappings.before.find(r => r.kind === 'mention' && r.value.person === 'jinshu:028:p153' && r.value.unit === 's0373');
assert(record);
const enclosing = packet.preflight.candidates.find(c => c.unit === 's0373');
const row = { before: record, language: 'zh', span: record.value.spans.zh[0], candidate: enclosing,
  beforeDisposition: expandedBefore.candidateDispositions.find(d => d.candidate === enclosing.id), afterDisposition: expandedAfter.candidateDispositions.find(d => d.candidate === enclosing.id),
  sourceQuote: '汝非皇太子', reason: 'The Haixi negative lyric denies this title and does not identify the earlier Yuankang crown prince.' };
const affected = new Set(before.people.filter((p, i) => JSON.stringify(p) !== JSON.stringify(candidate.people[i])).map(p => p[0]));
for (let i = 0; i < before.claims.length; i++) if (JSON.stringify(before.claims[i]) !== JSON.stringify(candidate.claims[i])) affected.add(before.claims[i][0]);
let count = 0;
function check(name, fn) { fn(); console.log(`ok ${++count} ${name}`); }
const guard = (rows = [row], old = expandedBefore, next = expandedAfter, compact = candidate) => guardOwnershipDelta(before, compact, affected, old, next, { packet, reclassifications: rows });
check('real exact candidate preserves 403 people and 1813 accounts with one reviewed non-person replacement', () => { guard(); assert.equal(candidate.people.length, 403); assert.equal(packet.preflight.candidates.length, 1813); assert.equal(expandedBefore.mentions.length - expandedAfter.mentions.length, 1); });
check('silent deletion rejected', () => assert.throws(() => guard([]), /source occurrences/));
check('missing disposition rejected', () => { const next = clone(expandedAfter); next.candidateDispositions = next.candidateDispositions.filter(d => d.candidate !== enclosing.id); assert.throws(() => guard([row], expandedBefore, next), /after non-person disposition/); });
check('forged disposition rejected', () => { const bad = clone(row); bad.afterDisposition.reason = 'not-a-name'; assert.throws(() => guard([bad]), /after non-person disposition/); });
check('unrelated unit rejected', () => { const bad = clone(row); bad.candidate.unit = 's0374'; assert.throws(() => guard([bad]), /Forged reclassification candidate/); });
check('real candidate from unrelated unit rejected', () => { const bad = clone(row); bad.candidate = packet.preflight.candidates.find(c => c.unit !== 's0373' && c.language === 'zh'); assert.throws(() => guard([bad]), /same-unit enclosing candidate/); });
check('forged enclosing span rejected', () => { const bad = clone(row); bad.candidate.startCodePoint = 0; assert.throws(() => guard([bad]), /Forged reclassification candidate/); });
check('forged original span rejected', () => { const bad = clone(row); bad.span.startCodePoint--; assert.throws(() => guard([bad]), /Forged reclassification span/); });
check('forged candidate ID rejected', () => { const bad = clone(row); bad.candidate.id += 'fake'; assert.throws(() => guard([bad]), /Forged reclassification candidate/); });
check('forged original candidate ref rejected', () => { const bad = clone(row); bad.before.value.candidateRefs = [enclosing.id]; assert.throws(() => guard([bad]), /mention contract/); });
check('unaccounted other occurrence rejected', () => { const next = clone(expandedAfter); next.mentions.splice(next.mentions.findIndex(m => m.spans.zh.length > 0 && m.unit.id !== 's0373'), 1); assert.throws(() => guard([row], expandedBefore, next), /source occurrences/); });
check('duplicate reclassification rejected', () => assert.throws(() => guard([row, row]), /Duplicate occurrence/));
const scope = { commit, book, chapter, sourceSha256: hash(sourceBytes), extractionSha256: hash(beforeBytes), candidateSha256: hash(candidateBytes) };
const deltas = clone(api.d.computeCurationDrift(api.d.parseCurationDriftJson(beforeBytes.toString()), api.d.parseCurationDriftJson(candidateBytes.toString())));
const predicates = [...new Set(mappings.before.map(r => r.kind === 'claim' ? r.value.predicate : 'mention'))];
const lineage = predicates.map(predicate => ({ kind: predicate === 'mention' ? 'mention' : 'claim', before: mappings.before.filter(r => (r.kind === 'claim' ? r.value.predicate : 'mention') === predicate).map(r => r.locator), after: mappings.after.filter(r => (r.kind === 'claim' ? r.value.predicate : 'mention') === predicate).map(r => r.locator), reason: 'Synthetic fixture maps the exact preexisting evidence partition; it is not historical approval.' }));
const proposal = { schemaVersion: 1, input: scope, authorId: 'synthetic-test-author', affectedPeople: [...affected], deltas, changedRecords: mappings, lineage, mentionReclassifications: [row] }, proposalBytes = bytes(proposal);
const review = { schemaVersion: 1, input: { ...scope, proposalSha256: hash(proposalBytes) }, reviewerId: 'synthetic-test-reviewer', reviewedAt: '2026-10-25T00:00:00Z', status: 'approved', findings: [], deltas, changedRecords: mappings, lineage, mentionReclassifications: [row],
  deltaChecks: deltas.map(delta => ({ delta, reason: 'Synthetic exact-delta coverage tests the review contract without asserting real source approval.', units: ['s0373'], quotes: ['汝非皇太子'] })),
  evidenceChecks: mappings.after.map(record => { const units = record.kind === 'claim' ? record.value.evidence.map(id => id.split(':').at(-1)) : [record.value.unit]; return { record, reason: 'Synthetic fixture covers each exact evidence unit; independent historical approval remains separate.', units, quotes: units.map(id => packet.units.find(u => u.id === id).zh) }; }) };
const reviewBytes = bytes(review), pins = { sourceSha256: hash(sourceBytes), extractionSha256: hash(beforeBytes), candidateSha256: hash(candidateBytes), proposalSha256: hash(proposalBytes), reviewSha256: hash(reviewBytes) };
const input = { root, commit, book, chapter, candidateBytes, proposalBytes, reviewBytes, pins };
const plan = await prepareOwnershipPlan(input);
check('real-edge synthetic review produces stdout-only extraction-ready plan with exact candidate bytes', () => { assert.equal(plan.status, 'extraction-ready-only'); assert.equal(plan.changes[0].contentBase64, candidateBytes.toString('base64')); assert(!plan.changes.some(c => c.path.includes('date-audit'))); });
const unreviewed = clone(review); delete unreviewed.mentionReclassifications; const unreviewedBytes = bytes(unreviewed);
await assert.rejects(prepareOwnershipPlan({ ...input, reviewBytes: unreviewedBytes, pins: { ...pins, reviewSha256: hash(unreviewedBytes) } }), /exact mention reclassifications/);console.log(`ok ${++count} unreviewed non-person replacement rejected`);
console.log(`${count} V2 focused checks passed; candidate/source bytes unchanged and no canonical writes.`);
