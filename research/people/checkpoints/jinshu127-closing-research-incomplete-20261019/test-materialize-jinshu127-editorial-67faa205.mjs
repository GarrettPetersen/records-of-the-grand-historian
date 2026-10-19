import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { materialize } from './materialize-jinshu127-editorial-67faa205.mjs';

const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const dir = path.join(root, 'data/people/generated/jinshu-identity-ref-64521198-20261018');
const ref = '67faa20531f92381a2b192c72004a2ae043e1763';
const stage = f => JSON.parse(execFileSync('git', ['show', `${ref}:${f}`], { cwd: root, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 }));
const artifact = f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const fixture = () => ({ source: stage('data/jinshu/127.json'), baseline: stage('data/people/extractions/jinshu/127.json'), oldHistory: stage('data/people/editorial-decisions/jinshu/127.json'), candidate: artifact('jinshu127-s0232-editorial-candidate-67faa205.json'), review: artifact('jinshu127-s0232-editorial-independent-decision-disk-audit-67faa205.json'), mergedHistory: artifact('jinshu127-s0232-editorial-merged-history-disk-audit-67faa205.json') });

test('real pinned input materializes exact two source changes and preserves all old claims and history', () => {
  const f = fixture(), result = materialize(f);
  const before = f.source.content[18].sentences[2].translations[0];
  const after = result.source.content[18].sentences[2].translations[0];
  assert.equal(after.literal, before.literal.replace('closed Bi Gan\'s tomb', 'raised a mound over Bi Gan\'s tomb'));
  assert.equal(after.idiomatic, before.idiomatic.replace('closed Bi Gan\'s tomb', 'raised a mound over Bi Gan\'s tomb'));
  assert.deepEqual(result.extraction.people, f.baseline.people);
  assert.deepEqual(result.extraction.claims, f.baseline.claims);
  assert.deepEqual(result.extraction.translationRepairs.slice(0, 11), f.baseline.translationRepairs);
  assert.deepEqual(result.extraction.translationRepairs.slice(11).map(r => r[6]), ['applied', 'applied']);
  assert.deepEqual(result.source, artifact('jinshu127-s0232-materialized-source-67faa205.json'));
  assert.deepEqual(result.extraction, artifact('jinshu127-s0232-materialized-extraction-67faa205.json'));
  assert.deepEqual(result.packet, artifact('jinshu127-s0232-materialized-packet-67faa205.json'));
});

test('reject stale source and changed candidate baseline content', () => {
  const f = fixture(); f.source.content[18].sentences[2].translations[0].literal += ' changed';
  assert.throws(() => materialize(f), /fingerprint|digest|mismatch/i);
  const g = fixture(); g.candidate.claims[0][2] = { altered: true };
  assert.throws(() => materialize(g), /unrelated baseline content/);
});

test('reject altered old history, incomplete decision and proposal drift', () => {
  const f = fixture(); f.mergedHistory.reviews[0].reviewer.name = 'altered';
  assert.throws(() => materialize(f), /Merged review/);
  const g = fixture(); g.review.decisions.pop();
  assert.throws(() => materialize(g), /missing decision/);
  const h = fixture(); h.candidate.translationRepairs[11][3] += ' changed';
  assert.throws(() => materialize(h), /no review batch matches/);
});
