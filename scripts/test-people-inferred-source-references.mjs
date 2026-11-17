import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewedInferredSourceReferences} from './lib/people-inferred-source-references.mjs';

function fixture() {
  const prefix='fixture:001:',unit=prefix+'s0001',id=prefix+'p003';
  const claim=(subject,predicate,value,certainty='strongly-inferred')=>({id:subject+':'+predicate,subject,predicate,value,certainty,evidence:[unit]});
  const named=(n,zh)=>({localId:prefix+n,preferredNameSuggestion:{zh},mentions:[],claims:[claim(prefix+n,'name',{kind:'personal',zh},'explicit')]});
  const sibling=named('p001','楊盛'),child=named('p002','倦');
  const person={localId:id,book:'fixture',chapter:'001',preferredNameSuggestion:{zh:'楊盛兄'},mentionException:'Unnamed elder brother, father of Juan.',mentions:[],claims:[
    claim(id,'name',{kind:'descriptive-kinship',zh:'楊盛兄'}),
    claim(id,'family-relationship',{relation:'sibling-of',personId:sibling.localId,kinshipTerm:{zh:'兄'},subjectRole:'elder-brother',objectRole:'younger-sibling',subjectRelativeAge:'elder'}),
    {...claim(id,'family-relationship',{relation:'parent-of',personId:child.localId,kinshipTerm:{zh:'父'},subjectRole:'father',objectRole:'son'}),id:id+':parent'}]};
  const source={id:'s0001',kind:'paragraph-sentence',blockIndex:0,collection:'sentences',itemIndex:0,zh:'楊盛遣兄子倦入寇長蛇。',en:'Yang Sheng sent his elder brother’s son Juan.'};
  const corpus={localPeople:new Map([sibling,child,person].map(p=>[p.localId,p])),chapters:[{extraction:{book:'fixture',chapter:'001'},packet:{units:[source]}}]};
  const certificate={scope:{book:'fixture',chapter:'001'},retained:[{caseId:'reviewed-case',canonicalPersonId:'canonical',localPeople:[id],sourceWitnesses:[{localId:id,book:'fixture',chapter:'001',unitId:'s0001',quote:'兄子倦'}]}]};
  const run=(certificates=[certificate])=>reviewedInferredSourceReferences([person],corpus,'canonical',certificates);
  return{person,corpus,certificate,source,run};
}
test('reviewed unnamed kinship yields an explicit inferred citation without fabricating a direct mention',()=>{
  const f=fixture(),before=structuredClone(f.person),refs=f.run();
  assert.equal(refs.length,1);assert.deepEqual(refs[0].mentionRefs,[]);
  assert.equal(refs[0].sourceQuote,'兄子倦');assert.equal(refs[0].reviewedCaseId,'reviewed-case');
  assert.deepEqual(refs[0].languages,['zh','en']);assert.deepEqual(refs[0].kinds,['inferred-kinship']);
  assert(refs[0].inference.includes('inferred'));assert.equal(refs[0].claimRefs.length,3);
  assert.deepEqual(f.person,before);assert.equal(refs[0].unitKind,'paragraph-sentence');
});
test('no independent proof, wrong scope, missing target or changed accepted identity supplies no citation',()=>{
  const f=fixture();assert.deepEqual(f.run([]),[]);
  for(const mutate of [c=>c.scope.chapter='002',c=>c.retained[0].localPeople=[],c=>c.retained[0].canonicalPersonId='other',c=>c.retained[0].sourceWitnesses=[]]){
    const c=structuredClone(f.certificate);mutate(c);assert.deepEqual(f.run([c]),[]);
  }
});
test('named people and arbitrary mention exceptions retain the existing direct-mention requirement',()=>{
  for(const mutate of [p=>p.claims[0].value.kind='personal',p=>p.claims[0].certainty='explicit',p=>delete p.mentionException,p=>p.mentions.push({id:'real-mention'})]){
    const f=fixture();mutate(f.person);assert.deepEqual(f.run(),[]);
  }
});
test('stale quotes, missing named relatives and false kinship edges fail loudly',()=>{
  for(const mutate of [f=>f.source.zh='楊盛遣兵。',f=>f.corpus.localPeople.delete('fixture:001:p002'),f=>f.person.claims[2].value.objectRole='father',f=>f.person.claims[1].evidence=['fixture:001:s0002']]){
    const f=fixture();mutate(f);assert.throws(()=>f.run(),/current primary source/);
  }
});
test('a current source packet is required and external anchor witnesses cannot become scoped facts',()=>{
  const f=fixture();delete f.corpus.chapters[0].packet;assert.throws(()=>f.run(),/Missing current/);
  const g=fixture();g.certificate.retained[0].sourceWitnesses[0].chapter='002';assert.deepEqual(g.run(),[]);
});
test('duplicate exact primary witnesses collapse to one cited passage',()=>{
  const f=fixture();f.certificate.retained[0].sourceWitnesses.push(structuredClone(f.certificate.retained[0].sourceWitnesses[0]));
  const refs=f.run();assert.equal(refs.length,1);assert.equal(refs[0].claimRefs.length,3);
});

function collectiveFixture() {
  const f=fixture(),id=f.person.localId,unit='fixture:001:s0001';
  f.person.preferredNameSuggestion={en:'Yuan Shu'};
  f.person.mentionException='Named only as one of 二袁 in the warning.';
  f.person.claims=[
    {id:'personal',subject:id,predicate:'name',value:{kind:'personal',en:'Yuan Shu'},certainty:'strongly-inferred',evidence:[unit]},
    {id:'collective',subject:id,predicate:'name',value:{kind:'alternate',en:'the two Yuans',zh:'二袁'},certainty:'explicit',evidence:[unit]}];
  f.source.zh='不可追二袁之蹤。';f.source.en='Do not follow the path of the two Yuans.';
  f.certificate.retained[0].sourceWitnesses[0].quote='二袁';
  return f;
}
test('Jinshu 117 Yuan Shu collective reference preserves the person without inventing an individual mention',()=>{
  const f=collectiveFixture(),before=structuredClone(f.person),refs=f.run();
  assert.equal(refs.length,1);assert.equal(refs[0].sourceQuote,'二袁');assert.deepEqual(refs[0].claimRefs,['collective','personal']);
  assert.deepEqual(refs[0].kinds,['reviewed-allusion']);assert.deepEqual(refs[0].mentionRefs,[]);
  assert(refs[0].inference.includes('independently reviewed'));assert.deepEqual(f.person,before);
});
test('Jinshu 117 explicit unnamed brother label retains its reviewed source citation',()=>{
  const f=collectiveFixture();f.person.claims=[{...f.person.claims[1],value:{kind:'descriptive-kinship',zh:'兄',en:"Yang Duo's elder brother"}}];
  f.source.zh='楊多使兄子良國至。';f.certificate.retained[0].sourceWitnesses[0].quote='兄';
  const refs=f.run();assert.equal(refs.length,1);assert.deepEqual(refs[0].kinds,['inferred-kinship']);assert.deepEqual(refs[0].mentionRefs,[]);
});
test('collective citations require current exact Chinese evidence, explicit attribution and an independent scoped proof',()=>{
  for(const mutate of [f=>f.person.claims[1].evidence=['fixture:001:s0002'],f=>f.person.claims[1].certainty='strongly-inferred',f=>f.person.claims[1].value.kind='personal',f=>delete f.person.claims[1].value.zh,f=>f.certificate.retained[0].sourceWitnesses[0].quote='二',f=>f.certificate.retained[0].localPeople=[]]){
    const f=collectiveFixture();mutate(f);assert.deepEqual(f.run(),[]);
  }
  const f=collectiveFixture();f.source.zh='追前人之蹤。';assert.throws(()=>f.run(),/current primary source/);
});
