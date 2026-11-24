import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareChapterEditorialHistory} from './lib/people-chapter-editorial-preparation.mjs';
import * as native from './lib/people-editorial-decisions.mjs';
const hash='sha256:'+'a'.repeat(64);
function fixture(){
 const repair=i=>({id:`test:001:r${String(i).padStart(4,'0')}`,unit:{id:'s'+String(i).padStart(4,'0'),kind:'paragraph-sentence',blockIndex:0,collection:'sentences',itemIndex:i-1},field:'idiomatic',before:'Wrong '+i,after:'Correct '+i,reason:'The source explicitly identifies this person.',confidence:'high',status:'applied'});
 const extraction={book:'test',chapter:'001',input:{chapterFingerprint:hash},translationRepairs:[repair(1),repair(2)]};
 const reviewed=native.editorialDecisionSeed({...extraction,translationRepairs:[{...repair(1),status:'proposed'}]});
 reviewed.reviewer={...reviewed.reviewer,name:'Independent reviewer',agentId:'actual-reviewer',runId:'actual-run',model:'test',completedAt:'2026-11-15T00:00:00.000Z'};
 reviewed.decisions=reviewed.proposals.map(p=>({repairId:p.id,decision:'accept',after:null,reason:p.reason,sourceWitness:{source:'chapter-text',citation:'test:001:'+p.unit.id,excerpt:'甲'}}));
 const options={extraction,canonical:null,current:reviewed,reviewerAgentId:'actual-reviewer',native};
 return{options,reviewed,repair};
}
test('preserves exact accepted review and seeds only the new corrections',()=>{
 const {options,reviewed}=fixture(),before=JSON.stringify(reviewed),r=prepareChapterEditorialHistory(options);
 assert.equal(r.document.schemaVersion,4);assert.deepEqual(native.editorialReviews(r.document)[0],reviewed);
 assert.equal(JSON.stringify(reviewed),before);assert.deepEqual(r.pendingRepairIds,['test:001:r0002']);
 assert.equal(r.document.reviews[1].reviewer.agentId,null);assert.equal(r.document.reviews[1].decisions[0].reason,'');
 assert.equal(r.approvalGranted,false);assert.equal(r.retainedReviewCount,1);
 assert.deepEqual(prepareChapterEditorialHistory({...options,current:r.document}).document,r.document);
});
test('first review uses the native single-review wrapper and remains unapproved',()=>{
 const {options}=fixture(),r=prepareChapterEditorialHistory({...options,current:{},reviewerAgentId:null});
 assert.equal(r.document.schemaVersion,3);assert.equal(r.document.reviewer.agentId,null);assert.equal(r.pendingRepairIds.length,2);
});
test('retains exact native-valid canonical history without an agent ID, without promoting incoming anonymous review',()=>{
 const {options,reviewed}=fixture();reviewed.reviewer.agentId=null;reviewed.reviewer.runId=null;
 assert.doesNotThrow(()=>native.validateEditorialDecisionDocument(reviewed));
 const before=structuredClone(reviewed),result=prepareChapterEditorialHistory({...options,canonical:reviewed});
 assert.deepEqual(native.editorialReviews(result.document)[0],before);
 assert.deepEqual(result.pendingRepairIds,['test:001:r0002']);assert.equal(result.approvalGranted,false);
 assert.throws(()=>prepareChapterEditorialHistory({...options,canonical:null}),/Partially written review/);
});
test('rejects uncaptured approval, changed canonical history and half-written templates',()=>{
 const {options,reviewed}=fixture();assert.throws(()=>prepareChapterEditorialHistory({...options,reviewerAgentId:'someone-else'}),/Uncaptured reviewer/);
 assert.throws(()=>prepareChapterEditorialHistory({...options,canonical:reviewed,current:{}}),/Canonical editorial history changed/);
 const template=native.editorialDecisionSeed({...options.extraction,translationRepairs:options.extraction.translationRepairs.map(r=>({...r,status:'proposed'}))});
 template.decisions[0].reason='A partial model response';
 assert.throws(()=>prepareChapterEditorialHistory({...options,current:template}),/Partially written review/);
});
test('changed accepted wording requires a fresh decision; exact native revise decisions can be retained',()=>{
 const {options,reviewed}=fixture();const changed=structuredClone(options.extraction);changed.translationRepairs[0].after='Different';
 assert.equal(prepareChapterEditorialHistory({...options,extraction:changed}).pendingRepairIds.length,2);
 reviewed.decisions[0].decision='revise';reviewed.decisions[0].after='Different';
 assert.deepEqual(prepareChapterEditorialHistory({...options,extraction:changed}).pendingRepairIds,['test:001:r0002']);
});
test('obsolete empty templates are retired as evidence rather than promoted to reviews',()=>{
 const {options}=fixture(),r=prepareChapterEditorialHistory({...options,current:{}});
 const next=structuredClone(options.extraction);next.translationRepairs[0].after='Changed';
 const result=prepareChapterEditorialHistory({...options,extraction:next,current:r.document});
 assert.equal(result.retiredTemplates.length,1);assert.equal(result.retainedReviewCount,0);assert.equal(result.document.reviewer.agentId,null);
});
test('an unchanged rejected set fails closed instead of making a duplicate review generation',()=>{
 const {options,reviewed}=fixture();options.extraction.translationRepairs=options.extraction.translationRepairs.slice(0,1);
 reviewed.decisions[0].decision='reject';
 assert.throws(()=>prepareChapterEditorialHistory(options),/Previously rejected corrections remain unchanged/);
 assert.equal(options.current.decisions[0].decision,'reject');
});
test('pending templates cannot pass the native applied-repair approval gate',()=>{
 const {options}=fixture(),r=prepareChapterEditorialHistory(options);
 assert.throws(()=>native.validateAppliedEditorialDecisions(r.document,options.extraction),/no matching independent/);
 const pending=r.document.reviews[1];pending.reviewer={...options.current.reviewer};
 pending.decisions=pending.proposals.map(p=>({repairId:p.id,decision:'accept',after:null,reason:p.reason,sourceWitness:{source:'chapter-text',citation:'test:001:'+p.unit.id,excerpt:'乙'}}));
 assert.doesNotThrow(()=>native.validateAppliedEditorialDecisions(r.document,options.extraction));
});
