import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';import{execFileSync}from'node:child_process';
import{ROOT,overlay,load}from'./runtime.mjs';import{readIdentityDossierStore}from'./candidate/scripts/lib/people-identity-dossier-store.mjs';
const J=path.dirname(fileURLToPath(import.meta.url)),D=J+'/source-review-revision-2',O=D+'/validated-full-chapter-binding',need=(v,m)=>{if(!v)throw Error(m)};
need(!fs.existsSync(O),'Immutable full-chapter binding already exists; inspect its receipt');
function put(dir,prefix=''){for(const row of fs.readdirSync(dir,{withFileTypes:true})){const name=prefix+row.name;if(row.isDirectory())put(dir+'/'+row.name,name+'/');else if(/\.(?:mjs|js|json)$/.test(name))overlay.set(name,fs.readFileSync(dir+'/'+row.name));}}put(J+'/candidate');
const api=await load('scripts/lib/people-chapter-identity.mjs'),record=await load('scripts/lib/people-identity-review-record.mjs'),source=await load('scripts/lib/people-validated-chapter.mjs');
const bytes=fs.readFileSync(D+'/source-review-packet.json'),raw=fs.readFileSync(D+'/report.raw.json'),supp=fs.readFileSync(D+'/citation-supplement.raw.json');
for(const name of ['source-review-packet.json','report.raw.json','citation-supplement.raw.json']){
 const rel=path.relative(ROOT,D+'/'+name),archived=execFileSync('git',['show','64f8cd19e54e4605b9978d7b28c06f7ac6372e8f:'+rel],{cwd:ROOT,maxBuffer:8*1024*1024});
 need(record.identityArtifactHash(archived)===record.identityArtifactHash(fs.readFileSync(D+'/'+name)),'Verified capture archive drift: '+name);
}
const state=JSON.parse(fs.readFileSync(D+'/review-state.json')),follow=JSON.parse(fs.readFileSync(D+'/citation-followup-state.json')),p=JSON.parse(bytes);
need(state.phase==='report-recorded'&&follow.phase==='report-recorded'&&follow.agentId===state.agentId,'Original captured reviews are not terminal');
const job={schemaVersion:1,kind:'captured-independent-identity-review',phase:'report-recorded',scope:p.scope,
 agentId:state.agentId,runId:state.runId,sourcePacketSha256:record.identityArtifactHash(bytes),reportSha256:record.identityArtifactHash(raw),authorAgentIds:['codex-host-bounded-dossier-author-20261030'],
 citationSupplement:{agentId:follow.agentId,runId:follow.runId,sha256:record.identityArtifactHash(supp),packetSha256:follow.packetSha256},
 origin:{kind:'verified-native-capture-archive',revision:'64f8cd19e54e4605b9978d7b28c06f7ac6372e8f'}};
const bundle=record.createIdentityReviewBundle(bytes,raw,job,supp),matcher=(await load('scripts/lib/people-candidates.mjs')).loadProperNounMatcher(),sources=new Map();
for(const scope of api.chapterIdentityEvidenceScopes(bundle)){const key=`${scope.book}:${scope.chapter}`;sources.set(key,source.loadValidatedPeopleChapter(scope.book,scope.chapter,{properNounMatcher:matcher,strictAliasDispositions:key==='jinshu:053'}));}
const registry=await readIdentityDossierStore(J+'/registry-revision-1',new Map());
try{
 const inputs=api.chapterIdentityInputs('jinshu','053'),certificate=api.validateChapterIdentityBundle({localPersonMap:registry.localPersonMap,canonicalByKnownId:registry.canonicalByKnownId},sources,p.scope,bundle,inputs);
 api.assertReviewedIdentityCoverage(sources.get('jinshu:053'),{localPersonMap:registry.localPersonMap},[certificate]);
 fs.mkdirSync(O,{recursive:false});for(const[file,value]of [['captured-job.json',job],['review-bundle.json',bundle],['identity-certificate.json',certificate]])fs.writeFileSync(O+'/'+file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
 const receipt={scope:p.scope,sourcePacketSha256:job.sourcePacketSha256,originalReportSha256:job.reportSha256,supplementSha256:job.citationSupplement.sha256,
  originalReportsPreserved:true,sourceExtractionEditorialDatePinsUnchanged:true,chapterChineseUnits:sources.get('jinshu:053').packet.units.length,
  chapterChineseFingerprint:bundle.receipt.chapterChinese,reviewedCases:certificate.retained.length,chapterLocalPeople:certificate.retained.reduce((n,r)=>n+r.localPeople.length,0),reviewedAmbiguousCases:certificate.ambiguity.length,
  nativeIdentityProofAccepted:true,dataQualified:false,published:false};fs.writeFileSync(O+'/acceptance-receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 fs.copyFileSync(O+'/review-bundle.json',J+'/candidate/data/people/identity-reviews/jinshu/053.json');console.log(JSON.stringify(receipt));
}finally{registry.close();}
