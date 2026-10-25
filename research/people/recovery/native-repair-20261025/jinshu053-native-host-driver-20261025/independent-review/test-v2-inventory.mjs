import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {test} from 'node:test';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readWorkflowInventory,assertWorkflowInventory,assertNoFutureDateArtifacts,assertBaselineArtifacts,assertNoCachedReviewArtifacts} from '../guards-v2.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {acquireProcessRunLock}=await import(pathToFileURL(path.join(runtime,'scripts/lib/process-run-lock.mjs')).href);
test('v2 rejects future artifacts, changed baseline, future plans/jobs, symlinks and directories',t=>{
 const root=fs.mkdtempSync(path.join(here,'inventory-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 for(const name of ['audit-0-fixture.json','review-0.json','state.json'])fs.writeFileSync(path.join(root,name),'{}');
 const inventory=readWorkflowInventory(root),state={reviewPlans:{'audit-0':{}},jobs:{'audit-0-fixture':{},'repair-0-fixture':{status:'interrupted'}}};
 assertWorkflowInventory(root,inventory);assertNoFutureDateArtifacts(root,state);assertBaselineArtifacts(root,inventory);assertNoCachedReviewArtifacts(root);
 for(const name of ['candidate-1.json','review-1.json','reaudit-1-valid-matching-review.json','publication.json','editorial-amendment.json']){
  const file=path.join(root,name);fs.writeFileSync(file,'{}');
  assert.throws(()=>assertWorkflowInventory(root,inventory));assert.throws(()=>assertNoFutureDateArtifacts(root,state));
  if(!name.startsWith('candidate'))assert.throws(()=>assertNoCachedReviewArtifacts(root));fs.unlinkSync(file);
 }
 for(const field of ['reviewPlans','jobs']){
  const changed=structuredClone(state);changed[field]['reaudit-1']={};assert.throws(()=>assertNoFutureDateArtifacts(root,changed));
 }
 fs.writeFileSync(path.join(root,'review-0.json'),'{"changed":true}');assert.throws(()=>assertWorkflowInventory(root,inventory));assert.throws(()=>assertBaselineArtifacts(root,inventory));fs.writeFileSync(path.join(root,'review-0.json'),'{}');
 fs.mkdirSync(path.join(root,'nested'));assert.throws(()=>readWorkflowInventory(root));fs.rmdirSync(path.join(root,'nested'));
 fs.symlinkSync(path.join(root,'review-0.json'),path.join(root,'link'));assert.throws(()=>readWorkflowInventory(root));fs.unlinkSync(path.join(root,'link'));
 assertWorkflowInventory(root,inventory);
});
test('actual lock refuses any existing lock and cleanup removes only its own token',t=>{
 const root=fs.mkdtempSync(path.join(here,'lock-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const file=path.join(root,'lock.json');
 fs.writeFileSync(file,JSON.stringify({pid:999999,token:'stale-foreign'}));assert.throws(()=>acquireProcessRunLock(file,{failIfExists:true}));assert.equal(JSON.parse(fs.readFileSync(file)).token,'stale-foreign');fs.unlinkSync(file);
 const unlock=acquireProcessRunLock(file,{failIfExists:true});assert.ok(fs.existsSync(file));unlock();assert.ok(!fs.existsSync(file));
 const otherUnlock=acquireProcessRunLock(file,{failIfExists:true});fs.writeFileSync(file,JSON.stringify({token:'replacement-owner'}));otherUnlock();assert.equal(JSON.parse(fs.readFileSync(file)).token,'replacement-owner');
});
