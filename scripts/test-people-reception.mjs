import assert from 'node:assert/strict';
import test from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { personClaimReception, personReceptionErrors, APPROVED_RECEPTION_TYPES } from './lib/people-reception.mjs';
import { dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { personLifeSummary, representativePersonYear } from './lib/people-presentation.mjs';
import { personDetailClaimSections } from './generate-people-pages.mjs';
import { validateClaimVocabulary } from './validate-people-extraction.mjs';
import { reconcileRetrospectiveValue, reconcileRetrospectiveExtraction, reconcileRetrospectiveProposal } from './lib/people-reception-reconciliation.mjs';
import { readJson, PEOPLE_DIR } from './lib/people-content.mjs';
import { getPeopleSchemaValidator } from './lib/people-schema.mjs';

const year = value => ({ era: 'AD', year: value, precision: 'year' });
test('submission reconciliation preserves sealed before rows, hashes and raw input',()=>{
  const row=['p001','event-participation',{kind:'posthumous-reference',receptionType:'posthumous',action:'historically posthumous honor'},'explicit',['s0001']];
  const raw={sourceHash:'source',extractionHash:'extraction',changes:[{kind:'replace',before:row,after:structuredClone(row)}]};
  const saved=structuredClone(raw),{proposal,changes}=reconcileRetrospectiveProposal(raw);
  assert.deepEqual(raw,saved);assert.deepEqual(proposal.changes[0].before,row);
  assert.equal(proposal.sourceHash,raw.sourceHash);assert.equal(proposal.extractionHash,raw.extractionHash);
  assert.equal(proposal.changes[0].after[2].receptionType,'retrospective');
  assert.equal(proposal.changes[0].after[2].action,row[2].action);
  assert.equal(changes.length,1);assert.deepEqual(reconcileRetrospectiveProposal(proposal).changes,[]);
  const invented=structuredClone(raw);invented.changes[0].after[2].receptionType='invented';
  assert.equal(reconcileRetrospectiveProposal(invented).proposal.changes[0].after[2].receptionType,'invented');
});
test('production scripts and prompts do not emit or accept removed reception labels',()=>{
  const scripts=new URL('.',import.meta.url);
  const allowed=new Set(['lib/people-reception.mjs','lib/people-reception-reconciliation.mjs']);
  const removed=/posthumous-(?:reference|commemoration)|receptionType\s*(?::|=|===)\s*['"]posthumous['"]/u;
  for(const file of readdirSync(scripts,{recursive:true})) {
    if(!/\.(?:mjs|js)$/u.test(file)||file.startsWith('test-')||allowed.has(file))continue;
    assert.equal(removed.test(readFileSync(new URL(file,scripts),'utf8')),false,file);
  }
  for(const file of ['prompt-people-extraction.txt','prompt-people-extraction-compact.txt','prompt-people-date-review.txt']) {
    assert.equal(removed.test(readFileSync(new URL(`../${file}`,scripts),'utf8')),false,file);
  }
});
test('both extraction schemas enforce the same approved reception type',()=>{
  const compact=readJson(`${PEOPLE_DIR}/schema/compact-extraction.schema.json`);
  const expanded=readJson(`${PEOPLE_DIR}/schema/extraction.schema.json`);
  for(const valueSchema of [compact.$defs.claim.prefixItems[2],expanded.$defs.claim.properties.value]) {
    assert.deepEqual(valueSchema.properties.receptionType.enum,['retrospective']);
    const validate=getPeopleSchemaValidator().compile(valueSchema);
    assert.equal(validate({receptionType:'retrospective'}),true);
    for(const receptionType of ['posthumous','invented-label',null,{}])assert.equal(validate({receptionType}),false);
  }
});
test('approved reception vocabulary is exactly the user-approved single category',()=>{
  assert.deepEqual(APPROVED_RECEPTION_TYPES,['retrospective']);
});
test('production vocabulary validation rejects agent-invented reception categories',()=>{
  for(const receptionType of ['posthumous','commemorative','historical-reference','retrospective-ish','Retrospective','retrospective ',null,{},[]]) {
    const errors=[];
    validateClaimVocabulary({predicate:'event-participation',value:{kind:'retrospective-reference',receptionType}}, {},errors);
    assert.ok(errors.some(error=>error.includes('receptionType must be retrospective')),JSON.stringify(receptionType));
  }
  for(const kind of ['posthumous-reference','posthumous-commemoration',undefined]) {
    const errors=[];
    validateClaimVocabulary({predicate:'event-participation',value:{kind,receptionType:'retrospective'}},{},errors);
    assert.ok(errors.length,String(kind));
  }
  const errors=[];
  validateClaimVocabulary({predicate:'event-participation',value:{kind:'political',receptionType:'retrospective',action:'a source-specific recalled event'}},{},errors);
  assert.deepEqual(errors,[]);
});
test('removed reception categories are rejected, not silently classified',()=>{
  for(const value of [{kind:'posthumous-reference'},{action:'posthumous-commemoration'},{receptionType:'posthumous'}]) {
    assert.equal(personClaimReception({value}),null);
    assert.ok(personReceptionErrors({value}).length);
  }
});
test('reconciliation preserves names and evidence and is idempotent',()=>{
  const value={kind:'posthumous-commemoration',receptionType:'posthumous',action:'a historically posthumous honor',dateContext:{westernYear:year(320)}};
  const original=structuredClone(value),expected={...value,kind:'retrospective-reference',receptionType:'retrospective'};
  assert.deepEqual(reconcileRetrospectiveValue(value),expected);assert.deepEqual(value,original);
  assert.deepEqual(reconcileRetrospectiveValue({kind:'posthumous-name'}),{kind:'posthumous-name'});
  const e={schemaVersion:2,claims:[['p1','event-participation',value,'explicit',['s1']]]};
  const r=reconcileRetrospectiveExtraction(e);
  assert.equal(r.changes.length,1);assert.deepEqual(r.candidate.claims[0][4],['s1']);
  assert.deepEqual(reconcileRetrospectiveExtraction(r.candidate).changes,[]);
});
const reception = {
  id: 'c1', predicate: 'event-participation',
  value: { kind: 'retrospective-reference', role: 'honoree', dateContext: {
    sourceDate: { text: 'dated later commemoration' }, westernYear: year(320),
  } }, evidence: ['s1'],
};

test('only explicit reception semantics classify a claim', () => {
  assert.equal(personClaimReception(reception), 'retrospective');
  assert.equal(personClaimReception({ value: { kind: 'retrospective-reference' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { receptionType: 'retrospective' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { action: 'retrospective-reference' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { westernYear: year(1200), note: 'possibly posthumous' } }), null);
  assert.equal(personClaimReception({ predicate: 'name', value: { kind: 'posthumous-name' } }), null);
});

test('validation rejects reception as living attestation and contradictory classifications', () => {
  assert.deepEqual(personReceptionErrors(reception), []);
  assert.match(personReceptionErrors({ ...reception, predicate: 'attestation' }).join(), /not life events/);
  assert.match(personReceptionErrors({ value: { receptionType: 'alive' } }).join(), /must be/);
  assert.match(personReceptionErrors({ value: { kind: 'retrospective-reference', receptionType: 'invalid' } }).join(), /must be retrospective/);
  const errors = [];
  validateClaimVocabulary({ ...reception, predicate: 'attestation' }, {}, errors);
  assert.ok(errors.some(error => error.includes('not life events')));
  assert.ok(dateAuditDiagnostics({ items: [{ ...reception, predicate: 'attestation' }] })
    .some(item => item.problem.includes('not life events')));
});

test('undated reception is still included in the independent date audit', () => {
  const extraction = { schemaVersion: 2, people: [['p001', {}, 'historical', '', {}]],
    claims: [['p001', 'event-participation', { kind: 'retrospective-reference', role: 'quoted author' }, 'explicit', ['s1']]] };
  assert.equal(dateAuditItems(extraction).items[0].predicate, 'event-participation');
});

test('later reception retains its evidence without extending life, activity or search period', () => {
  const person = { life: { birth: [], death: [{ value: { westernYear: year(220) } }], ageClaims: [],
    attestedActivity: [{ value: { westernYear: year(200) } }] }, events: [reception],
    titlesAndHonors: [{ id: 'c2', predicate: 'honor', value: { receptionType: 'retrospective', title: 'honor' } }] };
  const baseline = { ...person, events: [], titlesAndHonors: [] };
  assert.equal(personLifeSummary(person), personLifeSummary(baseline));
  assert.deepEqual(representativePersonYear(person), representativePersonYear(baseline));
  const sections = new Map(personDetailClaimSections(person));
  assert.deepEqual(sections.get('Later references and commemoration'), [person.titlesAndHonors[0], reception]);
  assert.deepEqual(sections.get('Events and relationships'), []);
  assert.deepEqual(sections.get('Career and standing'), []);
  assert.equal(sections.get('Later references and commemoration')[1].evidence[0], 's1');
});
