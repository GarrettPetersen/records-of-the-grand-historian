import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {randomUUID} from 'node:crypto';
import {writeJsonAtomic,PEOPLE_DIR} from './lib/people-content.mjs';
import {buildDateAuditPacket} from './lib/people-date-audit.mjs';
import {dateReviewJobs} from './lib/people-date-workflow.mjs';
import {grokBuildDateWorker,grokBuildDateTools} from './lib/grok-build-date-worker.mjs';
import {grokBuildIdentityWorker} from './lib/grok-build-identity-worker.mjs';
import {getPeopleSchemaValidator} from './lib/people-schema.mjs';

const response=calls=>({choices:[{finish_reason:'tool_calls',message:{role:'assistant',tool_calls:calls.map(([name,args],i)=>({id:`call-${i}`,type:'function',function:{name,arguments:JSON.stringify(args)}}))}}],usage:{total_tokens:20}});

test('date record tools cite sealed Chinese bytes, retain failed checks, and return only complete reports',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'grok-date-worker-'));
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const options={dataDir:path.join(directory,'data'),peopleDir:path.join(directory,'people')};
  writeJsonAtomic(path.join(options.dataDir,'fixture/001.json'),{content:[{sentences:[{id:'s0001',zh:'甲在元年。',translation:'Jia was present in year one.'}]}]});
  const extraction={schemaVersion:2,book:'fixture',chapter:'001',run:{model:'extractor'},people:[['p001',['Jia','甲'],'historical','Official',{a:[]}]],claims:[['p001','attestation',{sourceDate:{text:'元年'}},'explicit',['s0001']]],surfaces:[],translationRepairs:[]};
  writeJsonAtomic(path.join(options.peopleDir,'extractions/fixture/001.json'),extraction);
  const packet=buildDateAuditPacket('fixture','001',options),job=dateReviewJobs(packet,{maxUnits:10,maxBytes:64000})[0];
  let turn=0;const batches=[
    [['finish_date',{summary:'A complete fixture source review against the sealed evidence.',blocked:false,reason:''}]],
    [['read_evidence',{section:'units',start:0,count:10}]],
    [...job.ownedItems,...job.ownedPeople].map(id=>['save_check',{id,verdict:'supported',event:'Jia is present in the named first-year event.',reason:'The fixture Chinese source explicitly supports the owned event and person.',evidence:[{unit:'s0001',quote:null}]}]),
    [['finish_date',{summary:'Every assigned source unit, temporal item and person was independently checked.',blocked:false,reason:''}]],
  ];
  const state={};const artifact=await grokBuildDateWorker({maxWorkerBytes:64000,maxRunTokens:1000,maxToolTurns:10,validateExtraction:()=>{}},{request:async()=>response(batches[turn++])})({kind:'review',key:'audit-fixture',directory,state,job,packet,save:async patch=>Object.assign(state,patch)});
  assert.equal(turn,4);assert.equal(artifact.itemChecks[0].evidence[0].quote,'甲在元年。');assert.equal(artifact.reviewer.independentOfExtractor,true);
  assert.match(artifact.reviewer.agentId,/^grok-build-date-/);
});

test('empty date ownership compiles valid rejecting tool schemas, rather than empty enums',()=>{
  const input={units:[{id:'s0001'}],people:[],items:[],contextItems:[],ownedItems:[],ownedPeople:[]};
  for(const tool of grokBuildDateTools(input,'review'))assert.doesNotThrow(()=>getPeopleSchemaValidator().compile(tool.function.parameters));
});

test('date recovery revalidates an actual finish request without inventing one',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'grok-date-recovery-'));
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const paths={dataDir:path.join(directory,'data'),peopleDir:path.join(directory,'people')};
  writeJsonAtomic(path.join(paths.dataDir,'fixture/001.json'),{content:[{sentences:[{id:'s0001',zh:'甲在元年。',translation:'Jia was present in year one.'}]}]});
  writeJsonAtomic(path.join(paths.peopleDir,'extractions/fixture/001.json'),{schemaVersion:2,book:'fixture',chapter:'001',run:{model:'extractor'},people:[['p001',['Jia','甲'],'historical','Official',{a:[]}]],claims:[['p001','attestation',{sourceDate:{text:'元年'}},'explicit',['s0001']]],surfaces:[],translationRepairs:[]});
  const packet=buildDateAuditPacket('fixture','001',paths),job=dateReviewJobs(packet,{maxUnits:10,maxBytes:64000})[0];
  for(const hadFinish of [true,false]){
    const batches=[...(hadFinish?[[['finish_date',{summary:'Every assigned event will be checked against the sealed Chinese source.',blocked:false,reason:''}]]]:[]),
      [['read_evidence',{section:'units',start:0,count:10}]],
      [...job.ownedItems,...job.ownedPeople].map(id=>['save_check',{id,verdict:'supported',event:'Jia is present in the first-year event.',reason:'The supplied Chinese explicitly supports this event and individual.',evidence:[{unit:'s0001',quote:null}]}])];
    let turn=0;const state={};const task={kind:'review',key:`recovery-${hadFinish}`,directory,state,job,packet,save:async patch=>Object.assign(state,patch)};
    const options={maxWorkerBytes:64000,maxRunTokens:1000,maxToolTurns:batches.length,validateExtraction:()=>{}};
    await assert.rejects(grokBuildDateWorker(options,{request:async()=>response(batches[turn++])})(task),/paused/);
    const resume=grokBuildDateWorker({...options,recoverOnly:true},{request:async()=>{throw new Error('Recovery must not spend another model request');}});
    if(hadFinish){const artifact=await resume(task);assert.equal(artifact.itemChecks.length,job.ownedItems.length);}
    else await assert.rejects(resume(task),/cannot start a model turn/);
  }
});

test('identity tool worker requires source reads and every assigned pair before finishing',async t=>{
  const batch=`fixture-${randomUUID()}`;
  t.after(()=>fs.rmSync(path.join(PEOPLE_DIR,'generated','grok-build-identity',batch),{recursive:true,force:true}));
  const ids=['a:001:p001','a:002:p001'];
  const dossier={batch,document:{people:Object.fromEntries(ids.map((id,index)=>[id,{currentCanonicalPersonId:`canon-${index}`} ])),blocks:[{reviewPairs:[['canon-0','canon-1']]}],priorSeparations:[]}};
  const decision={decision:'possible-same-as',localPeople:ids,basis:['The supplied primary passages leave identification unresolved.'],confidence:'low'};
  const batches=[[['finish_resolution',{}]],[['read_source',{id:ids[0],start:0,count:1}],['read_source',{id:ids[1],start:0,count:1}]],[['record_decision',{key:'pair',decision}]],[['finish_resolution',{}]]];
  let turn=0,validated=0;
  const artifact=await grokBuildIdentityWorker(dossier,{maxTotalTokens:1000,request:async()=>response(batches[turn++]),readSource:async()=>({units:[{zh:'甲在。'}]}),validate:()=>{validated++;}});
  assert.equal(turn,4);assert.equal(validated,2);assert.deepEqual(artifact.decisions,[decision]);
});
