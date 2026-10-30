import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{createHash}from'node:crypto';
import{ROOT,REF,load,overlay}from'./runtime.mjs';import{loadCurrentCorpus}from'./load-current-corpus.mjs';
import{readIdentityDossierStore}from'./candidate/scripts/lib/people-identity-dossier-store.mjs';
import{acquireProcessRunLock}from'../../../../../../../scripts/lib/process-run-lock.mjs';
const J=path.dirname(fileURLToPath(import.meta.url)),write=(f,v)=>fs.writeFileSync(J+'/'+f,JSON.stringify(v,null,2)+'\n'),need=(v,m)=>{if(!v)throw Error(m)},started=Date.now();
const release=acquireProcessRunLock(ROOT+'/data/people/generated/resolution-run.lock',{label:'Linear accepted identity equivalence and source packet preparation',failIfExists:true});let store;
try{
 write('integration-run-state.json',{phase:'strict-current-corpus-loading',revision:REF,pid:process.pid});
 const loaded=await loadCurrentCorpus();
 const runtime=await import('./runtime.mjs?accepted-compact');
 for(const file of ['scripts/lib/people-resolution.mjs','scripts/lib/people-identity-dossiers.mjs','scripts/lib/people-chapter-identity.mjs','scripts/lib/people-validated-chapter.mjs','scripts/lib/people-qualified-scope.mjs','scripts/lib/people-identity-seal.mjs','scripts/lib/people-publication.mjs','scripts/compile-people-catalog.mjs','scripts/prepare-people-chapter-identity.mjs','data/people/schema/catalog.schema.json'])runtime.overlay.set(file,fs.readFileSync(J+'/candidate/'+file));
 const core=await runtime.load('scripts/lib/people-resolution.mjs');
 write('integration-run-state.json',{phase:'linear-accepted-constraint-replay',revision:REF,pid:process.pid});
 const start=Date.now(),accepted=core.resolveAcceptedPeopleClusters(loaded.corpus.localPeople,loaded.docs),seconds=(Date.now()-start)/1000;
 store=await readIdentityDossierStore(J+'/registry-revision-1',new Map());
 need(accepted.clusters.length===store.dossiers.size,'Changed accepted canonical group count');
 let members=0,known=0;for(const cluster of accepted.clusters){need(store.dossierVersions.has(cluster.canonicalPersonId),'Changed accepted canonical ID');for(const id of cluster.localPeople){need(store.localPersonMap.get(id)===cluster.canonicalPersonId,'Changed accepted source membership');members++;}for(const id of [cluster.canonicalPersonId,...cluster.retiredIds]){need(store.canonicalByKnownId.get(id)===cluster.canonicalPersonId,'Changed accepted identity lineage');known++;}}
 need(members===store.localPersonMap.size&&known===store.canonicalByKnownId.size,'Lost accepted identity membership or lineage');
 write('real-compact-resolution-equivalence.json',{revision:REF,extractions:loaded.corpus.chapters.length,localPeople:members,acceptedDocuments:loaded.docs.length,canonicalPeople:accepted.clusters.length,knownIds:known,exactAcceptedMembershipAndLineage:true,metrics:accepted.metrics,seconds,totalSeconds:(Date.now()-started)/1000,codeAdopted:false,dataQualified:false,published:false});
 store.close();store=null;
 // The store itself reads immutable local artifacts. Source modules continue to
 // read only REF through the read-only pinned runtime, with this explicit IO seam.
 globalThis.__readIdentityDossierStore=readIdentityDossierStore;
 runtime.overlay.set('scripts/lib/people-identity-dossier-store.mjs',Buffer.from('export const readIdentityDossierStore = globalThis.__readIdentityDossierStore;\n'));
 write('integration-run-state.json',{phase:'preparing-native-validated-pilot-source-evidence',revision:REF,pid:process.pid});
 const api=await runtime.load('scripts/prepare-people-chapter-identity.mjs');
 const prepared=await api.buildChapterIdentityReviewPacket({book:'jinshu',chapter:'053',registry:J+'/registry-revision-1'});
 const out=J+'/source-review-revision-2';fs.mkdirSync(out,{recursive:false});
 for(const[file,value]of [['plan.json',prepared.plan],['source-review-packet.json',prepared.packet],['preparation-receipt.json',prepared.receipt]])fs.writeFileSync(out+'/'+file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
 write('integration-run-state.json',{phase:'finished',revision:REF,pid:process.pid,elapsedSeconds:(Date.now()-started)/1000,receipt:prepared.receipt});
 console.log(JSON.stringify({membershipMatched:true,acceptedReplaySeconds:seconds,sourceReview:prepared.receipt}));
}catch(error){write('integration-run-state.json',{phase:'failed',revision:REF,pid:process.pid,error:error.name,message:error.message,errors:error.errors??null});throw error;}finally{store?.close();release();}
