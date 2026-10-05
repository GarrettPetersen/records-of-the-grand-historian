import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { runLocalRecordToolSession } from './lib/local-record-tool-session.mjs';
import { namedPeopleRecordTools, normalizePeopleRecordCalls } from './lib/people-record-tools.mjs';
import { PEOPLE_TOOLS, compileToolDraft, newToolState, executePeopleTool } from './lib/deepseek-people-tools.mjs';
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

test('candidate links use host-owned exact occurrences rather than model span transcription',()=>{
  const candidate=['cand_1234567890abcdef','s0001','zh','甲',0,[]];
  const response={choices:[{message:{tool_calls:[{function:{name:'link_candidates',arguments:JSON.stringify({person:'p001',kind:'personal-name',candidateIds:[candidate[0]]})}}]}}]};
  const call=normalizePeopleRecordCalls(response,[candidate]).choices[0].message.tool_calls[0];
  assert.equal(call.function.name,'write_records');
  assert.deepEqual(JSON.parse(call.function.arguments).records[0].locations,[{unit:'s0001',occurrences:[0]}]);
});

test('individual unit audits require owned read source and do not constitute independent approval',()=>{
  const snapshot={fingerprint:'fixture',requireUnitAudits:true,worker:{units:[['s0001','p','甲在。','Jia was present.','Jia was present.']],candidates:[],readOnlyContext:{before:[],after:[]}}};
  const state=newToolState(snapshot);
  const args={unit:'s0001',reason:'The named individual and explicit presence in the sealed source were captured.'};
  assert.throws(()=>executePeopleTool(state,snapshot,'audit_unit',args),/read owned/);
  executePeopleTool(state,snapshot,'read_source',{start:0,count:1});
  executePeopleTool(state,snapshot,'audit_unit',args);
  assert.equal(state.accepted,false);assert.equal(state.auditComplete,false);
  assert.throws(()=>executePeopleTool(state,snapshot,'audit_unit',{...args,unit:'s9999'}),/read owned/);
});

test('repeated read-only actions stop without spending an unbounded invocation',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'grok-no-progress-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  let calls=0;
  await assert.rejects(runLocalRecordToolSession({directory,fingerprint:'same',initialState:()=>({fingerprint:'same',nextTurn:1,messages:[],records:{saved:true},finished:false}),
    tools:[{type:'function',function:{name:'read',parameters:{type:'object',properties:{},additionalProperties:false}}}],maxTurns:20,maxTotalTokens:1000,
    request:async()=>{calls++;return {choices:[{message:{role:'assistant',tool_calls:[{id:'read',function:{name:'read',arguments:'{}'}}]}}],usage:{total_tokens:20}};},
    execute:async()=>({ok:true}),progress:state=>state.records,progressFeedback:()=> 'Save the missing check rather than rereading.',
  }),/Eight turns/);
  assert.equal(calls,8);assert.deepEqual(readJson(path.join(directory,'state.json')).records,{saved:true});
});
