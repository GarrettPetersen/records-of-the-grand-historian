import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {readWorkflowInventory,assertWorkflowInventory,assertNoFutureDateArtifacts} from '../guards-v2.mjs';
test('exact inventory rejects orphan future artifacts, added directories, and changed baseline bytes',t=>{
  const root=fs.mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'inventory-fixture-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  for(const name of ['state.json','review-0.json','audit-0-synthetic.json'])fs.writeFileSync(path.join(root,name),'{}\n');
  const baseline=readWorkflowInventory(root),state={reviewPlans:{'audit-0':{}}};
  assertWorkflowInventory(root,baseline);assertNoFutureDateArtifacts(root,state);
  for(const name of ['candidate-1.json','review-1.json','reaudit-1-synthetic.json','publication.json','combined-proposal.json','repair-candidate-0-1.json']) {
    fs.writeFileSync(path.join(root,name),'{}\n');
    assert.throws(()=>assertWorkflowInventory(root,baseline));assert.throws(()=>assertNoFutureDateArtifacts(root,state));fs.unlinkSync(path.join(root,name));
  }
  fs.mkdirSync(path.join(root,'orphan'));assert.throws(()=>readWorkflowInventory(root));fs.rmdirSync(path.join(root,'orphan'));
  assert.throws(()=>assertNoFutureDateArtifacts(root,{reviewPlans:{'audit-0':{},'reaudit-1':{}}}));
  fs.writeFileSync(path.join(root,'review-0.json'),'changed\n');assert.throws(()=>assertWorkflowInventory(root,baseline));
});
