import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { constants } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import test from 'node:test';
import { identityInputSeal, identityDossierInputs, peopleDigest, stableJson } from './lib/people-identity-seal.mjs';

const reference = value => `sha256:${crypto.createHash('sha256').update(stableJson(value)).digest('hex')}`;

test('input seals hash exact file bytes with bounded reusable buffers and close failed reads', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-seal-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const dir of ['scripts', 'data/test', 'data/people/extractions', 'data/people/resolutions',
    'data/people/curation', 'data/people/chronology', 'data/people/schema', 'data/people/identity-reviews']) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }
  const files = {
    'scripts/empty.mjs': '', 'root.js': 'export default "史😀";',
    'data/test/001.json': JSON.stringify({ text: 'x'.repeat(65_535) + '史😀' + 'y'.repeat(65_538) }),
    'data/people/extractions/a.json': '{}', 'data/people/identity-reviews/a.json': '{"accepted":true}',
    'data/people/config.json': '{}', 'data/glossary.json': '{}', 'package.json': '{}',
  };
  for (const [file, value] of Object.entries(files)) fs.writeFileSync(path.join(root, file), value);
  const pairs = Object.keys(files).sort().map(file => [file,
    crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]);
  const expected = reference(pairs), dossier = reference(pairs.filter(([file]) => !file.startsWith('data/people/identity-reviews/')));
  const original = { readFileSync: fs.readFileSync, readSync: fs.readSync, closeSync: fs.closeSync };
  const buffers = new Set(); let reads = 0, closed = 0;
  try {
    fs.readFileSync = () => { throw Error('Unbounded whole-file read'); };
    fs.readSync = (fd, buffer, offset, length, position) => {
      assert(length <= 65_536); buffers.add(buffer); reads++;
      // Short reads must not be mistaken for EOF or hash stale tail bytes.
      return original.readSync(fd, buffer, offset, Math.min(length, 4093), position);
    };
    assert.equal(identityInputSeal(root), expected); assert.equal(buffers.size, 1);
    buffers.clear(); assert.equal(identityDossierInputs(root), dossier); assert.equal(buffers.size, 1);
    assert(reads > 32);
    fs.closeSync = fd => { closed++; return original.closeSync(fd); };
    fs.readSync = () => { throw Error('Injected read failure'); };
    assert.throws(() => identityInputSeal(root), /Injected read failure/); assert.equal(closed, 1);
  } finally { Object.assign(fs, original); }
  fs.writeFileSync(path.join(root, 'data/test/001.json'), 'changed');
  assert.notEqual(identityInputSeal(root), expected);
  fs.unlinkSync(path.join(root, 'data/glossary.json'));
  assert.throws(() => identityInputSeal(root), /ENOENT/);
});

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
