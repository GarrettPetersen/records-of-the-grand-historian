import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { PINNED_MODULE_PARSER, pinnedModuleDependencies } from './lib/people-pinned-module-parser.mjs';

async function parseWithOpenInput(t, bytes, declaredSize = bytes.length, end = false) {
  const child = spawn(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', PINNED_MODULE_PARSER, String(declaredSize)],
    { stdio: ['pipe', 'pipe', 'pipe'] });
  let out = '', err = '';
  child.stdout.on('data', data => { out += data; });
  child.stderr.on('data', data => { err += data; });
  const done = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.stdin.on('error', reject);
    child.on('close', code => resolve({ code, out, err }));
  });
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM'); });
  child.stdin.write(bytes);
  if (end) child.stdin.end();
  return done;
}

test('parsing completes while stdin remains open, preserves UTF-8, and never evaluates source', { timeout: 5_000 }, async t => {
  const bytes = Buffer.from(`import './甲.mjs';export {x} from './乙.mjs';/*${'史'.repeat(32_000)}*/throw Error('repository code must not execute');`);
  const result = await parseWithOpenInput(t, bytes);
  assert.equal(result.code, 0, result.err);
  assert.deepEqual(JSON.parse(result.out), ['./甲.mjs', './乙.mjs']);
});

test('truncated input fails visibly instead of waiting or parsing partial source', { timeout: 5_000 }, async t => {
  const bytes = Buffer.from("import './a.mjs';");
  const result = await parseWithOpenInput(t, bytes, bytes.length + 1, true);
  assert.notEqual(result.code, 0);
  assert.match(result.err, /Truncated pinned module input/);
});

test('empty modules parse and invalid source or size fails', () => {
  assert.deepEqual(pinnedModuleDependencies(Buffer.alloc(0)), []);
  assert.throws(() => pinnedModuleDependencies(Buffer.from('export ???')), /Command failed/);
  assert.throws(() => pinnedModuleDependencies('not bytes'), /Bounded pinned module bytes/);
});
