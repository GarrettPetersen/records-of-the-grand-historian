import test from 'node:test';
import assert from 'node:assert/strict';
import { buildResearchView, groupUnmatchedClaims } from './people-claim-review-groups-research.mjs';

const claim = (id, value, evidence = ['s1']) => [id, 'fact', { value }, 'explicit', evidence];
const snapshot = claims => ({ schemaVersion: 2, book: 'jinshu', chapter: '022', claims });
const bytes = value => Buffer.from(JSON.stringify(value));

test('exact unique values survive reordering; edited rows remain grouped for human review', () => {
  const result = groupUnmatchedClaims(snapshot([claim('a', 1), claim('b', 2)]), snapshot([claim('b', 3), claim('a', 1)]));
  assert.deepEqual(result.unchangedUniqueContent, [{ beforeIndex: 0, afterIndex: 1 }]);
  assert.deepEqual(result.groups.map(g => [g.before.map(r => r.index), g.after.map(r => r.index)]), [[[1], [0]]]);
  assert.equal(result.groups[0].before[0].claim[2].value, 2);
  assert.equal(result.groups[0].after[0].claim[2].value, 3);
});

test('duplicates remain unpaired and represented without loss', () => {
  const result = groupUnmatchedClaims(snapshot([claim('a', 1), claim('a', 1)]), snapshot([claim('a', 1)]));
  assert.deepEqual(result.unchangedUniqueContent, []);
  assert.deepEqual(result.groups.map(g => [g.before.length, g.after.length]), [[2, 1]]);
});

test('changed anchor creates one-sided groups; no candidate is silently assigned', () => {
  const result = groupUnmatchedClaims(snapshot([claim('a', 1, ['s1'])]), snapshot([claim('a', 2, ['s2'])]));
  assert.deepEqual(result.groups.map(g => [g.before.length, g.after.length]), [[1, 0], [0, 1]]);
});

test('all many-to-many rows remain visible and no pairing is claimed', () => {
  const result = groupUnmatchedClaims(snapshot([claim('a', 1), claim('a', 2)]), snapshot([claim('a', 3), claim('a', 4)]));
  assert.deepEqual(result.groups.map(g => [g.before.length, g.after.length]), [[2, 2]]);
});

test('malformed claims, duplicate JSON members and invalid bytes fail closed', () => {
  assert.throws(() => groupUnmatchedClaims(snapshot([['a']]), snapshot([])), /unsupported compact claim/);
  const valid = bytes(snapshot([]));
  assert.throws(() => buildResearchView({ retained: Buffer.from('{"claims":[],"claims":[]}'), current: valid, candidate: valid }), /Duplicate JSON member/);
  assert.throws(() => buildResearchView({ retained: Buffer.from([0xff]), current: valid, candidate: valid }));
});

test('all three raw inputs are bound independently and altered bytes change the hash', () => {
  const valid = bytes(snapshot([claim('a', 1)]));
  const altered = Buffer.from(`${valid.toString()} `);
  const view = buildResearchView({ retained: valid, current: altered, candidate: valid });
  assert.notEqual(view.rawSha256.retained, view.rawSha256.current);
  assert.equal(view.rawSha256.retained, view.rawSha256.candidate);
  assert.equal(Object.keys(view.transitions).length, 3);
  assert.match(view.kind, /not-mappings-or-approval/);
});

test('chapter-local IDs cannot be compared across chapter, book or schema generations', () => {
  const valid = snapshot([claim('p001', 1, ['s0001'])]);
  for (const changed of [{chapter:'023'}, {book:'shiji'}, {schemaVersion:3}, {chapter:''}, {book:' jinshu'}, {schemaVersion:null}]) {
    assert.throws(() => groupUnmatchedClaims(valid, {...valid, ...changed}), /required|match exactly/);
  }
  const missing = {...valid}; delete missing.chapter;
  assert.throws(() => groupUnmatchedClaims(valid, missing), /required/);
  assert.throws(() => buildResearchView({retained:bytes(valid), current:bytes({...valid, book:'shiji', chapter:'001'}), candidate:bytes(valid)}), /match exactly/);
});
