import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { localNameKeys, resolveAcceptedPeopleClusters } from './lib/people-resolution.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';
import { memberContract, buildIdentityDossierIndex, streamIdentityDossierIndex,
  planChapterIdentityReview, IDENTITY_REVIEW_LIMITS } from './lib/people-identity-dossiers.mjs';
import { writeIdentityDossierStore, readIdentityDossierStore } from './lib/people-identity-dossier-store.mjs';
import { writeValidatedIdentityMembers } from './lib/people-identity-member-store.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-streaming-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const people = new Map();
  for (let i = 1; i <= 24; i++) {
    const id = `fixture:${i < 3 ? '001' : '002'}:p${String(i).padStart(3, '0')}`;
    people.set(id, { localId: id, promptVersion: 7, preferredNameSuggestion: { en: 'Wang Wei', zh: '王偉' },
      mentions: [{ ignoredByIdentity: true }], descriptorSuggestion: 'Not part of identity contract', claims: [
        { id: `${id}:name`, subject: id, predicate: 'name', value: { en: 'Wang Wei', zh: '王偉', kind: 'personal-name' },
          certainty: 'explicit', evidence: ['fixture:001:s0001'] },
        { id: `${id}:office`, subject: id, predicate: 'office', value: { en: 'Governor' }, certainty: 'explicit', evidence: ['fixture:001:s0001'] },
        { id: `${id}:fact`, subject: id, predicate: 'event', value: { en: 'Long narrative evidence'.repeat(2000) }, certainty: 'explicit', evidence: ['fixture:001:s0001'] },
      ] });
  }
  const ids = [...people.keys()];
  people.get(ids[0]).claims.push({ predicate: 'same-person', value: { personId: ids[1] }, certainty: 'explicit' });
  people.get(ids[0]).claims.push({ predicate: 'different-person', value: { person: ids[2] }, certainty: 'explicit' });
  const documents = [{ batch: 'accepted', authority: 'curated', decisions: [
    { decision: 'merge', localPeople: [ids[0], ids[1]], canonicalPersonId: 'per_pinned' },
    { decision: 'possible-same-as', localPeople: [ids[2], ids[3]] },
  ] }];
  const coverage = { sourceChapters: 2, extractedChapters: 2, missingChapterIds: [] };
  const visit = consume => {
    for (const chapter of ['001', '002']) consume({ localPeople: new Map([...people].filter(([id]) => id.split(':')[1] === chapter)) });
    return { coverage };
  };
  return { root, people, documents, coverage, visit };
}

test('bounded member spool preserves native names, identity versions and accepted constraints', t => {
  const f = fixture(t), store = writeValidatedIdentityMembers(path.join(f.root, 'members'), f.visit);
  t.after(() => store.close());
  assert.deepEqual(store.coverage, f.coverage);
  for (const [id, original] of f.people) {
    const read = store.people.get(id);
    assert.deepEqual(localNameKeys(read), localNameKeys(original));
    assert.deepEqual(memberContract(read, localNameKeys(read)), memberContract(original, localNameKeys(original)));
    assert.equal(read.mentions, undefined);
    assert.equal(read.claims.some(claim => claim.predicate === 'event'), false);
  }
  assert.deepEqual(resolveAcceptedPeopleClusters(store.constraints, f.documents), resolveAcceptedPeopleClusters(f.people, f.documents));
  const first = [...store.constraints.values()][0];
  first.claims.push({ predicate: 'different-person', value: { personId: [...f.people.keys()][1] } });
  assert.throws(() => resolveAcceptedPeopleClusters(store.constraints, f.documents), /Contradictory explicit identity/);
});

test('streamed persistent registry is byte-identical to the in-memory index and keeps bounded retrieval', async t => {
  const f = fixture(t), store = writeValidatedIdentityMembers(path.join(f.root, 'members'), f.visit);
  t.after(() => store.close());
  const accepted = resolveAcceptedPeopleClusters(f.people, f.documents);
  const original = buildIdentityDossierIndex(f.people, accepted.clusters, localNameKeys);
  let reads = 0;
  const lazy = { size: store.people.size, get(id) { reads++; return store.people.get(id); } };
  const streamed = streamIdentityDossierIndex(lazy, accepted.clusters, localNameKeys);
  assert.equal(reads, 0, 'creating a stream must not materialize any source evidence');
  const provenance = { revision: '1'.repeat(40), generatedPairs: 0 };
  const a = path.join(f.root, 'in-memory'), b = path.join(f.root, 'streamed');
  const before = writeIdentityDossierStore(a, original, provenance);
  const after = writeIdentityDossierStore(b, streamed, provenance);
  assert.equal(reads, f.people.size, 'each source member is read exactly once');
  assert.deepEqual(after, before);
  for (const file of ['dossiers.jsonl', 'index.jsonl', 'manifest.json']) assert.deepEqual(fs.readFileSync(path.join(a, file)), fs.readFileSync(path.join(b, file)));
  const reader = await readIdentityDossierStore(b, new Map()); t.after(() => reader.close());
  const inputs = Object.fromEntries(['source', 'extraction', 'editorial', 'dateAudit'].map(k => [k, peopleDigest(k)]));
  const plan = planChapterIdentityReview(reader, { book: 'fixture', chapter: '001' }, inputs, IDENTITY_REVIEW_LIMITS);
  assert.equal(plan.metrics.cases, 1); assert.equal(plan.metrics.targetLocalPeople, 2);
  assert.equal(plan.metrics.generatedPairs, 0); assert.equal(plan.metrics.maxDossiersInCase, 8);
  assert.equal(plan.metrics.overflowCases, 1);
});

test('member reads reject changed bytes and closed readers; validation failures retain unpublished scratch', t => {
  const f = fixture(t), directory = path.join(f.root, 'members');
  const store = writeValidatedIdentityMembers(directory, f.visit); t.after(() => store.close());
  const file = path.join(directory, 'members.jsonl'), data = fs.readFileSync(file);
  data[0] = 32; fs.writeFileSync(file, data);
  assert.throws(() => store.people.get([...f.people.keys()][0]), /Changed identity member bytes/);
  store.close(); assert.throws(() => store.people.get('unknown'), /closed/);
  const failed = path.join(f.root, 'failed');
  assert.throws(() => writeValidatedIdentityMembers(failed, consume => {
    consume({ localPeople: f.people }); throw new Error('source validation failed');
  }), /source validation failed/);
  assert.equal(fs.existsSync(path.join(failed, 'members.jsonl')), true);
  assert.equal(fs.existsSync(path.join(failed, 'receipt.json')), false);
  assert.equal(fs.existsSync(path.join(failed, 'manifest.json')), false);
});

test('a lazy source hole cannot publish a registry manifest', t => {
  const f = fixture(t), clusters = resolveAcceptedPeopleClusters(f.people, f.documents).clusters;
  const lazy = { size: f.people.size, get() { return undefined; } };
  const out = path.join(f.root, 'incomplete');
  assert.throws(() => writeIdentityDossierStore(out, streamIdentityDossierIndex(lazy, clusters, localNameKeys),
    { revision: '1'.repeat(40) }), /missing or multiply assigned source member/);
  assert.equal(fs.existsSync(path.join(out, 'manifest.json')), false);
});
