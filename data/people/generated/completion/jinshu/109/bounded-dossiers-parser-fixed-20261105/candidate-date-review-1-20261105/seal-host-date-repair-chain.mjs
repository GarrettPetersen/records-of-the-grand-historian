import fs from 'node:fs';
import {read,write,need,hash,root,dir,v} from './host-date-repair-tools.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {applyDateRepairProposal,dateRepairJobs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {normalizeExtractionDateHints} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-hints.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import {dateWorkerInput} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-worker.mjs';
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');
const out=dir+'host-authored-repair-handoffs-round1-compact/',plan=read(dir+'host-date-repair-plan.json'),chapterPacket=read(v+'prospective-packet.json'),editorial=read(v+'editorial.json'),report=read(root+'/data/people/generated/date-workflow/jinshu/109/review-1.json'),sealedTransition=read(dir+'source-transition-review.input.json');
need(!fs.existsSync(out),'Preserve existing sealed handoffs');
need(hash(fs.readFileSync(root+'/data/people/generated/date-workflow/jinshu/109/review-1.json'))==='dbd6a595981018535f878fe098f34f78c52a555864ca183c2e37233efc091bb8','Original negative review changed');
for(const[file,expected]of Object.entries(sealedTransition.sealedFileSha256))need(hash(fs.readFileSync(file))===expected,'Original sealed source transition changed: '+file);
const baseline=read(v+'date-replay-candidate.json'),baselinePacket=read(v+'date-replay-packet.json');
const nativePlan=dateRepairJobs(report,baselinePacket,baseline,{maxBytes:64512});
need(JSON.stringify(nativePlan)===JSON.stringify(plan.groups),'Normal native repair plan differs from host finding ownership');
let candidate=baseline,packet=baselinePacket;const steps=[],outputs=[];
for(let i=1;i<=7;i++){
 const folder=dir+'host-date-repair-group'+String(i).padStart(3,'0')+'/',proposal=read(folder+'proposal.json'),receipt=read(folder+'receipt.json'),expectedCandidate=read(folder+'candidate.json');
 const key='repair-1-'+plan.groups[i-1].id+'-'+packet.extractionHash.slice(7,19);
 need(proposal.author.agentId==='codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33','Actual host authorship required');
 need(proposal.sourceHash===packet.sourceHash&&proposal.extractionHash===packet.extractionHash,'Repair hash chain changed');
 const applied=applyDateRepairProposal(candidate,proposal,packet),normalized=normalizeExtractionDateHints(applied);
 need(normalized.changes.length===0&&JSON.stringify(applied)===JSON.stringify(expectedCandidate),'Native normalization or replay changed the prepared candidate');
 const validated=validateCompactPeopleExtraction(applied,chapterPacket,{strictAliasDispositions:true});validateAppliedEditorialDecisions(editorial,validated.normalized);
 const nextPacket=buildDateAuditPacket('jinshu','109',{dataDir:v+'date-input',peopleDir:root+'/data/people',extraction:applied});
 need(nextPacket.extractionHash===receipt.candidateExtractionHash&&hash(fs.readFileSync(folder+'proposal.json'))===receipt.proposalSha256,'Draft receipt mismatch');
 const input=dateWorkerInput({kind:'repair',packet,extraction:candidate,baselinePacket,baselineExtraction:baseline,report,findings:plan.groups[i-1].findings});
 const inputText=JSON.stringify(input)+'\n';need(Buffer.byteLength(inputText)<=64512,'Complete repair input exceeds evidence ceiling');outputs.push({key,proposal,inputText});
 steps.push({group:i,key,findings:plan.groups[i-1].findings.length,changes:proposal.changes.length,inputBytes:Buffer.byteLength(inputText),inputSha256:hash(Buffer.from(inputText)),sourceProposalFile:folder+'proposal.json',proposalSha256:receipt.proposalSha256,baselineExtractionHash:packet.extractionHash,candidateExtractionHash:nextPacket.extractionHash,normalValidation:true,editorialValidation:true,hintNormalizationChanges:0});
 candidate=applied;packet=nextPacket;
}
need(steps.reduce((n,s)=>n+s.findings,0)===55,'All original findings must remain accounted for');
fs.mkdirSync(out);
for(const{key,proposal,inputText}of outputs){write(out+key+'.result.json',proposal);fs.writeFileSync(out+key+'.input.json',inputText,{flag:'wx'})}
const unresolved=packet.items.filter(i=>i.value?.unresolved===true||i.value?.dateContext?.unresolved===true);
write(out+'receipt.json',{at:new Date().toISOString(),kind:'sealed-host-authored-date-repair-chain',sourceHash:packet.sourceHash,baselineExtractionHash:baselinePacket.extractionHash,candidateExtractionHash:packet.extractionHash,negativeReportSha256:hash(fs.readFileSync(root+'/data/people/generated/date-workflow/jinshu/109/review-1.json')),nativeEvidenceCeiling:64512,hardWorkerBytes:65536,steps,totalChanges:steps.reduce((n,s)=>n+s.changes,0),assignedFindings:55,independentDateApproval:false,sourceTransitionApplied:false,sourceTransitionPacketUnchanged:true,sealedSourceFilesVerified:Object.keys(sealedTransition.sealedFileSha256).length,author:{name:'Codex host',agentId:'codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33'},requiredIndependentReviewerExclusions:['codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33'],producerRunFabricated:false,canonicalWrites:0,nativeWorkflowWrites:0,paidModelCalls:0,chapterApproved:false,finalPeople:packet.people.length,finalDateItems:packet.items.length,unresolvedItems:unresolved.map(i=>i.id),identityFindingPending:true,applicationInstruction:'Only after independently approved English source transition is actually applied and exact queue ownership is revalidated, run the normal native runDateWorkflow with attachmentDateWorker({outputDir:thisDirectory}), maxWorkerBytes64512, jobConcurrency1 and existing round1/max3. These result files are genuine host-authored repairs; their author must remain excluded from independent approval. Do not retag old reports or bypass focused research before re-audit.'});
console.log(JSON.stringify({groups:steps.length,findings:55,changes:steps.reduce((n,s)=>n+s.changes,0),finalPeople:packet.people.length,finalDateItems:packet.items.length,candidateExtractionHash:packet.extractionHash,inputBytes:steps.map(s=>s.inputBytes),unresolvedItems:unresolved.length,canonicalWrites:0,independentDateApproval:false}));
