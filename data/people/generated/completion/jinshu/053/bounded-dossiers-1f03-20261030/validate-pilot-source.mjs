import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{createHash}from'node:crypto';import{overlay,load}from'./runtime.mjs';
const J=path.dirname(fileURLToPath(import.meta.url)),D=J+'/source-review-revision-2',need=(v,m)=>{if(!v)throw Error(m)};
for(const file of ['scripts/lib/people-resolution.mjs','scripts/lib/people-identity-dossiers.mjs','scripts/lib/people-chapter-identity.mjs','scripts/lib/people-validated-chapter.mjs'])overlay.set(file,fs.readFileSync(J+'/candidate/'+file));
const api=await load('scripts/lib/people-chapter-identity.mjs'),source=await load('scripts/lib/people-validated-chapter.mjs'),digest=(await load('scripts/lib/people-identity-seal.mjs')).peopleDigest;
const original=JSON.parse(fs.readFileSync(D+'/source-review-packet.json')),state=JSON.parse(fs.readFileSync(D+'/review-state.json')),report=JSON.parse(fs.readFileSync(D+'/report.with-citation-supplement.json'));
need(state.phase==='report-recorded'&&report.reviewer.agentId===state.agentId,'Actual independent source reviewer receipt');
const unitsByScope=new Map();for(const unit of original.units){const key=`${unit.book}:${unit.chapter}`;if(!unitsByScope.has(key))unitsByScope.set(key,[]);unitsByScope.get(key).push(unit)}
const bundle={schemaVersion:1,kind:'chapter-identity-review',scope:original.scope,plan:original.plan,report,
 receipt:{actualReviewerAgentId:state.agentId,authorAgentIds:[...original.authorAgentIds,'codex-host-bounded-dossier-author-20261030'],planFingerprint:original.plan.fingerprint,reportFingerprint:digest(report),
 sourcePeople:original.people.map(person=>({localId:person.localId,fingerprint:api.identitySourceEvidenceFingerprint(person,{units:unitsByScope.get(`${person.book}:${person.chapter}`)})}))}};
// Accepted mappings are from the real native equivalence receipt; store metadata
// is immutable, byte-verified and contains no public facts from these sources.
const {readIdentityDossierStore}=await import('./candidate/scripts/lib/people-identity-dossier-store.mjs');const registry=await readIdentityDossierStore(J+'/registry-revision-1',new Map());
try{
const view={localPersonMap:registry.localPersonMap,canonicalByKnownId:registry.canonicalByKnownId},matcher=(await load('scripts/lib/people-candidates.mjs')).loadProperNounMatcher(),sources=new Map();
for(const scope of api.chapterIdentityEvidenceScopes(bundle)){const key=`${scope.book}:${scope.chapter}`;sources.set(key,source.loadValidatedPeopleChapter(scope.book,scope.chapter,{properNounMatcher:matcher,strictAliasDispositions:key==='jinshu:053'}));}
const currentInputs=api.chapterIdentityInputs('jinshu','053'),certificate=api.validateChapterIdentityBundle(view,sources,original.scope,bundle,currentInputs);
api.assertReviewedIdentityCoverage(sources.get('jinshu:053'),view,[certificate]);
for(const [file,value]of [['validated-review-bundle.json',bundle],['validated-identity-certificate.json',certificate]])fs.writeFileSync(D+'/'+file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const receipt={schemaVersion:1,scope:original.scope,actualReviewerAgentId:state.agentId,runId:state.runId,planFingerprint:original.plan.fingerprint,
 inputs:currentInputs,reviewedCases:certificate.retained.length,chapterLocalPeople:certificate.retained.reduce((n,x)=>n+x.localPeople.length,0),reviewedAmbiguousCases:certificate.ambiguity.length,
 nativeIdentityProofAccepted:true,productionCodeAdopted:false,dataQualified:false,published:false};fs.writeFileSync(D+'/identity-acceptance-receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}catch(error){fs.writeFileSync(D+'/identity-validation-error.json',JSON.stringify({name:error.name,message:error.message,errors:error.errors??null},null,2)+'\n');throw error;}finally{registry.close();}
