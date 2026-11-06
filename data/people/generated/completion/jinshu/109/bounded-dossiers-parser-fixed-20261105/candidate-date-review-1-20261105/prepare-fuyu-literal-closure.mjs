import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {applyTranslationRepairs,reconcileExtractionAfterRepairs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-translation-repairs.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,folder=dir+'focused-date-research-current-source-c72620a9/';
const read=f=>JSON.parse(fs.readFileSync(f)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex'),same=isDeepStrictEqual,write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const canonicalize=v=>Array.isArray(v)?v.map(canonicalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v;
const mentionWitnesses=rows=>rows.map(({id,...witness})=>JSON.stringify(canonicalize(witness))).sort();
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
const config=read(dir+'focused-date-research-c72620a9.json'),wf=root+'/data/people/generated/date-workflow/jinshu/109',native=read(wf+'/state.json');
need(native.generationId===config.generationId&&native.phase==='reaudit'&&native.round===2&&native.reviewRoundCeiling===3&&!native.circuitBreaker,'Preserve native source generation and capped chronology');
for(const[f,digest]of Object.entries(config.sealedCurrentFiles))need(hash(fs.readFileSync(f))===digest,'Current frozen input changed: '+f);
const supplementalFile=folder+'fuyu-critical-reading.english-supplemental.raw.json',supplemental=read(supplementalFile),source=read(root+'/data/jinshu/109.json'),canonical=read(root+'/data/people/extractions/jinshu/109.json'),staged=read(wf+'/'+native.candidate);
need(supplemental.reviewer?.agentId==='18eed238-8e6e-4946-90ce-6c0e155b3d47'&&supplemental.status==='proposed-correction-only'&&supplemental.corrections.length===1,'Preserve actual author supplemental');
const proposal=supplemental.corrections[0];
need(proposal.book==='jinshu'&&proposal.chapter==='109'&&proposal.unit==='s0138'&&proposal.field==='literal'&&proposal.before!==proposal.after&&proposal.sourceReason.length>20,'Exact complete supplemental required');
const matcher=loadProperNounMatcher(),packet=buildPeopleExtractionPacket('jinshu','109',{chapterData:source,chapterFile:root+'/data/jinshu/109.json',properNounMatcher:matcher}),target=packet.units.find(u=>u.id===proposal.unit);
need(target?.literal===proposal.before,'Current literal before image changed');
const opts={dataDir:root+'/data',peopleDir:root+'/data/people'},canonicalDate=buildDateAuditPacket('jinshu','109',{...opts,extraction:canonical}),stagedDate=buildDateAuditPacket('jinshu','109',{...opts,extraction:staged});
need(canonicalDate.sourceHash===config.sourceHash&&canonicalDate.extractionHash===config.canonicalExtractionHash&&stagedDate.extractionHash===config.candidateExtractionHash,'Source and extraction pins changed');
const matched=packet.units.filter(u=>/夫餘|部眾|部落|率騎|世子俊/u.test(u.zh)),ids=new Set(matched.map(u=>u.id));
const index=packet.units.indexOf(target);for(let n=Math.max(0,index-2);n<=Math.min(packet.units.length-1,index+2);n++)ids.add(packet.units[n].id);
const sourceUnits=packet.units.filter(u=>ids.has(u.id));
const input={kind:'independent-supplemental-English-and-record-wording-review-input',schemaVersion:1,book:'jinshu',chapter:'109',sourceHash:canonicalDate.sourceHash,canonicalExtractionHash:canonicalDate.extractionHash,stagedExtractionHash:stagedDate.extractionHash,excludedReviewerIds:['codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33',supplemental.reviewer.agentId],proposals:[{...proposal,id:'s0138-literal',sourceChinese:target.zh,authorAgentId:supplemental.reviewer.agentId,reason:proposal.sourceReason}],extractionProposals:[],sourceUnits,repeatedUseScan:{allSourceUnits:packet.units.length,pattern:'夫餘|部眾|部落|率騎|世子俊',matchedUnitIds:matched.map(u=>u.id),includesBothEnglishFields:true},references:read(folder+'fuyu-critical-reading.input.json').references,origin:{file:supplementalFile,sha256:hash(fs.readFileSync(supplementalFile))},instructions:'Independently check the complete one-field replacement against supplied Chinese, both English fields, neighboring units and ALL included repeated uses. Approve a faithful correction; amend only definite defects, never style preferences. Keep literal third year, Jun/Ke coordination, seventeen thousand cavalry, captured king, and population greater than fifty thousand. Do not infer a regnal era/year, silently emend Chinese, identify unnamed people, merge people, or approve dates. Return a complete exact approve/amend/reject check and separate complete before/after proposals for any definite further English defects. Shared host checkout only; no source mutation, Git, build, clone, worktree, delegation or paid APIs. This is an unclaimed editorial proposal, not an approval or application.'};
const locator=Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,target[k]])),repair={id:'jinshu:109:r0240',unit:locator,field:'literal',before:proposal.before,after:proposal.after,reason:proposal.sourceReason,confidence:'high',status:'proposed'};
const changed=applyTranslationRepairs(source,[repair]).chapter,next=buildPeopleExtractionPacket('jinshu','109',{chapterData:changed,chapterFile:root+'/data/jinshu/109.json',properNounMatcher:matcher});
need(same(packet.units.map(u=>[u.id,u.zh,u.en]),next.units.map(u=>[u.id,u.zh,u.en])),'The proposed literal correction changed Chinese or idiomatic English');
need(same(packet.preflight.candidates,next.preflight.candidates),'The proposed literal correction unexpectedly changes candidate accounting');
const variants=[];
for(const[name,raw]of [['canonical',canonical],['staged',staged]]){
 const expanded=validateCompactPeopleExtraction(raw,packet,{strictAliasDispositions:true}).normalized,rec=reconcileExtractionAfterRepairs(expanded,next,{previousPacket:packet});
 need(!rec.unresolvedSpans.length&&!rec.unresolvedCandidates.length,'The proposed literal correction requires new mention/candidate decisions');
 for(const key of ['people','claims'])if(!same(expanded[key],rec.extraction[key])){
  const first=expanded[key].findIndex((value,i)=>!same(value,rec.extraction[key][i]));
  throw Error(JSON.stringify({problem:'Unexpected reconciliation delta',variant:name,key,beforeLength:expanded[key].length,afterLength:rec.extraction[key].length,first,before:expanded[key][first],after:rec.extraction[key][first]}));
 }
 // The library sorts mentions and regenerates ordinal IDs. Compare every full
 // source geometry/person/kind/candidate witness with multiplicity, never IDs.
 need(same(mentionWitnesses(expanded.mentions),mentionWitnesses(rec.extraction.mentions)),'The literal correction changes a complete mention witness');
 variants.push({name,unresolvedSpans:0,unresolvedCandidates:0,peopleClaimsUnchanged:true,completeMentionWitnessMultisetUnchanged:true,mentionOrdinalOrderMayChange:true});
}
const bytes=Buffer.from(JSON.stringify(input)+'\n');need(bytes.length<=60*1024,'Complete editorial evidence exceeds bounded transport; do not truncate');
fs.writeFileSync(folder+'fuyu-literal-closure.input.json',bytes,{flag:'wx'});
write(folder+'fuyu-literal-closure.preparation.json',{at:new Date().toISOString(),kind:'unclaimed-independent-English-closure-preparation',inputFile:folder+'fuyu-literal-closure.input.json',inputSha256:hash(bytes),inputBytes:bytes.length,sourceHash:input.sourceHash,canonicalExtractionHash:input.canonicalExtractionHash,stagedExtractionHash:input.stagedExtractionHash,sourceUnits:sourceUnits.length,proposals:1,reviewerAssigned:false,variants,canonicalWrites:0,independentReview:false,dateApproval:false,chapterApproved:false,next:'Independently review this complete correction before source application; preserve old source reviews and reconcile affected evidence after application. Never retag date approvals.'});
console.log(JSON.stringify({prepared:true,bytes:bytes.length,units:sourceUnits.length,repeatedUnits:matched.length,proposals:1,canonicalWrites:0,independentReview:false}));
