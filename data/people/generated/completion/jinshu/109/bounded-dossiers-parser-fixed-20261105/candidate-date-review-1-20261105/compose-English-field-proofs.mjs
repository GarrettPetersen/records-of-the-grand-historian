import {createHash} from 'node:crypto';
import {validateEditorialReview} from './source-review-validation.mjs';

const need=(v,m)=>{if(!v)throw Error(m);};
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export const COMPOSED_SOURCE_CHECKS=[
  'exact-independent-field-proof-composition',
  'additional-finding-coverage-without-retagging',
  'exact-reviewed-source-and-record-string-delta',
  'chinese-identity-and-reviewed-English-geometry',
  'candidate-coverage-editorial-history-and-philology',
  'unchanged-chronology-and-366-change-replay',
  'complete-negative-history-and-final-round-hold',
  'shared-ownership-resource-and-post-reservation-pins',
  'reviewed-code-config-and-clean-runtime-bindings',
  'durable-intent-archive-and-post-application-verification',
];
export function fieldKey(p){
  need(typeof p.unit==='string','A source unit is required');
  if(p.field==='en'||p.field==='literal')return `${p.unit}/${p.field}`;
  need(['person.alias.en','claim.action'].includes(p.field)&&typeof p.jsonPointer==='string','Unsupported record wording target');
  return `record${p.jsonPointer}`;
}

// Original reports stay immutable. An approved field is a proof, while an
// amended field is only a proposal until a different reviewer approves it.
export function composeEnglishFieldProofs(proofs,pins,coverage=[],supersessions=[]){
  need(Array.isArray(proofs)&&proofs.length>0,'Independent proofs required');
  const approved=new Map(),versions=new Map(),pending=[],additional=[],proofMetadata=[],usedSupersessions=new Set();
  for(const proof of proofs){
    const {input,report,caseId,agentId,inputSha256}=proof;
    need(input.sourceHash===pins.sourceHash,'Source proof changed');
    validateEditorialReview(report,input,{caseId,sha:inputSha256,id:agentId,canonicalHash:pins.canonicalExtractionHash,candidateHash:pins.candidateExtractionHash});
    proofMetadata.push(Object.fromEntries(Object.entries(proof).filter(([k])=>!['input','report'].includes(k))));
    const proposals=new Map([...input.proposals,...input.extractionProposals].map(p=>[p.id,p]));
    for(const check of report.checks){
      const proposal=proposals.get(check.id),key=fieldKey(proposal);
      need(proposal.book==='jinshu'&&proposal.chapter==='109'&&typeof proposal.before==='string'&&proposal.before!==proposal.after,'Exact non-noop reviewed field required');
      const unit=input.units.find(u=>u.id===proposal.unit);
      need(unit&&typeof unit.zh==='string','Complete Chinese and paired-field context required');
      if(check.verdict==='approve'){
        const selected={...proposal,sourceChinese:unit.zh,proof:proofMetadata.at(-1),reviewerAgentId:agentId,reviewerRunId:proof.runId},old=approved.get(key);
        if(old){
          const rules=supersessions.filter(r=>r.fieldKey===key&&r.fromCaseId===old.proof.caseId&&r.toCaseId===caseId);
          need(rules.length===1,'Duplicate independent approval target: '+key);
          const rule=rules[0];
          need(old.before===proposal.before&&rule.beforeAfterSha256===digest(old.after)&&rule.selectedAfterSha256===digest(proposal.after)&&typeof rule.reason==='string'&&rule.reason.length>=60,'Explicit source-preserving replacement proof required');
          usedSupersessions.add(rule);
        }
        approved.set(key,selected);versions.set(key,[...(versions.get(key)??[]),selected]);
      }else{
        need(check.verdict==='amend','Rejected field requires a separate explicit disposition');
        pending.push({caseId,agentId,key,before:proposal.before,after:check.after});
      }
    }
    for(const [index,correction] of report.additionalCorrections.entries())additional.push({caseId,index,agentId,correction});
  }
  for(const change of pending){
    need((versions.get(change.key)??[]).some(selected=>selected.before===change.before&&selected.after===change.after&&selected.reviewerAgentId!==change.agentId),'Amended field lacks independent exact recheck: '+change.key);
  }
  const used=new Set(),resolutions=[];
  for(const finding of additional){
    const key=fieldKey(finding.correction),selected=approved.get(key);
    need(selected&&selected.before===finding.correction.before&&selected.reviewerAgentId!==finding.agentId,'Additional correction remains independently unreviewed: '+key);
    if(selected.after===finding.correction.after){resolutions.push({...finding,key,resolution:'exact-independent-recheck'});continue;}
    const entries=coverage.filter(c=>c.caseId===finding.caseId&&c.additionalIndex===finding.index);
    need(entries.length===1,'Additional finding needs explicit coverage review: '+key);
    const entry=entries[0];
    need(entry.fieldKey===key&&entry.findingSha256===digest(finding.correction)&&entry.selectedAfterSha256===digest(selected.after)&&typeof entry.reason==='string'&&entry.reason.trim().length>=60,'Coverage must bind the exact old finding and already approved replacement');
    used.add(entry);resolutions.push({...finding,key,resolution:'existing-field-proof-needs-application-review',coverage:entry,selectedAfter:selected.after});
  }
  need(used.size===coverage.length,'Unexpected or unused coverage declarations');
  need(usedSupersessions.size===supersessions.length,'Unexpected or unused replacement-proof declarations');
  const fields=[...approved.values()].sort((a,b)=>fieldKey(a).localeCompare(fieldKey(b)));
  return {kind:'composed-independent-English-field-proofs',...pins,fields,proofs:proofMetadata,additionalFindingResolutions:resolutions,supersessions,supersededFieldProofs:[...versions.values()].flatMap(v=>v.slice(0,-1)),sourceFieldCount:fields.filter(p=>['en','literal'].includes(p.field)).length,recordWordingCount:fields.filter(p=>!['en','literal'].includes(p.field)).length,originalReportsUnchanged:true,wholeBatchReviewerApproval:false,requiresIndependentApplicationReview:true};
}
