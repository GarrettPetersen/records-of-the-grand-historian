import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification/scripts';
const {resolvePeopleClusters}=await import(`${runtime}/lib/people-resolution.mjs`);
const {validateResolutionDocument}=await import(`${runtime}/sdk-people-resolve.mjs`);
const out=path.dirname(fileURLToPath(import.meta.url)),p=path.dirname(out);
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const key=(a,b)=>[a,b].sort().join('\0');
const blind=read(`${out}/blind-source-judgment.json`);assert.equal(sha(`${out}/blind-source-judgment.json`),'402b80f9d5993320a4ae870be31196631fb7cb5b3eeff7576ddeee0675c86f68');
const registry=read(`${p}/../selected-registry.json`);assert.equal(sha(`${p}/../selected-registry.json`),blind.proof.registrySha256);
const manifest=read(`${p}/author/manifest.json`);assert.equal(sha(`${p}/author/manifest.json`),'439b7ae026b911e7a843965dc9d025634e9ec92ce083361f13365bfcd286b6b5');
const documents=manifest.documents.map(x=>{assert.equal(sha(`${p}/author/${x.file}`),x.sha256);assert.equal(fs.statSync(`${p}/author/${x.file}`).size,x.bytes);return read(`${p}/author/${x.file}`)});
const locals=new Map(Object.entries(registry.people).map(([id,x])=>[id,{...x.record,claims:x.claims,mentions:x.mentions,nameKeys:x.aliasesAndNameKeys}]));
const prior=registry.priorConstraintDocuments.map(x=>x.document);
const baseline=resolvePeopleClusters(locals,prior);
const baselineMap=new Map(baseline.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId])));
for(const cluster of registry.completeEndpointClusters){const actual=baseline.clusters.find(x=>x.canonicalPersonId===cluster.canonicalPersonId);assert.deepEqual(actual?.localPeople,cluster.localPeople);for(const id of cluster.localPeople)assert.equal(baselineMap.get(id),cluster.canonicalPersonId)}
const blindMap=new Map(blind.judgments.map(x=>[key(...x.canonicalPair),x]));
const coverage=new Map(); const documentProof=[];
for(let ix=0;ix<documents.length;ix++){
 const document=documents[ix],packet=read(`${p}/part-${String(ix+1).padStart(3,'0')}.json`);
 const owned=Object.fromEntries(packet.people.map(x=>[x.localId,{...x.record,currentCanonicalPersonId:x.currentCanonicalPersonId,nameKeys:x.aliasesAndNameKeys}]));
 const cleanPairs=packet.scope.reviewPairs.filter(pair=>blindMap.get(key(...pair)).outcome!=='source-hold');
 const dossier={batch:document.batch,document:{people:owned,targetLocalPeople:packet.people.filter(x=>x.currentCanonicalPersonId===packet.scope.starRootCanonicalPersonId).map(x=>x.localId),blocks:[{id:`c006-${ix+1}`,component:`c006-${ix+1}`,localPeople:Object.keys(owned),reviewPairs:cleanPairs}]}};
 validateResolutionDocument(document,dossier,{localPeople:locals},prior,documents.filter((_,i)=>i!==ix));
 let decisions=0;
 for(const d of document.decisions){
  decisions++;
  for(const id of d.localPeople)assert.notEqual(id,'jinshu:028:p153');
  const canonical=[...new Set(d.localPeople.map(id=>baselineMap.get(id)))];
  for(let ai=0;ai<canonical.length;ai++)for(let bi=ai+1;bi<canonical.length;bi++){
   const pair=key(canonical[ai],canonical[bi]);if(!blindMap.has(pair))continue;
   const judgment=blindMap.get(pair);assert.equal(d.decision,judgment.outcome);
   let c=coverage.get(pair);if(!c){c={outcome:d.decision,localPairs:new Set(),documents:new Set()};coverage.set(pair,c)}assert.equal(c.outcome,d.decision);c.documents.add(manifest.documents[ix].file);
   for(const a of d.localPeople.filter(id=>baselineMap.get(id)===canonical[ai]))for(const b of d.localPeople.filter(id=>baselineMap.get(id)===canonical[bi]))c.localPairs.add(key(a,b));
  }
 }
 documentProof.push({...manifest.documents[ix],validation:'independently passed exported validateResolutionDocument against all79 prior documents and other2 proposals',amendedReviewPairs:cleanPairs.length,omittedHeldPairs:packet.scope.reviewPairs.length-cleanPairs.length,decisions});
}
const pairProof=[];
for(const j of blind.judgments){const k=key(...j.canonicalPair),c=coverage.get(k);if(j.outcome==='source-hold'){assert.equal(c,undefined);continue}assert.ok(c);const[a,b]=j.canonicalPair;const expected=j.endpointMemberships[a].flatMap(x=>j.endpointMemberships[b].map(y=>key(x,y)));for(const q of expected)assert.ok(c.localPairs.has(q));pairProof.push({canonicalPair:j.canonicalPair,outcome:c.outcome,completeCartesianLocalPairs:expected.length,documents:[...c.documents]})}
assert.equal(coverage.size,68);
const aggregate=resolvePeopleClusters(locals,[...prior,...documents]);
const aggregateMap=new Map(aggregate.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId])));
for(const j of blind.judgments){const a=j.endpointMemberships[j.canonicalPair[0]][0],b=j.endpointMemberships[j.canonicalPair[1]][0];if(j.outcome==='merge')assert.equal(aggregateMap.get(a),aggregateMap.get(b));else assert.notEqual(aggregateMap.get(a),aggregateMap.get(b))}
const proof={schemaVersion:1,canonicalRevision:manifest.canonicalRevision,registrySha256:blind.proof.registrySha256,blindSourceJudgmentSha256:sha(`${out}/blind-source-judgment.json`),authorManifestSha256:sha(`${p}/author/manifest.json`),completeRegistryPeople:locals.size,priorDocuments:prior.length,priorDecisions:prior.reduce((n,d)=>n+d.decisions.length,0),baselineCompleteEndpointMappings:registry.completeEndpointClusters.length,baselineClusters:baseline.clusters.length,aggregateClusters:aggregate.clusters.length,documents:documentProof,cleanPairCoverage:68,heldPairs:1,pairProof,scope:'bounded shared-registry structural proof; no global CI or publication approval'};
fs.writeFileSync(`${out}/exact-structural-proof.json`,JSON.stringify(proof,null,2)+'\n');
const report={schemaVersion:1,role:'independent-source-reviewer',reviewer:'/root/jin053_rest_c006_peer',canonicalRevision:manifest.canonicalRevision,status:'approved-exact-clean-proposals-with-one-unfinished-source-hold',blindSourceJudgmentSha256:proof.blindSourceJudgmentSha256,authorManifestSha256:proof.authorManifestSha256,documents:manifest.documents.map(x=>({file:x.file,batch:x.batch,bytes:x.bytes,sha256:x.sha256,sourceApproval:'approved for exact68-clean-pair scope',structuralValidation:'passed'})),outcomes:{merge:34,'keep-separate':34,'source-hold':1},cleanOwnedPairsApproved:68,ownedPairsTotal:69,sourceHold:{localId:'jinshu:028:p153',canonicalPair:blind.judgments.find(x=>x.outcome==='source-hold').canonicalPair,approval:false,reason:'Haixi Taihe folk-song 皇太子 s0373 is incorrectly attached to Shamen/Minhuai. Exact clean proposals omit it. No future extraction repair reviewed or approved.'},structuralProof:{file:'exact-structural-proof.json',sha256:sha(`${out}/exact-structural-proof.json`)},sourceNotes:['All authored outcomes match the unchanged blind judgments. Complete baseline memberships and Cartesian cross-group local coverage reproduced.','Part003 includes incidental suishu023 s0318 wording 莫知紀極; this is not a person reference and is not relied upon. Explicit 梁武陵王紀 s0335 independently supports the separation. No source/extraction correction is authorized by this receipt.'],globalCI:'not performed',publication:'host-only; not authorized by this receipt',nativeUsage:'unavailable'};
fs.writeFileSync(`${out}/exact-proposal-review.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({review:{file:`${out}/exact-proposal-review.json`,sha256:sha(`${out}/exact-proposal-review.json`)},proof:{file:`${out}/exact-structural-proof.json`,sha256:sha(`${out}/exact-structural-proof.json`)},counts:report.outcomes,registryPeople:locals.size,priorDocuments:prior.length,priorDecisions:proof.priorDecisions,endpointMappings:proof.baselineCompleteEndpointMappings},null,2));
