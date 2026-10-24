import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { computeCurationDrift, parseCurationDriftJson, verifyCurationDrift } from './lib/people-curation-drift.mjs';

test('complete stable diff includes exact subtree values, escapes and array positions', () => {
  const before = JSON.parse('{"z":[1,{"x":true},3],"a/b~c":{"lost":[null,"x"],"same":0},"null":null}');
  const after = JSON.parse('{"null":"value","a/b~c":{"new":{"k":2},"same":0},"z":[1,{"x":false}]}');
  const expected = [
    { op: 'remove', path: '/a~1b~0c/lost', before: [null, 'x'] },
    { op: 'add', path: '/a~1b~0c/new', after: { k: 2 } },
    { op: 'replace', path: '/null', before: null, after: 'value' },
    { op: 'replace', path: '/z/1/x', before: true, after: false },
    { op: 'remove', path: '/z/2', before: 3 },
  ];
  assert.deepEqual(computeCurationDrift(before, after), expected);
  assert.equal(verifyCurationDrift(before, after, expected), true);
  assert.deepEqual(computeCurationDrift({ b: 2, a: 1 }, { a: 1, b: 2 }), []);
  assert.deepEqual(computeCurationDrift({ a: 1 }, ['x']), [{ op: 'replace', path: '', before: { a: 1 }, after: ['x'] }]);
  assert.deepEqual(computeCurationDrift([], ['a', 'b']), [{ op: 'add', path: '/0', after: 'a' }, { op: 'add', path: '/1', after: 'b' }]);
});

test('reject missing, extra, reordered or tampered rows and fields', () => {
  const before = { a: 1, b: null, c: [1, 2] }, after = { a: 2, c: [1, 3], d: null };
  const rows = computeCurationDrift(before, after);
  const attempts = [rows.slice(1), [...rows, rows[0]], [...rows].reverse(),
    rows.map((row, i) => i ? row : { ...row, before: 9 }),
    rows.map((row, i) => i ? row : { ...row, path: '/other' }),
    rows.map((row, i) => i ? row : { ...row, author: 'unreviewed' }),
    rows.map((row, i) => i ? row : { op: row.op, path: row.path, after: row.after }),
    [{ op: 'replace', path: '', before, after }], null];
  for (const attempt of attempts) assert.throws(() => verifyCurationDrift(before, after, attempt));
  assert.throws(() => verifyCurationDrift(before, { ...after, d: 'changed' }, rows));
});

test('reject non-JSON and ambiguous in-memory values', () => {
  const sparse = []; sparse[1] = 'x';
  const extra = [1]; extra.foo = 2;
  const cycle = {}; cycle.self = cycle;
  const shared = {}; const aliases = [shared, shared];
  const getter = {}; Object.defineProperty(getter, 'x', { enumerable: true, get: () => 1 });
  for (const value of [undefined, NaN, Infinity, -0, 1e20, 1n, sparse, extra, cycle, aliases, getter, new Date(), { a: undefined }]) {
    assert.throws(() => computeCurationDrift(value, null));
    assert.throws(() => verifyCurationDrift(null, null, value));
  }
});

test('CLI is read-only and verifies a raw inventory without granting approval', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-curation-drift-test-'));
  const before = path.join(dir, 'before.json'), after = path.join(dir, 'after.json'), inventory = path.join(dir, 'inventory.json');
  t.after(() => { for (const file of [before, after, inventory]) fs.unlinkSync(file); fs.rmdirSync(dir); });
  fs.writeFileSync(before, '{"a":1}');
  fs.writeFileSync(after, '{"a":2}');
  fs.writeFileSync(inventory, '[{"op":"replace","path":"/a","before":1,"after":2}]');
  const run = () => spawnSync(process.execPath, ['scripts/people-curation-drift.mjs', before, after, '--verify', inventory], { encoding: 'utf8' });
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.kind, 'mechanical-drift-evidence-not-approval');
  assert.equal(output.verifiedSuppliedInventory, true);
  assert.equal(fs.readFileSync(before, 'utf8'), '{"a":1}');
  assert.equal(fs.readFileSync(after, 'utf8'), '{"a":2}');
  fs.writeFileSync(inventory, '[{"op":"replace","path":"/a","before":1,"after":3}]');
  assert.notEqual(run().status, 0);
  fs.writeFileSync(inventory, '[{"op":"replace","op":"add","path":"/a","after":2}]');
  assert.notEqual(run().status, 0);
});

test('preserves dangerous object member names without prototype mutation', () => {
  const before = JSON.parse('{"__proto__":{"x":1},"constructor":null}');
  const after = JSON.parse('{"__proto__":{"x":2},"constructor":null}');
  const rows = computeCurationDrift(before, after);
  assert.deepEqual(rows, [{ op: 'replace', path: '/__proto__/x', before: 1, after: 2 }]);
  assert.equal(verifyCurationDrift(before, after, rows), true);
  assert.equal({}.x, undefined);
});

test('raw parser rejects duplicate members, including escaped equivalent names', () => {
  for (const text of ['{"a":1,"a":2}', '{"a":1,"\\u0061":2}', '[{"x":1,"x":2}]', '{"a":1,}', '1e400', '-0', '9007199254740993', '1e20', '0.10000000000000001', '1e-9999']) {
    assert.throws(() => parseCurationDriftJson(text));
  }
  assert.deepEqual(parseCurationDriftJson(' { "a" : [true, false, null, -1.2e+3, "x\\\"y"] } '), { a: [true, false, null, -1200, 'x"y'] });
  assert.deepEqual(parseCurationDriftJson('{"a":{"x":1},"b":{"x":2}}'), { a: { x: 1 }, b: { x: 2 } });
  assert.equal(parseCurationDriftJson('1.000e-1'), 0.1);
});

test('does not mutate snapshots or share returned subtrees', () => {
  const before = { item: { nested: ['one'] } }, after = { added: { nested: ['two'] } };
  const snapshotBefore = JSON.stringify(before), snapshotAfter = JSON.stringify(after);
  const rows = computeCurationDrift(before, after);
  rows[0].after.nested.push('three');
  assert.equal(JSON.stringify(before), snapshotBefore);
  assert.equal(JSON.stringify(after), snapshotAfter);
});
