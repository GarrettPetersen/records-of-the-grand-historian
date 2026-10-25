import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const here=path.dirname(new URL(import.meta.url).pathname),base=path.dirname(here);
const bytes=f=>fs.readFileSync(path.join(base,f)),read=f=>JSON.parse(bytes(f)),sha=b=>createHash('sha256').update(b).digest('hex');
const blindSha='7515546862740b906bd1083680508226097548b095aaedfbfabb7f6cdbc1148f';assert.equal(sha(bytes('independent-review/blind-source-judgment.json')),blindSha);
const blind=read('independent-review/blind-source-judgment.json'),reg=read('../selected-registry.json'),host=read('host-context.json'),hand=read('host-handoff.json');
assert.equal(sha(bytes('../selected-registry.json')),blind.registrySha256);assert.equal(sha(bytes('sealed-manifest.json')),blind.sealedManifestSha256);
const hashes=['1f9af3e7c39292988ae3b56084ad30dda226c105be67c3ad0aa291a466c80d37','d7f335df020d88543c31fcf925597549d7dfe83726553faed4d68345ad2bfe3f','0dcf69311c03fe542d6d0e23a1cbe507aa79c47586423d4e9bf6518bb33a2fe3'];
const files=hashes.map((s,i)=>{const file=`author/part-${String(i+1).padStart(3,'0')}.resolution.json`;assert.equal(sha(bytes(file)),s);return {file,sha256:s};});
assert.equal(sha(bytes('author/validation-proof.json')),'83977a3b864ac3fcf0ce2be9808f1ac2e297376fcbad5e4cc720e1a8a2bc0a78');
const docs=files.map(f=>read(f.file)),prior=host.priorConstraintDocuments.map(x=>x.document),ids=[...host.ownedPeople,...host.priorOnlyPeople];assert.equal(new Set(ids).size,211);assert.equal(prior.length,24);assert.equal(prior.flatMap(x=>x.decisions).length,113);
const people=new Map(ids.map(id=>{const x=reg.people[id],[book,chapter]=id.split(':');return [id,{...x.record,book,chapter,claims:x.claims,mentions:x.mentions}]}));
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {validateResolutionDocument}=await import(runtime+'/scripts/sdk-people-resolve.mjs');
const {resolvePeopleClusters,buildResolutionCandidates}=await import(runtime+'/scripts/lib/people-resolution.mjs');
const baseline=resolvePeopleClusters(people,prior),mapping=new Map(baseline.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId])));assert.equal(baseline.clusters.length,209);
for(const id of host.ownedPeople)assert.equal(mapping.get(id),reg.people[id].currentCanonicalPersonId);
const names=buildResolutionCandidates(people).people;
const validations=[];let cartesian=0;const checkedPairs=[];
for(let i=0;i<3;i++){
 const packet=read(`part-${String(i+1).padStart(3,'0')}.json`),groups=new Map();
 for(const x of packet.people){let group=groups.get(x.currentCanonicalPersonId);if(!group)groups.set(x.currentCanonicalPersonId,group=[]);group.push(x.localId);}
 const visible=packet.people.map(x=>x.localId),key=`peer-component-${i+1}`;
 const dossier={batch:hand.batches[i].batch,document:{targetLocalPeople:groups.get(packet.scope.starRootCanonicalPersonId),currentGroups:[...groups].map(([canonicalPersonId,localPeople])=>({canonicalPersonId,localPeople})),blocks:[{id:key,component:key,localPeople:visible,reviewPairs:packet.scope.reviewPairs}],people:Object.fromEntries(packet.people.map(x=>[x.localId,{...x,nameKeys:names[x.localId].nameKeys}]))}};
 validateResolutionDocument(docs[i],dossier,{localPeople:people},prior,docs.filter((_,j)=>j!==i));validations.push({file:files[i].file,passed:true,otherNewDocumentsIncluded:2});
 for(const pair of packet.scope.reviewPairs){
  const expected=blind.judgments.find(j=>j.pair.join('|')===pair.join('|'));assert.ok(expected);
  for(const left of groups.get(pair[0]))for(const right of groups.get(pair[1])){
   const found=docs[i].decisions.filter(d=>d.localPeople.includes(left)&&d.localPeople.includes(right));assert.equal(found.length,1);assert.equal(found[0].decision,expected.outcome);cartesian++;
  }
  checkedPairs.push({pair,outcome:expected.outcome,sourceApproved:true,blindEvidence:expected.evidence});
 }
 // Verify every author-supplied source quote against the same sealed source, not merely the outcome.
 if(i<2)for(const d of docs[i].decisions){
  const peer=d.localPeople.find(id=>id!=='jinshu:053:p023'),row=packet.people.find(x=>x.localId===peer);assert.ok(row);
  assert.equal(d.notes[0],'jinshu:053:s0205 identifies 禕 as 張華息, the son of Zhang Hua appointed to accompany the crown prince.');
  assert.equal(d.notes[1],`The peer source identifies ${row.record.preferredNameSuggestion.zh}: ${row.sourceUnits.map(u=>u.zh).join(' ')}`);
 }
}
assert.equal(checkedPairs.length,111);assert.equal(cartesian,131);
const result=resolvePeopleClusters(people,[...prior,...docs]),resultMapping=new Map(result.clusters.flatMap(c=>c.localPeople.map(id=>[id,c.canonicalPersonId])));assert.equal(result.clusters.length,200);
for(const c of baseline.clusters)assert.equal(new Set(c.localPeople.map(id=>resultMapping.get(id))).size,1);
for(const doc of docs)for(const d of doc.decisions)if(d.decision==='keep-separate')assert.equal(new Set(d.localPeople.map(id=>mapping.get(id))).size,d.localPeople.length);
assert.equal(sha(bytes('independent-review/blind-source-judgment.json')),blindSha);
const structural={schemaVersion:1,reviewer:'/root/jin053_rest_c001_peer',canonicalRevision:hand.canonicalRevision,createdAt:new Date().toISOString(),registrySha256:blind.registrySha256,sealedManifestSha256:blind.sealedManifestSha256,proposalFiles:files,context:{people:people.size,owned:115,priorOnly:96,priorDocuments:24,priorDecisions:113},documentValidation:{api:'validateResolutionDocument',globalConsistencyEnabled:true,validations},aggregateValidation:{api:'resolvePeopleClusters',passed:true,baselineClusters:209,resultClusters:200},coverage:{canonicalPairs:111,cartesianEndpointPairs:131,allMatchBlindJudgments:true,existingMergedRootMembersPreserved:true,noKeepSeparateWithinExistingCluster:true},globalCI:false,publicationApproval:false};
const structFile=path.join(here,'proposal-structural-receipt.json');assert.ok(!fs.existsSync(structFile));fs.writeFileSync(structFile,JSON.stringify(structural,null,2)+'\n');
const review={schemaVersion:1,reviewer:'/root/jin053_rest_c001_peer',stage:'exact-proposal-source-and-structure-review',createdAt:new Date().toISOString(),canonicalRevision:hand.canonicalRevision,blindReceipt:{file:'independent-review/blind-source-judgment.json',sha256:blindSha,unchanged:true},proposalFiles:files,authorValidationProofSha256:'83977a3b864ac3fcf0ce2be9808f1ac2e297376fcbad5e4cc720e1a8a2bc0a78',structuralReceipt:{file:'independent-review/proposal-structural-receipt.json',sha256:sha(fs.readFileSync(structFile))},approved:true,sourceApproval:true,sourceFindings:['All 111 outcomes match independently sealed source judgments: nine merges and 102 keep-separate.','The transitive twelve-record Sima Yi merge preserves the three existing root records and is supported by explicit posthumous identification, continuous biography, sons Shi/Zhao, and specific Meng Da/Liaodong campaigns.','Zhang Hua’s Western Jin son remains separate from the later Zhang Yi loyalist and all other homonyms; 禕/祎 variation was assessed using family/career context, not spelling alone.','Tang ancestral-temple Emperor Xuan remains separate; the source distinguishes the Tang ancestral line from Sima Yi.'],structuralApproval:true,findings:[],checkedPairs,scope:'Exact three proposal files only; no approval transfers to edited files or other cohorts. Host aggregate validation and full global CI remain required.',globalCI:false,publicationApproval:false};
const reviewFile=path.join(here,'exact-proposal-review.json');assert.ok(!fs.existsSync(reviewFile));fs.writeFileSync(reviewFile,JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify({review:{file:reviewFile,sha256:sha(fs.readFileSync(reviewFile))},structural:{file:structFile,sha256:sha(fs.readFileSync(structFile))},approved:review.approved,coverage:structural.coverage}));
