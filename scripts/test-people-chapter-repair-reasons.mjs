import test from 'node:test';
import assert from 'node:assert/strict';
import * as native from './lib/people-editorial-decisions.mjs';
import {prepareChapterEditorialHistory} from './lib/people-chapter-editorial-preparation.mjs';
import {bindChapterRepairReasonMetadata} from './lib/people-chapter-native-inputs.mjs';
function fixture(){
 const repair={id:'test:001:r0001',unit:{id:'s0001',kind:'paragraph-sentence',blockIndex:0,collection:'sentences',itemIndex:0},field:'idiomatic',before:'Wrong',after:'Correct',reason:'The author identifies the named source actor.',confidence:'high',status:'applied'};
 const extraction={book:'test',chapter:'001',input:{chapterFingerprint:'sha256:'+'a'.repeat(64)},translationRepairs:[repair]};
 const review=native.editorialDecisionSeed({...extraction,translationRepairs:[{...repair,status:'proposed'}]});
 review.reviewer={...review.reviewer,name:'Independent reviewer',agentId:'actual-reviewer',runId:'actual-run',model:'test',completedAt:'2026-11-16T00:00:00.000Z'};
 review.decisions=[{repairId:repair.id,decision:'accept',after:null,reason:'Independent reading confirms the actor named in Chinese.',sourceWitness:{source:'chapter-text',citation:'test:001:s0001',excerpt:'甲'}}];
 const candidate={schemaVersion:2,book:'test',chapter:'001',run:{agentId:'source-author'},people:[['p001',['甲']]],claims:[],translationRepairs:[[repair.unit.id,repair.field,repair.before,repair.after,repair.reason,repair.confidence,'applied']]};
 const options={priorRepairCount:0,canonicalReviewCount:0,actualReviewerAgentId:'actual-reviewer',authorAgentIds:['source-author'],native};return{repair,extraction,review,candidate,options};
}
test('different independent reasoning does not reseed an accepted exact correction',()=>{
 const f=fixture(),before=JSON.stringify(f.review),r=prepareChapterEditorialHistory({extraction:f.extraction,canonical:null,current:f.review,reviewerAgentId:'actual-reviewer',native});
 assert.deepEqual(r.pendingRepairIds,[]);assert.equal(JSON.stringify(f.review),before);assert.deepEqual(native.editorialReviews(r.document),[f.review]);assert.equal(r.approvalGranted,false);
 const e=structuredClone(f.extraction);e.translationRepairs[0].reason=f.review.decisions[0].reason;
 assert.deepEqual(prepareChapterEditorialHistory({extraction:e,canonical:null,current:f.review,reviewerAgentId:'actual-reviewer',native}).pendingRepairIds,[]);
 e.translationRepairs[0].after='Different unreviewed wording';assert.equal(prepareChapterEditorialHistory({extraction:e,canonical:null,current:f.review,reviewerAgentId:'actual-reviewer',native}).pendingRepairIds.length,1);
});
test('reason binding satisfies the strict native reason gate without changing raw source records',()=>{
 const f=fixture(),before=JSON.stringify(f.candidate),old=JSON.stringify(f.review);
 assert.throws(()=>native.validateAppliedEditorialDecisions(f.review,f.extraction),/lost review reasoning/);
 const result=bindChapterRepairReasonMetadata(f.candidate,f.review,f.options);
 assert.equal(result.changes.length,1);assert.equal(result.candidate.translationRepairs[0][4],f.review.decisions[0].reason);
 assert.equal(JSON.stringify(f.candidate),before);assert.equal(JSON.stringify(f.review),old);assert.equal(result.semanticApprovalCreated,false);
 const expected=structuredClone(f.candidate);expected.translationRepairs[0][4]=f.review.decisions[0].reason;assert.deepEqual(result.candidate,expected);
 const expanded=structuredClone(f.extraction);expanded.translationRepairs[0].reason=result.candidate.translationRepairs[0][4];assert.doesNotThrow(()=>native.validateAppliedEditorialDecisions(f.review,expanded));
 assert.deepEqual(bindChapterRepairReasonMetadata(result.candidate,f.review,f.options).changes,[]);
});
test('old canonical repair history remains byte exact',()=>{
 const f=fixture(),r=bindChapterRepairReasonMetadata(f.candidate,f.review,{...f.options,priorRepairCount:1,canonicalReviewCount:1});assert.deepEqual(r.candidate,f.candidate);assert.deepEqual(r.changes,[]);
});
test('uncaptured approvals, author approvals and third-party replacement reasoning fail closed',()=>{
 const f=fixture();assert.throws(()=>bindChapterRepairReasonMetadata(f.candidate,f.review,{...f.options,actualReviewerAgentId:'other-reviewer'}),/Uncaptured/);
 assert.throws(()=>bindChapterRepairReasonMetadata(f.candidate,f.review,{...f.options,authorAgentIds:['source-author','actual-reviewer']}),/independent/);
 f.candidate.translationRepairs[0][4]='Unreviewed third-party claim';assert.throws(()=>bindChapterRepairReasonMetadata(f.candidate,f.review,f.options),/reasoning differs/);
});
test('duplicate accepted decisions cannot be silently collapsed',()=>{
 const f=fixture(),document={schemaVersion:4,book:'test',chapter:'001',reviews:[f.review,f.review].map(({schemaVersion,book,chapter,...r})=>r)};
 assert.throws(()=>bindChapterRepairReasonMetadata(f.candidate,document,f.options),/Duplicate accepted/);
});
test('rejected or changed wording is never made to look independently applied',()=>{
 const f=fixture();f.review.decisions[0].decision='reject';assert.deepEqual(bindChapterRepairReasonMetadata(f.candidate,f.review,f.options).changes,[]);
 assert.throws(()=>native.validateAppliedEditorialDecisions(f.review,f.extraction),/rejected/);
 f.review.decisions[0].decision='accept';f.candidate.translationRepairs[0][3]='Unapproved changed after';assert.deepEqual(bindChapterRepairReasonMetadata(f.candidate,f.review,f.options).changes,[]);
});
