import fs from 'node:fs';
import {encodeEnglishRepairPacket} from './English-repair-packet.mjs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {acquireProcessRunLock} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/process-run-lock.mjs';
import {collectEnglishRepairDecisions} from './collect-English-repair-decisions.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',out=new URL('./complete-English-coverage-c4f6b535-20261105/',import.meta.url).pathname;
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},hash=b=>createHash('sha256').update(b).digest('hex');
need(!inspectLocalDisk(root).errors.length,'Resource hold');
const unlock=acquireProcessRunLock(out+'writer.lock',{label:'Prepare focused repair findings without repeating full-source review',failIfExists:true});
try{
  const m=read(out+'manifest.json'),file=out+'cross-review-manifest.json',c=read(file);need(c.jobs.every(j=>j.phase==='returned'),'Drain original/current cross-review cohort first');
  const registry=collectEnglishRepairDecisions(),pending=registry.entries.filter(e=>e.status==='pending-review'||e.unreconciledCurrentFieldFindings.length);
  need(!pending.some(e=>e.status==='rejected-keep-current'),'Conflicting additional diagnosis needs explicit adjudication');
  const units=new Map(),claimHints=new Map(),personHints=new Map();
  for(const p of m.parts){const i=read(p.inputFile);for(const u of i.sourceUnits){if(units.has(u.id))need(JSON.stringify(units.get(u.id))===JSON.stringify(u),'Source context changed');units.set(u.id,u);}for(const h of i.localClaimLabelHints)claimHints.set(h.id,h);for(const h of i.localPersonLabelHints)personHints.set(h.id,h);}
  need(units.size===302,'Complete source index required');
  const round=(c.followupRounds??0)+1,jobs=[];
  const packet=entries=>{
    const blocks=new Set([0,1]);for(const e of entries){const u=units.get(e.unit);need(u,'Exact source unit required');for(const b of [u.blockIndex-1,u.blockIndex,u.blockIndex+1])blocks.add(b);}
    const sourceUnits=[...units.values()].filter(u=>blocks.has(u.blockIndex)),unitIds=new Set(sourceUnits.map(u=>u.id)),targetKeys=new Set(entries.map(e=>e.targetKey));
    const findings=registry.duplicateCurrentFieldFindings.filter(f=>entries.some(e=>e.unreconciledCurrentFieldFindings.includes(f.findingId)));
    const excluded=new Set(['codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33',...entries.map(e=>e.authorAgentId),...findings.map(f=>f.alternativeAuthorAgentId)]);
    const proposals=entries.map((e,n)=>({...Object.fromEntries(['unit','field','before','after','sourceQuote','sourceReason','recordKind','recordId','fieldPath','authorAgentId'].filter(k=>k in e).map(k=>[k,e[k]])),id:`focused-${round}-${n+1}`,addressesCurrentFieldFindings:e.unreconciledCurrentFieldFindings,additionalFindings:findings.filter(f=>f.existingTargetKey===e.targetKey).map(f=>Object.fromEntries(['findingId','sourceReason','alternativeAuthorAgentId','reportSha256'].map(k=>[k,f[k]]))),reviewPurpose:e.status==='independently-approved'?'Check whether the existing approved replacement already fixes the additional diagnosis; preserve its wording when faithful. The alternative is unapproved.':'Independently review this exact new/amended replacement.'}));
    const records=entries.filter(e=>e.recordKind!=='source-English');
    return {schemaVersion:1,kind:'independent-source-English-repair-packet',book:'jinshu',chapter:'109',sourceHash:m.sourceHash,canonicalExtractionHash:m.canonicalExtractionHash,stagedExtractionHash:m.stagedExtractionHash,excludedReviewerIds:[...excluded],proposals,sourceUnits,sourceIssues:registry.sourceIssues.filter(i=>unitIds.has(i.unit)),localClaimLabelHints:records.filter(e=>e.recordKind==='claim-label').map(e=>claimHints.get(e.recordId)),localPersonLabelHints:records.filter(e=>e.recordKind==='person-label').map(e=>personHints.get(e.recordId)),approvedContextRepairs:registry.entries.filter(e=>e.recordKind==='source-English'&&e.status==='independently-approved'&&unitIds.has(e.unit)&&!targetKeys.has(e.targetKey)).map(e=>({unit:e.unit,field:e.field,after:e.after,approvalReportSha256:e.approval.rawSha256})),textualCaution:{instruction:'Keep s0233 and sacrifice/textual ambiguities explicit; do not emend Chinese or infer dates.'},scope:'Focused delta only. Original sourceUnits show current canonical before text. approvedContextRepairs shows independently reviewed pending wording elsewhere: do not rediscover the already-addressed original defect. If its proposed after still has a definite defect, identify it explicitly. No full302-unit rereview or publication approval.'};
  };
  let group=[];
  const flush=()=>{if(!group.length)return;const value=packet(group),bytes=JSON.stringify(encodeEnglishRepairPacket(value))+'\n',stem=`cross-followup${String(round).padStart(3,'0')}-plan${String(c.followupPlanningRevision??1).padStart(2,'0')}-${String(jobs.length+1).padStart(2,'0')}`;need(Buffer.byteLength(bytes)<=56500,'Focused evidence too large '+JSON.stringify({bytes:Buffer.byteLength(bytes),targets:group.map(e=>e.unit+'-'+(e.field??e.recordId)),sourceBytes:Buffer.byteLength(JSON.stringify(value.sourceUnits)),proposalBytes:Buffer.byteLength(JSON.stringify(value.proposals)),approvedContextBytes:Buffer.byteLength(JSON.stringify(value.approvedContextRepairs))}));jobs.push({stem,part:'followup',followupRound:round,proposals:group.length,inputSha256:hash(bytes),inputBytes:Buffer.byteLength(bytes),phase:'prepared',inputFile:out+stem+'.input.json',promptFile:out+stem+'.prompt.txt',rawFile:out+stem+'.review.raw.json',bytes});group=[];};
  pending.sort((a,b)=>units.get(a.unit).blockIndex-units.get(b.unit).blockIndex||a.unit.localeCompare(b.unit)||String(a.field).localeCompare(String(b.field)));
  for(const e of pending){if(group.length&&Buffer.byteLength(JSON.stringify(encodeEnglishRepairPacket(packet([...group,e]))))>56500)flush();group.push(e);}flush();
  for(const j of jobs){fs.writeFileSync(j.inputFile,j.bytes,{flag:'wx'});delete j.bytes;c.jobs.push(j);}
  if(jobs.length){c.followupRounds=round;c.phase='ready-next';}
  for(const [p,v] of [[out+'repair-decisions-working.json',registry],[file,c]]){fs.writeFileSync(p+'.tmp',JSON.stringify(v,null,2)+'\n',{flag:'wx'});fs.renameSync(p+'.tmp',p);}
  console.log(JSON.stringify({newReviewJobs:jobs.length,focusedTargets:pending.length,approvedUnchanged:registry.entries.filter(e=>e.status==='independently-approved').length,canonicalWrites:0}));
}finally{unlock();}
