import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildDriftReviewInventory, verifyDriftReview } from './lib/people-curation-drift-review.mjs';
import { claimContentView } from './lib/people-claim-content-view.mjs';

const bytes = value => Buffer.from(JSON.stringify(value));
function fixture() {
  const snapshots = { retained: bytes({ a: 1 }), current: bytes({ a: 2 }), candidate: bytes({ a: 3, b: true }) };
  const provenanceAuthors = { retained: ['worker-a'], current: ['worker-b'], candidate: ['worker-c'] };
  const inventory = buildDriftReviewInventory(snapshots);
  const report = {
    schemaVersion: 1, inputs: inventory.inputs, reviewer: 'reviewer-1',
    reviews: inventory.rows.map(row => ({ row, verdict: 'uncertain', reasoning: 'Needs source examination.',
      evidence: [{ reference: 'synthetic source', excerpt: 'synthetic text', explanation: 'Synthetic example only.' }] })),
  };
  return { snapshots, provenanceAuthors, report };
}
function run(f) { return verifyDriftReview({ snapshots: f.snapshots, provenanceAuthors: f.provenanceAuthors, reportBytes: bytes(f.report) }); }

test('three-generation rows are bound and structurally validated without approving them', () => {
  const result = run(fixture());
  assert.equal(result.structurallyValid, true);
  assert.equal(result.rows, 5);
  assert.match(result.warning, /No provenance completeness/);
});
test('raw bytes bind formatting even when semantic hash is unchanged', () => {
  const f = fixture();
  const next = { ...f.snapshots, retained: Buffer.from('{ "a": 1 }') };
  const a = buildDriftReviewInventory(f.snapshots).inputs.retained;
  const b = buildDriftReviewInventory(next).inputs.retained;
  assert.equal(a.semanticSha256, b.semanticSha256);
  assert.notEqual(a.rawSha256, b.rawSha256);
  f.snapshots = next;
  assert.throws(() => run(f), /Input hashes/);
});
test('all fields and every recomputed row must match exactly in order', () => {
  for (const mutate of [
    f => f.report.reviews.pop(),
    f => f.report.reviews.push(f.report.reviews[0]),
    f => { f.report.reviews[1] = f.report.reviews[0]; },
    f => { f.report.reviews[0].row.change.after = 99; },
    f => { f.report.reviews[0].row.from = 'candidate'; },
    f => { f.report.inputs.current.semanticSha256 = 'sha256:' + '0'.repeat(64); },
    f => { f.report.reviews[0].extra = true; },
    f => { f.report.reviews[0].evidence[0].extra = true; },
  ]) {
    const f = fixture(); mutate(f); assert.throws(() => run(f));
  }
});
test('every verdict, reasoning and evidence field is mandatory and explicit', () => {
  for (const mutate of [
    f => { f.report.reviews[0].verdict = 'approved'; },
    f => { f.report.reviews[0].verdict = ''; },
    f => { f.report.reviews[0].reasoning = '  '; },
    f => { f.report.reviews[0].evidence = []; },
    f => { f.report.reviews[0].evidence[0].excerpt = ''; },
    f => { delete f.report.reviews[0].evidence[0].reference; },
  ]) {
    const f = fixture(); mutate(f); assert.throws(() => run(f));
  }
});
test('known authors are independently supplied, required and disjoint from reviewer', () => {
  for (const mutate of [
    f => { f.provenanceAuthors.retained = []; },
    f => { delete f.provenanceAuthors.current; },
    f => { f.provenanceAuthors.candidate = ['reviewer-1']; },
    f => { f.provenanceAuthors.retained = ['worker-a', 'worker-a']; },
    f => { f.report.reviewer = 'Reviewer-1'; },
  ]) {
    const f = fixture(); mutate(f); assert.throws(() => run(f));
  }
});
test('duplicate JSON members, imprecise numbers and invalid UTF-8 fail closed', () => {
  const f = fixture();
  for (const invalid of [Buffer.from('{"a":1,"a":2}'), Buffer.from('{"n":9007199254740993}'), Buffer.from([0xff])]) {
    assert.throws(() => buildDriftReviewInventory({ ...f.snapshots, current: invalid }));
  }
  assert.throws(() => verifyDriftReview({ snapshots: f.snapshots, provenanceAuthors: f.provenanceAuthors, reportBytes: Buffer.from('{"schemaVersion":1,"schemaVersion":1}') }));
});
test('no-drift snapshots do not become an approval', () => {
  const f = fixture(); f.snapshots.current = f.snapshots.retained; f.snapshots.candidate = f.snapshots.retained;
  const inventory = buildDriftReviewInventory(f.snapshots);
  f.report.inputs = inventory.inputs; f.report.reviews = [];
  assert.deepEqual(run(f), { structurallyValid: true, rows: 0, warning: 'No provenance completeness, factual correctness, approval, or publication established' });
});
test('read-only CLI emits real inventory and verifies an independently supplied report', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-review-cli-test-'));
  try {
    const f = fixture();
    const names = ['retained', 'current', 'candidate'];
    for (const name of names) fs.writeFileSync(path.join(directory, `${name}.json`), f.snapshots[name]);
    fs.writeFileSync(path.join(directory, 'authors.json'), bytes(f.provenanceAuthors));
    fs.writeFileSync(path.join(directory, 'report.json'), bytes(f.report));
    const args = names.map(name => path.join(directory, `${name}.json`));
    const invoke = extra => spawnSync(process.execPath, ['scripts/people-curation-drift-review.mjs', ...args, ...extra], { encoding: 'utf8' });
    const dry = invoke([]);
    assert.equal(dry.status, 0, dry.stderr);
    const output = JSON.parse(dry.stdout);
    assert.equal(output.kind, 'structural-evidence-not-approval');
    assert.equal(output.structuralCheck, null);
    assert.deepEqual(output.inventory, buildDriftReviewInventory(f.snapshots));
    assert.match(output.warning, /No provenance completeness/);
    const extra = ['--verify', path.join(directory, 'report.json'), '--provenance', path.join(directory, 'authors.json')];
    const checked = invoke(extra);
    assert.equal(checked.status, 0, checked.stderr);
    const checkedOutput = JSON.parse(checked.stdout);
    assert.equal(checkedOutput.structuralCheck.structurallyValid, true);
    const hash = value => `sha256:${createHash('sha256').update(value).digest('hex')}`;
    assert.deepEqual(checkedOutput.suppliedFiles, { reportRawSha256: hash(bytes(f.report)), provenanceRawSha256: hash(bytes(f.provenanceAuthors)) });
    assert.match(checkedOutput.warning, /never use as a publication gate/);
    fs.writeFileSync(path.join(directory, 'report.json'), '{"schemaVersion":1,"schemaVersion":1}');
    const badReport = invoke(extra);
    assert.notEqual(badReport.status, 0);
    assert.equal(badReport.stdout, '');
    assert.match(badReport.stderr, /Duplicate JSON member/);
    fs.writeFileSync(path.join(directory, 'report.json'), bytes(f.report));
    fs.writeFileSync(path.join(directory, 'authors.json'), '{"retained":[],"retained":[]}');
    const badAuthors = invoke(extra);
    assert.notEqual(badAuthors.status, 0);
    assert.match(badAuthors.stderr, /Duplicate JSON member/);
    assert.notEqual(invoke(['--verify', path.join(directory, 'report.json')]).status, 0);
  } finally {
    // Only the test's own fresh temporary directory is removed.
    fs.rmSync(directory, { recursive: true });
  }
});
test('claim content view preserves add/delete evidence without treating edits as identity matches', () => {
  const view = claimContentView({ claims: [['a'], ['b'], ['c']] }, { claims: [['a'], ['c', 1], ['c']] });
  assert.equal(view.uniqueContentReordered, false);
  assert.equal(view.matchedUniqueCount, 2);
  assert.deepEqual(view.removed, [{ value: ['b'], count: 1, positions: [1] }]);
  assert.deepEqual(view.added, [{ value: ['c', 1], count: 1, positions: [1] }]);
  assert.deepEqual(view.ambiguous, []);
});
test('claim content view detects order changes and explicitly marks duplicate ambiguity', () => {
  const view = claimContentView({ claims: ['a', 'b', 'x', 'x'] }, { claims: ['b', 'a', 'x'] });
  assert.equal(view.uniqueContentReordered, true);
  assert.deepEqual(view.ambiguous, [{ value: 'x', beforePositions: [2, 3], afterPositions: [2] }]);
  assert.deepEqual(view.removed, [{ value: 'x', count: 1, positions: [2, 3] }]);
  assert.throws(() => claimContentView({ claims: [] }, {}), /claims arrays/);
});
test('claim view is optional and leaves complete positional inventory untouched', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-claim-view-test-'));
  try {
    for (const [name, claims] of Object.entries({ retained: ['a', 'b'], current: ['a', 'b'], candidate: ['b'] })) {
      fs.writeFileSync(path.join(directory, `${name}.json`), bytes({ claims }));
    }
    const args = ['retained', 'current', 'candidate'].map(name => path.join(directory, `${name}.json`));
    const invoke = extra => spawnSync(process.execPath, ['scripts/people-curation-drift-review.mjs', ...args, ...extra], { encoding: 'utf8' });
    const plain = invoke([]), annotated = invoke(['--claim-view']);
    assert.equal(plain.status, 0, plain.stderr); assert.equal(annotated.status, 0, annotated.stderr);
    const a = JSON.parse(plain.stdout), b = JSON.parse(annotated.stdout);
    assert.deepEqual(a.inventory, b.inventory);
    assert.equal(b.claimViews.currentToCandidate.removed[0].value, 'a');
    assert.match(b.claimViews.currentToCandidate.warning, /complete positional inventory/);
  } finally { fs.rmSync(directory, { recursive: true }); }
});
