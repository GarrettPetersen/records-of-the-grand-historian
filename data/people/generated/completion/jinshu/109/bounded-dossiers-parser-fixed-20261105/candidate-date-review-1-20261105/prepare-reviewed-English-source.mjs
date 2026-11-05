import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {pinnedIdentityChapterContext} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-pinned-identity-source.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {applyTranslationRepairs,reconcileExtractionAfterRepairs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-translation-repairs.mjs';
import {editorialDecisionSeed,validateEditorialDecisions,mergeEditorialDecisionReview,validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import {compactPeopleExtraction,serializeCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,out=dir+'reviewed-English-source-prepared-v3/';
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex'),write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
need(!fs.existsSync(out),'Preserve existing preparation');
const approved=read(dir+'independently-reviewed-English-source-patch.json'),reviewState=read(dir+'english-full-source-review-manifest.json');
need(reviewState.completeReports===4&&approved.repairs.length===40&&approved.allReviewerAuthoredAmendmentsIndependentlyRechecked,'Complete independently reviewed patch required');
for(const proof of approved.reviewProofs){const p=reviewState.parts.find(p=>p.index===proof.part);need(p?.phase==='report-recorded'&&p.reportSha256===proof.sha256&&hash(fs.readFileSync(proof.file))===proof.sha256&&p.runId===proof.runId&&p.agentId===proof.agentId,'Independent raw review proof changed');}
const context=pinnedIdentityChapterContext(root,approved.sourceRevision),matcher=loadProperNounMatcher(),loaded=context.load('jinshu','109',{properNounMatcher:matcher,strictAliasDispositions:true}),packet=loaded.packet,extraction=structuredClone(loaded.extraction),originalRaw=loaded.raw;
let editorial=context.editorial('jinshu','109');validateAppliedEditorialDecisions(editorial,extraction);
const paths={source:'data/jinshu/109.json',extraction:'data/people/extractions/jinshu/109.json',editorial:'data/people/editorial-decisions/jinshu/109.json'},before={};
for(const[k,path]of Object.entries(paths)){const bytes=fs.readFileSync(root+'/'+path);need(bytes.equals(context.snapshot.read(path)),'Current canonical input changed: '+path);before[k]={path,bytes,sha256:hash(bytes)};}
need(before.source.sha256===approved.sourceByteSha256,'Frozen source differs');
const added=[];
for(const row of approved.repairs){
 const unit=packet.units.find(u=>u.id===row.unitId),reviewer=row.independentReviewer;
 need(unit&&unit.zh===row.sourceQuote&&row.before===unit[row.field==='literal'?'literal':'en']&&reviewer.agentId!==row.authorAgentId&&row.verdict==='approve','Exact independent source correction required');
 const proof=approved.reviewProofs.find(p=>p.part===row.reviewProofPart),review=read(proof.file),rawRow=review.repairs.find(r=>r.proposalId===row.proposalId);
 need(rawRow?.verdict==='approve'&&rawRow.after===row.after&&review.reviewer.agentId===reviewer.agentId,'Final after text lacks independent approval');
 const id='jinshu:109:r'+String(extraction.translationRepairs.length+1).padStart(4,'0');
 const repair={id,unit:Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,unit[k]])),field:row.field,before:row.before,after:row.after,reason:row.reason,confidence:'high',status:'proposed'};
 extraction.translationRepairs.push(repair);added.push(repair);
 const scoped=structuredClone(extraction);scoped.translationRepairs=scoped.translationRepairs.filter(r=>r.status!=='proposed'||r.id===id);
 const incoming=editorialDecisionSeed(scoped);need(incoming.decisions.length===1,'One scoped editorial decision required');
 // This history schema's existing machine-review kind is cursor-agent. Actual
 // provider, context and captured run are explicit; no Cursor SDK/model is claimed.
 incoming.reviewer={kind:'cursor-agent',name:'Grok Bot independent English source reviewer',model:'Grok Bot (provider model not exposed)',agentId:reviewer.agentId,runId:reviewer.runId,completedAt:read(proof.file).reviewedAt??approved.at};
 incoming.decisions[0]={repairId:id,decision:'accept',after:null,reason:row.reason,sourceWitness:{source:'chapter-text',citation:'Jinshu109 '+row.unitId,excerpt:row.sourceQuote}};
 validateEditorialDecisions(incoming,scoped,packet);editorial=mergeEditorialDecisionReview(editorial,incoming);
}
const applied=applyTranslationRepairs(JSON.parse(before.source.bytes),added),next=buildPeopleExtractionPacket('jinshu','109',{chapterData:applied.chapter,chapterFile:root+'/'+paths.source,properNounMatcher:matcher}),reconciled=reconcileExtractionAfterRepairs(extraction,next,{previousPacket:packet});
fs.mkdirSync(out);write(out+'reconciliation.json',{unresolvedSpans:reconciled.unresolvedSpans,unresolvedCandidates:reconciled.unresolvedCandidates});
write(out+'prospective-packet.json',next);write(out+'prospective-extraction.json',reconciled.extraction);
need(!reconciled.unresolvedSpans.length,'Unresolved mention geometry');
const accounting=read(dir+'source-callback-decisions.json');
need(JSON.stringify(accounting.input)===JSON.stringify(next.input),'Prospective source accounting is stale');
need(JSON.stringify([...reconciled.unresolvedCandidates].sort())===JSON.stringify(accounting.decisions.map(d=>d.candidate).sort()),'Every exact unresolved candidate requires one decision');
const compact=compactPeopleExtraction(reconciled.extraction,next);
need(JSON.stringify(packet.units.map(u=>[u.id,u.zh]))===JSON.stringify(next.units.map(u=>[u.id,u.zh])),'Complete Chinese source changed');
compact.people=structuredClone(originalRaw.people);compact.claims=structuredClone(originalRaw.claims);
const seenCandidates=new Set();
for(const decision of accounting.decisions){
 const candidate=next.preflight.candidates.find(c=>c.id===decision.candidate),unit=next.units.find(u=>u.id===decision.unit);
 need(candidate&&unit&&!seenCandidates.has(candidate.id),'Unknown/duplicate source callback');seenCandidates.add(candidate.id);
 for(const field of ['unit','language','exact','occurrence'])need(candidate[field]===decision[field],'Source callback target changed: '+field);
 need(unit.zh.includes(decision.zhEvidence),'Missing exact Chinese callback witness');
 if(decision.action==='link'){
  need(reconciled.extraction.mentions.some(m=>m.person===decision.personId&&m.unit.id===unit.id&&m.spans.zh.some(span=>span.exact.includes(decision.zhEvidence))),'Person callback requires an existing same-unit Chinese mention');
  need(['personal-name','title-reference'].includes(decision.kind),'Unexpected callback mention kind');
  const prefix='jinshu:109:';need(decision.personId.startsWith(prefix),'Cross-chapter callback forbidden');const person=decision.personId.slice(prefix.length);
  need(compact.people.some(p=>p[0]===person),'Callback person absent');
  let surface=compact.surfaces.find(row=>row[0]===person&&row[1]===decision.kind&&row[2]===candidate.language&&row[3]===candidate.exact);
  if(!surface){surface=[person,decision.kind,candidate.language,candidate.exact,[]];compact.surfaces.push(surface);}
  let use=surface[4].find(row=>row[0]===candidate.unit);if(!use){use=[candidate.unit,[]];surface[4].push(use);}
  need(!use[1].includes(candidate.occurrence),'Callback already linked');use[1].push(candidate.occurrence);use[1].sort((a,b)=>a-b);
 }else{
  need(decision.action==='disposition'&&decision.disposition==='not-person'&&['place','book-title','organization'].includes(decision.reason),'Invalid non-person callback');
  let group=compact.candidateDispositions.find(row=>row[0]==='not-person'&&row[1]===decision.reason);
  if(!group){group=['not-person',decision.reason,[]];compact.candidateDispositions.push(group);}
  group[2].push([candidate.id.slice('jinshu:109:'.length),decision.note]);
 }
}
const preserved=validateCompactPeopleExtraction(compact,next,{strictAliasDispositions:true});validateAppliedEditorialDecisions(editorial,preserved.normalized);
need(JSON.stringify(compact.people)===JSON.stringify(originalRaw.people)&&JSON.stringify(compact.claims)===JSON.stringify(originalRaw.claims),'English repair may not delete/alter existing people or facts');
const sourceBytes=JSON.stringify(applied.chapter,null,2)+'\n',output={source:sourceBytes,extraction:serializeCompactPeopleExtraction(compact),editorial:JSON.stringify(editorial,null,2)+'\n'},files={};
for(const[k,bytes]of Object.entries(output)){fs.writeFileSync(out+k+'.json',bytes,{flag:'wx'});fs.writeFileSync(out+'before-'+k+'.json',before[k].bytes,{flag:'wx'});files[k]={path:paths[k],beforeSha256:before[k].sha256,beforeFile:out+'before-'+k+'.json',afterSha256:hash(Buffer.from(bytes)),afterFile:out+k+'.json'};}
const wf=root+'/data/people/generated/date-workflow/jinshu/109/';
const manifest={at:new Date().toISOString(),kind:'independently-reviewed-full-source-English-preparation',sourceRevision:approved.sourceRevision,fields:40,sourceUnits:27,files,reviewProofs:approved.reviewProofs,sourceCallbackDecisions:dir+'source-callback-decisions.json',sourceCallbacksResolved:12,normalValidation:true,editorialValidation:true,completeChineseSourceUnchanged:true,existingPeopleAndClaimsByteStructureUnchanged:true,stats:preserved.stats,priorDateCandidateFile:wf+'candidate-1.json',priorDateReportFile:wf+'review-1.json',nativeDateRound:1,maxRepairRounds:3,dateCandidateRebasePrepared:false,dateReconciliationRequiredBeforeApplication:true,canonicalWrites:0,dateApproval:false,chapterApproved:false};
write(out+'manifest.json',manifest);console.log(JSON.stringify({prepared:true,fields:40,stats:preserved.stats,canonicalWrites:0,dateCandidateRebasePrepared:false}));
