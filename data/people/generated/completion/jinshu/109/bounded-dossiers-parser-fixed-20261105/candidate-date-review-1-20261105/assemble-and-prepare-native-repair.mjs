import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {runDateWorkflow} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {attachmentDateWorker} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-worker.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {loadProperNounMatcher} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import {isCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
import {validatePeopleExtraction,validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,outputDir=dir+'native-repair-handoffs-round1',wf=root+'/data/people/generated/date-workflow/jinshu/109';
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex');
const s=read(dir+'controller.json');
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
need(s.completeReports===13 && s.parts.every(p=>p.phase==='report-recorded'),'Complete native review coverage required');
need(!fs.existsSync(outputDir),'Preserve existing handoff');
for(const p of s.parts)need(hash(fs.readFileSync(p.reportFile))===p.reportSha256,'Retained report changed');
const packet=buildPeopleExtractionPacket('jinshu','109',{chapterData:read(root+'/data/jinshu/109.json'),chapterFile:root+'/data/jinshu/109.json',properNounMatcher:loadProperNounMatcher()});
const editorial=read(root+'/data/people/editorial-decisions/jinshu/109.json');
const validateExtraction=extraction=>{
 const result=(isCompactPeopleExtraction(extraction)?validateCompactPeopleExtraction:validatePeopleExtraction)(extraction,packet,{strictAliasDispositions:true});
 validateAppliedEditorialDecisions(editorial,result.normalized);
 return result;
};
fs.mkdirSync(outputDir);
let handoffError;
try{
 await runDateWorkflow({book:'jinshu',chapter:'109'},attachmentDateWorker({outputDir}),{dataDir:root+'/data',peopleDir:root+'/data/people',generationId:s.generationId,maxRounds:3,maxWorkerBytes:65536,jobConcurrency:1,validateExtraction});
 throw Error('Expected an explicit first-repair attachment boundary, not publication');
}catch(error){
 if(!error.message.startsWith('Attachment required: review '+outputDir+'/'))throw error;
 handoffError=error.message;
}
const native=read(wf+'/state.json'),report=read(wf+'/'+native.review),inputs=fs.readdirSync(outputDir).filter(f=>f.endsWith('.input.json'));
need(native.phase==='repair' && native.round===1 && native.reviewRoundCeiling===3 && report.status==='needs-revision' && inputs.length===1,'Exact incomplete repair boundary required');
const input=outputDir+'/'+inputs[0],bytes=fs.readFileSync(input);
need(bytes.length<=65536,'First repair input exceeds worker ceiling');
const receipt={at:new Date().toISOString(),kind:'full-native-candidate-date-review-and-next-repair-handoff',generationId:s.generationId,sourceHash:s.sourceHash,canonicalExtractionHash:s.canonicalExtractionHash,candidateExtractionHash:s.extractionHash,reportFile:wf+'/'+native.review,reportSha256:hash(fs.readFileSync(wf+'/'+native.review)),status:report.status,completeReports:13,reviewedUnits:report.reviewedUnits.length,reviewedItems:report.itemChecks.length,reviewedPeople:report.personChecks.length,findings:report.findings.length,supportedItems:report.itemChecks.filter(c=>c.verdict==='supported').length,researchBlockedItems:report.itemChecks.filter(c=>c.verdict==='research-blocked').length,round:1,maxRepairRounds:3,repairGroups:native.repairPlan.length,nextRepairInput:input,nextRepairInputBytes:bytes.length,nextRepairInputSha256:hash(bytes),attachmentBoundary:handoffError,modelCalls:0,canonicalWrites:0,dateApproval:false,chapterApproved:false};
fs.writeFileSync(dir+'complete-native-review-repair-handoff.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt));
