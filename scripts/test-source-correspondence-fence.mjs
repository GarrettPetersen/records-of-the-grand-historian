import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { acquireProcessRunLock } from './lib/process-run-lock.mjs';
import { runSourceCorrespondence } from './apply-source-correspondence.mjs';

test('source correspondence respects the combined-curation lock and preserves its edit behavior', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-fence-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lock = path.join(root, 'data/people/generated/date-workflow-run.lock');
  const source = path.join(root, 'chapter.json');
  const queue = path.join(root, 'queue.json');
  fs.writeFileSync(source, JSON.stringify({ meta: {}, content: [{ type: 'paragraph', sentences: [{
    id: 's0001', zh: '甲。', translations: [{ lang: 'en', literal: 'A.', idiomatic: 'A.' }],
  }] }] }));
  fs.writeFileSync(queue, JSON.stringify({ items: [{ id: 'item1', file: source, status: 'approved',
    type: 'source_replacement_candidate', localRange: { ids: ['s0001'], text: '甲。' },
    sourceRange: { text: '乙。' }, manualTranslations: [{ zh: '乙。', literal: 'B.', idiomatic: 'B.' }],
  }] }));
  const beforeSource = fs.readFileSync(source);
  const beforeQueue = fs.readFileSync(queue);
  const unlock = acquireProcessRunLock(lock, { label: 'Fixture lock' });
  try {
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import { runSourceCorrespondence } from ${JSON.stringify(new URL('./apply-source-correspondence.mjs', import.meta.url).href)};
      runSourceCorrespondence(['--queue', ${JSON.stringify(queue)}], { root: ${JSON.stringify(root)} });
    `], { encoding: 'utf8' });
    assert.notEqual(child.status, 0);
    assert.match(child.stderr, /run lock already exists/);
    assert.throws(() => runSourceCorrespondence(['--queue', queue], { root }), /run lock already exists/);
    assert.deepEqual(fs.readFileSync(source), beforeSource);
    assert.deepEqual(fs.readFileSync(queue), beforeQueue);
    runSourceCorrespondence(['--queue', queue, '--dry-run'], { root });
    assert.deepEqual(fs.readFileSync(source), beforeSource);
    assert.deepEqual(fs.readFileSync(queue), beforeQueue);
  } finally { unlock(); }
  runSourceCorrespondence(['--queue', queue], { root });
  const after = JSON.parse(fs.readFileSync(source, 'utf8'));
  assert.equal(after.content[0].sentences[0].zh, '乙。');
  assert.equal(after.content[0].sentences[0].translations[0].idiomatic, 'B.');
  assert.equal(JSON.parse(fs.readFileSync(queue, 'utf8')).items[0].status, 'applied');
  assert.equal(fs.existsSync(lock), false);
});

test('existing unreadable or stale locks are never taken over by fenced writers', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-fence-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lock = path.join(root, 'data/people/generated/date-workflow-run.lock');
  fs.mkdirSync(path.dirname(lock), { recursive: true });
  for (const content of ['not json', JSON.stringify({ pid: 99999999, token: 'stale' })]) {
    fs.writeFileSync(lock, content);
    assert.throws(() => acquireProcessRunLock(lock, { failIfExists: true }), /run lock already exists/);
    assert.equal(fs.readFileSync(lock, 'utf8'), content);
  }
});

test('a source-correspondence error releases only its own lock', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-fence-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lock = path.join(root, 'data/people/generated/date-workflow-run.lock');
  const queue = path.join(root, 'broken-queue.json');
  fs.writeFileSync(queue, '{');
  assert.throws(() => runSourceCorrespondence(['--queue', queue], { root }), SyntaxError);
  assert.equal(fs.readFileSync(queue, 'utf8'), '{');
  assert.equal(fs.existsSync(lock), false);
});
