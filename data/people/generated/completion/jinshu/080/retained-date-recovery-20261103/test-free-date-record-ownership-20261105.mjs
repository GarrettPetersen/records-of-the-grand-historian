import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root=new URL('.',import.meta.url).pathname,dir=root+'free-date-record-ownership-fix-20261105/',runtime='/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/';
const variants=['before','proposed'],results=[];
for(const variant of variants){
 const file=dir+variant+'-test-runtime.mjs',source=fs.readFileSync(dir+variant+'-source.mjs','utf8').replace("from './people-content.mjs'",`from '${pathToFileURL(runtime+'people-content.mjs')}'`).replace("from './openrouter-free.mjs'",`from '${pathToFileURL(runtime+'openrouter-free.mjs')}'`);
 fs.writeFileSync(file,source,{flag:'wx'});const {runOpenRouterDateTools}=await import(pathToFileURL(file));
 const valid=(id,reason='Source-backed check')=>({key:id,value:{id,verdict:'supported',reason}});
 const cases=[
  {name:'reject-prefixed-item-id',kind:'review',calls:[{section:'itemChecks',records:[valid('check-claim-1')]}],expectedKeys:[],error:'not owned'},
  {name:'reject-unowned-person-id',kind:'review',calls:[{section:'personChecks',records:[valid('p999')]}],expectedKeys:[],section:'personChecks',error:'not owned'},
  {name:'reject-mixed-batch-without-partial-write',kind:'review',calls:[{section:'itemChecks',records:[valid('claim-1'),{key:'invalid:key',value:{id:'invalid:key'}}]}],expectedKeys:[],error:'Invalid date record'},
  {name:'reject-duplicate-key-atomically',kind:'review',calls:[{section:'itemChecks',records:[valid('claim-1'),valid('claim-1','different check')]}],expectedKeys:[],error:'Duplicate'},
  {name:'allow-correction-in-later-call',kind:'review',calls:[{section:'itemChecks',records:[valid('claim-1','initial')]},{section:'itemChecks',records:[valid('claim-1','corrected')]}],expectedKeys:['claim-1'],reason:'corrected'},
  {name:'preserve-repair-record-keys',kind:'repair',calls:[{section:'changes',records:[{key:'change-1',value:{kind:'remove',id:'claim-1',reason:'Source disproves inferred life date'}}]}],expectedKeys:['change-1'],section:'changes'}
 ];
 for(const c of cases){
  const caseDir=dir+variant+'-'+c.name;fs.mkdirSync(caseDir);const key='test-'+c.name,task={kind:c.kind,key,directory:caseDir,state:{}},input={instructions:'Synthetic offline tool-contract test; no inference.',phase:c.kind,book:'test',chapter:'001',ownedItems:['claim-1'],ownedPeople:['p001'],ownedUnits:[],sourceHash:'test-source',extractionHash:'test-extraction'};let count=0;
  const request=async()=>{const args=c.calls[count++];assert.ok(args,'Unexpected request');return {choices:[{finish_reason:'tool_calls',message:{role:'assistant',content:null,tool_calls:[{id:'call-'+count,type:'function',function:{name:'save_records',arguments:JSON.stringify(args)}}]}}]}};
  await assert.rejects(runOpenRouterDateTools(task,{input,key:'offline-not-used',model:'test:free',timeoutMs:1,maxTurns:c.calls.length,request}),/paused after/);
  const state=JSON.parse(fs.readFileSync(path.join(caseDir,'openrouter-tools-'+key,'state.json'))),section=c.section??'itemChecks',keys=Object.keys(state.records[section]),last=JSON.parse(state.messages.at(-1).content);
  let passed=true;try{assert.deepEqual(keys,c.expectedKeys);if(c.error)assert.ok(last.ok===false&&last.error.includes(c.error));if(c.reason)assert.equal(state.records.itemChecks['claim-1'].reason,c.reason)}catch{passed=false}
  results.push({variant,case:c.name,passed,keys,toolResult:last});
  if(variant==='proposed')assert.ok(passed,c.name+' failed');
 }
}
assert.ok(results.filter(r=>r.variant==='before'&&!r.passed).length>=4,'Original contract defects were not reproduced');
const receipt={at:new Date().toISOString(),kind:'offline-openrouter-date-record-ownership-regressions',productionRuntimeUnchanged:true,modelCalls:0,proposedPassed:results.filter(r=>r.variant==='proposed'&&r.passed).length,originalFailuresReproduced:results.filter(r=>r.variant==='before'&&!r.passed).length,results};fs.writeFileSync(dir+'regression-receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({proposedPassed:receipt.proposedPassed,originalFailuresReproduced:receipt.originalFailuresReproduced,modelCalls:0,productionRuntimeUnchanged:true}));
