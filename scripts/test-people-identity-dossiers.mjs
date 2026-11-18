import './test-people-inferred-intermediary-witness.mjs';
import './test-people-inferred-paternal-witness.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { localNameKeys } from './lib/people-resolution.mjs';
import { buildIdentityDossierIndex, planChapterIdentityReview, validateRetainedDossierReview, assertDossierPrimaryWitness } from './lib/people-identity-dossiers.mjs';

const inputs = Object.fromEntries(['source', 'extraction', 'editorial', 'dateAudit'].map((key, i) => [key, `sha256:${String(i + 1).repeat(64)}`]));
const limits = { maxDossiersPerCase: 8, maxKeysPerCase: 16, maxPostingReadsPerKey: 8 };
const keyReader = person => person.keys;
function inferredFatherFixture(text='楊盛遣兄子倦入寇長蛇。',relativeNames=['楊盛','倦']){
 const localId='fixture:001:p099',unit='fixture:001:s0001';
 const father={localId,mentionException:'Individuated only as the elder brother and father implied by 兄子.',mentions:[],claims:[
  {id:'n',subject:localId,predicate:'name',value:{kind:'descriptive-kinship',zh:'楊盛兄'},certainty:'strongly-inferred',evidence:[unit]},
  {id:'s',subject:localId,predicate:'family-relationship',value:{relation:'sibling-of',personId:'fixture:001:p001',kinshipTerm:{zh:'兄'},subjectRole:'elder-brother',objectRole:'younger-sibling',subjectRelativeAge:'elder'},certainty:'strongly-inferred',evidence:[unit]},
  {id:'p',subject:localId,predicate:'family-relationship',value:{relation:'parent-of',personId:'fixture:001:p002',kinshipTerm:{zh:'父'},subjectRole:'father',objectRole:'son'},certainty:'strongly-inferred',evidence:[unit]},
 ]};
 const relatives=new Map(relativeNames.map((name,i)=>{const localId=`fixture:001:p00${i+1}`;return[localId,{localId,mentions:[],claims:[{id:'n'+i,subject:localId,predicate:'name',value:{kind:'personal',zh:name},certainty:'explicit',evidence:[unit]}]}];}));
 const keys=p=>p.claims.filter(c=>c.predicate==='name').map(c=>({language:'zh',key:'zh:'+c.value.zh,sources:[c.id]}));
 return{father,keys,relatives,source:new Map([[unit,text]]),witness:{localId,book:'fixture',chapter:'001',unitId:'s0001',quote:text}};
}
test('source-individuated unnamed elder-brother fathers retain their existing 兄子 witnesses',()=>{
 for(const [text,names] of [['楊盛遣兄子倦入寇長蛇。',['楊盛','倦']],['勃勃遣兄子提南侵池陽。',['勃勃','提']],['德迎其兄子超于長安',['德','超']]]){
  const f=inferredFatherFixture(text,names);assert.doesNotThrow(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives));
  f.witness.quote='兄子'+names[1];assert.doesNotThrow(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives));
 }
});
test('inferred intermediary witness requires both exact source-linked relations and roles',()=>{
 const mutations=[
  f=>delete f.father.mentionException,
  f=>{f.father.claims=f.father.claims.filter(c=>c.id!=='s');},
  f=>{f.father.claims=f.father.claims.filter(c=>c.id!=='p');},
  f=>{f.father.claims[2].evidence=['fixture:001:s0002'];},
  f=>{f.father.claims[1].value.subjectRole='younger-brother';},
  f=>{f.father.claims[2].value.objectRole='father';},
  f=>{f.father.claims[2].value.personId=f.father.claims[1].value.personId;},
  f=>{f.father.claims[1].certainty='explicit';},
  f=>{f.father.claims[0].value.kind='personal';},
  f=>{f.father.mentions=[{unit:{id:'s0001'},spans:{zh:[],en:[]}}];},
 ];
 for(const mutate of mutations){const f=inferredFatherFixture();mutate(f);assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives),/current primary source/);}
});
test('inferred intermediary witness still requires the entire quoted 兄子 compound in the exact current unit',()=>{
 for(const quote of ['兄','兄子','父','德兄','兄子倦不存在']){const f=inferredFatherFixture();f.witness.quote=quote;assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives),/current primary source/);}
 const f=inferredFatherFixture();f.witness.unitId='s0002';assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,()=>[]),/current primary source/);
});
test('unnamed intermediary witness requires independently source-linked sibling and nephew names',()=>{
 for(const mutate of [f=>f.relatives.delete('fixture:001:p002'),f=>{f.relatives.get('fixture:001:p002').claims[0].evidence=['fixture:001:s0002'];},f=>{f.relatives.get('fixture:001:p001').claims[0].value.zh='不存在';}]){
  const f=inferredFatherFixture();mutate(f);assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives),/current primary source/);
 }
 const f=inferredFatherFixture();assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys),/current primary source/);
});
function inferredMotherFixture(shared=false){
 const f=inferredFatherFixture(shared?'懿左常侍張敞諫懿曰：殿下以母弟之親。':'恢舅苟和時為立節將軍。',shared?['懿','泓']:['恢','苟和']),id=f.father.localId,unit='fixture:001:s0001';
 f.father.claims=[{id:'n',subject:id,predicate:'name',value:{kind:'descriptive-kinship',zh:shared?'姚泓之母':'姚恢之母'},certainty:'strongly-inferred',evidence:[unit]},
  {id:'p',subject:id,predicate:'family-relationship',value:{relation:'parent-of',personId:'fixture:001:p001',kinshipTerm:{zh:'母'},subjectRole:'mother',objectRole:'son',line:'maternal'},certainty:'strongly-inferred',evidence:[unit]}];
 if(shared){
  f.father.claims.push({...structuredClone(f.father.claims[1]),id:'p2',value:{...f.father.claims[1].value,personId:'fixture:001:p002'}});
  f.relatives.get('fixture:001:p001').claims.push({id:'s',subject:'fixture:001:p001',predicate:'family-relationship',value:{relation:'sibling-of',personId:'fixture:001:p002',kinshipTerm:{zh:'母弟'},subjectRole:'younger-brother',objectRole:'elder-brother',line:'maternal',sharedParentage:'full'},certainty:'explicit',evidence:[unit]});
  f.witness.quote='母弟';
 }else{
  const uncle=f.relatives.get('fixture:001:p002');
  uncle.claims.push({id:'s',subject:uncle.localId,predicate:'family-relationship',value:{relation:'sibling-of',personId:id,kinshipTerm:{zh:'舅'},subjectRole:'brother',objectRole:'sister',line:'maternal'},certainty:'strongly-inferred',evidence:[unit]},
   {id:'k',subject:uncle.localId,predicate:'family-relationship',value:{relation:'kin-of',personId:'fixture:001:p001',kinshipTerm:{zh:'舅'},subjectRole:'maternal-uncle',objectRole:'nephew',line:'maternal'},certainty:'explicit',evidence:[unit]});
  f.witness.quote='恢舅';
 }
 return f;
}
test('explicit maternal-uncle and same-mother source constructions support unnamed mothers',()=>{
 for(const shared of [false,true]){const f=inferredMotherFixture(shared);assert.doesNotThrow(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives));}
});
test('unnamed-mother witness rejects incomplete, paternal or detached source graphs',()=>{
 const cases=[
  [false,f=>{f.relatives.get('fixture:001:p002').claims=f.relatives.get('fixture:001:p002').claims.filter(c=>c.id!=='s');}],
  [false,f=>{f.relatives.get('fixture:001:p002').claims.find(c=>c.id==='k').value.line='paternal';}],
  [false,f=>{f.relatives.get('fixture:001:p002').claims.find(c=>c.id==='s').evidence=['fixture:001:s0002'];}],
  [false,f=>{f.witness.quote='舅';}],
  [true,f=>{f.father.claims.pop();}],
  [true,f=>{f.relatives.get('fixture:001:p001').claims.find(c=>c.id==='s').value.sharedParentage='uncertain';}],
  [true,f=>{f.relatives.get('fixture:001:p001').claims.find(c=>c.id==='s').value.line='paternal';}],
  [true,f=>{f.relatives.delete('fixture:001:p002');}],
 ];
 for(const[shared,mutate]of cases){const f=inferredMotherFixture(shared);mutate(f);assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives),/current primary source/);}
});
test('non-mention same-person witness requires already accepted membership and exact linked name evidence',()=>{
 const f=inferredFatherFixture('姚泓，興之長子也。',['興','泓']),id=f.father.localId,unit='fixture:001:s0001';
 f.father.claims=[{id:'n',subject:id,predicate:'name',value:{kind:'personal',zh:'姚興'},certainty:'explicit',evidence:[unit]},
  {id:'same',subject:id,predicate:'same-person',value:{personId:'fixture:001:p001'},certainty:'strongly-inferred',evidence:[unit]}];
 f.witness.quote='興';const accepted=new Map([[id,'accepted-canonical'],['fixture:001:p001','accepted-canonical']]);
 assert.doesNotThrow(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives,accepted));
 accepted.set(id,'separate-canonical');assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives,accepted),/current primary source/);
 accepted.set(id,'accepted-canonical');f.father.claims[1].evidence=['fixture:001:s0002'];assert.throws(()=>assertDossierPrimaryWitness(f.witness,f.father,f.source,f.keys,new Map(),f.relatives,accepted),/current primary source/);
});
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


test('freshly validated Chinese abbreviations and kinship spans support primary witnesses', () => {
  const f = fixture(3), person = f.records.values().next().value;
  person.claims[0].value.zh = '王衍長女';
  person.keys[0].key = 'zh:王衍長女'; person.keys[0].value = '王衍長女';
  person.mentions = [{ person: person.localId, unit: { id: 's0001' }, kind: 'kinship-reference', spans: { zh: [{ exact: '長女' }], en: [] } }];
  // Re-seal the changed fixture's current evidence rather than retagging a proof.
  const index = buildIdentityDossierIndex(f.records, f.clusters, keyReader);
  const plan = planChapterIdentityReview(index, f.plan.scope, inputs, limits);
  const item = plan.cases.find(c => c.localPeople.includes(person.localId));
  const row = f.report.reviews.find(c => c.sourceWitnesses.some(w => w.localId === person.localId));
  row.caseId = item.id; row.membershipFingerprint = item.canonicalMembership.fingerprint;
  row.sourceWitnesses[0].quote = '衍長女';
  f.report.planFingerprint = plan.fingerprint;
  f.sourceUnits.set('fixture:001:s0001', '王偉至，衍長女美。');
  assert.doesNotThrow(() => validateRetainedDossierReview(index, plan, f.report, f.sourceUnits,
    'independent', ['host-author'], inputs, keyReader));
  row.sourceWitnesses[0].quote = '美';
  assert.throws(() => validateRetainedDossierReview(index, plan, f.report, f.sourceUnits,
    'independent', ['host-author'], inputs, keyReader), /does not support/);
});
