import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { localNameKeys } from './lib/people-resolution.mjs';
import { buildIdentityDossierIndex, planChapterIdentityReview, validateRetainedDossierReview } from './lib/people-identity-dossiers.mjs';

const inputs = Object.fromEntries(['source', 'extraction', 'editorial', 'dateAudit'].map((key, i) => [key, `sha256:${String(i + 1).repeat(64)}`]));
const limits = { maxDossiersPerCase: 8, maxKeysPerCase: 16, maxPostingReadsPerKey: 8 };
const keyReader = person => person.keys;
function person(id, name = '王偉', english = 'Wang Wei') {
  const [book, chapter] = id.split(':'); const claimId = `${book}:${chapter}:c${id.split(':p')[1]}`;
  return { localId: id, promptVersion: 7, preferredNameSuggestion: { zh: name, en: english }, keys: [
    { key: `zh:${name}`, language: 'zh', value: name, kinds: ['personal'], blocking: true, sources: [claimId] },
    { key: `en:${english.toLowerCase()}`, language: 'en', value: english, kinds: ['personal'], blocking: true, sources: [claimId] },
  ], claims: [{ id: claimId, subject: id, predicate: 'name', value: { zh: name, en: english, kind: 'personal-name' },
    certainty: 'explicit', evidence: [`${book}:${chapter}:s0001`] }] };
}
function fixture(size = 20) {
  const records = new Map(), clusters = [];
  for (let i = 0; i < size; i += 1) {
    const id = `fixture:${i < 3 ? '001' : '002'}:p${String(i + 1).padStart(5, '0')}`;
    records.set(id, person(id)); clusters.push({ canonicalPersonId: `per_${String(i).padStart(6, '0')}`, localPeople: [id], retiredIds: [] });
  }
  const index = buildIdentityDossierIndex(records, clusters, keyReader);
  const plan = planChapterIdentityReview(index, { book: 'fixture', chapter: '001' }, inputs, limits);
  const sourceUnits = new Map([['fixture:001:s0001', '王偉字仲明。'], ['fixture:002:s0001', '王偉字仲明。']]);
  const report = { schemaVersion: 1, planFingerprint: plan.fingerprint, reviewer: { agentId: 'independent', name: 'Independent source reviewer' },
    reviews: plan.cases.map(item => ({ caseId: item.id, canonicalPersonId: item.canonicalPersonId, verdict: 'approve', membershipReviewed: true, membershipFingerprint: item.canonicalMembership.fingerprint, ambiguityReviewed: true,
      unresolvedIdentity: true, reason: 'Primary Chinese identifies this local person; cross-chapter equivalence remains unestablished, so retain the accepted assignment.',
      sourceWitnesses: item.localPeople.map(localId => ({ localId, book: 'fixture', chapter: '001', unitId: 's0001', quote: '王偉' })) })) };
  return { records, clusters, index, plan, report, sourceUnits };
}
const validate = f => validateRetainedDossierReview(f.index, f.plan, f.report, f.sourceUnits, 'independent', ['extractor', 'host-author'], inputs, keyReader);

test('one case per canonical person, with accepted local records kept together', () => {
  const f = fixture(); const merged = { canonicalPersonId: f.clusters[0].canonicalPersonId,
    localPeople: [...f.clusters[0].localPeople, ...f.clusters[1].localPeople], retiredIds: [f.clusters[1].canonicalPersonId] };
  const index = buildIdentityDossierIndex(f.records, [merged, ...f.clusters.slice(2)], keyReader);
  const plan = planChapterIdentityReview(index, f.plan.scope, inputs, limits);
  assert.equal(plan.cases.length, 2); assert.equal(plan.metrics.targetLocalPeople, 3);
  assert.equal(plan.cases[0].localPeople.length, 2); assert.equal(plan.metrics.generatedPairs, 0);
});

test('reviewed ambiguity retains separate records without granting merges or publication', () => {
  const f = fixture(), certificate = validate(f);
  assert.equal(certificate.retained.length, 3); assert.equal(certificate.ambiguity.length, 3);
  assert.equal(certificate.grantsNewMerges, false); assert.equal(certificate.grantsNewSeparations, false);
  assert.equal(certificate.publicationApproval, false); assert.equal(f.index.dossiers.size, 20);
});

test('overflow is explicit and cannot be relabelled as identity certainty', () => {
  const f = fixture(); assert.ok(f.plan.cases.every(item => item.retrieval.overflow));
  f.report.reviews[0].unresolvedIdentity = false;
  assert.throws(() => validate(f), /ambiguity cannot become/);
});

test('an incomplete or self-authored review cannot authorize chapter completion', () => {
  const f = fixture(); f.report.reviews.pop(); assert.throws(() => validate(f), /Missing or duplicate/);
  const g = fixture(); g.report.reviewer.agentId = 'host-author';
  assert.throws(() => validateRetainedDossierReview(g.index, g.plan, g.report, g.sourceUnits, 'host-author', ['host-author'], inputs, keyReader), /independent reviewer/);
});

test('stale chapter inputs, altered case assignments and invented witnesses fail', () => {
  const f = fixture(); assert.throws(() => validateRetainedDossierReview(f.index, f.plan, f.report, f.sourceUnits,
    'independent', ['host-author'], { ...inputs, source: `sha256:${'f'.repeat(64)}` }, keyReader), /inputs changed/);
  const g = fixture(); g.report.reviews[0].canonicalPersonId = 'per_invented'; assert.throws(() => validate(g), /assignment or source-person/);
  const h = fixture(); h.report.reviews[0].sourceWitnesses[0].quote = '不存在'; assert.throws(() => validate(h), /current primary source/);
});

test('a certificate cannot smuggle a new merge through extra fields', () => {
  const f = fixture(); f.report.reviews[0].decision = 'merge'; assert.throws(() => validate(f), /Unexpected person review fields/);
});

test('held cases remain blocked and every local person needs primary source evidence', () => {
  const f = fixture(); f.report.reviews[0].verdict = 'hold'; assert.throws(() => validate(f), /held or unknown/);
  const g = fixture(); g.report.reviews[0].sourceWitnesses = []; assert.throws(() => validate(g), /witnesses are required/);
});

test('accepted membership growth does not reopen unchanged chapter source identities', () => {
  const f = fixture(); const merged = { canonicalPersonId: f.clusters[3].canonicalPersonId,
    localPeople: [...f.clusters[0].localPeople, ...f.clusters[3].localPeople], retiredIds: [f.clusters[0].canonicalPersonId] };
  f.index = buildIdentityDossierIndex(f.records, [merged, f.clusters[1], f.clusters[2], ...f.clusters.slice(4)], keyReader);
  const certificate = validate(f); assert.equal(certificate.retained[0].canonicalPersonId, merged.canonicalPersonId);
});

test('source-identity edits and newly extracted chapter people require fresh coverage', () => {
  const f = fixture(); const changed = structuredClone(f.records); changed.values().next().value.claims[0].value.zh = '王威';
  f.index = buildIdentityDossierIndex(changed, f.clusters, keyReader); assert.throws(() => validate(f), /source-person evidence changed/);
  const g = fixture(); const id = 'fixture:001:p99999'; g.records.set(id, person(id));
  g.index = buildIdentityDossierIndex(g.records, [...g.clusters, { canonicalPersonId: 'per_added', localPeople: [id], retiredIds: [] }], keyReader);
  assert.throws(() => validate(g), /coverage changed/);
});

test('same-name bucket size never creates a complete comparison graph', () => {
  const samples = [];
  for (const size of [100, 1000, 10000]) {
    const start = performance.now(), f = fixture(size), elapsedMs = performance.now() - start;
    assert.equal(f.plan.metrics.generatedPairs, 0);
    assert.ok(f.plan.metrics.postingIdsVisited <= 3 * 2 * limits.maxPostingReadsPerKey);
    assert.ok(f.plan.cases.every(item => item.candidateDossiers.length <= limits.maxDossiersPerCase));
    assert.ok(f.plan.cases.every(item => item.retrieval.queries.some(query => query.totalDossiers === size && query.omitted)));
    samples.push({ bucketSize: size, chapterPeople: 3, postingIdsVisited: f.plan.metrics.postingIdsVisited,
      candidateDossiers: f.plan.metrics.candidateDossiers, generatedPairs: f.plan.metrics.generatedPairs, elapsedMs: Math.round(elapsedMs) });
  }
  console.log('bounded-identity-scaling ' + JSON.stringify(samples));
});


test('admission bounds cannot be widened by a caller', () => {
  const f = fixture();
  for (const key of Object.keys(limits)) assert.throws(() => planChapterIdentityReview(f.index, f.plan.scope, inputs,
    { ...limits, [key]: limits[key] + 1 }), /hard retrieval limit/);
});

test('an arbitrary Han substring is not a source identity witness', () => {
  const f = fixture(); f.report.reviews[0].sourceWitnesses[0].quote = '字';
  assert.throws(() => validate(f), /current primary source/);
});

test('complete accepted membership and an external primary anchor are required', () => {
  const f = fixture(); const merged = { canonicalPersonId: f.clusters[0].canonicalPersonId,
    localPeople: [...f.clusters[0].localPeople, ...f.clusters[3].localPeople], retiredIds: [f.clusters[3].canonicalPersonId] };
  f.index = buildIdentityDossierIndex(f.records, [merged, f.clusters[1], f.clusters[2], ...f.clusters.slice(4)], keyReader);
  f.plan = planChapterIdentityReview(f.index, f.plan.scope, inputs, limits);
  f.report.planFingerprint = f.plan.fingerprint;
  f.report.reviews = f.plan.cases.map(item => ({ caseId: item.id, canonicalPersonId: item.canonicalPersonId, verdict: 'approve',
    membershipReviewed: true, membershipFingerprint: item.canonicalMembership.fingerprint,
    ambiguityReviewed: true, unresolvedIdentity: true, reason: 'Retain source-backed identity with reviewed cross-chapter uncertainty.',
    sourceWitnesses: item.localPeople.map(localId => ({ localId, book: 'fixture', chapter: '001', unitId: 's0001', quote: '王偉' })) }));
  assert.throws(() => validate(f), /identity-anchor witness/);
  const item = f.plan.cases[0];
  f.report.reviews[0].sourceWitnesses.push({ localId: item.canonicalMembership.anchorLocalId,
    book: 'fixture', chapter: '002', unitId: 's0001', quote: '王偉' });
  assert.equal(validate(f).retained.length, 3);
  f.report.reviews[0].membershipReviewed = false;
  assert.throws(() => validate(f), /canonical membership/);
});

test('small complete candidate buckets still cannot mint separation certainty', () => {
  const f = fixture(4); assert.ok(f.plan.cases.every(item => !item.retrieval.overflow));
  f.report.reviews[0].unresolvedIdentity = false;
  assert.throws(() => validate(f), /ambiguity cannot become/);
});

test('normal native generic-title rules remain active in the dossier index', () => {
  const p = person('fixture:001:p001', '太子', 'Crown Prince'); p.claims[0].value.kind = 'title-name';
  const index = buildIdentityDossierIndex(new Map([[p.localId, p]]),
    [{ canonicalPersonId: 'per_title', localPeople: [p.localId], retiredIds: [] }], localNameKeys);
  assert.equal(index.postings.has('en:crown prince'), false); assert.equal(index.postings.has('zh:太子'), false);
});

test('canonical source Chinese partitions English lookups without a pair graph', () => {
  const a = person('fixture:001:p001', '王偉'), b = person('fixture:002:p002', '王維');
  const index = buildIdentityDossierIndex(new Map([[a.localId, a], [b.localId, b]]),
    [{ canonicalPersonId: 'per_a', localPeople: [a.localId], retiredIds: [] },
      { canonicalPersonId: 'per_b', localPeople: [b.localId], retiredIds: [] }], localNameKeys);
  const plan = planChapterIdentityReview(index, { book: 'fixture', chapter: '001' }, inputs, limits);
  assert.equal(plan.cases[0].candidateDossiers.length, 0);
  assert.equal(plan.cases[0].retrieval.overflow, false); assert.equal(plan.metrics.generatedPairs, 0);
  assert.ok(plan.cases[0].retrieval.queries.some(query => query.mode === 'source-Chinese-partition' && query.fullNamePostingCount === 2));
});


test('primary Chinese witness names preserve the existing approved variant equivalence', () => {
  const f = fixture(1), localId = f.clusters[0].localPeople[0]; f.records.set(localId, person(localId, '張機', 'Zhang Ji'));
  f.index = buildIdentityDossierIndex(f.records, f.clusters, localNameKeys);
  f.plan = planChapterIdentityReview(f.index, f.plan.scope, inputs, limits); const item = f.plan.cases[0];
  f.report.planFingerprint = f.plan.fingerprint; f.report.reviews[0].caseId = item.id;
  f.report.reviews[0].membershipFingerprint = item.canonicalMembership.fingerprint;
  f.report.reviews[0].sourceWitnesses[0].quote = '张机'; f.sourceUnits.set('fixture:001:s0001', '张机在京。');
  const certificate = validateRetainedDossierReview(f.index, f.plan, f.report, f.sourceUnits,
    'independent', ['host-author'], inputs, localNameKeys);
  assert.equal(certificate.retained.length, 1);
});
