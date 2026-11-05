import fs from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
import {readRemotePeopleWorkLedger,mutateRemotePeopleWorkLedger,dateExecutorIsBusy} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-work-queue.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',peopleDir=root+'/data/people',base=new URL('.',import.meta.url).pathname,out=base+'free072-source-feedback-20261105/',key='audit-0-4d9c64d727f54740b560',wf=peopleDir+'/generated/date-workflow/jinshu/072',file=wf+'/openrouter-tools-'+key+'/state.json',worker='openrouter-local-dates';
const need=(v,m)=>{if(!v)throw Error(m)},read=p=>JSON.parse(fs.readFileSync(p)),hash=b=>createHash('sha256').update(b).digest('hex'),json=v=>JSON.stringify(v,null,2)+'\n';
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');need(!fs.existsSync(out),'Preserve previous feedback receipt');
const bytes=fs.readFileSync(file),before=JSON.parse(bytes),native=read(wf+'/state.json');
need(before.nextTurn===46&&!before.finished,'Feedback is only for the retained idle turn46');need(!fs.existsSync(wf+'/openrouter-tools-'+key+'/response-46.json'),'Recover existing response first');
need(native.sourceHash==='sha256:2c9222275bd47d63ca8d92ec76fdf99cd456c73850b222fbf5216849c5c8f2fe'&&native.extractionHash==='sha256:5d73bb4d2075f62dcfe7f7dbc820b04dc16ca01f765403851d0844d219a22f96','Input generation changed');
const claim=readRemotePeopleWorkLedger().dateAudits['jinshu/072'];need(claim?.worker===worker&&claim.lane==='openrouter'&&!dateExecutorIsBusy(claim),'Sticky owner changed or is active');
const feedback=`Host source/validator feedback; no review verdict is supplied. The normal validator requires substantive event text in the field named event on EVERY owned itemCheck, including hints. Ten of27 current item checks have it; complete the remaining17 using the exact owned ID as BOTH key and value.id. Preserve each complete record when updating it. Then validate with finish_date.

Independently re-evaluate substantive support before finishing: claim-22 currently says 290 AD was after Sima Lun's coup. Primary Jinshu004 places the deposition of Empress Jia under Yongkang1 and Sima Lun's usurpation under Yongning1, distinct from Hui's accession under Taixi1. Source: https://zh.wikisource.org/wiki/晉書/卷004 . Consult the chapter headings/events and remove or correct the unsupported parenthetical; do not manufacture a citation. Reassess whether the proposed interval is actually supported by 惠懷之際. This feedback does not instruct you to reject all broad source-period windows.

Other internal inconsistencies need an independent judgment: your claim-79 item reason asserts Guan Lu's entire lifespan209–256 matches its interval, while the person check records AD240–256. Your own event descriptions call Jing Fang and Guan Lu historical exemplars, whereas the saved reasons justify contemporary attestation with whole lifespans. Verify the actual sealed fields and dateKind/event relation; distinguish a retrospective exemplum from contemporary activity. A known lifespan, office-holder's career, plausible range, or later narrative event alone is not proof of the earlier item's particular endpoints. For any unsupported conversion/ownership, record the exact affected ID and a substantive finding or research hold. Do not invent a missing date to obtain approval. Do not apply host proposals or alter sealed evidence. Uncertainty and a negative report are valid outcomes.

This is the host's actual follow-up, appended to the same retained conversation. The initial input fingerprint, provider messages and all prior saved judgments remain unchanged. No model call, date approval or canonical edit was performed by adding this feedback.`;
const after=structuredClone(before);after.messages.push({role:'user',content:feedback});
fs.mkdirSync(out);fs.writeFileSync(out+'before.private.json',bytes,{flag:'wx'});fs.writeFileSync(out+'host-feedback.txt',feedback+'\n',{flag:'wx'});
const token=randomUUID(),unlock=acquireProcessRunLock(peopleDir+'/generated/date-workflow-run.lock',{label:'People date workflow',failIfExists:true});let reserved=false;
try{
 mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits['jinshu/072'];need(c?.worker===worker&&c.lane==='openrouter'&&!dateExecutorIsBusy(c),'Owner became busy');need(c.sourceHash===native.sourceHash&&c.extractionHash===native.extractionHash,'Owner input changed');c.executorToken=token;c.executorExpiresAt=new Date(Date.now()+10*60000).toISOString();},{message:'Reserve retained free review for explicit host source feedback'});reserved=true;
 need(hash(fs.readFileSync(file))===hash(bytes),'Retained draft changed before feedback');
 const temp=file+'.host-feedback-'+token;fs.writeFileSync(temp,json(after),{flag:'wx'});fs.renameSync(temp,file);
 const receipt={at:new Date().toISOString(),kind:'actual-host-feedback-to-retained-independent-reviewer',jobKey:key,nextTurn:46,sourceHash:native.sourceHash,extractionHash:native.extractionHash,beforeSha256:hash(bytes),afterSha256:hash(fs.readFileSync(file)),initialFingerprint:before.fingerprint,recordsUnchanged:JSON.stringify(before.records)===JSON.stringify(after.records),providerMessagesUnchanged:true,hostFeedbackSha256:hash(Buffer.from(feedback+'\n')),primaryReference:'https://zh.wikisource.org/wiki/晉書/卷004',reviewAccepted:false,canonicalWrites:0,modelCalls:0};
 need(receipt.recordsUnchanged,'Feedback changed review records');fs.writeFileSync(out+'receipt.json',json(receipt),{flag:'wx'});
 mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits['jinshu/072'];need(c?.worker===worker&&c.executorToken===token,'Lost feedback lease');c.jobs[key].hostSourceFeedback={receiptFile:out+'receipt.json',receiptSha256:hash(fs.readFileSync(out+'receipt.json')),nextTurn:46,reviewAccepted:false};},{message:'Checkpoint explicit source feedback without changing review judgments'});
 console.log(JSON.stringify(receipt));
}finally{
 if(reserved)mutateRemotePeopleWorkLedger(l=>{const c=l.dateAudits['jinshu/072'];need(c?.worker===worker&&c.executorToken===token,'Lost feedback lease');delete c.executorToken;delete c.executorExpiresAt;},{message:'Release host feedback executor; retain free review context'});
 unlock();
}
