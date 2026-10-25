import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {validateResolutionDocument}=await import(runtime+'/scripts/sdk-people-resolve.mjs');
const {resolvePeopleClusters}=await import(runtime+'/scripts/lib/people-resolution.mjs');
const a=path.dirname(fileURLToPath(import.meta.url)),p=path.dirname(a);
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const r=read(path.join(p,'../selected-registry.json')),h=read(path.join(p,'host-context.json')),hand=read(path.join(p,'host-handoff.json'));
assert.equal(sha(path.join(p,'../selected-registry.json')),hand.registrySha256);
assert.equal(sha(path.join(p,'sealed-manifest.json')),hand.sealedManifestSha256);
assert.equal(sha(path.join(p,'../HOST_REVIEW_PROTOCOL.md')),'7de78092e3da0da3cef2c1ca18ed2ca234fda210d4cdbd7fbaf2e9b2b6dfa91b');
const supplements=read(path.join(a,'source-supplement.json')),sourceDocs=new Map();
for(const b of Object.values(supplements.blocks)){
 if(!sourceDocs.has(b.sourcePath)){
  const bytes=execFileSync('git',['show',`${hand.canonicalRevision}:${b.sourcePath}`]);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),b.sourceRawSha256);
  sourceDocs.set(b.sourcePath,JSON.parse(bytes));
 }
 const block=sourceDocs.get(b.sourcePath).content[b.blockIndex];
 assert.deepEqual(block.sentences.map(u=>({id:u.id,zh:u.zh})),b.units);
}
const localPeople=new Map(Object.entries(r.people).map(([id,x])=>[id,{...x.record,claims:x.claims,mentions:x.mentions}]));
const prior=r.priorConstraintDocuments.map(x=>x.document);
for(const doc of prior)for(const d of doc.decisions)for(const id of d.localPeople)assert(localPeople.has(id),`missing ${id}`);
const baseline=resolvePeopleClusters(localPeople,prior),members=new Map(baseline.clusters.map(c=>[c.canonicalPersonId,c.localPeople]));
let verifiedClusters=0;
for(const c of r.completeEndpointClusters){assert.deepEqual(members.get(c.canonicalPersonId),[...c.localPeople].sort());verifiedClusters++;}
const docs=hand.batches.map((b,i)=>read(path.join(a,`part-${String(i+1).padStart(3,'0')}.resolution.json`)));
const results=[];
for(const [i,b] of hand.batches.entries()){
 const packet=read(path.join(p,b.packet));assert.equal(sha(path.join(p,b.packet)),b.sha256);
 const people=Object.fromEntries(packet.people.map(x=>[x.localId,{...x,nameKeys:x.aliasesAndNameKeys}]));
 const dossier={batch:b.batch,document:{people,targetLocalPeople:packet.people.map(x=>x.localId),blocks:[{component:'owned-star',localPeople:packet.people.map(x=>x.localId),reviewPairs:packet.scope.reviewPairs}]}};
 validateResolutionDocument(docs[i],dossier,{localPeople},prior,docs.filter((_,j)=>j!==i));
 results.push({file:`part-${String(i+1).padStart(3,'0')}.resolution.json`,batch:b.batch,bytes:fs.statSync(path.join(a,`part-${String(i+1).padStart(3,'0')}.resolution.json`)).size,sha256:sha(path.join(a,`part-${String(i+1).padStart(3,'0')}.resolution.json`)),validation:'passed against all registry prior documents and other two new proposals'});
}
const union=resolvePeopleClusters(localPeople,[...prior,...docs]);
const proof={sourceVerification:{protocolSha256:sha(path.join(p,'../HOST_REVIEW_PROTOCOL.md')),completePinnedBlocks:Object.keys(supplements.blocks).length,exactBaselineSourceBlobs:sourceDocs.size,losslessPacketJoins:'prepare-author.py checks every restored mentions array, record, aliases, claims, sourcePins, sourceUnits and complete canonical endpoint membership; host prior subset reproduced exactly'},scope:'Bounded sealed registry structural validation, not global CI or publication approval',registrySha256:sha(path.join(p,'../selected-registry.json')),hostContextSha256:sha(path.join(p,'host-context.json')),localPeople:localPeople.size,completePriorDocuments:prior.length,completePriorDecisions:prior.reduce((n,x)=>n+x.decisions.length,0),verifiedCanonicalClusters:verifiedClusters,baselineClusters:baseline.clusters.length,unionClusters:union.clusters.length,documents:results,runtime,environment:{PEOPLE_REPO_ROOT:process.env.PEOPLE_REPO_ROOT},runtimePins:Object.fromEntries(['scripts/sdk-people-resolve.mjs','scripts/lib/people-resolution.mjs'].map(f=>[f,sha(path.join(runtime,f))])),reproduce:'python3 author/prepare-author.py && node author/validate-author.mjs (run from cohort-006 directory)',result:'passed'};
fs.writeFileSync(path.join(a,'structural-proof.json'),JSON.stringify(proof,null,2)+'\n');
const cov=read(path.join(a,'source-coverage.json'));
const outcomes=Object.fromEntries([...new Set(cov.reviewedPairs.map(x=>x.outcome))].map(k=>[k,cov.reviewedPairs.filter(x=>x.outcome===k).length]));
const manifest={schemaVersion:1,role:'source-author',canonicalRevision:hand.canonicalRevision,sealedManifestSha256:hand.sealedManifestSha256,registrySha256:hand.registrySha256,documents:results,outcomes,coverage:{ownedPeople:cov.sourceRecords.length,claims:cov.sourceRecords.reduce((n,x)=>n+x.claims,0),sourceUnits:cov.sourceRecords.reduce((n,x)=>n+x.sourceUnits,0),reviewPairs:cov.reviewedPairs.length},artifacts:['source-coverage.json','source-supplement.json','structural-proof.json','prepare-author.py','validate-author.mjs'].map(file=>({file,bytes:fs.statSync(path.join(a,file)).size,sha256:sha(path.join(a,file))})),sourceApproval:'Author proposal only; independent review required',globalCI:'not performed',publication:'not authorized by this receipt',nativeUsage:'unavailable'};
fs.writeFileSync(path.join(a,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({outcomes,proof},null,2));
