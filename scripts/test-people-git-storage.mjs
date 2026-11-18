import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { compactPeopleGitStorage, inspectPeopleGitStorage } from './lib/people-git-storage.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'people-git-storage-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (args, input) => execFileSync('git', args, { cwd: root, input, encoding: 'utf8' }).trim();
  git(['init', '-q']); git(['config', 'user.name', 'Fixture']); git(['config', 'user.email', 'fixture@example.invalid']);
  fs.writeFileSync(path.join(root, 'source'), 'source'); git(['add', 'source']); git(['commit', '-qm', 'source']);
  const unreachable = git(['hash-object', '-w', '--stdin'], 'unreferenced recovery evidence');
  const head = git(['rev-parse', 'HEAD']);
  return { root, git, unreachable, head, receipt: path.join(root, 'receipt.json') };
}
test('compaction retains reachable AND unreachable objects, refs, index and dirty work', t => {
  const f = fixture(t); fs.writeFileSync(path.join(f.root, 'source'), 'unfinished work');
  const before = inspectPeopleGitStorage(f.root).files.map(r => r.oid).sort();
  const index = fs.readFileSync(path.join(f.root, '.git/index'));
  const r = compactPeopleGitStorage({ ...f, apply: true });
  assert.equal(r.applied, true); assert.equal(inspectPeopleGitStorage(f.root).files.length, 0);
  for (const oid of before) f.git(['cat-file', '-e', oid]);
  assert.equal(f.git(['cat-file', '-p', f.unreachable]), 'unreferenced recovery evidence');
  assert.equal(f.git(['rev-parse', 'HEAD']), f.head);
  assert.deepEqual(fs.readFileSync(path.join(f.root, '.git/index')), index);
  assert.equal(fs.readFileSync(path.join(f.root, 'source'), 'utf8'), 'unfinished work');
  assert.equal(JSON.parse(fs.readFileSync(f.receipt)).status, 'complete');
});
test('preview is read-only; active Git locks refuse mutation', t => {
  const f = fixture(t), before = inspectPeopleGitStorage(f.root).files.length;
  assert.equal(compactPeopleGitStorage(f).applied, false);
  assert.equal(fs.existsSync(f.receipt), false);
  fs.writeFileSync(path.join(f.root, '.git/index.lock'), 'active');
  assert.throws(() => compactPeopleGitStorage({ ...f, apply: true }), /active Git/);
  assert.equal(inspectPeopleGitStorage(f.root).files.length, before);
});
test('corrupt objects never authorize loose deletion', t => {
  const f = fixture(t), p = path.join(f.root, '.git/objects', f.unreachable.slice(0, 2), f.unreachable.slice(2));
  fs.chmodSync(p, 0o600); fs.writeFileSync(p, 'corrupt');
  assert.throws(() => compactPeopleGitStorage({ ...f, apply: true }), /failed|Unverifiable Git object size/);
  assert.equal(fs.existsSync(p), true);
  assert.equal(fs.existsSync(path.join(f.root, '.git/people-storage-compaction.lock')), false);
});
test('a completed preserved pack can be verified and adopted without recompression after an index-cache refresh', t => {
  const f = fixture(t), inventory = inspectPeopleGitStorage(f.root);
  const packed = f.git(['pack-objects', path.join(f.root, '.git/objects/pack/pack')], inventory.files.map(r => r.oid).join('\n') + '\n');
  const resumeReceipt = path.join(f.root, 'prior-receipt.json');
  fs.writeFileSync(resumeReceipt, JSON.stringify({kind:'lossless-loose-git-compaction',selected:inventory.files,
    selectedAllocatedBytes:inventory.looseBytes,status:'verified-before-loose-removal'}));
  const source = path.join(f.root, 'source'); fs.utimesSync(source, new Date(), new Date()); f.git(['status', '--porcelain']);
  const loose = path.join(f.root, '.git/objects', f.unreachable.slice(0, 2), f.unreachable.slice(2));
  fs.utimesSync(loose, new Date(), new Date());
  const result = compactPeopleGitStorage({ ...f, apply: true, resumeReceipt, existingPack: packed });
  assert.equal(result.packHash, packed); assert.equal(result.applied, true);
  assert.equal(f.git(['cat-file', '-p', f.unreachable]), 'unreferenced recovery evidence');
});
test('a verified pack cannot hide corrupt freshly modified loose bytes', t => {
  const f = fixture(t), inventory = inspectPeopleGitStorage(f.root);
  const packed = f.git(['pack-objects', path.join(f.root, '.git/objects/pack/pack')], inventory.files.map(r => r.oid).join('\n') + '\n');
  const resumeReceipt = path.join(f.root, 'prior-receipt.json');
  fs.writeFileSync(resumeReceipt, JSON.stringify({kind:'lossless-loose-git-compaction',selected:inventory.files,
    selectedAllocatedBytes:inventory.looseBytes,status:'verified-before-loose-removal'}));
  const loose = path.join(f.root, '.git/objects', f.unreachable.slice(0, 2), f.unreachable.slice(2));
  fs.chmodSync(loose,0o600);fs.writeFileSync(loose,'corrupt representation');
  assert.throws(()=>compactPeopleGitStorage({...f,apply:true,resumeReceipt,existingPack:packed}));
  for(const row of inventory.files)assert.equal(fs.existsSync(row.file),true);
});
test('an incomplete preserved pack never authorizes deletion of another object', t => {
  const f = fixture(t), inventory = inspectPeopleGitStorage(f.root);
  const packed = f.git(['pack-objects', path.join(f.root, '.git/objects/pack/pack')], f.unreachable + '\n');
  const resumeReceipt = path.join(f.root, 'prior-receipt.json');
  fs.writeFileSync(resumeReceipt, JSON.stringify({kind:'lossless-loose-git-compaction',selected:inventory.files,
    selectedAllocatedBytes:inventory.looseBytes,status:'verified-before-loose-removal'}));
  assert.throws(() => compactPeopleGitStorage({ ...f, apply: true, resumeReceipt, existingPack: packed }), /preserve every/);
  for(const row of inventory.files) assert.equal(fs.existsSync(row.file), true);
});
test('redirected object directories and excessive batch sizes fail closed', t => {
  const f = fixture(t), objects = path.join(f.root, '.git/objects');
  const prefix = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))
    .find(name => !fs.existsSync(path.join(objects, name)));
  assert.notEqual(prefix, undefined, 'fixture needs an unused loose-object directory');
  const directory = path.join(objects, prefix);
  fs.mkdirSync(path.join(f.root, 'outside')); fs.symlinkSync(path.join(f.root, 'outside'), directory);
  assert.throws(() => inspectPeopleGitStorage(f.root), /Redirected/);
  assert.throws(() => compactPeopleGitStorage({ ...f, maxInputBytes: 4 * 1024 ** 3 }), /at most/);
});
