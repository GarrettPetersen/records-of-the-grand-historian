import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildReviewDossier, digest, verifyReview } from './reconciliation-review-contract-20261020-incomplete.mjs';

const mockContext = { rawByteHashes: Object.fromEntries(['source', 'packet', 'extraction', 'editorialHistory'].map((key) => [key, 'a'.repeat(64)])), dependencies: Object.fromEntries(['scanner', 'glossary', 'code'].map((key) => [key, 'b'.repeat(64)])), authors: ['fixture-author'], downstreamReferences: [], editorialHistory: {}, historicalPacketReceipt: 'fixture-only' };
const mockPacket = { input: { fixture: true }, units: [], preflight: { candidates: ['a'] } };
const before = { source: { units: [{ id: 's1', en: 'Yi' }] }, packet: structuredClone(mockPacket), extraction: { mentions: [], dispositions: [{ id: 'a', type: 'polity' }] }, context: structuredClone(mockContext) };
const after = structuredClone(before);
after.source.units[0].en = 'Yi province';
after.extraction.dispositions[0].type = 'place';
after.extraction.mentions.push({ unit: 's1', span: [0, 2] });
after.packet.preflight.candidates.push('b');
const dossier = buildReviewDossier(before, after);
assert.equal(dossier.changes.length, 4);
const report = { version: 1, beforeHash: dossier.beforeHash, afterHash: dossier.afterHash, changesHash: dossier.changesHash, reviewer: 'independent-reviewer', decisions: dossier.changes.map((change) => ({ path: change.path, changeHash: digest(change), decision: 'approve', reason: 'Compared the complete source and extraction.' })) };
const authorizedReport = digest(report);
const originalBefore = digest(before);
const adapters = {
  verifyProvenance: async ({ before: actual }) => digest(actual) === originalBefore,
  verifyReviewer: async ({ report: actual, reportHash }) => actual.reviewer === 'independent-reviewer' && reportHash === authorizedReport,
};
await verifyReview(before, after, report, adapters);
await assert.rejects(() => verifyReview(before, after, report), /adapters/);
await assert.rejects(() => verifyReview(before, after, { ...report, reviewer: 'forged' }, adapters), /authentication/);
await assert.rejects(() => verifyReview(before, after, { ...report, decisions: report.decisions.slice(1) }, adapters), /Incomplete/);
await assert.rejects(() => verifyReview(before, after, { ...report, decisions: [report.decisions[0], ...report.decisions.slice(0, -1)] }, adapters), /duplicate/);
await assert.rejects(() => verifyReview(before, after, { ...report, decisions: report.decisions.map((v, i) => i ? v : { ...v, decision: 'reject' }) }, adapters), /decision/);
await assert.rejects(() => verifyReview(before, after, { ...report, decisions: report.decisions.map((v, i) => i ? v : { ...v, reason: ' ' }) }, adapters), /decision/);
const tampered = structuredClone(after); tampered.extraction.mentions[0].span[1] = 1;
await assert.rejects(() => verifyReview(before, tampered, report, adapters), /exact state/);
await assert.rejects(() => verifyReview(before, after, report, { ...adapters, verifyProvenance: async () => false }), /provenance/);
await assert.rejects(() => verifyReview(before, after, report, { ...adapters, verifyReviewer: async () => 'true' }), /authentication/);
const mutable = structuredClone(after);
await assert.rejects(() => verifyReview(before, mutable, report, { ...adapters, verifyReviewer: async () => { mutable.source.units[0].en = 'corrupted'; return true; } }), /changed during/);
assert.throws(() => buildReviewDossier({ ...before, packet: null }, after), /Missing packet/);
assert.throws(() => buildReviewDossier({ ...before, packet: {} }, after), /Missing packet/);
assert.throws(() => buildReviewDossier({ ...before, context: { ...before.context, historicalPacketReceipt: '' } }, after), /provenance/);
assert.throws(() => buildReviewDossier({ ...before, context: { ...before.context, dependencies: {} } }, after), /dependency/);
assert.throws(() => digest([, 1]), /Sparse/);
assert.throws(() => digest({ invalid: undefined }), /JSON/);
const cycle = {}; cycle.cycle = cycle;
assert.throws(() => digest(cycle), /Cyclic/);
assert.throws(() => digest({ get secret() { return 1; } }), /Non-JSON/);
const hidden = {}; Object.defineProperty(hidden, 'hidden', { value: 1 });
assert.throws(() => digest(hidden), /Non-JSON/);
assert.throws(() => digest({ [Symbol('x')]: 1 }), /Symbol/);
assert.notEqual(digest({ x: null }), digest({}));
const escaped = buildReviewDossier({ source: { 'a/b~c': 1 }, packet: mockPacket, extraction: {}, context: mockContext }, { source: { 'a/b~c': 2 }, packet: mockPacket, extraction: {}, context: mockContext });
assert.equal(escaped.changes[0].path, '/source/a~1b~0c');

// Real research artifacts exercise complete structural differences; this is
// not provenance verification or approval of either chapter candidate.
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const old = read('./jinshu129-final-materialized-20261020-incomplete.json');
const updated = read('./jinshu129-saturn-disposition-candidate-20261020-incomplete.json');
const real = buildReviewDossier({ source: old.source, extraction: old.extraction, packet: mockPacket, context: mockContext }, { source: updated.source, extraction: updated.extraction, packet: mockPacket, context: mockContext });
assert.ok(real.changes.length > 0);
assert.ok(real.changes.some(({ path }) => path.startsWith('/extraction/')));
console.log(`Contract negative controls passed; real candidate structural delta: ${real.changes.length} changes (placeholder packet, no approval).`);
