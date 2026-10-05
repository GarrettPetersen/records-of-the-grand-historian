import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildInputFingerprint } from './lib/people-content.mjs';
import { planGrokBuildChunks } from './grok-build-people-extract.mjs';
import { reservePeopleTargetsInLedger, validatePeopleWorkLedger } from './lib/people-work-queue.mjs';

const units = ['甲', '乙', '丙'].map((zh, index) => ({
  id: `s${String(index + 1).padStart(4, '0')}`, kind: 'paragraph-sentence',
  blockIndex: index, collection: 'sentences', itemIndex: 0,
  zh: `${zh}來。`, en: `Person ${index + 1} came.`, literal: `Person ${index + 1} came.`,
}));
const packet = {
  schemaVersion: 1, book: 'fixture', chapter: '001',
  source: { path: 'data/fixture/001.json', title: { zh: '測試', en: 'Fixture' } },
  input: buildInputFingerprint(units), units,
  preflight: { scannerVersion: 2, candidates: [] },
  context: { westernEraStyle: 'BC_AD', roles: [], polities: [], reigns: [] },
};

test('Grok Build planning keeps bounded, disjoint source ownership', () => {
  const chunks = planGrokBuildChunks(packet, { maxUnits: 1, maxCandidates: 100, maxBytes: 24 * 1024 });
  assert.deepEqual(chunks.map(({ start, end }) => [start, end]), [[0, 1], [1, 2], [2, 3]]);
});

test('Grok Build refuses a single oversized source unit before claiming', () => {
  assert.throws(() => planGrokBuildChunks(packet, { maxUnits: 1, maxCandidates: 100, maxBytes: 1 }),
    /One source unit exceeds/);
});

test('Grok Build has a distinct queue lane and cannot take a Grok Bot claim', () => {
  const target = { book: 'fixture', chapter: '001', chapterFingerprint: packet.input.chapterFingerprint };
  const ledger = { schemaVersion: 1, claims: {} };
  const first = reservePeopleTargetsInLedger(ledger, [target], {
    lane: 'grokbot', worker: 'grokbot-test', limit: 1, sticky: true, now: 1000,
  });
  assert.equal(first.claimed.length, 1);
  assert.equal(reservePeopleTargetsInLedger(ledger, [target], {
    lane: 'grok-build', worker: 'grok-build-test', limit: 1, sticky: true, now: 2000,
  }).claimed.length, 0);
  validatePeopleWorkLedger(ledger);
  const ownLedger = { schemaVersion: 1, claims: {} };
  reservePeopleTargetsInLedger(ownLedger, [target], {
    lane: 'grok-build', worker: 'grok-build-test', limit: 1, sticky: true, now: 1000,
  });
  validatePeopleWorkLedger(ownLedger);
});
