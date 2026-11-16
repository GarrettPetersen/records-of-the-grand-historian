import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {chapterRoleAgentId,remoteAdmissionLimit,remoteAdmissionInventory,measureRemoteAdmission,remoteContinuationSlot} from './lib/people-remote-admission.mjs';
const policy={completionThroughput:{targetPublishedChaptersPerDay:50,initialRemoteAssignments:4,maxRemoteAssignments:12}};
test('uses the same actual journal actor fields for inventory and retained campaign roles',()=>{
 const job={ownerAgentId:'grokbot:source-owner',reviewAgentId:'bc-independent-reviewer'};
 assert.equal(chapterRoleAgentId(job,'owner'),'grokbot:source-owner');assert.equal(chapterRoleAgentId(job,'reviewer'),'bc-independent-reviewer');
 assert.equal(chapterRoleAgentId({},'reviewer'),undefined);assert.throws(()=>chapterRoleAgentId(job,'review'),/Unknown chapter role/);
});
test('explicit remote policy replaces the serial cap and rejects invalid limits',()=>{
 assert.equal(remoteAdmissionLimit(policy),4);assert.equal(remoteAdmissionLimit(policy,'8'),8);assert.equal(remoteAdmissionLimit(policy,'12'),12);
 for(const n of ['0','13','oops','2.5'])assert.throws(()=>remoteAdmissionLimit(policy,n));assert.throws(()=>remoteAdmissionLimit({}));
});
test('counts other chapters, code reviews and uncertain dispatches without treating artifact directories as jobs',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'remote-admission-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const put=(folder,file,v)=>{fs.mkdirSync(path.join(dir,folder),{recursive:true});fs.writeFileSync(path.join(dir,folder,file),JSON.stringify(v));};
 const id='jinshu-056-0123456789ab';put(id,'job.json',{id,ownerAgentId:'bc-owner',ownerRunId:'run-owner',dispatch:{owner:{state:'sent',lane:'cursor-sdk'}}});
 put('artifact-only','notes.json',{note:'not a chapter'});put('release-review','review-state.json',{agentId:'bc-code',runId:'run-code'});
 const uncertain='jinshu-119-abcdef012345';put(uncertain,'job.json',{id:uncertain,reviewAgentId:'bc-pending',dispatch:{reviewer:{state:'dispatching',lane:'cursor-sdk'}}});
 const inventory=remoteAdmissionInventory(dir);assert.equal(inventory.jobs.length,2);
 const r=await measureRemoteAdmission(inventory,new Set(['grok-live']),async()=>({status:'running'}));
 assert.equal(r.activeCount,4);assert(r.occupied.includes('cursor:bc-owner'));assert(r.occupied.includes('cursor:bc-code'));
});
test('deduplicates overlapping inventory and fails closed on failed or unknown status measurement',async()=>{
 const inventory={runs:[{agentId:'bc-one',runId:'run-a'},{agentId:'bc-one',runId:'run-b'}],uncertain:['cursor:bc-one','grok:g1']};
 const r=await measureRemoteAdmission(inventory,new Set(['g1']),async()=>({status:'running'}));assert.equal(r.activeCount,2);
 await assert.rejects(measureRemoteAdmission(inventory,new Set(),async()=>{throw Error('Offline');}),/Offline/);
 await assert.rejects(measureRemoteAdmission(inventory,new Set(),async()=>({status:'unknown'})),/Unknown Cursor/);
});
test('completed remote conversations do not occupy active capacity',async()=>{
 const r=await measureRemoteAdmission({runs:[{agentId:'bc-a',runId:'run-a'}],uncertain:[]},new Set(),async()=>({status:'finished'}));assert.equal(r.activeCount,0);
});
test('counts an actual Cursor reviewer through the chapter journal reviewAgentId and reviewerRunId fields',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cursor-review-admission-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const id='jinshu-127-0123456789ab',d=path.join(dir,id);fs.mkdirSync(d);
 fs.writeFileSync(path.join(d,'job.json'),JSON.stringify({id,status:'reviewing',ownerAgentId:'grokbot:original-owner',reviewAgentId:'bc-actual-reviewer',reviewerRunId:'run-actual-reviewer',dispatch:{reviewer:{state:'sent',lane:'cursor-sdk'}}}));
 const inventory=remoteAdmissionInventory(dir);
 assert.deepEqual(inventory.runs,[{agentId:'bc-actual-reviewer',runId:'run-actual-reviewer'}]);
 const r=await measureRemoteAdmission(inventory,new Set(),async row=>{assert.equal(row.agentId,'bc-actual-reviewer');assert.equal(row.runId,'run-actual-reviewer');return{status:'running'};});
 assert.deepEqual(r.occupied,['cursor:bc-actual-reviewer']);assert.equal(r.activeCount,1);
 await assert.rejects(measureRemoteAdmission(inventory,new Set(),async()=>{throw Error('Reviewer status unavailable');}),/Reviewer status unavailable/);
});
test('deduplicates a sent Grok reviewer startup against the same actual live actor',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'grok-review-admission-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const id='jinshu-056-0123456789ab',d=path.join(dir,id);fs.mkdirSync(d);
 fs.writeFileSync(path.join(d,'job.json'),JSON.stringify({id,status:'reviewing',reviewAgentId:'grokbot:actual-reviewer',dispatch:{reviewer:{state:'sent',lane:'grokbot'}}}));
 const inventory=remoteAdmissionInventory(dir);assert.deepEqual(inventory.uncertain,['grok:actual-reviewer']);
 const r=await measureRemoteAdmission(inventory,new Set(['actual-reviewer']),async()=>{throw Error('Unexpected SDK status');});
 assert.deepEqual(r.occupied,['grok:actual-reviewer']);assert.equal(r.activeCount,1);
});
test('sent Grok startup retains its slot until a real chapter return without leaking slots from old roles',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'grok-admission-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const id='jinshu-056-abcdef012345',d=path.join(dir,id);fs.mkdirSync(d);const file=path.join(d,'job.json');
 const job={id,status:'working',ownerAgentId:'grokbot:g1',dispatch:{owner:{lane:'grokbot',state:'sent'}}};
 fs.writeFileSync(file,JSON.stringify(job));let r=await measureRemoteAdmission(remoteAdmissionInventory(dir),new Set(),async()=>{throw Error('Unexpected SDK call');});assert.equal(r.activeCount,1);
 assert.deepEqual(remoteContinuationSlot(r,'grokbot:g1',1),{reserved:true,admitted:true});
 assert.equal(remoteContinuationSlot(r,'bc-other',1).admitted,false);
 job.status='review-returned';fs.writeFileSync(file,JSON.stringify(job));r=await measureRemoteAdmission(remoteAdmissionInventory(dir),new Set(),async()=>null);assert.equal(r.activeCount,0);
 job.status='reviewing';fs.writeFileSync(file,JSON.stringify(job));assert.equal(remoteAdmissionInventory(dir).uncertain.length,0);
});
