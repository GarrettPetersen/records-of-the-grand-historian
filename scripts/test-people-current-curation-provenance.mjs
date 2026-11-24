import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {recordCurrentChapterCuration} from './lib/people-current-curation-provenance.mjs';
const hash=b=>'sha256:'+createHash('sha256').update(b).digest('hex');
function fixture(){
 const raw={book:'test',chapter:'001',people:[['old-retained-person']],run:{model:'Grok Bot-chunked',promptVersion:7,agentId:null,runId:null,chunks:[{chunkId:'001',model:'Grok Bot',agentId:null,runId:null}]}},sourceBytes=Buffer.from('{"originalSource":true}'),extractionBytes=Buffer.from(JSON.stringify(raw));
 return{sourceBytes,extractionBytes,job:{book:'test',chapter:'001',status:'ready-for-review',ownerAgentId:'grokbot:actual-current-owner',reviewAgentId:'bc-independent-reviewer',authors:['grokbot:actual-current-owner'],unitIds:['s0001'],coveredUnits:['s0001'],revision:100},operations:[{role:'owner',operation:'finish',resultRevision:90,at:'2026-11-15T00:00:00Z'}],validation:{passed:true,sourceSha256:hash(sourceBytes),extractionSha256:hash(extractionBytes)},model:'Grok Bot full-chapter curation (provider model not exposed)'};
}
test('current curation metadata preserves unknown historical authors without inventing IDs or source facts',()=>{
 const f=fixture(),before=Buffer.from(f.extractionBytes),r=recordCurrentChapterCuration(f),raw=JSON.parse(before);
 assert.deepEqual(f.extractionBytes,before);assert.deepEqual(r.receipt.historicalRun,raw.run);assert.deepEqual(r.receipt.historicalUnknownChunkIds,['001']);
 assert.equal(r.receipt.oldChunksReattributed,false);assert.equal(r.receipt.approvalGranted,false);assert.equal(r.candidate.run.agentId,f.job.ownerAgentId);assert.equal(r.candidate.run.runId,null);
 assert.deepEqual({...r.candidate,run:raw.run},raw);assert.equal(r.receipt.independentReviewOfNewGenerationRequired,true);
});
test('missing full owner coverage, native byte drift, unfinished work and uncaptured identities fail',()=>{
 for(const mutate of [f=>f.job.coveredUnits=[],f=>f.job.status='working',f=>f.extractionBytes=Buffer.from(f.extractionBytes+' '),f=>f.validation.passed=false,f=>f.operations=[],f=>f.job.ownerAgentId=null,f=>f.job.reviewAgentId=f.job.ownerAgentId]){const f=fixture();mutate(f);assert.throws(()=>recordCurrentChapterCuration(f));}
});
test('current reconciliation cannot replace known historical authors or assume a legacy provider',()=>{
 for(const mutate of [raw=>raw.run.chunks[0].agentId='known-author',raw=>raw.run.chunks[0].model='Unknown provider']){const f=fixture(),raw=JSON.parse(f.extractionBytes);mutate(raw);f.extractionBytes=Buffer.from(JSON.stringify(raw));f.validation.extractionSha256=hash(f.extractionBytes);assert.throws(()=>recordCurrentChapterCuration(f));}
});
test('mixed known/unknown chunk authors and an identified aggregate author remain fail-closed',()=>{
 for(const mutate of [raw=>raw.run.chunks.push({chunkId:'002',model:'Grok Bot',agentId:'grokbot:known-historical-author'}),raw=>raw.run.agentId='grokbot:known-aggregate-author']){
  const f=fixture(),raw=JSON.parse(f.extractionBytes);mutate(raw);f.extractionBytes=Buffer.from(JSON.stringify(raw));f.validation.extractionSha256=hash(f.extractionBytes);
  assert.throws(()=>recordCurrentChapterCuration(f),/entirely anonymous historical chunks/);
 }
});
