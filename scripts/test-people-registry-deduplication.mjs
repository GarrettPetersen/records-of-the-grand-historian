import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { deduplicateRegistryPayloads } from './deduplicate-people-registry-payloads.mjs';

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'registry-deduplication-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const hashes = {};
  for (const d of ['first', 'second']) {
    fs.mkdirSync(path.join(root, d));
    for (const name of ['dossiers.jsonl', 'index.jsonl']) {
      const b = Buffer.from(name + ' sealed reviewer evidence'); fs.writeFileSync(path.join(root, d, name), b);
      hashes[name] = { file: name, bytes: b.length, sha256: createHash('sha256').update(b).digest('hex') };
    }
    fs.writeFileSync(path.join(root, d, 'manifest.json'), JSON.stringify({ kind: 'canonical-identity-dossier-store', headers: hashes['dossiers.jsonl'], metadata: hashes['index.jsonl'] }));
  }
  return { root, registries: ['first', 'second'], receipt: path.join(root, 'receipt.json'), apply: true, checkIdle: () => {} };
}
test('identical immutable payloads share storage with exact paths, manifest bytes and evidence retained', t => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.root, 'second/manifest.json'));
  assert.equal(deduplicateRegistryPayloads(f).duplicateFiles, 2);
  for (const name of ['dossiers.jsonl', 'index.jsonl']) {
    assert.equal(fs.statSync(path.join(f.root, 'first', name)).ino, fs.statSync(path.join(f.root, 'second', name)).ino);
    assert.equal(fs.statSync(path.join(f.root, 'first', name)).mode & 0o222, 0);
  }
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'second/manifest.json')), before);
  assert.equal(deduplicateRegistryPayloads({ ...f, apply: false }).duplicateFiles, 0);
});
test('a corrupt or open candidate does not cause any sharing', t => {
  const f = fixture(t), target = path.join(f.root, 'second/index.jsonl');
  assert.throws(() => deduplicateRegistryPayloads({ ...f, checkIdle: () => { throw Error('busy'); } }), /busy/);
  const b = fs.readFileSync(target); b[0] ^= 1; fs.writeFileSync(target, b);
  assert.throws(() => deduplicateRegistryPayloads(f), /corrupt/);
  assert.notEqual(fs.statSync(path.join(f.root, 'first/dossiers.jsonl')).ino, fs.statSync(path.join(f.root, 'second/dossiers.jsonl')).ino);
  assert.equal(fs.existsSync(f.receipt), false);
});
