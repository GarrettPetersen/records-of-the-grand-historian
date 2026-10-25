import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base=path.resolve('data/people/generated/independent-identity-recovery/jinshu053-current-glyph-20261025');
const output=path.join(base,'native-cohort-02/independent-review');
const root='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
process.env.PEOPLE_REPO_ROOT=root;
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
const {validateResolutionDocument}=await import(path.join(runtime,'scripts/sdk-people-resolve.mjs'));
const {resolvePeopleClusters}=await import(path.join(runtime,'scripts/lib/people-resolution.mjs'));
const {expandPeopleExtraction}=await import(path.join(runtime,'scripts/lib/people-compact.mjs'));
const {buildPeopleExtractionPacket}=await import(path.join(runtime,'scripts/build-people-extraction-packet.mjs'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f));
const owner=read(path.join(base,'native-cohort-02/ownership.json'));
const blindRaw=fs.readFileSync(path.join(output,'fresh-source-judgment.json'));
if(hash(blindRaw)!=='2fb02f33ea7ec2de2a0f286900c13129b75b2daa3e0ac2df9f63c2c3afc64c68')throw Error('Fresh source judgment changed');
const ref=owner.canonicalRevision;
const git=file=>execFileSync('git',['-C',root,'show',`${ref}:${file}`],{maxBuffer:40*1024*1024});
const pinRaw=fs.readFileSync(path.join(base,'input-pin-manifest.json'));if(hash(pinRaw)!==JSON.parse(blindRaw).inputPinManifestSha256)throw Error('Input pin manifest changed');
const manifest=JSON.parse(pinRaw);const inputPins=new Map(manifest.inputPins.map(p=>[p.path,p]));
for(const p of manifest.dependencyPins){const location=p.location==='runtime'?runtime:root;if(hash(fs.readFileSync(path.join(location,p.path)))!==p.sha256)throw Error(`Runtime/config dependency changed ${p.path}`);}
const inspection=read(path.resolve('data/people/generated/independent-identity-recovery/jinshu053-current-20261025/resolver-handoff-inspection.json'));
const checked=new Map();
const pinnedGit=file=>{if(!checked.has(file)){const raw=git(file);const pin=inputPins.get(file);if(!pin||hash(raw)!==pin.sha256)throw Error(`Canonical input pin mismatch ${file}`);checked.set(file,raw);}return checked.get(file);};
const endpoints=new Map();const packets=[];
for(const assignment of owner.packets){
 const raw=fs.readFileSync(path.join(base,assignment.file));if(hash(raw)!==assignment.sha256)throw Error('Packet hash mismatch');
 const packet=JSON.parse(raw);packets.push({assignment,packet});
 for(const p of packet.people){if(hash(pinnedGit(p.sourcePins.sourcePath))!==p.sourcePins.sourceRawSha256||hash(pinnedGit(p.sourcePins.extractionPath))!==p.sourcePins.extractionRawSha256)throw Error('Endpoint pin mismatch');endpoints.set(p.localId,{...p.record,claims:p.claims,mentions:p.mentions,promptVersion:p.promptVersion});}
}
const prior=[]; const priorPins=[];
for(const pin of inspection.intersectingResolutionFiles){
 const raw=git(pin.path);if(hash(raw)!==pin.sha256)throw Error(`Prior hash mismatch ${pin.path}`);
 const doc=JSON.parse(raw);const decisions=doc.decisions.filter(d=>d.localPeople.some(id=>endpoints.has(id)));
 if(decisions.length!==pin.touchingDecisions)throw Error('Prior constraint count mismatch');
 prior.push({...doc,decisions});priorPins.push({...pin,actualSha256:hash(raw)});
}
const needed=new Set(prior.flatMap(d=>d.decisions.flatMap(d=>d.localPeople)));
const loaded=new Map();
for(const id of needed){
 if(endpoints.has(id))continue;
 const [book,chapter]=id.split(':');const file=`data/people/extractions/${book}/${chapter}.json`;
 if(!loaded.has(file)){
 const original=JSON.parse(pinnedGit(file));
 const expanded=original.schemaVersion===2?expandPeopleExtraction(original,buildPeopleExtractionPacket(book,chapter,{chapterData:JSON.parse(pinnedGit(`data/${book}/${chapter}.json`))})):original;
 loaded.set(file,expanded);
 }
 const ext=loaded.get(file);const record=ext.people.find(p=>p.localId===id);if(!record)throw Error(`Missing canonical endpoint ${id}`);
 endpoints.set(id,{...record,claims:ext.claims.filter(c=>c.subject===id),mentions:ext.mentions.filter(m=>m.person===id),promptVersion:ext.promptVersion});
}
// Include each complete intersecting decision, never shorten its membership.
const baseline=resolvePeopleClusters(endpoints,prior);
const sealedBaseline=read(path.join(base,'constraint-complete-baseline-proof.json'));if(JSON.stringify(prior)!==JSON.stringify(sealedBaseline.constraintDocuments))throw Error('New baseline prior constraints do not match canonical Git');if(endpoints.size!==34||baseline.clusters.length!==34)throw Error('Baseline cardinality mismatch');
for(const {packet} of packets)for(const p of packet.people){const c=baseline.clusters.find(c=>c.localPeople.includes(p.localId));if(c.canonicalPersonId!==p.currentCanonicalPersonId)throw Error('Canonical endpoint mapping mismatch');}
const receipts=[];const accepted=[];
for(const arg of process.argv.slice(2)){
 const [seed,file,expected]=arg.split('=');const n=Number(seed);const {assignment,packet}=packets[n-1];
 const raw=fs.readFileSync(file);if(hash(raw)!==expected)throw Error(`Proposal hash mismatch ${file}`);
 const doc=JSON.parse(raw);const dossier={batch:assignment.batch,document:{people:Object.fromEntries(packet.people.map(p=>[p.localId,p])),targetLocalPeople:packet.scope.targetLocalPeople,blocks:[{id:packet.scope.blockIds.join('+'),component:assignment.batch,localPeople:packet.scope.members,reviewPairs:packet.scope.reviewPairs}]}};
 const before=JSON.stringify(doc);
 validateResolutionDocument(doc,dossier,{localPeople:endpoints},prior,accepted);
 if(JSON.stringify(doc)!==before)throw Error('Validator mutated document');
 for(const d of doc.decisions)if(d.decision==='merge'){
  const final=resolvePeopleClusters(endpoints,[...prior,...accepted,doc]);
  if(!final.clusters.some(c=>d.localPeople.every(id=>c.localPeople.includes(id))))throw Error('Merge silently skipped by curation');
 }
 accepted.push(doc);receipts.push({seed:n,file:path.resolve(file),sha256:hash(raw),batch:doc.batch,decisions:doc.decisions.length,validated:true});
}
const final=resolvePeopleClusters(endpoints,[...prior,...accepted]);
const receipt={kind:'independent bounded structural proof; human source approval is separate; no global approval',canonicalRevision:ref,freshSourceJudgmentSha256:hash(blindRaw),localPeople:endpoints.size,packetEndpoints:23,verifiedCanonicalInputs:[...checked].map(([path,raw])=>({path,sha256:hash(raw)})),priorFiles:priorPins,baselineClusters:baseline.clusters.length,finalClusters:final.clusters.length,documents:receipts,proofScriptSha256:hash(fs.readFileSync(new URL(import.meta.url))),createdAt:new Date().toISOString()};
fs.writeFileSync(path.join(output,'bounded-verification.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({localPeople:endpoints.size,priorFiles:prior.length,documents:receipts.length,baselineClusters:baseline.clusters.length,finalClusters:final.clusters.length}));
