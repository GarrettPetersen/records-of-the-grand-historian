import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.JINSHU127_GUARD_TEST_FIXTURE_ROOT ||
    fs.realpathSync(process.env.JINSHU127_GUARD_TEST_FIXTURE_ROOT) !== fs.realpathSync(root)) {
  throw new Error('Set JINSHU127_GUARD_TEST_FIXTURE_ROOT to the isolated script-only fixture; never run this test in a shared checkout');
}
const source = path.join(root, 'data/people/extractions/jinshu/127.json');
const digest = data => createHash('sha256').update(data).digest('hex');
if (digest(fs.readFileSync(source)) !== 'cfff7a83582f27778d3088391e2c2633f63c43dbb9888850877464661fd7f6e7' ||
    digest(fs.readFileSync(path.join(root, 'data/jinshu/127.json'))) !== '6970c4c954c237823685d6e9accee73bb3e9a49e3aec0c92664c5998ff921652') {
  throw new Error('Isolated Jinshu 127 input fingerprints do not match the retained regression fixture');
}
const work = fs.mkdtempSync(path.join(root, 'export-only-test-'));
const snapshot = dir => {
  const result = {};
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) result[path.relative(dir, full)] = digest(fs.readFileSync(full));
      else throw new Error(`Unexpected non-file in protected data tree: ${full}`);
    }
  }
  visit(dir);
  return result;
};
const run = args => spawnSync(process.execPath, ['scripts/apply-people-translation-repairs.mjs',
  '--book', 'jinshu', '--chapter', '127', ...args], { cwd: root, encoding: 'utf8' });

test('mixed real occurrences export only the requested new packet', () => {
  const before = snapshot(path.join(root, 'data'));
  const output = path.join(work, 'mixed.json');
  const result = run(['--reconcile-current', '--unscanned-review-packet', output]);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /requires source review: 13 occurrence/);
  const items = JSON.parse(fs.readFileSync(output, 'utf8')).items;
  assert.equal(items.length, 13);
  assert.ok(items.some(item => item.unit === 's0192' && item.span.exact === 'Xiong' && item.people.includes('jinshu:127:p109')));
  assert.deepEqual(snapshot(path.join(root, 'data')), before);
});

test('zero-occurrence export exits clearly without any writes', () => {
  const variant = path.join(work, 'no-english-preferred-names.json');
  const extraction = JSON.parse(fs.readFileSync(source, 'utf8'));
  for (const person of extraction.people) {
    person[1][0] = '';
    for (const name of person[5]) name[0].en = '';
  }
  fs.writeFileSync(variant, JSON.stringify(extraction));
  const variantHash = digest(fs.readFileSync(variant));
  const before = snapshot(path.join(root, 'data'));
  const output = path.join(work, 'zero.json');
  const result = run(['--reconcile-current', '--extraction', variant, '--unscanned-review-packet', output]);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /No unscanned name surfaces found; export-only mode made no writes/);
  assert.equal(fs.existsSync(output), false);
  assert.equal(digest(fs.readFileSync(variant)), variantHash);
  assert.deepEqual(snapshot(path.join(root, 'data')), before);
});

test('normal reconciliation and untrusted replay refuse writes while questions remain', () => {
  const before = snapshot(path.join(root, 'data'));
  const review = path.join(work, 'untrusted-review.json');
  fs.writeFileSync(review, '{}\n');
  for (const [args, message] of [
    [['--reconcile-current'], /requires source review/],
    [['--reconcile-current', '--unscanned-review', review], /no trusted dispatch verifier/],
  ]) {
    const result = run(args);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, message);
    assert.deepEqual(snapshot(path.join(root, 'data')), before);
  }
});

test('export mode rejects non-reconcile, review, decision flags, and existing outputs', () => {
  const before = snapshot(path.join(root, 'data'));
  const existing = path.join(work, 'existing.json');
  fs.writeFileSync(existing, 'preserve this byte-for-byte\n');
  for (const args of [
    ['--unscanned-review-packet', path.join(work, 'not-current.json')],
    ['--reconcile-current', '--unscanned-review-packet', path.join(work, 'with-review.json'), '--unscanned-review', existing],
    ['--reconcile-current', '--unscanned-review-packet', path.join(work, 'with-candidate.json'), '--candidate-person', 'candidate=p001@personal-name'],
    ['--reconcile-current', '--unscanned-review-packet', existing],
  ]) {
    const result = run(args);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /requires only --reconcile-current|EEXIST/);
    assert.equal(fs.readFileSync(existing, 'utf8'), 'preserve this byte-for-byte\n');
    assert.deepEqual(snapshot(path.join(root, 'data')), before);
  }
});
