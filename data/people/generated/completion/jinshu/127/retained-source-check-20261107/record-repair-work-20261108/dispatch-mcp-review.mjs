import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {dispatchMcpEnvironment,dispatchJobKey,readDispatchJobs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/grokbot-dispatch-work.mjs';
import {mutateRemotePeopleWorkLedger} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {observeProvider} from '../../../093/bounded-independent-parts-eb9a-20261105/provider-observation.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),name=path.join(dir,'private-ticket.json'),ticket=readDispatchJobs(name)[0],ready=JSON.parse(fs.readFileSync(path.join(dir,'mcp-ready.json'))),
  key=ready.jobId,token='mcp-'+randomUUID(), env=dispatchMcpEnvironment(path.resolve('.env'));
assert.ok(ticket && ticket.worker===ready.worker && ticket.reviewJob===key);
const root=process.cwd(), stateFile=path.join(os.homedir(),'.local/state/24histories-grokbot-headless/state.json');
const currentSend=()=>JSON.parse(fs.readFileSync(stateFile)).dispatchJobs?.[dispatchJobKey(ticket)];
assert.ok(!currentSend(),'Prior send must be reconciled');
const prior=observeProvider(r=>r.id===ready.reviewer);assert.equal(prior.lastMessageId,ready.priorRunId);assert.equal(prior.newestEntryId,prior.lastMessageId);
const guard=inspectLocalDisk(root);assert.deepEqual(guard.errors,[]);assert.deepEqual(guard.memory.warnings,[]);
function update(label,fn){return mutateRemotePeopleWorkLedger(l=>{const r=l.dateAudits['jinshu/127'];assert.equal(r.worker,ready.owner);assert.equal(r.generationId,'a6dc476b-5e0c-4284-b7dc-e61524ceb7c9');assert.ok(!l.claims['jinshu/127']&&!l.identityReviews?.['jinshu/127']?.activeRun);assert.equal(r.jobs[key].inputSha256,ready.inputSha);fn(r,r.jobs[key]);},{message:label});}
update('Reserve the independently assigned Jinshu 127 MCP review',(r,j)=>{assert.ok(!r.executorToken);assert.equal(j.status,'prepared');assert.ok(!Object.values(r.jobs).some(k=>['claimed','running','running-tools'].includes(k.status)));r.executorToken=token;r.executorHost=os.hostname();r.executorExpiresAt=new Date(Date.now()+35*60000).toISOString();j.status='claimed';});
const result=spawnSync(process.execPath,['--max-old-space-size=3072','/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/grokbot-headless-dispatch.mjs','once','--launch-app','--max-active','1','--workers',ready.worker,'--assignments',name],{env,encoding:'utf8',timeout:130000,stdio:['ignore','pipe','pipe']});
const send=currentSend();const now=observeProvider(r=>r.id===ready.reviewer);
const definitelyUnsent=!send&&now.lastMessageId===prior.lastMessageId&&now.newestEntryId===prior.newestEntryId;
const observation={at:new Date().toISOString(),jobId:key,exit:result.status,sendReceipt:send??null,provider:now,definitelyUnsent,
  dispatchMessage:(result.stderr||result.stdout||String(result.error)).replaceAll(env.GROKBOT_MCP_AUTH_TOKEN,'[redacted]').replaceAll(ticket.claimToken,'[redacted]').trim().slice(-1000)};
update('Record Jinshu 127 MCP dispatch outcome',(r,j)=>{assert.equal(r.executorToken,token);j.dispatchObservation=observation;if(definitelyUnsent){j.status='prepared';delete r.executorToken;delete r.executorHost;delete r.executorExpiresAt;}else if(send?.status==='dispatched'){j.status='running';}});
fs.writeFileSync(path.join(dir,'dispatch-'+Date.now()+'.json'),JSON.stringify(observation,null,2)+'\n',{flag:'wx'});console.log(observation);
