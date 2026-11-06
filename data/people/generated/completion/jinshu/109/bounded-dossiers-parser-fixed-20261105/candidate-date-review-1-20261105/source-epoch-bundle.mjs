// EPOCH_RECHECK_IMPORT_BEGIN
import {composeSourceEpochReview} from './source-epoch-proof-reuse.mjs';
// EPOCH_RECHECK_IMPORT_END
import fs from 'node:fs';
import {SOURCE_EPOCH_CHECKS as requiredChecks,validateEditorialReview,validateSourceCodeReview} from './source-review-validation.mjs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {isDeepStrictEqual as same} from 'node:util';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
import {readRemotePeopleWorkLedger,mutateRemotePeopleWorkLedger} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {applyTranslationRepairs,reconcileExtractionAfterRepairs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-translation-repairs.mjs';
import {editorialDecisionSeed,validateEditorialDecisions,mergeEditorialDecisionReview,validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import {compactPeopleExtraction,serializeCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {dateRepairDifference,applyDateRepairProposal} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {writeTextAtomic,exactSpanAt} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-content.mjs';

const [configFile,action]=process.argv.slice(2),root='/Users/garrettpetersen/records-of-the-grand-historian',runtime='/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime',dir=new URL('.',import.meta.url).pathname,wf=root+'/data/people/generated/date-workflow/jinshu/109';
const need=(v,m)=>{if(!v)throw Error(m)},read=f=>JSON.parse(fs.readFileSync(f)),hash=b=>createHash('sha256').update(b).digest('hex'),json=v=>JSON.stringify(v,null,2)+'\n',write=(f,v)=>fs.writeFileSync(f,json(v),{flag:'wx'}),shaFile=f=>hash(fs.readFileSync(f));
need(configFile&&path.isAbsolute(configFile)&&['prepare','apply'].includes(action),'Use explicit absolute CONFIG then prepare/apply');
const config=read(configFile),app=config.application,controllerFile=dir+config.controllerFile,control=read(controllerFile),out=dir+app.preparedFolder+'/',options={dataDir:root+'/data',peopleDir:root+'/data/people'},paths={source:root+'/data/jinshu/109.json',extraction:root+'/data/people/extractions/jinshu/109.json',editorial:root+'/data/people/editorial-decisions/jinshu/109.json'},receiptFile=out+'application.json',intentFile=out+'application-intent.json';
const codeFile=new URL(import.meta.url).pathname;
// EPOCH_CONFIG_PATH_BEGIN
need(path.resolve(configFile)===dir+'closure-review-c72620a9.json','Use the exact reviewed configuration for prepare and apply');
// EPOCH_CONFIG_PATH_END
function current(){
 need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
 need(execFileSync('git',['-C',runtime,'rev-parse','HEAD'],{encoding:'utf8'}).trim()===app.runtimeHead&&!execFileSync('git',['-C',runtime,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim(),'Preserve exact clean reviewed runtime');
 for(const[f,digest]of Object.entries(config.sealedCurrentFiles))need(shaFile(f)===digest,'Frozen source/native input changed: '+f);
 const native=read(wf+'/state.json');need(native.generationId===config.generationId&&native.phase==='reaudit'&&native.round===2&&native.reviewRoundCeiling===3&&!native.circuitBreaker&&!Object.keys(native.jobs).some(k=>k.startsWith('reaudit-2-'))&&!Object.keys(native.reviewPlans??{}).includes('reaudit-2')&&!fs.existsSync(wf+'/candidate-3.json'),'Preserve held native round2/3 and undispatched final audit');
 need(!fs.existsSync(root+'/data/people/date-audits/jinshu/109.json'),'Preserve absent retired positive audit');return native;
}
function owners(ledger,{requireIdle}){
 const c=ledger.dateAudits?.['jinshu/109'],i=ledger.identityReviews?.['jinshu/109'];
 need(typeof requireIdle==='boolean','Specify read-only preparation or idle application ownership');
 need(c?.worker===config.worker&&c.lane==='grokbot'&&c.status==='research-blocked'&&c.generationId===config.generationId&&c.sourceHash===config.sourceHash&&c.extractionHash===config.canonicalExtractionHash&&c.executorToken===control.executorToken&&!ledger.claims?.['jinshu/109'],'Preserve exact shared source owner');
 const active=Object.entries(c.jobs).filter(([,j])=>['claimed','running','running-tools'].includes(j.status));
 if(requireIdle)need(!active.length,'Preserve active model work before source application');
 else if(active.length){const reader=control.parts.find(p=>p.caseId===control.activeCaseId);need(active.length===1&&reader?.caseId==='goguryeo-note-cross-review-v2'&&reader.status==='running'&&active[0][0]===reader.jobKey&&active[0][1].agentId===reader.agentId,'Only the exact pinned source-note reader may overlap read-only preparation');}
 need(i?.worker==='jinshu-completion-109-identity'&&!i.activeRun,'Preserve retained identity owner');return {c,i};
}
function englishProofs(){
 return app.englishCases.map(caseId=>{
  const job=control.parts.find(p=>p.caseId===caseId);need(job?.status==='returned'&&job.verdict==='approve','Capture exact independent English approval: '+caseId);
  const input=read(job.inputFile),report=read(job.rawFile);need(shaFile(job.inputFile)===job.sha256&&shaFile(job.rawFile)===job.reviewSha256,'Immutable independent proof changed');
  validateEditorialReview(report,input,{caseId,sha:job.sha256,id:job.agentId,canonicalHash:config.canonicalExtractionHash,candidateHash:config.candidateExtractionHash});
  need(report.verdict==='approve'&&!report.additionalCorrections.length&&input.extractionProposals.length===0,'Every definite English correction requires independent closure');
  return {caseId,input,report,agentId:job.agentId,runId:job.runId,completedAt:job.completedAt,inputFile:job.inputFile,inputSha256:job.sha256,reportFile:job.rawFile,reportSha256:job.reviewSha256};
 });
}
function packetFor(source){return buildPeopleExtractionPacket('jinshu','109',{chapterData:source,chapterFile:paths.source,properNounMatcher:loadProperNounMatcher()});}
function validate(raw,packet,editorial){const v=validateCompactPeopleExtraction(raw,packet,{strictAliasDispositions:true});validateAppliedEditorialDecisions(editorial,v.normalized);return v;}
const canonicalize=v=>Array.isArray(v)?v.map(canonicalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v;
const witnessSet=(mentions,packet,movedEnglishUnits)=>mentions.map(({id,...w})=>{
 const u=packet.units.find(u=>u.id===w.unit.id);for(const language of ['en','zh'])for(const span of w.spans[language]){
  need(same(span,exactSpanAt(u[language],span.exact,span.occurrence)),'Mention is not anchored to its exact current unit/geometry');
  delete span.unitTextHash;
  // Approved English rewording can move an existing exact name. Both old and
  // new geometries are verified above; person, kind, unit, exact text,
  // occurrence, multiplicity and candidate references remain equal below.
  if(language==='en'&&movedEnglishUnits.has(w.unit.id)){delete span.startCodePoint;delete span.endCodePoint;}
 }
 return JSON.stringify(canonicalize(w));
}).sort();

if(action==='prepare'){
 const native=current();need(!fs.existsSync(out),'Preserve existing preparation');need(!control.activeCaseId||control.activeCaseId==='goguryeo-note-cross-review-v2','Preserve source writers and unrelated work');
 const {i}=owners(readRemotePeopleWorkLedger(),{requireIdle:false}),proofs=englishProofs(),source=read(paths.source),canonical=read(paths.extraction),staged=read(wf+'/'+native.candidate),editorialBefore=read(paths.editorial),packet=packetFor(source),oldCanonical=buildDateAuditPacket('jinshu','109',{...options,extraction:canonical}),oldStaged=buildDateAuditPacket('jinshu','109',{...options,extraction:staged});
 need(oldCanonical.sourceHash===config.sourceHash&&oldCanonical.extractionHash===config.canonicalExtractionHash&&oldStaged.extractionHash===config.candidateExtractionHash,'Current semantic pins changed');
 const normalized=validate(canonical,packet,editorialBefore).normalized,proposals=proofs.flatMap(proof=>proof.input.proposals.map(p=>({...p,proof}))),targets=proposals.map(p=>p.unit+'-'+p.field);
 need(Array.isArray(app.expectedTargets)&&proposals.length===app.expectedTargets.length&&new Set(targets).size===targets.length&&same([...targets].sort(),[...app.expectedTargets].sort()),'Exact declared independently reviewed source cohort required');
 let editorial=structuredClone(editorialBefore);
 const repairs=proposals.map((p,n)=>{const productionReason=app.productionReasons[p.id];need(typeof productionReason==='string'&&productionReason.length>=20&&productionReason.length<=500,'Exact bounded production rationale required');const u=packet.units.find(u=>u.id===p.unit),check=p.proof.report.checks.find(c=>c.id===p.id);need(u&&u.zh===p.sourceChinese&&u[p.field]===p.before&&check?.verdict==='approve'&&check.after===p.after&&p.authorAgentId!==p.proof.agentId,'Complete independent exact source replacement required');return {id:'jinshu:109:r'+String(normalized.translationRepairs.length+n+1).padStart(4,'0'),unit:Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,u[k]])),field:p.field==='en'?'idiomatic':'literal',before:p.before,after:p.after,reason:productionReason,confidence:'high',status:'proposed'};});
 const reviewing=structuredClone(normalized);
 for(const[n,repair]of repairs.entries()){
  reviewing.translationRepairs.push(repair);const scoped=structuredClone(reviewing);scoped.translationRepairs=scoped.translationRepairs.filter(r=>r.status!=='proposed'||r.id===repair.id);const review=editorialDecisionSeed(scoped),proof=proposals[n].proof;need(review.decisions.length===1,'One exact editorial approval required');
  review.reviewer={kind:'cursor-agent',name:'Grok Bot independent source correction reviewer',model:'Grok Bot (provider model not exposed)',agentId:proof.agentId,runId:proof.runId,completedAt:proof.completedAt};review.decisions[0]={repairId:repair.id,decision:'accept',after:null,reason:repair.reason,sourceWitness:{source:'chapter-text',citation:'Jinshu109 '+repair.unit.id,excerpt:packet.units.find(u=>u.id===repair.unit.id).zh}};validateEditorialDecisions(review,scoped,packet);editorial=mergeEditorialDecisionReview(editorial,review);
 }
 const afterSource=applyTranslationRepairs(source,repairs).chapter,next=packetFor(afterSource),movedEnglishUnits=new Set(proposals.filter(p=>p.field==='en').map(p=>p.unit));
 need(packet.units.length===next.units.length,'Source unit count changed');
 for(const u of packet.units){const after=next.units.find(v=>v.id===u.id),expected=structuredClone(u);for(const p of proposals.filter(p=>p.unit===u.id))expected[p.field]=p.after;need(same(expected,after),'Undeclared source field or locator changed');}
 fs.mkdirSync(out);write(out+'source.json',afterSource);write(out+'editorial.json',editorial);fs.mkdirSync(out+'date-input/jinshu',{recursive:true});fs.linkSync(out+'source.json',out+'date-input/jinshu/109.json');const variants=[],mentionReanchors=[];
 for(const[name,raw,priorDate]of [['canonical',canonical,oldCanonical],['staged',staged,oldStaged]]){
  const expanded=validate(raw,packet,editorialBefore).normalized;expanded.translationRepairs.push(...structuredClone(repairs));const rec=reconcileExtractionAfterRepairs(expanded,next,{previousPacket:packet});need(!rec.unresolvedSpans.length&&!rec.unresolvedCandidates.length,'New source accounting requires independent review');
  need(same(witnessSet(structuredClone(expanded.mentions),packet,movedEnglishUnits),witnessSet(structuredClone(rec.extraction.mentions),next,movedEnglishUnits)),'An undeclared mention identity, exact surface or untouched geometry changed');
  for(const before of expanded.mentions.filter(m=>movedEnglishUnits.has(m.unit.id))){const matches=rec.extraction.mentions.filter(m=>m.person===before.person&&m.kind===before.kind&&same(m.unit,before.unit)&&same(m.spans.en.map(s=>[s.exact,s.occurrence]),before.spans.en.map(s=>[s.exact,s.occurrence])));need(matches.length===1,'Unique complete moved mention required');const after=matches[0];if(!same(before.spans.en,after.spans.en))mentionReanchors.push({variant:name,person:before.person,kind:before.kind,unit:before.unit.id,before:before.spans.en,after:after.spans.en});}
  const compact=compactPeopleExtraction(rec.extraction,next);compact.people=structuredClone(raw.people);compact.claims=structuredClone(raw.claims);const valid=validate(compact,next,editorial),date=buildDateAuditPacket('jinshu','109',{dataDir:out+'date-input',peopleDir:root+'/data/people',extraction:compact});
  need(same(date.items,priorDate.items)&&same(date.people,priorDate.people),'Dates, claim identities or hints changed');
  fs.writeFileSync(out+(name==='canonical'?'extraction.json':'candidate.json'),serializeCompactPeopleExtraction(compact),{flag:'wx'});variants.push({name,raw:compact,date,stats:valid.stats});
 }
 const [c,s]=variants,proposal=dateRepairDifference(c.raw,s.raw,c.date);proposal.author={name:'Codex host retained date repair author',agentId:'codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33'};for(const change of proposal.changes)change.reason='Carry existing staged chronology unchanged across independently reviewed English corrections; fresh current-source independent date approval remains required.';
 need(proposal.changes.length===366&&same(applyDateRepairProposal(c.raw,proposal,c.date),s.raw),'All existing staged chronology must replay exactly');write(out+'combined-proposal.json',proposal);
 const files={};for(const[name,file]of Object.entries(paths)){fs.copyFileSync(file,out+'before-'+name+'.json',fs.constants.COPYFILE_EXCL);files[name]={path:file,beforeFile:out+'before-'+name+'.json',beforeSha256:shaFile(file),afterFile:out+name+'.json',afterSha256:shaFile(out+name+'.json')};}
 const manifest={at:new Date().toISOString(),kind:'independently-reviewed-English-source-epoch-bundle',files,fromGenerationId:native.generationId,toGenerationId:randomUUID(),previousSourceHash:config.sourceHash,previousCanonicalExtractionHash:config.canonicalExtractionHash,previousCandidateExtractionHash:config.candidateExtractionHash,sourceHash:c.date.sourceHash,canonicalExtractionHash:c.date.extractionHash,candidateExtractionHash:s.date.extractionHash,sourceFields:proposals.map(({proof,...p})=>p),proofs:proofs.map(({input,report,...p})=>p),identityOwner:{worker:i.worker,updatedAt:i.updatedAt},nativeStateSha256:shaFile(wf+'/state.json'),negativeReportSha256:shaFile(wf+'/review-1.json'),candidateFile:native.candidate,dateItems:s.date.items.length,dateReplayChanges:proposal.changes.length,peopleUnchanged:true,claimsAndHintsUnchanged:true,completeMentionWitnessesUnchanged:true,nativeRound:2,maxRepairRounds:3,canonicalWrites:0,dateApproval:false,chapterApproved:false,stats:c.stats};
 manifest.mentionReanchors=mentionReanchors;delete manifest.completeMentionWitnessesUnchanged;manifest.mentionAssignmentsAndExactSurfacesUnchanged=true;
 manifest.productionReasons=app.productionReasons;manifest.reasonProjection={hostAuthoredBoundedSummaries:true,originalFullReasonsPreservedInSourceFields:true,exactApprovedAfterTextsUnchanged:true,requiresIndependentApplicationReview:true};
 manifest.workflowFileSha256=Object.fromEntries(fs.readdirSync(wf).map(name=>{need(name.endsWith('.json')&&fs.lstatSync(wf+'/'+name).isFile(),'Unexpected workflow service or nested state; preserve it');return [name,shaFile(wf+'/'+name)];}));
 current();write(out+'manifest.json',manifest);console.log(JSON.stringify({prepared:true,EnglishFields:manifest.sourceFields.length,dateItems:manifest.dateItems,dateReplayChanges:366,canonicalWrites:0,sourceHash:manifest.sourceHash}));
}else{
 const native=current(),manifest=read(out+'manifest.json'),reviewJob=control.parts.find(p=>p.caseId===app.reviewCase);
 need(control.phase==='all-reviewed'&&!control.activeCaseId&&control.parts.every(p=>p.status==='returned'),'Capture all independent closure and code reports before source application; historical negative reports remain immutable');
 need(reviewJob&&reviewJob.status==='returned'&&reviewJob.verdict==='approve'&&shaFile(reviewJob.rawFile)===reviewJob.reviewSha256&&shaFile(reviewJob.inputFile)===reviewJob.sha256,'Exact independent code report required');
 const reviewInput=read(reviewJob.inputFile),report=read(reviewJob.rawFile);
 // EPOCH_RECHECK_GATE_BEGIN
 validateSourceCodeReview(report,reviewInput,{sha:reviewJob.sha256,id:reviewJob.agentId});
 need(report.verdict==='approve'&&reviewInput.configFile===path.resolve(configFile)&&reviewInput.configSha256===shaFile(configFile)&&app.runtimeHead===reviewInput.runtimeBoundary.head,'Bind exact active config and runtime to the independent review');
 const priorJob=control.parts.find(p=>p.caseId==='source-epoch-code-review');need(priorJob?.status==='returned'&&priorJob.verdict==='needs-revision'&&shaFile(priorJob.inputFile)===priorJob.sha256&&shaFile(priorJob.rawFile)===priorJob.reviewSha256,'Preserve exact original code review');
 const priorInput=read(priorJob.inputFile),priorReport=read(priorJob.rawFile);validateSourceCodeReview(priorReport,priorInput,{sha:priorJob.sha256,id:priorJob.agentId});
 need(reviewInput.priorReview.inputSha256===priorJob.sha256&&reviewInput.priorReview.resultSha256===priorJob.reviewSha256&&reviewInput.priorReview.runId===priorJob.runId,'Exact captured prior code-review lineage required');
 composeSourceEpochReview(priorInput,priorReport,reviewInput,report,fs.readFileSync(codeFile,'utf8'),config,read(reviewInput.originalConfigFile),{priorInputBytes:fs.readFileSync(priorJob.inputFile),priorReportBytes:fs.readFileSync(priorJob.rawFile),originalConfigBytes:fs.readFileSync(reviewInput.originalConfigFile)});
 // EPOCH_RECHECK_GATE_END
 need(report.sourceHash===config.sourceHash&&report.extractionHash===config.candidateExtractionHash&&report.manifestSha256===shaFile(out+'manifest.json')&&reviewInput.manifestSha256===report.manifestSha256&&report.applierSha256===shaFile(codeFile)&&reviewInput.applierSha256===report.applierSha256,'Exact source, code and manifest review pins required');
 need(same(reviewInput.pathBases,{D:dir,P:root+'/'}),'Exact sealed path namespaces required');
 for(const[key,digest]of Object.entries(reviewInput.sealedFileSha256)){const parts=key.split('|');need(parts.length===2&&Object.hasOwn(reviewInput.pathBases,parts[0])&&!path.isAbsolute(parts[1]),'Malformed sealed path');const file=reviewInput.pathBases[parts[0]]+parts[1];need(shaFile(file)===digest,'A sealed code/preparation boundary changed: '+file);}
 const proofs=englishProofs();need(same(proofs.map(({input,report,...p})=>p),manifest.proofs),'Captured English approval bindings changed');
 need(manifest.fromGenerationId===config.generationId&&manifest.nativeRound===2&&manifest.maxRepairRounds===3&&manifest.nativeStateSha256===shaFile(wf+'/state.json')&&manifest.negativeReportSha256===shaFile(wf+'/review-1.json'),'Preserve native source epoch and original negative findings');
 for(const f of Object.values(manifest.files))need(shaFile(f.path)===f.beforeSha256&&shaFile(f.beforeFile)===f.beforeSha256&&shaFile(f.afterFile)===f.afterSha256,'Current or prepared canonical file changed');
 const beforeCanonical=read(paths.extraction),beforeCandidate=read(wf+'/'+native.candidate),candidate=read(out+'candidate.json'),proposal=read(out+'combined-proposal.json'),chapter=read(out+'source.json'),editorial=read(out+'editorial.json'),canonical=read(out+'extraction.json'),packet=packetFor(chapter);
 for(const value of [canonical,candidate])validate(value,packet,editorial);
 for(const[before,after]of [[beforeCanonical,canonical],[beforeCandidate,candidate]])need(same(before.people,after.people)&&same(before.claims,after.claims),'An unreviewed person, hint or date claim changed');
 const proposedOptions={dataDir:out+'date-input',peopleDir:root+'/data/people'},cDate=buildDateAuditPacket('jinshu','109',{...proposedOptions,extraction:canonical}),sDate=buildDateAuditPacket('jinshu','109',{...proposedOptions,extraction:candidate});
 need(cDate.sourceHash===manifest.sourceHash&&cDate.extractionHash===manifest.canonicalExtractionHash&&sDate.extractionHash===manifest.candidateExtractionHash&&same(applyDateRepairProposal(canonical,proposal,cDate),candidate),'Exact independently reviewed source/date replay required');
 need(!fs.existsSync(intentFile)&&!fs.existsSync(receiptFile),'Recover existing application intent; do not repeat source writes');
 const archive=wf+'.reviewed-English-'+manifest.toGenerationId;need(!fs.existsSync(archive),'Preserve existing source epoch archive');
 const unlock=acquireProcessRunLock(root+'/data/people/generated/resolution-run.lock',{label:'Reviewed source epoch application',failIfExists:true});
 try{
  const q=mutateRemotePeopleWorkLedger(l=>{const{c,i}=owners(l,{requireIdle:true});need(i.worker===manifest.identityOwner.worker&&i.updatedAt===manifest.identityOwner.updatedAt,'Identity owner changed since preparation');c.sourceEditorialApplication={phase:'applying',intentFile,receiptFile,dateApproval:false};i.sourceApplication={phase:'applying',intentFile,receiptFile,chapterApproved:false};},{message:'Reserve reviewed English-field109 source application while preserving capped chronology'});
  write(intentFile,{at:new Date().toISOString(),kind:'reviewed-source-epoch-application-intent',queueCommit:q.commit,manifestFile:out+'manifest.json',manifestSha256:shaFile(out+'manifest.json'),reviewFile:reviewJob.rawFile,reviewSha256:reviewJob.reviewSha256,archive,receiptFile,oldGenerationId:native.generationId,newGenerationId:manifest.toGenerationId,canonicalWritesExpected:3,dateApproval:false});
  // EPOCH_CANONICAL_PIN_BEGIN
  for(const f of Object.values(manifest.files))need(shaFile(f.path)===f.beforeSha256,'Source changed after reservation');
  // EPOCH_CANONICAL_PIN_END
  current();need(same(Object.keys(manifest.workflowFileSha256).sort(),fs.readdirSync(wf).sort()),'Workflow files changed after reservation');for(const[name,digest]of Object.entries(manifest.workflowFileSha256))need(shaFile(wf+'/'+name)===digest,'Immutable workflow history changed');
  fs.renameSync(wf,archive);fs.mkdirSync(wf);for(const name of Object.keys(manifest.workflowFileSha256)){fs.copyFileSync(archive+'/'+name,wf+'/'+name,fs.constants.COPYFILE_EXCL);need(shaFile(wf+'/'+name)===manifest.workflowFileSha256[name],'Workflow archive copy failed exact verification');}
  for(const f of Object.values(manifest.files))writeTextAtomic(f.path,fs.readFileSync(f.afterFile,'utf8'));
  const next=structuredClone(native);Object.assign(next,{generationId:manifest.toGenerationId,sourceHash:manifest.sourceHash,extractionHash:manifest.canonicalExtractionHash,manualRepairAuthority:receiptFile,priorGenerationDirectory:archive});
  next.sourceEpochTransitions=[...(native.sourceEpochTransitions??[]),{at:new Date().toISOString(),fromGenerationId:native.generationId,toGenerationId:manifest.toGenerationId,archive,manifestFile:out+'manifest.json',receiptFile,roundBefore:2,roundAfter:2,maxRepairRounds:3,unchangedChronology:true,EnglishFields:manifest.sourceFields.length,approvalRetagged:false,previousNegativeFindingAuthority:native.retainedNegativeFindingAuthority}];
  const originalNegative=read(archive+'/review-1.json');next.retainedNegativeFindingAuthority={kind:'historical-negative-report-only',originalReportSha256:manifest.negativeReportSha256,originalSourceHash:originalNegative.sourceHash,originalExtractionHash:originalNegative.extractionHash,archiveWorkflowDirectory:archive,currentSourceApproval:false,approvalRetagged:false};
  writeTextAtomic(wf+'/'+next.candidate,fs.readFileSync(out+'candidate.json','utf8'));writeTextAtomic(wf+'/combined-proposal.json',fs.readFileSync(out+'combined-proposal.json','utf8'));writeTextAtomic(wf+'/source-epoch-lineage.json',json(next.sourceEpochTransitions));writeTextAtomic(wf+'/state.json',json(next));
  for(const f of Object.values(manifest.files))need(shaFile(f.path)===f.afterSha256,'Installed canonical file differs from preparation');
  const livePacket=packetFor(read(paths.source)),liveCanonical=read(paths.extraction),liveCandidate=read(wf+'/'+next.candidate),liveEditorial=read(paths.editorial);
  for(const value of [liveCanonical,liveCandidate])validate(value,livePacket,liveEditorial);
  const liveDate=buildDateAuditPacket('jinshu','109',{...options,extraction:liveCanonical}),liveStaged=buildDateAuditPacket('jinshu','109',{...options,extraction:liveCandidate});need(liveDate.sourceHash===manifest.sourceHash&&liveDate.extractionHash===manifest.canonicalExtractionHash&&liveStaged.extractionHash===manifest.candidateExtractionHash&&same(applyDateRepairProposal(liveCanonical,read(wf+'/combined-proposal.json'),liveDate),liveCandidate),'Installed source/date replay differs');
  need(shaFile(wf+'/review-1.json')===manifest.negativeReportSha256&&!fs.existsSync(root+'/data/people/date-audits/jinshu/109.json')&&next.round===2&&next.reviewRoundCeiling===3&&!next.circuitBreaker,'Retired approval, native cap or negative history changed');
  const receipt={at:new Date().toISOString(),kind:'applied-independently-reviewed-English-source-epoch',fromGenerationId:native.generationId,toGenerationId:next.generationId,archiveWorkflowDirectory:archive,sourceHash:liveDate.sourceHash,canonicalExtractionHash:liveDate.extractionHash,candidateExtractionHash:liveStaged.extractionHash,EnglishFieldsApplied:manifest.sourceFields.length,canonicalWrites:3,dateItems:liveStaged.items.length,dateReplayChanges:366,peopleClaimsHintsUnchanged:true,normalValidation:true,editorialValidation:true,codeReviewerAgentId:reviewJob.agentId,codeReviewerRunId:reviewJob.runId,nativeRound:2,maxRepairRounds:3,dateApproval:false,identityApproval:false,chapterApproved:false,published:false};write(receiptFile,receipt);
  const completed=mutateRemotePeopleWorkLedger(l=>{const{c,i}=owners(l,{requireIdle:true});need(c.sourceEditorialApplication?.intentFile===intentFile&&i.sourceApplication?.intentFile===intentFile,'Source application ownership changed');l.dateAuditHistory??={};(l.dateAuditHistory['jinshu/109']??=[]).push(structuredClone(c));Object.assign(c,{generationId:next.generationId,sourceHash:liveDate.sourceHash,extractionHash:liveDate.extractionHash,status:'research-blocked',sticky:true,candidateStage:{phase:'reaudit',round:2,maxRepairRounds:3,candidateExtractionHash:liveStaged.extractionHash,sourceApplicationReceipt:receiptFile,currentSourceReviewReports:0,priorResearchMustReconcile:true},sourceEditorialApplication:{phase:'applied',at:receipt.at,receipt:receiptFile,requiresFreshDateApproval:true}});delete c.executorToken;delete c.executorHost;delete c.executorExpiresAt;Object.assign(i,{phase:'source-reconciliation-hold',activeRun:false,updatedAt:receipt.at,queueUpdatedAt:receipt.at,sourceApplication:{phase:'applied',receipt:receiptFile,oldPacketDispatchForbidden:true,dateApproval:false,chapterApproved:false}});},{message:'Record reviewed English-field109 source epoch; preserve native2/3, staged dates and immutable reports'});
  Object.assign(control,{phase:'applied-checkpoint',activeCaseId:null,sourceApplicationReceipt:receiptFile,queueCommit:completed.commit,executorReleased:true,nextSourceGenerationId:next.generationId,oldResearchDispatchForbidden:true});writeTextAtomic(controllerFile,json(control));
  need(!inspectLocalDisk(root).errors.length,'Post-application resource hold; preserve completed source and receipt');console.log(JSON.stringify(receipt));
 }finally{unlock();}
}
