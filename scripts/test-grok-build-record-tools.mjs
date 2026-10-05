import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runLocalRecordToolSession } from './lib/local-record-tool-session.mjs';
import { namedPeopleRecordTools, normalizePeopleRecordCalls } from './lib/people-record-tools.mjs';
import { PEOPLE_TOOLS, compileToolDraft } from './lib/deepseek-people-tools.mjs';
import { readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { grokBuildSubscriptionCompletion } from './lib/grok-build-proxy.mjs';

test('named tools inherit canonical enums and normalize without tuple output', () => {
  const schema=readJson('data/people/schema/compact-extraction.schema.json');
  const tools=namedPeopleRecordTools(PEOPLE_TOOLS,schema);
  const disposition=tools.find(t=>t.function.name==='write_dispositions').function.parameters.properties.records.items.properties;
  assert.deepEqual(disposition.reason,schema.$defs.dispositionGroup.prefixItems[1]);
  assert.deepEqual(disposition.disposition,schema.$defs.dispositionGroup.prefixItems[0]);
  const response={choices:[{message:{tool_calls:[{function:{name:'write_people',arguments:JSON.stringify({records:[{id:'p001'}]})}}]}}]};
  assert.deepEqual(JSON.parse(normalizePeopleRecordCalls(response).choices[0].message.tool_calls[0].function.arguments),{section:'people',records:[{id:'p001'}]});
  response.choices[0].message.tool_calls[0].function.arguments='{';
  assert.equal(normalizePeopleRecordCalls(response).choices[0].message.tool_calls[0].function.arguments,'{');
});

test('host sorts person IDs after out-of-order tool replacement', () => {
  const person=id=>({id,preferredEnglish:id,preferredChinese:null,pinyin:null,historicity:'historical',descriptor:'Test',hints:{n:[],r:[],a:[],p:[],x:null},names:[],roles:[]});
  const records=Object.fromEntries(['people','surfaces','claims','candidateDispositions','translationRepairs'].map(s=>[s,{}]));
  records.people={p002:person('p002'),p001:person('p001')};
  assert.deepEqual(compileToolDraft({records,auditComplete:false},{seed:{coverage:{}}}).people.map(row=>row[0]),['p001','p002']);
});

test('record session replays persisted responses, rejects invalid arguments and retains partial work', async t => {
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'grok-record-test-'));
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const response=(name,args)=>({choices:[{finish_reason:'tool_calls',message:{role:'assistant',tool_calls:[{id:'call1',type:'function',function:{name,arguments:JSON.stringify(args)}}]}}],usage:{total_tokens:20}});
  writeJsonAtomic(path.join(directory,'response-1.json'),response('save',{value:'saved'}));
  const tools=['save','finish'].map(name=>({type:'function',function:{name,parameters:{type:'object',properties:{value:{type:'string'}},required:['value'],additionalProperties:false}}}));
  let requests=0;
  const options={directory,fingerprint:'same',initialState:()=>({fingerprint:'same',nextTurn:1,messages:[],finished:false}),tools,maxTurns:2,maxTotalTokens:100,
    request:async()=>{requests++;return response('save',{value:2});},execute:async(state,name,args)=>{state.value=args.value;if(name==='finish'){state.finished=true;state.artifact={value:args.value};}return {ok:true};}};
  await assert.rejects(runLocalRecordToolSession(options),/paused/);
  assert.equal(requests,1);
  const state=readJson(path.join(directory,'state.json'));
  assert.equal(state.value,'saved');assert.match(state.messages.at(-1).content,/must be string/);
  writeJsonAtomic(path.join(directory,'response-3.json'),response('finish',{value:'approved'}));
  const result=await runLocalRecordToolSession({...options,recoverOnly:true});
  assert.deepEqual(result,{value:'approved'});assert.equal(requests,1);
});

test('subscription guard refuses paid spillover or exhausted allowance before inference', async () => {
  for(const config of [{creditUsagePercent:100},{creditUsagePercent:5,onDemandCap:{val:1}},{creditUsagePercent:5,prepaidBalance:{val:1}}]) {
    let inference=0;
    await assert.rejects(grokBuildSubscriptionCompletion({credential:{token:'test',userId:'test'},version:'1.0.46',messages:[],tools:[],fetchImpl:async url=>{
      if(url.includes('chat/completions'))inference++;
      return new Response(JSON.stringify(url.includes('billing')?{config:{...config,currentPeriod:{type:'USAGE_PERIOD_TYPE_WEEKLY'}}}:{rule:{enabled:false}}));
    }}),/exhausted|Subscription-only/);
    assert.equal(inference,0);
  }
});
