import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {checkPeopleMasterSync} from './check-people-master-sync.mjs';

test('master freshness, missing released files, owned overlays and drift fail closed',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'people-sync-test-'));
 const remote=path.join(tmp,'remote'),root=path.join(tmp,'host');
 const git=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();
 const write=(dir,f,s)=>{fs.mkdirSync(path.dirname(path.join(dir,f)),{recursive:true});fs.writeFileSync(path.join(dir,f),s);};
 const commit=dir=>{git(dir,'add','.');git(dir,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','fixture');};
 try{
  for(const dir of[remote,root]){fs.mkdirSync(dir);git(dir,'init','-qb','master');}
  write(remote,'data/jinshu/001.json','{"value":1}\n');commit(remote);
  git(root,'remote','add','origin',remote);git(root,'fetch','-q','origin','master');git(root,'reset','--hard','origin/master');
  assert.equal(checkPeopleMasterSync(root).ok,true);
  fs.unlinkSync(path.join(root,'data/jinshu/001.json'));
  assert.match(checkPeopleMasterSync(root).errors.join('\n'),/released production files missing/);
  const master=git(root,'rev-parse','origin/master');
  const receipt={masterCommit:master,exceptions:[{path:'data/jinshu/001.json',sha256:null,owner:'fixture',reason:'Active job seals an absent input'}]};
  write(root,'data/people/generated/master-sync-receipt.json',JSON.stringify(receipt));
  assert.equal(checkPeopleMasterSync(root).ok,true);
  write(root,'data/jinshu/001.json','altered');
  assert.match(checkPeopleMasterSync(root).errors.join('\n'),/Pinned local input changed/);
  receipt.exceptions[0].sha256='sha256:'+createHash('sha256').update('altered').digest('hex');
  write(root,'data/people/generated/master-sync-receipt.json',JSON.stringify(receipt));
  assert.equal(checkPeopleMasterSync(root).ok,true);
  write(remote,'scripts/released.mjs','export const current = true;\n');commit(remote);
  assert.match(checkPeopleMasterSync(root).errors.join('\n'),/origin\/master is stale/);
  git(root,'fetch','-q','origin','master');
  assert.match(checkPeopleMasterSync(root).errors.join('\n'),/HEAD does not contain live master/);
  // Retain the local overlay while bringing the baseline forward.
  git(root,'reset','--soft','origin/master');
  assert.match(checkPeopleMasterSync(root).errors.join('\n'),/older master/);
  fs.unlinkSync(path.join(root,'data/people/generated/master-sync-receipt.json'));
  assert.match(checkPeopleMasterSync(root).errors.join('\n'),/released production files missing/);
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
