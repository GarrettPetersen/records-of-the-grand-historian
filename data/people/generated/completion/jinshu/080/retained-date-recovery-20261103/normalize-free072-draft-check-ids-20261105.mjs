import fs from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
import {readRemotePeopleWorkLedger,mutateRemotePeopleWorkLedger,dateExecutorIsBusy} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {retainedDateReviewJobs} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',base=new URL('.',import.meta.url).pathname,out=base+'free072-draft-key-normalization-20261105/',peopleDir=root+'/data/people',wf=peopleDir+'/generated/date-workflow/jinshu/072',worker='openrouter-local-dates',claimKey='jinshu/072';
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex'),json=v=>JSON.stringify(v,null,2)+'\n';
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');need(!fs.existsSync(out),'Preserve prior normalization');
const native=read(wf+'/state.json'),packet=buildDateAuditPacket('jinshu','072',{dataDir:root+'/data',peopleDir}),job=retainedDateReviewJobs(packet,structuredClone(native)).jobs[0],key='audit-0-'+job.id,file=wf+'/openrouter-tools-'+key+'/state.json',beforeBytes=fs.readFileSync(file),before=JSON.parse(beforeBytes),after=structuredClone(before),changes=[];
need(native.phase==='audit'&&native.round===0&&native.sourceHash===packet.sourceHash&&native.extractionHash===packet.extractionHash,'Retained source or phase changed');need(before.nextTurn===38&&!before.finished,'Normalize only the idle unfinished draft at turn38');
const q=readRemotePeopleWorkLedger(),claim=q.dateAudits[claimKey];need(claim?.worker===worker&&claim.lane==='openrouter'&&!dateExecutorIsBusy(claim),'Sticky date owner changed or is busy');
for(const[section,ids]of [['itemChecks',job.ownedItems],['personChecks',job.ownedPeople]]){
 const allowed=new Set(ids),used=new Set(),records={};
 for(const[recordKey,value]of Object.entries(after.records[section])){
  need(typeof value.id==='string'&&recordKey==='check-'+value.id,'Expected the exact recorded key-only formatting defect');
  const id=value.id;need(allowed.has(id)&&!used.has(id),'Unknown or duplicate owned target; do not guess');used.add(id);changes.push({section,beforeKey:recordKey,afterKey:id,beforeId:value.id,afterId:id});records[id]=value;
 }
 need(used.size===allowed.size,'Normalize only complete saved coverage, not missing checks');
 after.records[section]=records;
}
const restored=structuredClone(after);for(const section of ['itemChecks','personChecks'])restored.records[section]=Object.fromEntries(changes.filter(c=>c.section===section).map(c=>[c.beforeKey,restored.records[section][c.afterKey]]));need(JSON.stringify(restored)===JSON.stringify(before),'Key normalization changed review judgments');
const feedback='Host draft feedback before any acceptance: a create-only receipt records deterministic correction of the check- prefix on all39 saved item/person value.id fields, using exact owned-ID membership. Stable record keys, verdicts, reasons, evidence, original input fingerprint and all raw provider responses are unchanged. Use read_saved to inspect the current draft. This is formatting only and supplies no date approval. Independently recheck source support: claim-24’s saved reason says a reversed317–316interval even though the sealed item has its own exact value; claim-22 must justify an event-uncertainty window from 惠懷之際 rather than simply importing two whole reigns; claim-54 must establish whether 終於建平太守 actually proves death, rather than the last office held. A plausible career span alone is not source-based event dating. If evidence or conversion is insufficient, change the check and add a concrete finding/research hold. Never choose a year to clear the queue. Correct records under their existing stable keys, retain citations and finish_date only after every owned item/person check is sound.';
const previousFeedback=fs.readFileSync(base+'free072-draft-id-normalization-20261105/host-feedback.txt','utf8').trimEnd();need(after.messages.at(-1)?.role==='user'&&after.messages.at(-1).content===previousFeedback,'Pending host feedback changed');
const correctedFeedback=feedback.replace('on all39 saved item/person value.id fields','on all39 saved item/person keys and value.id fields').replace('Stable record keys, verdicts','Verdicts').replace('Correct records under their existing stable keys','Correct records using the exact owned ID as BOTH record key and value.id');
after.messages[after.messages.length-1].content=correctedFeedback;
fs.mkdirSync(out);fs.writeFileSync(out+'before-draft.private.json',beforeBytes,{flag:'wx'});fs.writeFileSync(out+'host-feedback.txt',correctedFeedback+'\n',{flag:'wx'});
const token=randomUUID(),unlock=acquireProcessRunLock(peopleDir+'/generated/date-workflow-run.lock',{label:'People date workflow',failIfExists:true});let reserved=false;
try{
 mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];need(c?.worker===worker&&c.lane==='openrouter'&&!dateExecutorIsBusy(c),'Owner became busy');need(c.sourceHash===packet.sourceHash&&c.extractionHash===packet.extractionHash,'Owner inputs changed');c.executorToken=token;c.executorExpiresAt=new Date(Date.now()+10*60000).toISOString();},{message:'Reserve idle retained draft for exact check-ID formatting'});reserved=true;
 need(hash(fs.readFileSync(file))===hash(beforeBytes),'Draft changed before formatting');
 const tmp=file+'.formatting-'+token;fs.writeFileSync(tmp,json(after),{flag:'wx'});fs.renameSync(tmp,file);
 const receipt={at:new Date().toISOString(),kind:'exact-owned-check-key-formatting',jobKey:key,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,beforeDraftSha256:hash(beforeBytes),afterDraftSha256:hash(fs.readFileSync(file)),initialInputFingerprintUnchanged:before.fingerprint===after.fingerprint,changes,keysAndValueIdsMatch:true,verdictsReasonsAndEvidenceUnchanged:true,rawProviderResponsesUnchanged:true,pendingUnsentHostFeedbackCorrected:true,hostFeedbackSha256:hash(Buffer.from(correctedFeedback+'\n')),priorIdFormattingReceipt:base+'free072-draft-id-normalization-20261105/receipt.json',reviewAccepted:false,independentDateApproval:false,canonicalWrites:0,modelCalls:0,privateBeforeSnapshot:out+'before-draft.private.json'};
 fs.writeFileSync(out+'receipt.json',json(receipt),{flag:'wx'});
 mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];need(c?.worker===worker&&c.executorToken===token,'Lost formatting owner');c.jobs[key].hostCheckIdFormatting={receiptFile:out+'receipt.json',receiptSha256:hash(fs.readFileSync(out+'receipt.json')),initialInputFingerprint:before.fingerprint,changes:changes.length,reviewAccepted:false};},{message:'Record exact owned-ID formatting without changing review judgments'});
 console.log(JSON.stringify({changes:changes.length,initialFingerprintUnchanged:true,judgmentsUnchanged:true,canonicalWrites:0,reviewAccepted:false}));
}finally{
 if(reserved)mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits[claimKey];need(c?.worker===worker&&c.executorToken===token,'Lost formatting lease');delete c.executorToken;delete c.executorExpiresAt;},{message:'Release retained draft formatting lease'});
 unlock();
}
