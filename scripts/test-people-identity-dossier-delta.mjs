import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildIdentityDossierIndex, planChapterIdentityReview, IDENTITY_REVIEW_LIMITS } from './lib/people-identity-dossiers.mjs';
import { localNameKeys } from './lib/people-resolution.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { writeIdentityDossierStore } from './lib/people-identity-dossier-store.mjs';
import { buildIdentityDossierDelta, writeIdentityDossierDelta, readIdentityDossierRegistry } from './lib/people-identity-dossier-delta.mjs';

const provenance = revision => ({ revision: revision.repeat(40), identityInputs: peopleDigest(revision) });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function person(chapter, en, zh) {
  const localId = `fixture:${chapter}:p001`;
  return { localId, promptVersion: 7, preferredNameSuggestion: { en, zh }, claims: [{ id: `fixture:${chapter}:c001`, subject: localId,
    predicate: 'name', value: { kind: 'personal', en, ...(zh ? { zh } : {}) }, certainty: 'explicit', evidence: [`fixture:${chapter}:s0001`] }] };
}
async function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dossier-delta-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const people = new Map([person('001', 'Wang Wei', '王偉'), person('002', 'Wang Wei', '王偉'), person('003', 'Wang Wei', '')].map(p => [p.localId, p]));
  const clusters = [...people.keys()].map((id, i) => ({ canonicalPersonId: `per_${i}`, localPeople: [id], retiredIds: i === 1 ? ['per_retired'] : [] }));
  const original = buildIdentityDossierIndex(people, clusters, localNameKeys), base = path.join(root, 'base');
  writeIdentityDossierStore(base, original, provenance('1'));
  const reader = await readIdentityDossierRegistry(base, new Map()); t.after(() => reader.close());
  const next = structuredClone(people), p = next.get('fixture:001:p001');
  p.preferredNameSuggestion = { en: 'Gao Zhao', zh: '高釗' }; p.claims[0].value = { kind: 'personal', en: 'Gao Zhao', zh: '高釗' };
  const delta = buildIdentityDossierDelta(reader, new Map([[p.localId, p]]), [p.localId], localNameKeys);
  return { root, base, reader, people, clusters, next, delta, out: path.join(root, 'delta') };
}
test('an immutable delta matches a full native rebuild including indexed plans and partitions', async t => {
  const f = await fixture(t), before = new Map(['manifest.json','dossiers.jsonl','index.jsonl'].map(file => [file, hash(fs.readFileSync(path.join(f.base, file)))]));
  const manifest = writeIdentityDossierDelta(f.out, f.base, f.reader, f.delta, provenance('2'));
  assert.equal(manifest.dossierCount, 3); assert.equal(f.delta.dossiers.length, 1); assert.equal(manifest.publicationApproval, false);
  assert.deepEqual(f.reader.dossiers.get('per_0'), buildIdentityDossierIndex(f.people, f.clusters, localNameKeys).dossiers.get('per_0'), 'Parent reader changed');
  assert.equal(f.reader.generationDepth, 1);
  const actual = await readIdentityDossierRegistry(f.out, new Map()); t.after(() => actual.close());
  const expected = buildIdentityDossierIndex(f.next, f.clusters, localNameKeys);
  for (const kind of ['postings','englishUnknownPostings','memberVersions','localPersonMap','chapters','canonicalByKnownId','dossierVersions']) {
    assert.deepEqual([...actual[kind]].sort(), [...expected[kind]].sort(), kind);
  }
  for (const id of expected.dossiers.keys()) assert.deepEqual(actual.dossiers.get(id), expected.dossiers.get(id));
  const inputs = Object.fromEntries(['source','extraction','editorial','dateAudit'].map(k => [k, peopleDigest(k)]));
  for (const chapter of ['001','002','003']) {
    const plan = planChapterIdentityReview(actual, { book: 'fixture', chapter }, inputs, IDENTITY_REVIEW_LIMITS);
    assert.deepEqual(plan, planChapterIdentityReview(expected, { book: 'fixture', chapter }, inputs, IDENTITY_REVIEW_LIMITS));
    assert.equal(plan.metrics.generatedPairs, 0); assert(plan.metrics.maxDossiersInCase <= 8);
  }
  assert.equal(actual.canonicalByKnownId.get('per_retired'), 'per_1');
  for (const [file, digest] of before) assert.equal(hash(fs.readFileSync(path.join(f.base, file))), digest, 'Parent file changed');
  actual.close(); assert.throws(() => actual.dossiers.get('per_0'), /closed/u); assert.throws(() => actual.dossiers.get('per_1'), /closed/u);
});
test('a changed member needs every accepted member of its dossier; unknown members cannot be added', async t => {
  const f = await fixture(t);
  assert.throws(() => buildIdentityDossierDelta(f.reader, new Map(), ['fixture:001:p001'], localNameKeys), /Current accepted member/u);
  assert.throws(() => buildIdentityDossierDelta(f.reader, f.next, ['fixture:999:p001'], localNameKeys), /Unknown changed member/u);
  assert.throws(() => buildIdentityDossierDelta(f.reader, f.next, ['fixture:001:p001','fixture:001:p001'], localNameKeys), /Unique changed/u);
});
test('stale before-versions fail before a generation is published', async t => {
  const f = await fixture(t); f.delta.dossiers[0].beforeVersion = peopleDigest('wrong');
  assert.throws(() => writeIdentityDossierDelta(f.out, f.base, f.reader, f.delta, provenance('2')), /stale dossier/u);
  assert.equal(fs.existsSync(f.out), false);
});
test('a dossier update cannot authorize a split or merge', async t => {
  const f = await fixture(t); f.delta.dossiers[0].dossier.localPeople = ['fixture:002:p001'];
  assert.throws(() => writeIdentityDossierDelta(f.out, f.base, f.reader, f.delta, provenance('2')), /membership/u);
  assert.equal(fs.existsSync(f.out), false);
});
test('changed parent manifests and changed delta payloads are rejected', async t => {
  const f = await fixture(t); writeIdentityDossierDelta(f.out, f.base, f.reader, f.delta, provenance('2'));
  const parent = path.join(f.base, 'manifest.json'), bytes = fs.readFileSync(parent);
  fs.appendFileSync(parent, '\n'); await assert.rejects(readIdentityDossierRegistry(f.out, new Map()), /parent manifest changed/u);
  fs.writeFileSync(parent, bytes); fs.appendFileSync(path.join(f.out, 'delta.json'), '\n');
  await assert.rejects(readIdentityDossierRegistry(f.out, new Map()), /delta bytes changed/u);
});
test('an interrupted delta has no usable manifest and immutable generations cannot be overwritten', async t => {
  const f = await fixture(t); fs.mkdirSync(f.out); fs.writeFileSync(path.join(f.out, 'delta.json'), '{}\n');
  await assert.rejects(readIdentityDossierRegistry(f.out, new Map()), /ENOENT/u);
  assert.throws(() => writeIdentityDossierDelta(f.out, f.base, f.reader, f.delta, provenance('2')), /already exists/u);
});
test('evidence-only source updates can retain every dossier and change only source provenance', async t => {
  const f = await fixture(t), delta = buildIdentityDossierDelta(f.reader, new Map(), [], localNameKeys);
  assert.equal(delta.dossiers.length, 0); assert.equal(delta.maps.postings.length, 0);
  writeIdentityDossierDelta(f.out, f.base, f.reader, delta, provenance('2'));
  const reader = await readIdentityDossierRegistry(f.out, new Map()); t.after(() => reader.close());
  assert.deepEqual(reader.dossiers.get('per_0'), f.reader.dossiers.get('per_0'));
  assert.deepEqual(reader.provenance, provenance('2'));
});
test('successive deltas preserve inherited and updated lookups, with bounded ancestry', async t => {
  const f = await fixture(t); writeIdentityDossierDelta(f.out, f.base, f.reader, f.delta, provenance('2'));
  const reader = await readIdentityDossierRegistry(f.out, new Map()); t.after(() => reader.close());
  const current = structuredClone(f.next), p = current.get('fixture:003:p001'); p.claims[0].value.zh = '王偉'; p.preferredNameSuggestion.zh = '王偉';
  const delta = buildIdentityDossierDelta(reader, new Map([[p.localId,p]]), [p.localId], localNameKeys), out = path.join(f.root, 'second');
  writeIdentityDossierDelta(out, f.out, reader, delta, provenance('3'));
  const actual = await readIdentityDossierRegistry(out, new Map()); t.after(() => actual.close());
  const expected = buildIdentityDossierIndex(current, f.clusters, localNameKeys);
  assert.deepEqual([...actual.englishUnknownPostings].sort(), [...expected.englishUnknownPostings].sort());
  for (const [id, dossier] of expected.dossiers) assert.deepEqual(actual.dossiers.get(id), dossier);
  await assert.rejects(readIdentityDossierRegistry(out, new Map(), new Set(Array.from({ length:16 }, (_,i) => String(i)))), /excessive/u);
});
test('the ancestry limit is enforced before publishing an unreadable seventeenth generation', async t => {
  const f = await fixture(t); let directory = f.base;
  for (let depth = 1; depth <= 16; depth++) {
    const reader = await readIdentityDossierRegistry(directory, new Map());
    try {
      assert.equal(reader.generationDepth, depth);
      const next = path.join(f.root, 'depth-' + (depth + 1)), delta = buildIdentityDossierDelta(reader, new Map(), [], localNameKeys);
      if (depth === 16) {
        assert.throws(() => writeIdentityDossierDelta(next, directory, reader, delta, provenance('2')), /ancestry limit/u);
        assert.equal(fs.existsSync(next), false);
      } else { writeIdentityDossierDelta(next, directory, reader, delta, provenance('2')); directory = next; }
    } finally { reader.close(); }
  }
});
