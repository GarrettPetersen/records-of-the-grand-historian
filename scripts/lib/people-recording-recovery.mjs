import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const hash=b=>'sha256:'+createHash('sha256').update(b).digest('hex');
export const recordingDocumentHash=v=>hash(JSON.stringify(v));
const read=f=>JSON.parse(fs.readFileSync(f));
export function recordingPin(file){const s=fs.lstatSync(file);assert(s.isFile()&&!s.isSymbolicLink(),'Recording recovery requires regular files');const b=fs.readFileSync(file);return{file,bytes:b.length,sha256:hash(b)};}
const verify=p=>{assert.deepEqual(recordingPin(p.file),p,'Stale recording recovery pin');return fs.readFileSync(p.file);};
const frozen=['source','extraction','editorial','materialization'];
const core=['scripts/lib/people-recording-recovery.mjs','scripts/run-people-chapter-owner.mjs','scripts/record-people-recording-return.mjs','scripts/gate-people-chapter-owner.mjs'];
const reports=['identity-review','date-report','review-validation','input-seal'];
const wrapperPointers={
 'review-validation':new Set(['/sourceHash','/extractionHash','/identityReviewHash','/dateReportHash','/productionExtractionStats']),
 'input-seal':new Set(['/sourceHash','/extractionHash','/sourceByteHash','/candidateByteHash','/editorialHash','/materializationHash','/identityReviewHash','/dateReportHash','/reviewValidationHash','/reviewedAt','/reviewer/runId','/protectedFiles'])
};
const decode=value=>typeof value==='string'?JSON.parse(value):value;
export function recordingSnapshot(dir){return Object.fromEntries([...frozen,...reports,'native-validation'].map(n=>[n,recordingPin(path.join(dir,n+'.json'))]));}
function currentNativeValidation(job,dir){
 const v=read(path.join(dir,'native-validation.json'));
 assert.equal(v.passed,true,'Recording requires passing native validation');
 assert.equal(v.sourceSha256,recordingPin(path.join(dir,'source.json')).sha256,'Native validation source changed');
 assert.equal(v.extractionSha256,recordingPin(path.join(dir,'extraction.json')).sha256,'Native validation extraction changed');
 assert(v.packetInput&&v.stats,'Complete native validation required');
 assert.equal(v.nativeRoot,job.nativeRoot,'Native validation runtime changed');
 assert.deepEqual(v.nativeSeals,job.nativeSeals,'Native validation seals changed');
 return v;
}
export function recordingStateInvariant(job,receipt,dir){
 assert(job.circuitBreaker,'No retained breaker to reconcile');
 assert.equal(recordingDocumentHash(job.circuitBreaker),receipt.breakerHash,'Original breaker changed');
 assert.equal(job.reviewRounds,receipt.reviewRounds,'Review counter changed');assert.equal(job.repairRounds,receipt.repairRounds,'Repair counter changed');
 const method=JSON.parse(verify(receipt.approach));assert.equal(method.kind,'reviewed-method-reconciliation-work-order');assert.equal(method.job,job.id);assert.deepEqual(method.oldBreaker,job.circuitBreaker,'Reviewed approach must retain the exact original breaker');assert.equal(method.counters.reviewRounds,job.reviewRounds);assert.equal(method.counters.repairRounds,job.repairRounds);assert.deepEqual(method.nextScope.map(s=>s.stage),['native-wrapper-binding','explicit-witness-capture']);
 assert.equal(job.id,receipt.job);assert.equal(job.reviewAgentId,receipt.reviewerAgentId);assert.equal(job.ownerAgentId,receipt.ownerAgentId);assert.equal(job.ownerRunId,receipt.ownerRunId);
 assert(!job.authors.includes(job.reviewAgentId),'Independent actual reviewer required');
 for(const n of frozen){assert.equal(receipt.frozen[n].file,path.join(dir,n+'.json'));verify(receipt.frozen[n]);assert(method.currentInputPins.some(p=>p.file===receipt.frozen[n].file&&p.sha256===receipt.frozen[n].sha256&&p.bytes===receipt.frozen[n].bytes),'Approach does not cover exact current frozen input');}
}
export async function authorizeRecordingRecovery({job,dir,receiptFile,feedbackFile,review,continuation,getRun,root=path.resolve(dir,'../../../../..'),now=Date.now()}){
 assert(review&&continuation,'Recording recovery is same-reviewer continuation only');assert(['held','review-returned','reviewing'].includes(job.status));
 const receiptPin=recordingPin(receiptFile),r=read(receiptFile);
 assert.equal(r.schemaVersion,1);assert.equal(r.kind,'reviewed-native-recording-recovery');
 assert(['native-wrapper-binding','explicit-witness-capture'].includes(r.stage),'Unknown recording scope');
 assert(Number.isFinite(Date.parse(r.expiresAt))&&Date.parse(r.expiresAt)>now,'Expired recording approach');
 recordingStateInvariant(job,r,dir);assert.equal(r.priorReviewerRunId,job.reviewerRunId);assert.equal(r.feedback.file,feedbackFile);verify(r.feedback);verify(r.approach);verify(r.codeReview.input);
 assert(r.codeReview.agentId!==job.reviewAgentId&&r.codeReview.agentId!==job.ownerAgentId,'Independent code reviewer required');
 assert(Array.isArray(r.codeReview.files)&&r.codeReview.files.length>=core.length);for(const f of core)assert(r.codeReview.files.some(p=>p.file===path.join(root,f)),'Core recording implementation must be reviewed');assert.equal(new Set(r.codeReview.files.map(p=>p.file)).size,r.codeReview.files.length);
 const codes=r.codeReview.files.map(p=>{verify(p);return p;});assert.equal(recordingDocumentHash(codes),r.codeReview.codeHash,'Changed reviewed implementation');
 const codeRun=await getRun(r.codeReview.agentId,r.codeReview.runId);assert.equal(codeRun.id,r.codeReview.runId);assert.equal(codeRun.agentId,r.codeReview.agentId);assert.equal(codeRun.status,'finished');
 const code=decode(codeRun.result);assert.equal(code.kind,'native-recording-recovery-code-review');assert.equal(code.approved,true);assert.deepEqual(code.findings,[]);assert.equal(code.codeHash,r.codeReview.codeHash);assert.equal(code.approachHash,r.approach.sha256,'Code/provider approval does not attest exact reviewed approach');
 const prior=(job.recordingRecoveryHistory??[]),existing=prior.find(h=>h.stage===r.stage),index=r.stage==='native-wrapper-binding'?0:1;
 assert.equal(prior.length,index+(existing?1:0),'Recording stages must be bounded and ordered');
 const method=JSON.parse(verify(r.approach)),required=[...frozen,...reports,'native-validation'];assert.equal(method.currentInputPins.length,required.length,'Complete reviewed approach inventory required');
 for(const n of required){const pins=method.currentInputPins.filter(p=>p.file===path.join(dir,n+'.json'));assert.equal(pins.length,1,'Missing/duplicate absolute approach input');if(!['review-validation','input-seal','native-validation'].includes(n)||(!existing&&index===0))verify(pins[0]);}
 if(index===1){assert.equal(prior[0].status,'recorded','Complete wrapper capture first');if(!existing)for(const p of Object.values(prior[0].after))verify(p);const old=await getRun(job.reviewAgentId,prior[0].runId);assert.deepEqual({id:old.id,agentId:old.agentId,status:old.status,result:old.result},prior[0].actualProvider,'Prior wrapper provider changed');const packet=JSON.parse(verify(r.witnessPacket));assert.equal(packet.sourceByteHash,r.frozen.source.sha256);assert.equal(packet.extractionByteHash,r.frozen.extraction.sha256);assert.equal(packet.reviewer,job.reviewAgentId);}
 const nativeValidation=currentNativeValidation(job,dir);
 if(index===1)assert.deepEqual(nativeValidation,prior[0].nativeValidation,'Native validation changed after wrapper');
 let priorAttempts=[];
 if(existing){
  assert.notEqual(existing.status,'recorded','Completed recording stage cannot be reopened');assert.equal(prior.at(-1),existing);assertRecordingOperations({job,dir,recovery:existing});
  if(existing.status==='dispatching'&&!existing.runId){assert.deepEqual(receiptPin,existing.receipt,'Uncertain dispatch may only retry exact idempotent receipt');return{...existing,resumingDispatch:true};}
  assert(existing.status==='sent'&&existing.runId,'Only a retained failed recording run can resume');assert.deepEqual(r.resumeOf?.receipt,existing.receipt);assert.equal(r.resumeOf?.runId,existing.runId);verify(r.resumeOf.receipt);assert((existing.priorAttempts??[]).length<1,'Bounded recording attempts exhausted');
  const old=await getRun(job.reviewAgentId,existing.runId);assert.equal(old.id,existing.runId);assert.equal(old.agentId,job.reviewAgentId);assert.equal(old.status,'finished','Preserve active recording run');
  if(index===1){const choice=read(path.join(dir,'review-validation.json')).nativeWitnessChoices;assert.equal(choice.approveExactExpandedReports,false);assert.equal(choice.choices.length,0,'Preserve nonempty witness work for explicit reviewed reconciliation');}
  priorAttempts=[...(existing.priorAttempts??[]),{...existing,actualFailedProvider:{id:old.id,agentId:old.agentId,status:old.status,result:old.result}}];
 }

 for(const [agentId,runId]of [[job.ownerAgentId,job.ownerRunId],[job.reviewAgentId,job.reviewerRunId]]){const run=await getRun(agentId,runId);assert.equal(run.id,runId);assert.equal(run.agentId,agentId);assert.equal(run.status,'finished','Existing actor must be terminal');}
 verify(receiptPin);recordingStateInvariant(job,r,dir);verify(r.feedback);for(const p of r.codeReview.files)verify(p);
 return{startedAt:new Date().toISOString(),priorAttempts,actualCodeProvider:{id:codeRun.id,agentId:codeRun.agentId,status:codeRun.status,result:codeRun.result},stage:r.stage,receipt:receiptPin,breakerHash:r.breakerHash,reviewRounds:r.reviewRounds,repairRounds:r.repairRounds,before:recordingSnapshot(dir),nativeValidation,operationOffset:fs.readFileSync(path.join(dir,'operations.jsonl'),'utf8').split('\n').filter(Boolean).length,findingOffset:job.findings.length,priorReviewerRunId:job.reviewerRunId,status:'dispatching'};
}
export function assertRecordingOperations({job,dir,recovery}){
 const r=JSON.parse(verify(recovery.receipt));recordingStateInvariant(job,r,dir);
 const operations=fs.readFileSync(path.join(dir,'operations.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(JSON.parse).slice(recovery.operationOffset);
 for(const op of operations){assert.equal(op.role,'reviewer','Other writer during recording recovery');if(['read','manifest','finding','finish','validate'].includes(op.operation))continue;
  if(recovery.stage==='native-wrapper-binding'){assert.equal(op.operation,'patch');assert(wrapperPointers[op.args.target]?.has(op.args.pointer),'Recording wrapper scope escalated');}
  else{assert(['patch','append'].includes(op.operation));assert.equal(op.args.target,'review-validation');assert(op.args.pointer==='/nativeWitnessChoices'||op.args.pointer.startsWith('/nativeWitnessChoices/'),'Recording choice scope escalated');if(op.operation==='append')assert.equal(op.args.pointer,'/nativeWitnessChoices/choices');}
 }
 assert.deepEqual(currentNativeValidation(job,dir),recovery.nativeValidation,'Recording changed native validation inputs, stats or runtime');
 const added=job.findings.slice(recovery.findingOffset);assert(!added.some(f=>f.role==='reviewer'&&['repair-required','research-hold'].includes(f.disposition)),'New substantive finding preserves source hold');
 for(const n of ['identity-review','date-report'])assert.deepEqual(recordingPin(path.join(dir,n+'.json')),recovery.before[n],'Recording cannot mutate captured judgments');
 return{receipt:r,operations:operations.length};
}
export async function validateRecordingReturn({job,dir,getRun}){
 const recovery=job.recordingRecovery;assert(recovery?.status==='sent');assert.equal(job.reviewerRunId,recovery.runId);assert.equal(job.dispatch.reviewer.runId,recovery.runId);const checks=assertRecordingOperations({job,dir,recovery});
 const run=await getRun(job.reviewAgentId,job.reviewerRunId);assert.equal(run.id,job.reviewerRunId);assert.equal(run.agentId,job.reviewAgentId);assert.equal(run.status,'finished');const result=decode(run.result);assert.equal(result.approved,true);assert.equal(result.agentId,job.reviewAgentId);assert.equal(result.runId,job.reviewerRunId);
 if(recovery.stage==='native-wrapper-binding'){
  assert.deepEqual(Object.keys(result).sort(),['kind','approved','agentId','runId','receiptHash','reportHashes'].sort());assert.equal(result.kind,'native-recording-wrapper-attestation');assert.equal(result.receiptHash,recovery.receipt.sha256);
  const hashes=Object.fromEntries(reports.map(n=>[n,recordingDocumentHash(read(path.join(dir,n+'.json')))]));assert.deepEqual(result.reportHashes,hashes,'Provider must attest exact current wrapper/report hashes');
 }else{
  assert.equal(result.kind,'native-witness-choice-attestation');const selection=read(path.join(dir,'review-validation.json')).nativeWitnessChoices;assert.equal(result.selectionHash,recordingDocumentHash(selection));assert.equal(result.packetHash,selection.packetHash);const packet=JSON.parse(verify(checks.receipt.witnessPacket));assert.equal(selection.packetHash,recordingDocumentHash(packet));assert.equal(selection.sourceByteHash,checks.receipt.frozen.source.sha256);assert.equal(selection.extractionByteHash,checks.receipt.frozen.extraction.sha256);assert.equal(selection.reviewer.agentId,job.reviewAgentId);assert.equal(selection.reviewer.runId,job.reviewerRunId);assert.equal(selection.approveExactExpandedReports,true);
 }
 return{...recovery,after:recordingSnapshot(dir),status:'recorded',actualProvider:{id:run.id,agentId:run.agentId,status:run.status,result:run.result},operations:checks.operations,recordedAt:new Date().toISOString()};
}
export async function assertRecordingRecoveryGate(job,dir,getRun){
 if(!job.circuitBreaker)return;
 const history=job.recordingRecoveryHistory;assert(Array.isArray(history)&&history.length===2,'Retained breaker requires both reviewed recording captures');assert.deepEqual(history.map(h=>h.stage),['native-wrapper-binding','explicit-witness-capture']);
 for(const h of history){assert.equal(h.status,'recorded');assert.deepEqual(currentNativeValidation(job,dir),h.nativeValidation,'Recorded native validation changed');const r=JSON.parse(verify(h.receipt));recordingStateInvariant(job,r,dir);for(const p of r.codeReview.files)verify(p);assert.equal(h.actualProvider?.agentId,job.reviewAgentId);assert.equal(h.actualProvider?.id,h.runId);assert.equal(h.actualProvider?.status,'finished');
 const actual=await getRun(job.reviewAgentId,h.runId);assert.deepEqual({id:actual.id,agentId:actual.agentId,status:actual.status,result:actual.result},h.actualProvider,'Actual source provider capture changed');
 const code=await getRun(r.codeReview.agentId,r.codeReview.runId);assert.deepEqual({id:code.id,agentId:code.agentId,status:code.status,result:code.result},h.actualCodeProvider,'Actual code review capture changed');}
 assert.equal(history[1].runId,job.reviewerRunId);assert.equal(job.witnessCapture?.actualRun,job.reviewerRunId,'Actual explicit witness adapter capture is mandatory');
 const captured=read(job.witnessCapture.receipt);const final=decode(history[1].actualProvider.result);assert.deepEqual(captured.attestation,final);const selection=JSON.parse(verify(captured.selection)),packet=JSON.parse(verify(captured.packet));assert.equal(final.selectionHash,recordingDocumentHash(selection));assert.equal(final.packetHash,recordingDocumentHash(packet));assert.equal(packet.sourceByteHash,recordingPin(path.join(dir,'source.json')).sha256);assert.equal(packet.extractionByteHash,recordingPin(path.join(dir,'extraction.json')).sha256);assert.equal(captured.actualRun,job.reviewerRunId);assert.equal(captured.actualReviewer,job.reviewAgentId);for(const [role,name]of Object.entries({identity:'identity-review',dateReport:'date-report',validation:'review-validation',seal:'input-seal'})){const current=recordingPin(path.join(dir,name+'.json'));assert.equal(current.sha256,captured.outputs[role].sha256);assert.equal(current.bytes,captured.outputs[role].bytes);}const approved=JSON.parse(verify(history[1].receipt)).codeReview.files;for(const p of captured.helperFiles){verify(p);assert(approved.some(a=>a.file===p.file&&a.sha256===p.sha256),'Capture helper was not independently code-approved');}
 const modulePin=captured.helperFiles.find(p=>path.basename(p.file)==='capture.mjs');assert(modulePin);const {expandWitnessChoices}=await import(pathToFileURL(modulePin.file));const raw={identity:read(path.join(captured.rawArchive,'identity-review.json')),dateReport:read(path.join(captured.rawArchive,'date-report.json'))};for(const [key,value]of Object.entries(raw))assert.equal(hash(fs.readFileSync(path.join(captured.rawArchive,key==='identity'?'identity-review.json':'date-report.json'))),packet.rawPins[key].sha256);const method=JSON.parse(verify(JSON.parse(verify(history[1].receipt)).approach));for(const [key,name]of Object.entries({identity:'identity-review',dateReport:'date-report'}))assert.equal(packet.rawPins[key].sha256,method.currentInputPins.find(p=>p.file===path.join(dir,name+'.json')).sha256,'Raw captured judgments differ from reviewed approach');
 const native=await import(pathToFileURL(path.join(job.nativeRoot,'scripts/lib/people-content.mjs')));assert.equal(packet.mechanical.length,0,'Recording recovery requires previously corrected inventory metadata');const expanded=expandWitnessChoices({reports:raw,units:native.contentUnits(read(path.join(dir,'source.json'))),packet,selection,actualReviewer:job.reviewAgentId,actualRun:job.reviewerRunId,sourceByteHash:packet.sourceByteHash,extractionByteHash:packet.extractionByteHash,helperByteHash:packet.helperByteHash});
 for(const [role,name]of Object.entries({identity:'identity-review',dateReport:'date-report'})){const current=read(path.join(dir,name+'.json'));delete current.hostWitnessCapture;current.reviewer.runId=raw[role].reviewer.runId;current.reviewedAt=raw[role].reviewedAt;assert.deepEqual(current,expanded.reports[role],'Captured judgments or witness expansion changed');}
}
// A returned recording can remain available for read-only packet preparation
// without clearing the retained breaker or accepting the failed capture.
export function recordingFailurePhase(job,dir){try{assertRecordingOperations({job,dir,recovery:job.recordingRecovery});return 'review-returned';}catch{return 'held';}}
