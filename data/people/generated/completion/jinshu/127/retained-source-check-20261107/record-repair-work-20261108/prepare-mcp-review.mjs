import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {observeProvider} from '../../../093/bounded-independent-parts-eb9a-20261105/provider-observation.mjs';
import {dispatchMcpEnvironment,verifyDispatchWork} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/grokbot-dispatch-work.mjs';
import {readRosterWorkers} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/grokbot-headless-dispatch.mjs';
import {GrokbotReviewStore,reviewFingerprint} from '/Users/garrettpetersen/.local/share/24histories-grokbot-mcp/repo/scripts/lib/grokbot-review-store.mjs';
import {mutateRemotePeopleWorkLedger,readRemotePeopleWorkLedger} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
const refreshing=process.argv[2]==='--refresh-ticket';
assert.ok(process.argv.length===2 || (refreshing && process.argv.length===3));
const dir=path.dirname(fileURLToPath(import.meta.url)), root=process.cwd();
const W='/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime',service='/Users/garrettpetersen/.local/share/24histories-grokbot-mcp/repo';
const sha=b=>createHash('sha256').update(b).digest('hex'), file=path.join(dir,'record-review.input.json'), bytes=fs.readFileSync(file),input=JSON.parse(bytes), inputSha=sha(bytes);
const jobId='jinshu127-records-'+inputSha.slice(0,16),worker='grokbot-25', reviewer='04811f86-4236-4507-a9a1-08340fa2ec8a',key='jinshu/127';
const save=(file,obj)=>fs.writeFileSync(path.join(dir,file),JSON.stringify(obj,null,2)+'\n',{flag:'wx',mode:0o600});
function guard(){const g=inspectLocalDisk(root);assert.deepEqual(g.errors,[]);assert.deepEqual(g.memory.warnings,[]);}
function owner(l){const r=l.dateAudits[key];assert.equal(r.worker,input.owner);assert.equal(r.generationId,input.generationId);assert.equal(r.sourceHash,input.sourceHash);assert.equal(r.extractionHash,input.extractionHash);assert.equal(r.status,'research-blocked');assert.ok(!r.executorToken && !l.claims[key] && !l.identityReviews?.[key]?.activeRun);assert.ok(!Object.values(r.jobs).some(j=>['claimed','running','running-tools'].includes(j.status)));return r;}
const env=dispatchMcpEnvironment(path.join(root,'.env'));
function call(command,values){
 guard();
 const child=spawnSync(process.execPath,[W+'/scripts/grokbot-mcp-client.mjs',command,...Object.entries(values).flatMap(([k,v])=>['--'+k,v])],{env,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:60000});
 if(child.status!==0)throw Error('Authenticated MCP '+command+' failed, status '+child.status);
 return JSON.parse(child.stdout);
}
guard();owner(readRemotePeopleWorkLedger());assert.ok(readRosterWorkers().some(r=>r.worker===worker && r.id===reviewer && !r.isRunning));
const actual=observeProvider(r=>r.id===reviewer);assert.equal(actual.lastMessageId,actual.newestEntryId);assert.ok(!actual.lastMessageId.startsWith('tbs'));
const status=call('status',{worker});assert.ok(!status.reviewsError && !status.claims.some(c=>c.status==='claimed') && !status.reviews.some(r=>r.status==='pending-review' && r.id!==jobId));
for(const [p,h] of Object.entries(input.sealedFileSha256))assert.equal(sha(fs.readFileSync(p)),h);
const packet={inputSha256:inputSha,review:input};
const result={kind:'independent-record-correction-review',packetSha256:inputSha,book:input.book,chapter:input.chapter,candidateHash:input.candidateHash,
  reviewer:{agentId:reviewer,independentOfAuthors:true},decisions:[],supplementalRepairs:[]};
const closed=props=>({type:'object',properties:props,required:Object.keys(props),additionalProperties:false});
const str={type:'string',minLength:1}, constant=v=>({const:v});
const schema=closed({kind:constant(result.kind),packetSha256:constant(inputSha),book:constant(input.book),chapter:constant(input.chapter),candidateHash:constant(input.candidateHash),
  reviewer:closed({agentId:constant(reviewer),independentOfAuthors:constant(true)}),decisions:{type:'array',minItems:3,maxItems:3,items:closed({index:{type:'integer',minimum:0,maximum:2},verdict:{enum:['accept','reject','revise']},witness:str,reason:str})},
  supplementalRepairs:{type:'array',items:closed({book:constant(input.book),chapter:constant(input.chapter),unit:str,field:{enum:['literal','en']},before:str,after:str,sourceReason:str})}});
const job={schemaVersion:1,id:jobId,worker,kind:'editorial-review',book:input.book,chapter:input.chapter,sourceRevision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  reviewerAgentId:reviewer,authorAgentIds:input.excludedReviewerIds,prompt:'Independently assess all three proposed record changes in order against the actual Chinese and both English fields. Compare beforeSurfaces and afterSurfaces, both wordings and all local assignments. Decide accept/reject/revise separately with the exact proposed Chinese witness and a source-based reason; describe a complete revised wording if needed. Return any definite additional English omission as an exact complete replacement. Do not re-extract, merge people, authorize a whole-chapter audit, or approve the chapter. Use only this sealed MCP review. The host uses one shared checkout at '+root+' and isolated artifacts. Do not create another checkout, clone, copy, run Git/builds, delegate, call paid APIs, or mutate host files. The host runs npm run people:disk:check before dispatch/heavy work or workspace changes and every 60 seconds. Your only output is the review envelope via submit-chunk --kind review.',
  packet,draft:{schemaVersion:1,jobId,packetSha256:reviewFingerprint(packet),reviewer:{agentId:reviewer,name:'Grok Bot'},result},reportSchema:schema,
  hostOwnership:{worker:input.owner,scope:'Independent review of the three exact Jinshu 127 record and mention corrections under the existing source-quality owner. Return artifacts only.',receiptSha256:inputSha}};
const priorJob=owner(readRemotePeopleWorkLedger()).jobs[jobId];
if(!priorJob){
 mutateRemotePeopleWorkLedger(l=>{const r=owner(l);assert.ok(!r.jobs[jobId]);r.jobs[jobId]={kind:'independent-record-correction-review',status:'prepared',agentId:reviewer,transportWorker:worker,inputSha256:inputSha,inputFile:file,reviewJob:jobId,priorRunId:actual.lastMessageId,transport:'sealed-mcp'};},{message:'Bind one Jinshu 127 editorial review to its current source owner'});
}else{assert.equal(priorJob.status,'prepared');assert.equal(priorJob.inputSha256,inputSha);assert.equal(priorJob.agentId,reviewer);}
const store=new GrokbotReviewStore(service+'/data/people/generated/grokbot/review-jobs');
if(!fs.existsSync(store.jobFile(worker,jobId)))store.register(job);assert.deepEqual(store.read(worker,jobId),job);
const resumed=call('resume',{worker,'review-job':jobId,book:input.book,chapter:input.chapter});assert.equal(resumed.mode,'sealed-review');assert.equal(resumed.reviewJob,jobId);
const sealed=call('get-chunk',{'claim-token':resumed.claimToken,'chunk-id':'review'});assert.deepEqual(sealed.packet,packet);assert.deepEqual(sealed.draft,job.draft);
const clientSha256=sha(fs.readFileSync(W+'/scripts/grokbot-mcp-client.mjs'));assert.equal(sha(execFileSync('curl',['-fsS','https://grokbot-mcp.24histories.com/grokbot-mcp-client.mjs'])),clientSha256);
const ticket={id:jobId+'-dispatch-1',worker,kind:'sealed-review',reviewJob:jobId,clientSha256,book:input.book,chapter:input.chapter,issuedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+25*60000).toISOString(),claimToken:resumed.claimToken,chunks:[{id:'review',packetFingerprint:reviewFingerprint(packet),draftFingerprint:reviewFingerprint(job.draft)}]};
assert.equal(await verifyDispatchWork(ticket,call,{assertSafe:guard,reviewerAgentId:reviewer}),true);
if(refreshing){
 const original=JSON.parse(fs.readFileSync(path.join(dir,'mcp-ready.json')));
 assert.equal(original.jobSha256,reviewFingerprint(job));
 assert.equal(original.priorRunId,actual.lastMessageId);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'mcp-job.json'))),job);
 const state=JSON.parse(fs.readFileSync(path.join(os.homedir(),'.local/state/24histories-grokbot-headless/state.json')));
 assert.ok(!Object.values(state.dispatchJobs??{}).some(r=>r.reviewJob===jobId),'Prior send receipt requires reconciliation');
 const ticketPath=path.join(dir,'private-ticket.json'), previous=JSON.parse(fs.readFileSync(ticketPath)).jobs[0];
 assert.equal(previous.reviewJob,jobId);assert.ok(Date.parse(previous.expiresAt)<=Date.now(),'Existing ticket still usable');
 fs.linkSync(ticketPath,path.join(dir,'private-expired-'+Date.parse(previous.expiresAt)+'.json'));
 const replacement='private-renewed-'+Date.now()+'.json';save(replacement,{schemaVersion:1,jobs:[ticket]});
 fs.renameSync(path.join(dir,replacement),ticketPath);
 console.log('Refreshed private ticket for the existing pending job.');process.exit(0);
}
save('mcp-job.json',job);save('private-ticket.json',{schemaVersion:1,jobs:[ticket]});
const receipt={at:new Date().toISOString(),jobId,owner:input.owner,worker,reviewer,priorRunId:actual.lastMessageId,inputSha,jobSha256:reviewFingerprint(job),packetFingerprint:reviewFingerprint(packet),clientSha256,status:'prepared-and-read-back',dispatched:false,qualityApproved:false};save('mcp-ready.json',receipt);console.log(receipt);
