import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { writeIdentityDossierStore, readIdentityDossierStore } from './lib/people-identity-dossier-store.mjs';
const revision = '1'.repeat(40), version = `sha256:${'2'.repeat(64)}`;
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-dossier-test-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, 'generation'); const index = {
    dossiers: new Map([['per_one', { id: 'per_one', version, names: ['One'], localPeople: ['fixture:001:p001'] }]]),
    postings: new Map([['en:one', { ids: ['per_one'], total: 1, fingerprint: version }]]),
    englishUnknownPostings: new Map(), localPersonMap: new Map([['fixture:001:p001', 'per_one']]), memberVersions: new Map([['fixture:001:p001', version]]),
    canonicalByKnownId: new Map([['per_one', 'per_one']]), chapters: new Map([['fixture:001', new Map([['per_one', ['fixture:001:p001']]])]]),
  }; return { root, directory, index };
}
test('persistent dossiers support fingerprinted direct lookup and explicit close', async t => {
  const f = fixture(t), manifest = writeIdentityDossierStore(f.directory, f.index, { revision });
  assert.equal(manifest.dossierCount, 1); assert.equal(manifest.publicationApproval, false);
  const reader = await readIdentityDossierStore(f.directory, new Map()); t.after(() => reader.close());
  assert.deepEqual(reader.dossiers.get('per_one'), f.index.dossiers.get('per_one'));
  assert.deepEqual(reader.chapters.get('fixture:001').get('per_one'), ['fixture:001:p001']);
  assert.equal(reader.dossiers.get('missing'), undefined); reader.close(); assert.throws(() => reader.dossiers.get('per_one'), /closed/);
});
test('an interrupted generation has no usable manifest', async t => {
  const f = fixture(t); fs.mkdirSync(f.directory); fs.writeFileSync(path.join(f.directory, 'dossiers.jsonl'), '{}\n');
  await assert.rejects(readIdentityDossierStore(f.directory, new Map()), /ENOENT/);
});
test('modified dossier bytes fail before evidence can be read', async t => {
  const f = fixture(t); writeIdentityDossierStore(f.directory, f.index, { revision });
  const file = path.join(f.directory, 'dossiers.jsonl'), b = fs.readFileSync(file, 'utf8'); fs.writeFileSync(file, b.replace('One', 'Two'));
  const reader = await readIdentityDossierStore(f.directory, new Map()); t.after(() => reader.close());
  assert.throws(() => reader.dossiers.get('per_one'), /bytes changed/);
});
test('changed registry metadata fails rather than silently rebuilding a different index', async t => {
  const f = fixture(t); writeIdentityDossierStore(f.directory, f.index, { revision });
  const file = path.join(f.directory, 'index.jsonl'); fs.appendFileSync(file, '\n');
  await assert.rejects(readIdentityDossierStore(f.directory, new Map()), /Truncated/);
});
test('an existing immutable generation is never overwritten', t => {
  const f = fixture(t); writeIdentityDossierStore(f.directory, f.index, { revision }); const file = path.join(f.directory, 'manifest.json');
  const before = fs.readFileSync(file); assert.throws(() => writeIdentityDossierStore(f.directory, f.index, { revision }), /EEXIST/);
  assert.deepEqual(fs.readFileSync(file), before);
});
test('oversized evidence fails with its partial generation preserved and unpublished', t => {
  const f = fixture(t); f.index.dossiers.get('per_one').names = ['x'.repeat(17 * 1024 * 1024)];
  assert.throws(() => writeIdentityDossierStore(f.directory, f.index, { revision }), /storage bound/);
  assert.equal(fs.existsSync(path.join(f.directory, 'manifest.json')), false);
  assert.equal(fs.existsSync(path.join(f.directory, 'dossiers.jsonl')), true);
});
