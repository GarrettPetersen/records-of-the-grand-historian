import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { constants } from 'node:buffer';
import test from 'node:test';
import { peopleDigest, stableJson } from './lib/people-identity-seal.mjs';

const reference = value => `sha256:${crypto.createHash('sha256').update(stableJson(value)).digest('hex')}`;

test('incremental identity digest exactly preserves deterministic stableJson bytes', () => {
  const values = [null, true, false, 0, -0, 1e30, 'Chinese 史記 / escaped " \\ \n / emoji 😀 / lone \ud800',
    [], {}, [null, undefined, , 3], { z: undefined, a: NaN, b: Infinity },
    { people: [{ z: ['史記', { role: 'emperor', date: null }], id: 'a' }], localPersonMap: { b: 'a', a: 'a' } }];
  for (const value of values) assert.equal(peopleDigest(value), reference(value));
  assert.equal(peopleDigest({ b: 2, a: 1 }), peopleDigest({ a: 1, b: 2 }));
  assert.notEqual(peopleDigest([1, 2]), peopleDigest([2, 1]));
  assert.notEqual(peopleDigest({ a: 1 }), peopleDigest({ a: 2 }));
  assert.throws(() => peopleDigest(undefined), TypeError);
  assert.throws(() => peopleDigest(1n), TypeError);
});

test('identity digest handles aggregate JSON larger than the V8 maximum string', () => {
  // Only one 1 MiB scalar is retained; references make the aggregate >512 MiB.
  // Independent expected hashing never invokes the serializer under test.
  const scalar = 'x'.repeat(1_048_576);
  const count = Math.ceil(constants.MAX_STRING_LENGTH / (scalar.length + 3)) + 1;
  const values = Array(count).fill(scalar);
  assert.ok(count * (scalar.length + 3) + 1 > constants.MAX_STRING_LENGTH);
  assert.throws(() => stableJson(values), RangeError);
  const expected = crypto.createHash('sha256').update('[');
  const encoded = JSON.stringify(scalar);
  for (let index = 0; index < count; index += 1) {
    if (index) expected.update(',');
    expected.update(encoded);
  }
  expected.update(']');
  assert.equal(peopleDigest(values), `sha256:${expected.digest('hex')}`);
});

test('incremental buffering preserves Unicode and key ordering across flushes', () => {
  const record = Object.fromEntries(Array.from({ length: 12_000 }, (_, index) =>
    [`key${12_000 - index}史`, { label: '😀史\ud800', value: index, empty: [] }]));
  assert.equal(peopleDigest(record), reference(record));
});
