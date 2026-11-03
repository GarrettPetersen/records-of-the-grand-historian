import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {cursorDateWorker} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-worker.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian';
const w=root+'/data/people/generated/date-workflow/jinshu/080';
const a=root+'/data/people/generated/completion/jinshu/080/retained-date-recovery-20261103';
const read=f=>JSON.parse(fs.readFileSync(f));
const s=read(w+'/state.json'),extraction=read(w+'/'+s.repairCandidate);
if(s.repairIndex!==2||s.repairCandidate!=='repair-candidate-0-2.json')
  throw Error('This sealed admission capture belongs to candidate 2; create new evidence for later candidates');
if(fs.existsSync(a+'/existing-reception-native-admission.json'))
  throw Error('Preserve the sealed admission receipt; do not overwrite reviewed evidence');
const baseline=read(root+'/data/people/extractions/jinshu/080.json');
const packet=buildDateAuditPacket('jinshu','080',{extraction});
const baselinePacket=buildDateAuditPacket('jinshu','080',{extraction:baseline}),report=read(w+'/'+s.review);
const feedback='Host diagnostics found all remaining structural errors: p053 death onOrBefore AD355 and p055/p056 reception westernYear AD355 use invalid precision day. Use precision year (or circa only where approximate); retain exact source-calendar detail in sourceDate. p049 has active hint AD354 and a dated office but no Western attestation. Verify your office anchor: if supported, supply a matching separate attestation with appropriate evidence and certainty; otherwise keep the chronology unresolved and remove unsupported hints. Do not invent a year to pass validation. Preserve retrospective labels on claim-547/548; reviewed host code now supports that narrow addition without changing their facts. A host-only preview with the three format fixes and an attestation copied from your proposed office anchor passes full structural validation, without editorial amendment. That preview is NOT source approval of AD354. Return the complete current proposal.';
const rows=[];
for(let i=s.repairIndex;i<s.repairPlan.length;i++) {
  const job=s.repairPlan[i],key=`repair-${s.round}-${job.id}-${packet.extractionHash.slice(7,19)}`;
  for(const correction of (i===s.repairIndex?[false,true]:[false])) {
    let message;
    const state=correction?{agentId:'offline-admission-only',sent:true,validationError:feedback}:{};
    const agent={agentId:'offline-admission-only',listArtifacts:async()=>[]};
    const stub={create:async()=>agent,resume:async()=>agent,listRuns:async()=>({items:[]}),getUsage:async()=>null};
    const worker=cursorDateWorker({model:'offline-admission-only',apiKey:'offline',maxWorkerBytes:57344,saveRemoteJob:async()=>{}},
      {stopRequested:false,activeRuns:new Map()}, {Agent:stub,
        send:async(_agent,m)=>{message=m;throw Error('offline-admission-captured');},
        wait:async()=>{throw Error('No wait allowed in offline admission');}});
    let error;
    try {await worker({kind:'repair',key,packet,extraction,baselinePacket,baselineExtraction:baseline,report,findings:job.findings,state,save:async()=>{}});}
    catch(e){error=e.message;}
    if(!message)throw Error(`Native admission failed for ${job.id}: ${error}`);
    rows.push({id:job.id,correction,bytes:Buffer.byteLength(message),guardPassedBeforeSendCallback:true,
      messageSha256:createHash('sha256').update(message).digest('hex')});
  }
}
const receipt={at:new Date().toISOString(),method:'Actual cursorDateWorker injected offline Agent/send after native guard; no provider, queue or canonical writes',
  maxBytes:57344,alreadyAcceptedGroupsSkipped:s.repairIndex,rows};
fs.writeFileSync(a+'/existing-reception-native-admission.json',JSON.stringify(receipt,null,2)+'\n');
fs.writeFileSync(a+'/group-3-prepared-host-feedback.json',JSON.stringify({at:new Date().toISOString(),
  jobKey:'repair-0-003-93aa5e6f7b2a1e2b6a63-f56fce4f8031',hostFeedback:feedback,
  messageBytes:rows.find(r=>r.correction).bytes,producerArtifactChanged:false,chapterApproved:false},null,2)+'\n');
console.log(JSON.stringify({rows:rows.map(({id,correction,bytes})=>({id,correction,bytes})),maxBytes:57344}));
