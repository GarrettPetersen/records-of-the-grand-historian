import fs from 'node:fs';import path from 'node:path';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
const base=path.dirname(path.dirname(new URL(import.meta.url).pathname)),out=base+'/author',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),handoff=read(base+'/host-handoff.json'),pins=read(base+'/input-pin-manifest.json');
if(sha(fs.readFileSync(base+'/sealed-cohort-manifest.json'))!==handoff.sealedManifestSha256)throw Error('Seal mismatch');
const gitRoot=pins.configRoot,runtime=pins.runtime,ref=handoff.canonicalRevision;
const pinByPath=new Map(pins.inputPins.map(p=>[p.path,p]));
for(const p of pins.dependencyPins){const r=p.location==='runtime'?runtime:gitRoot;const b=fs.readFileSync(path.join(r,p.path));if(sha(b)!==p.sha256)throw Error('Dependency mismatch '+p.path);}
const {validateResolutionDocument}=await import(runtime+'/scripts/sdk-people-resolve.mjs'),{resolvePeopleClusters,buildResolutionCandidates}=await import(runtime+'/scripts/lib/people-resolution.mjs');
const people=new Map(),docs=[],priorByBatch=new Map(),contexts=[],sourceChecks=new Set();
for(const a of handoff.batches){const b=fs.readFileSync(base+'/'+a.packet);if(sha(b)!==a.sha256)throw Error('Packet mismatch');const p=JSON.parse(b);if(p.canonicalRevision!==ref)throw Error('Ref mismatch');
 const expected=p.scope.completeEndpointMembers.map(x=>x.id).sort();if(JSON.stringify(expected)!==JSON.stringify(p.people.map(x=>x.localId).sort()))throw Error('Incomplete endpoint membership');
 for(const x of [...p.people,...p.constraintPeople]){const [book,chapter]=x.localId.split(':');const q={...x.record,book,chapter,claims:x.claims,mentions:x.mentions};if(people.has(x.localId)&&JSON.stringify(people.get(x.localId))!==JSON.stringify(q))throw Error('Conflicting person');people.set(x.localId,q);
  for(const [key,hashKey] of [['sourcePath','sourceRawSha256'],['extractionPath','extractionRawSha256']]){const f=x.sourcePins[key];if(sourceChecks.has(f))continue;const b=execFileSync('git',['show',ref+':'+f],{cwd:gitRoot,maxBuffer:32e6});if(sha(b)!==x.sourcePins[hashKey]||sha(b)!==pinByPath.get(f)?.sha256)throw Error('Canonical source pin mismatch '+f);sourceChecks.add(f);}
 }
 for(const d of p.constraintDocuments){if(priorByBatch.has(d.batch)&&JSON.stringify(priorByBatch.get(d.batch))!==JSON.stringify(d))throw Error('Prior conflict');priorByBatch.set(d.batch,d);}
 const component='native-'+a.packet,groups=[...new Set(p.people.map(x=>x.currentCanonicalPersonId))];
 const context={batch:a.batch,document:{targetLocalPeople:p.scope.targetLocalPeople,currentGroups:groups.map(id=>({canonicalPersonId:id,localPeople:p.people.filter(x=>x.currentCanonicalPersonId===id).map(x=>x.localId)})),reviewPairs:p.scope.reviewPairs,components:[{id:component,localPeople:p.people.map(x=>x.localId)}],blocks:[{id:p.scope.blockIds.join('+'),component,localPeople:p.people.map(x=>x.localId),reviewPairs:p.scope.reviewPairs}],people:Object.fromEntries(p.people.map(x=>[x.localId,x]))}};
 contexts.push(context);docs.push(read(out+'/'+(a.packet==='next-03.json'?'next-03.resolution-v2.json':a.packet.replace('.json','.resolution.json'))));
}
const candidatePeople=buildResolutionCandidates(people).people;for(const c of contexts)for(const [id,x] of Object.entries(c.document.people))c.document.people[id]={...x,nameKeys:candidatePeople[id].nameKeys};
const prior=[...priorByBatch.values()];for(const d of prior)for(const q of d.decisions)for(const id of q.localPeople)if(!people.has(id))throw Error('Missing prior endpoint '+id);
for(let i=0;i<docs.length;i++)validateResolutionDocument(docs[i],contexts[i],{localPeople:people},prior,docs.filter((_,j)=>i!==j));
const result=resolvePeopleClusters(people,[...prior,...docs]);
const cov=read(out+'/source-judgments-coverage-v2.json');if(cov.pairCount!==28||cov.pairs.length!==28)throw Error('Coverage count');
for(let i=0;i<docs.length;i++){const c=contexts[i];for(const pair of c.document.reviewPairs){const members=pair.map(id=>Object.values(c.document.people).filter(x=>x.currentCanonicalPersonId===id).map(x=>x.localId));const matches=docs[i].decisions.filter(d=>members.every(m=>m.every(id=>d.localPeople.includes(id))));if(matches.length!==1)throw Error('Uncovered/duplicate pair');}}

const sealedInput=read(out+'/constraint-complete-validation-input-v2.json');
if(JSON.stringify(sealedInput)!==JSON.stringify({canonicalRevision:ref,people:[...people],prior,documents:docs}))throw Error('Author full input differs from independently reassembled packet union');
const ctx=read(out+'/validation-contexts-v2.json');if(JSON.stringify(ctx.contexts)!==JSON.stringify(contexts))throw Error('Context mismatch');
console.log(JSON.stringify({readOnly:true,people:people.size,priorDocuments:prior.length,priorDecisions:prior.reduce((n,d)=>n+d.decisions.length,0),documentCount:docs.length,clusters:result.clusters.length,verifiedCanonicalSourceExtractionPins:sourceChecks.size,exportedDocumentValidationPassed:true,aggregateValidationPassed:true,fullInputAndContextsExact:true,globalApproval:false},null,2));
