import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadPrivateIdentityCandidate,projectPrivateIdentityIndex} from './lib/people-private-identity-inputs.mjs';
import {buildIdentityDossierIndex,planChapterIdentityReview,IDENTITY_REVIEW_LIMITS} from './lib/people-identity-dossiers.mjs';
import {resolveAcceptedPeopleClusters,localNameKeys} from './lib/people-resolution.mjs';
import {buildPeopleExtractionPacket,buildPeopleExtractionSeed} from './build-people-extraction-packet.mjs';
import {buildCompactInput} from './lib/people-compact.mjs';
import {loadProperNounMatcher} from './lib/people-candidates.mjs';
import {combinedDatePacket} from './lib/people-combined-curation-review.mjs';

const inputs=Object.fromEntries(['source','extraction','editorial','dateAudit'].map((k,i)=>[k,'sha256:'+String(i+1).repeat(64)]));
function person(id){const[b,c]=id.split(':');return{localId:id,promptVersion:7,preferredNameSuggestion:{en:'Wang Wei',zh:'王偉'},claims:[{id:b+':'+c+':c001',subject:id,predicate:'name',value:{en:'Wang Wei',zh:'王偉',kind:'personal-name'},certainty:'explicit',evidence:[b+':'+c+':s0001']}],mentions:[]};}
function index(people){const accepted=resolveAcceptedPeopleClusters(people),reader=buildIdentityDossierIndex(people,accepted.clusters,localNameKeys);reader.close=()=>{};return reader;}
test('new private members have stable native IDs, bounded candidates, and no merge or publication approval',()=>{
 const accepted=new Map(Array.from({length:30},(_,i)=>{const p=person('test:002:p'+String(i+1).padStart(3,'0'));return[p.localId,p];}));
 const own={localPeople:new Map([['test:001:p001',person('test:001:p001')]])},reader=index(accepted);
 const oldMembership=[...reader.localPersonMap],result=projectPrivateIdentityIndex(reader,own,{book:'test',chapter:'001'});
 const plan=planChapterIdentityReview(reader,{book:'test',chapter:'001'},inputs,IDENTITY_REVIEW_LIMITS),normal=index(new Map([...accepted,...own.localPeople]));
 assert.equal(reader.localPersonMap.get('test:001:p001'),normal.localPersonMap.get('test:001:p001'));
 for(const[id,canonical]of oldMembership)assert.equal(reader.localPersonMap.get(id),canonical);
 assert.equal(plan.cases.length,1);assert.ok(plan.cases[0].candidateDossiers.length<=8);assert.equal(plan.metrics.generatedPairs,0);
 assert.equal(result.publicationApproval,false);assert.equal(accepted.size,30);
});
test('private retained membership permits source evidence deltas but holds changed inventory or concrete false merges',()=>{
 const p=person('test:001:p001'),q=person('test:001:p002'),people=new Map([[p.localId,p],[q.localId,q]]),reader=index(people),own={localPeople:structuredClone(people)};
 own.localPeople.get(p.localId).preferredNameSuggestion.en='Wang Wei (source form)';
 assert.equal(projectPrivateIdentityIndex(reader,own,{book:'test',chapter:'001'},id=>people.get(id)).membershipChanges,0);
 const changed={localPeople:new Map([[p.localId,p]])};assert.throws(()=>projectPrivateIdentityIndex(reader,changed,{book:'test',chapter:'001'}),/inventory changed/);
 own.localPeople.get(p.localId).claims.push({id:'test:001:c003',subject:p.localId,predicate:'same-person',value:{person:q.localId},certainty:'explicit',evidence:['test:001:s0001']});
 assert.throws(()=>projectPrivateIdentityIndex(reader,own,{book:'test',chapter:'001'}),/accepted-membership replay/);
});
test('private projection refuses external positive identity and colliding source IDs',()=>{
 const p=person('test:001:p001'),own={localPeople:new Map([[p.localId,p]])},reader=index(new Map());
 p.claims.push({id:'test:001:c002',subject:p.localId,predicate:'same-person',value:{person:'test:002:p001'},certainty:'explicit',evidence:['test:001:s0001']});
 assert.throws(()=>projectPrivateIdentityIndex(reader,own,{book:'test',chapter:'001'}),/External positive identity/);
});
function filesFixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'private-identity-fixture-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const book='test',chapter='001',source={meta:{book,chapter},content:[{sentences:[{id:'s0001',zh:'王偉來。',translations:[{lang:'en',literal:'Wang Wei came.',idiomatic:'Wang Wei came.'}]}]}]};
 const matcher=loadProperNounMatcher(),packet=buildPeopleExtractionPacket(book,chapter,{chapterData:source,properNounMatcher:matcher});
 const extraction={schemaVersion:2,book,chapter,input:buildCompactInput(packet),run:{model:'offline',promptVersion:7,agentId:'author'},people:[['p001',['Wang Wei','王偉',null],'historical','A named traveler.',{n:[],r:[],a:['AD 1'],p:[],x:null},[[{kind:'personal-name',en:'Wang Wei',zh:'王偉'},'explicit',['s0001']]],[['official','explicit',['s0001']]]]],surfaces:[['p001','personal-name','zh','王偉',[['s0001',[0]]]],['p001','personal-name','en','Wang Wei',[['s0001',[0]]]]],claims:[['p001','attestation',{event:'Arrived in the fixture narrative.',sourceDate:{text:'Fixture year'},westernYear:{era:'AD',year:1,precision:'year'}},'explicit',['s0001']]],translationRepairs:[],candidateDispositions:[],coverage:Object.fromEntries(Object.entries(buildPeopleExtractionSeed(packet,'test').coverage).map(([k,v])=>[k,typeof v==='boolean'?true:v]))};
 const date=combinedDatePacket(book,chapter,source,extraction),documents={source,extraction,editorial:{pending:true},dateAudit:date},files={};
 for(const[k,d]of Object.entries(documents)){files[k]=path.join(dir,k+'.json');fs.writeFileSync(files[k],JSON.stringify(d)+'\n');}
 return{book,chapter,files,properNounMatcher:matcher};
}
test('private input loading preserves pending evidence and rejects byte drift without writing inputs',t=>{
 const f=filesFixture(t),before=Object.fromEntries(Object.entries(f.files).map(([k,p])=>[k,fs.readFileSync(p)])),candidate=loadPrivateIdentityCandidate(f);
 assert.equal(candidate.own.localPeople.size,1);assert.equal(candidate.metadata.chronologyApproval,false);candidate.assertUnchanged();
 for(const[k,p]of Object.entries(f.files))assert.deepEqual(fs.readFileSync(p),before[k]);
 fs.appendFileSync(f.files.editorial,' ');assert.throws(()=>candidate.assertUnchanged(),/changed during preparation: editorial/);
});
test('private inputs reject stale date generation and symlink substitutions',t=>{
 const f=filesFixture(t),date=JSON.parse(fs.readFileSync(f.files.dateAudit));date.extractionHash='sha256:'+'0'.repeat(64);fs.writeFileSync(f.files.dateAudit,JSON.stringify(date));
 assert.throws(()=>loadPrivateIdentityCandidate(f),/exact candidate generation/);
 const real=f.files.source+'.real';fs.renameSync(f.files.source,real);fs.symlinkSync(real,f.files.source);
 assert.throws(()=>loadPrivateIdentityCandidate(f),/absolute regular files/);
});
