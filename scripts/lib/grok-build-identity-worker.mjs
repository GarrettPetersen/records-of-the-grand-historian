import fs from 'node:fs';
import path from 'node:path';
import {PEOPLE_DIR,REPO_ROOT,readJson,sha256} from './people-content.mjs';
import {runLocalRecordToolSession} from './local-record-tool-session.mjs';
import {grokBuildSubscriptionCompletion} from './grok-build-proxy.mjs';

const object=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const tool=(name,description,parameters)=>({type:'function',function:{name,description,parameters}});

export async function grokBuildIdentityWorker(dossier,options){
  const input=dossier.document;
  const ids=Object.keys(input.people);
  const fingerprint=sha256(JSON.stringify({version:1,input}));
  const schema=structuredClone(readJson(path.join(PEOPLE_DIR,'schema','resolution.schema.json')).properties.decisions.items);
  schema.properties.decision.enum=['merge','keep-separate','possible-same-as'];
  delete schema.properties.canonicalPersonId;
  schema.properties.localPeople={type:'array',minItems:2,uniqueItems:true,items:{enum:ids}};
  const pairs=[...new Map(input.blocks.flatMap(block=>{
    if(!Array.isArray(block.reviewPairs))throw new Error('Identity tools require explicit remaining review pairs');
    return block.reviewPairs.map(pair=>[[...pair].sort().join('\0'),pair]);
  })).values()];
  const canonical=id=>input.people[id]?.currentCanonicalPersonId;
  const coverage=decisions=>{
    const merged=new Map();
    const root=id=>{while(merged.has(id))id=merged.get(id);return id;};
    for(const decision of decisions.filter(row=>row.decision==='merge')){
      const group=decision.localPeople.map(canonical);for(const id of group.slice(1))if(root(id)!==root(group[0]))merged.set(root(id),root(group[0]));
    }
    return pairs.filter(([left,right])=>root(left)!==root(right)&&!decisions.some(decision=>{
      const members=decision.localPeople.map(canonical);return members.includes(left)&&members.includes(right);
    }));
  };
  return runLocalRecordToolSession({directory:path.join(PEOPLE_DIR,'generated','grok-build-identity',dossier.batch,fingerprint.slice(7)),fingerprint,
    maxTurns:options.maxTurns??120,maxTotalTokens:options.maxTotalTokens,
    initialState:()=>({fingerprint,nextTurn:1,finished:false,readPeople:[],decisions:{},messages:[
      {role:'system',content:`${fs.readFileSync(path.join(REPO_ROOT,'prompt-people-resolution.txt'),'utf8')}\nUse read_people, read_source and record_decision rather than a full JSON artifact. Source-backed homonym handling and conservative uncertainty remain mandatory. This context is independent of extraction and repair messages. The host owns the batch and complete corpus consistency check. Never invent a canonical ID. Read source evidence for every compared person.`},
      {role:'user',content:JSON.stringify({batch:dossier.batch,blocks:input.blocks,people:ids,priorSeparations:input.priorSeparations})},
    ]}),
    tools:[
      tool('read_people','Read summaries for specific visible people.',object({ids:{type:'array',minItems:1,maxItems:5,items:{enum:ids}}})),
      tool('read_source','Read sealed Chinese/English source evidence and claims for a visible person, in bounded slices.',object({id:{enum:ids},start:{type:'integer',minimum:0},count:{type:'integer',minimum:1,maximum:10}})),
      tool('record_decision','Record one conservative source-backed decision. Prefer one supported transitive merge for a cluster; do not manufacture certainty to close a pair.',object({key:{type:'string'},decision:schema})),
      tool('finish_resolution','Validate every remaining pair, read coverage, and prior-separation constraints before returning host-owned output.',object({})),
    ],request:body=>{
      if(options.shouldStop?.())throw new Error('Grok Build identity stopped; saved decisions are resumable');
      return (options.request??grokBuildSubscriptionCompletion)({...body,maxTokens:8192,timeoutMs:options.timeoutMs});
    },execute:async(state,name,args)=>{
      if(name==='read_people')return {people:Object.fromEntries(args.ids.map(id=>[id,input.people[id]]))};
      if(name==='read_source'){
        const result=await options.readSource(args.id,args.start,args.count);
        state.readPeople=[...new Set([...state.readPeople,args.id])];return result;
      }
      if(name==='record_decision'){
        if(args.decision.localPeople.some(id=>!state.readPeople.includes(id)))throw new Error('Read source evidence before deciding identity');
        const next={...state.decisions,[args.key]:args.decision};
        options.validate({schemaVersion:1,batch:dossier.batch,decisions:Object.values(next)});
        state.decisions=next;return {saved:args.key,remainingPairs:coverage(Object.values(next)).length};
      }
      if(name==='finish_resolution'){
        const document={schemaVersion:1,batch:dossier.batch,decisions:Object.values(state.decisions)};
        const remaining=coverage(document.decisions);if(remaining.length)throw new Error(`Unreviewed pairs: ${JSON.stringify(remaining.slice(0,10))}`);
        options.validate(document);state.artifact=document;state.finished=true;return {validated:true};
      }
      throw new Error('Unknown identity tool');
    },
  });
}
