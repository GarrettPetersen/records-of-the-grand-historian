import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {ROOT,REF,load} from './runtime.mjs';
import {loadCurrentCorpus} from './load-current-corpus.mjs';
import {inspectLocalDisk} from '../../../../../../../scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '../../../../../../../scripts/lib/process-run-lock.mjs';
const J=path.dirname(fileURLToPath(import.meta.url)),KIND=J+'/../identity-wangyan-expansion-7f37-20261029',hash=b=>createHash('sha256').update(b).digest('hex'),need=(v,m)=>{if(!v)throw Error(m)},read=n=>JSON.parse(fs.readFileSync(J+'/'+n)),write=(n,x)=>fs.writeFileSync(J+'/'+n,JSON.stringify(x,null,2)+'\n');
need(!inspectLocalDisk(ROOT).errors.length,'Host guard');need(!fs.existsSync(J+'/graph-state.json'),'Existing graph invocation requires inspection');
const release=acquireProcessRunLock(J+'/graph.lock',{label:'Frozen053 bounded 20261030 global graph'}),start=Date.now();
write('graph-state.json',{phase:'running',pid:process.pid,revision:REF,startedAt:new Date().toISOString()});
try{
 const {corpus,docs,receipt}=await loadCurrentCorpus(),sdk=await load('scripts/sdk-people-resolve.mjs'),core=await load('scripts/lib/people-resolution.mjs'),compiler=await load('scripts/compile-people-catalog.mjs');
 const proposedBytes=fs.readFileSync(J+'/reviewed-resolution.json'),proposed=JSON.parse(proposedBytes),acceptance=read('source-review-acceptance.json');
 need(hash(proposedBytes)===acceptance.documentSha256,'Reviewed document seal drift');need(acceptance.acceptedAssignmentReviews.length>0,'No independently reviewed decisions');
 const prepared=sdk.buildDossiers({allUnresolved:false,chapters:new Set(['jinshu/053']),batch:proposed.batch,componentShards:false,shards:1},corpus,docs);
 need(prepared.dossiers.length===1,'Unexpected native dossier scope');
 const native=prepared.dossiers[0],ownedRoots=new Set(native.document.targetLocalPeople.map(id=>native.document.people[id].currentCanonicalPersonId)),dossier={batch:proposed.batch,document:{people:native.document.people,blocks:native.document.blocks,targetLocalPeople:Object.keys(native.document.people).filter(id=>ownedRoots.has(native.document.people[id].currentCanonicalPersonId))}};
 const prior=JSON.parse(fs.readFileSync(KIND+'/pairs.json')),nativePairs=[...new Set(native.document.blocks.flatMap(b=>b.reviewPairs.map(p=>[...p].sort().join('\0'))))].sort();
 need(JSON.stringify(nativePairs)===JSON.stringify(prior.pairs.map(p=>p.join('\0')).sort()),'Fresh native dossier does not reproduce exact current526 baseline');
 write('native-preflight-dossier.json',dossier);write('baseline-equivalence.json',{passed:true,baselinePairs:prior.pairs.length,exact526PairSetReproduced:true,nativeDossierSha256:hash(fs.readFileSync(J+'/native-preflight-dossier.json')),corpusReceipt:receipt});
 sdk.validateResolutionDocument(proposed,dossier,corpus,docs,[],{checkGlobalConsistency:true});
 write('full-global-decision-validation.json',{passed:true,revision:REF,documentSha256:acceptance.documentSha256,decisions:proposed.decisions.length,validator:'validateResolutionDocument(...checkGlobalConsistency:true)',existingWholeResolutionDocuments:docs.length,localPeople:corpus.localPeople.size,corpusReceipt:receipt,canonicalPublication:false});
 const resolved=core.resolvePeopleClusters(corpus.localPeople,[...docs,proposed]),map=new Map();for(const g of resolved.clusters)for(const id of g.localPeople)map.set(id,g.canonicalPersonId);
 const targetIds=[...corpus.localPeople].filter(([,p])=>p.book==='jinshu'&&p.chapter==='053').map(([id])=>id),roots=new Set(targetIds.map(id=>map.get(id)));need(targetIds.length===73,'Pilot roster drift');
 const candidates=core.buildResolutionCandidates(corpus.localPeople);candidates.blocks=candidates.blocks.filter(b=>b.localPeople.some(id=>roots.has(map.get(id))));const state=compiler.unresolvedCandidateState(candidates,map,resolved.keepSeparate,resolved.possibleSameAs),blocks=state.blocks.map(b=>({...b,reviewPairs:b.reviewPairs.filter(p=>p.some(id=>roots.has(id)))})).filter(b=>b.reviewPairs.length),pairs=[...new Set(blocks.flatMap(b=>b.reviewPairs.map(p=>[...p].sort().join('\0'))))].sort().map(s=>s.split('\0'));
 const endpointRoots=new Set([...roots,...pairs.flat()]),groups=resolved.clusters.filter(g=>endpointRoots.has(g.canonicalPersonId)),members=new Set(groups.flatMap(g=>g.localPeople));
 // Include all prior endpoint members for explicit canonical-rename and membership checks.
 const oldGroups=JSON.parse(fs.readFileSync(KIND+'/selected-complete-endpoint-clusters.json')),renames={};
 for(const g of oldGroups.endpointClusters){const rs=new Set(g.localPeople.map(id=>map.get(id)));need(rs.size===1,'Existing canonical group was pruned or split');renames[g.canonicalPersonId]=[...rs][0];}
 const mapped=new Set(prior.pairs.map(([a,b])=>[renames[a],renames[b]].sort()).filter(([a,b])=>a!==b).map(p=>p.join('\0'))),after=new Set(pairs.map(p=>p.join('\0'))),added=pairs.filter(p=>!mapped.has(p.join('\0')));
 write('pairs.json',{revision:REF,scope:{book:'jinshu',chapter:'053'},personCount:73,targetCanonicalPeople:[...roots].sort(),pairs,pairSetSha256:hash(JSON.stringify(pairs)),identityApproval:false});
 write('selected-complete-endpoint-clusters.json',{revision:REF,targetCanonicalPeople:[...roots].sort(),endpointClusters:groups,localToCanonical:Object.fromEntries([...new Set([...members,...oldGroups.endpointClusters.flatMap(g=>g.localPeople)])].sort().map(id=>[id,map.get(id)]))});
 write('selected-current-blocks.json',{revision:REF,scope:{book:'jinshu',chapter:'053'},blocks,people:Object.fromEntries([...members].sort().map(id=>[id,candidates.people[id]]))});
 write('final-reconciliation.json',{baselinePairs:prior.pairs.length,remainingPairs:pairs.length,genuineAddedPairs:added,canonicalRenames:Object.fromEntries(Object.entries(renames).filter(([a,b])=>a!==b)),noPriorCanonicalMembershipPruned:true,sourceAndExtractionUnchanged:true});
 write('graph-state.json',{phase:'finished',pid:process.pid,revision:REF,remainingPairs:pairs.length,genuineAddedPairs:added.length,elapsedSeconds:(Date.now()-start)/1000});console.log(JSON.stringify({passed:true,decisions:proposed.decisions.length,remainingPairs:pairs.length,genuineAddedPairs:added.length,elapsedSeconds:(Date.now()-start)/1000}));
}catch(e){write('graph-state.json',{phase:'failed',pid:process.pid,error:e.name,message:String(e.message).slice(0,1400),errors:e.errors??null});console.log(JSON.stringify({error:e.name,message:String(e.message).slice(0,1400)}));process.exitCode=1;}finally{release();}
