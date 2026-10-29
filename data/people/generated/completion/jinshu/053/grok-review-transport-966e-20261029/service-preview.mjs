import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {GrokbotMcpBridge} from '/Users/garrettpetersen/.local/share/24histories-grokbot-mcp/repo/scripts/lib/grokbot-mcp-bridge.mjs';
import {GrokbotReviewStore,reviewFingerprint} from '/Users/garrettpetersen/.local/share/24histories-grokbot-mcp/repo/scripts/lib/grokbot-review-store.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'grok-live-dependency-preview-'));fs.chmodSync(dir,0o700);
try{
 const store=new GrokbotReviewStore(path.join(dir,'private-review-store')),job={schemaVersion:1,id:'local-fixture-no-inference',worker:'grokbot-24',kind:'editorial-review',book:'jinshu',chapter:'053',sourceRevision:'966eecf6d00d0f14c72b46d94aff65f2790810e7',reviewerAgentId:'fixture-independent-agent',authorAgentIds:['fixture-original-author'],prompt:'Fixture only. No model prompt, no canonical data, no publication.',packet:{units:[{id:'fixture',zh:'測試'}]},draft:{},reportSchema:{type:'object',additionalProperties:false,required:['verdict'],properties:{verdict:{enum:['hold']}}},hostOwnership:{worker:'fixture-host',scope:'local transport dependency test only',receiptSha256:'a'.repeat(64)}};
 store.register(job);const b=new GrokbotMcpBridge({claimSecret:'fixture-only-claim-secret-'+'x'.repeat(32),reviewStore:store});
 const status=b.status({worker:job.worker});assert.ok(!status.claims.some(c=>c.status==='claimed'),'Existing extraction now owns worker; do not continue');
 const resumed=await b.resumeOrClaim({worker:job.worker,reviewJob:job.id}),input=b.getChunk({claimToken:resumed.claimToken,chunkId:'review'});assert.deepEqual(input.packet,job.packet);
 const received=b.submitChunk({claimToken:resumed.claimToken,chunkId:'review',report:{schemaVersion:1,jobId:job.id,packetSha256:reviewFingerprint(job.packet),reviewer:{agentId:job.reviewerAgentId,name:'Fixture only'},result:{verdict:'hold'}}});
 assert.equal(received.qualityApproved,false);assert.equal(received.published,false);assert.deepEqual(await b.finalizeChapter({claimToken:resumed.claimToken}),received);
 console.log(JSON.stringify({passed:true,realServiceDependencies:true,liveReadOnlyLedgerChecks:true,productionClaimsChanged:false,actualServiceFilesChanged:false,inferenceDispatched:false}));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
