import assert from 'node:assert/strict';
import test from 'node:test';
import {extractionVocabularyErrors} from './check-people-vocabulary.mjs';

const context={roles:[{id:'official'}],polities:[{id:'jin'}],reigns:[{id:'jin-test'}]};
function fixture(){return {schemaVersion:2,book:'fixture',chapter:'001',input:{unitCount:0,chapterFingerprint:`sha256:${'0'.repeat(64)}`,candidateScannerVersion:2,unitDigests:[]},run:{model:'fixture',promptVersion:7},people:[],surfaces:[],claims:[],translationRepairs:[],candidateDispositions:[],coverage:{allUnitsVisited:true,preflightCandidatesAccountedFor:true,unresolvedReferences:[]}};}
const row=(predicate,value,certainty='explicit')=>['p001',predicate,value,certainty,['s0001']];
test('vocabulary gate accepts approved values and descriptive event text',()=>{
  const e=fixture();e.claims=[row('event-participation',{kind:'a source-specific event',action:'Posthumous honors were granted.'}),row('event-participation',{kind:'retrospective-reference',receptionType:'retrospective',action:'remembered'}),row('family-relationship',{relation:'child-of',personId:'p002',parentage:'biological'}),row('polity-association',{polityId:'jin',reignId:'jin-test'})];
  assert.deepEqual(extractionVocabularyErrors(e,context),[]);
});
test('vocabulary gate rejects invented schema and semantic labels',()=>{
  const cases=[row('invented-predicate',{}),row('sex',{},'inferred'),row('event-participation',{kind:'posthumous-reference',action:'remembered'}),row('event-participation',{kind:'retrospective-reference',receptionType:'posthumous',action:'remembered'}),row('family-relationship',{relation:'invented',personId:'p002'}),row('family-relationship',{relation:'child-of',personId:'p002',parentage:'invented'}),row('polity-association',{polityId:'invented'}),row('attestation',{reignId:'invented'})];
  for(const claim of cases){const e=fixture();e.claims=[claim];assert.ok(extractionVocabularyErrors(e,context).length,JSON.stringify(claim));}
});
test('vocabulary gate rejects unknown schemas and malformed rows',()=>{
  assert.ok(extractionVocabularyErrors({schemaVersion:999},context).length);
  const e=fixture();e.claims=[null];assert.ok(extractionVocabularyErrors(e,context).length);
});
test('compact person role IDs and every controlled family qualifier are checked',()=>{
  const e=fixture();e.people=[['p001',['Jia','甲',null],'historical','Official',{n:[],r:[],a:[],p:[],x:null},[[{kind:'personal-name',en:'Jia'},'explicit',['s0001']]],[['official','explicit',['s0001']]]]];
  assert.deepEqual(extractionVocabularyErrors(e,context),[]);
  e.people[0][6][0][0]='invented';assert.ok(extractionVocabularyErrors(e,context).some(x=>x.includes('unknown roleId')));
  for(const field of ['parentage','line','sharedParentage','subjectRelativeAge','unionCategory','relationshipState']){
    const f=fixture();f.claims=[row('family-relationship',{relation:'child-of',personId:'p002',[field]:'invented'})];
    assert.ok(extractionVocabularyErrors(f,context).some(x=>x.includes('unknown')),field);
  }
});
