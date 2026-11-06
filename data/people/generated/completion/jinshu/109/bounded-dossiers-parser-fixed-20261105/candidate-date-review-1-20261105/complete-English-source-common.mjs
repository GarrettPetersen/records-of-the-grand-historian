import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {collectEnglishRepairDecisions} from './collect-English-repair-decisions.mjs';
export const root='/Users/garrettpetersen/records-of-the-grand-historian';
export const dir=new URL('.',import.meta.url).pathname;
export const evidence=dir+'complete-English-coverage-c4f6b535-20261105/';
export const prepared=dir+'complete-English-source-prepared-v2/';
export const workflow=root+'/data/people/generated/date-workflow/jinshu/109';
export const paths={source:'data/jinshu/109.json',extraction:'data/people/extractions/jinshu/109.json',editorial:'data/people/editorial-decisions/jinshu/109.json'};
export const read=f=>JSON.parse(fs.readFileSync(f));
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export const need=(v,m)=>{if(!v)throw Error(m)};
export const write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
export function frozenRepairProofs(){
  const receipt=read(evidence+'independent-production-admissible-repair-cohort-receipt.json'),m=read(evidence+'manifest.json'),registry=read(evidence+'repair-decisions-production.json');
  need(receipt.repairReviewComplete&&receipt.canonicalWrites===0&&hash(fs.readFileSync(evidence+'repair-decisions-production.json'))===receipt.reviewRegistrySha256&&hash(Buffer.from(JSON.stringify(read(evidence+'cross-review-manifest.json').jobs)))===receipt.reviewJobsSha256,'Frozen complete repair proof registry/jobs changed');
  const current=collectEnglishRepairDecisions();
  need(current.repairReviewComplete&&same(current.entries,registry.entries)&&same(current.duplicateCurrentFieldFindings,registry.duplicateCurrentFieldFindings),'Current proofs differ from frozen independently approved wordings');
  need(registry.entries.length===135&&registry.entries.every(e=>e.status==='independently-approved'&&e.approval.agentId!==e.authorAgentId&&!e.unreconciledCurrentFieldFindings.length&&!/\p{Script=Han}/u.test(e.after)),'All135 independently approved, production-admissible targets required');
  for(const [file,digest]of [[root+'/'+paths.source,m.sourceByteSha256],[root+'/'+paths.extraction,m.canonicalByteSha256],[workflow+'/state.json',m.nativeStateSha256]])need(hash(fs.readFileSync(file))===digest,'Frozen source/canonical/native pin changed: '+file);
  const native=read(workflow+'/state.json');
  need(native.generationId===m.generationId&&native.phase==='reaudit'&&native.round===2&&native.reviewRoundCeiling===3&&!native.circuitBreaker,'Preserve native capped round and source generation');
  need(!Object.keys(native.jobs).some(k=>k.startsWith('reaudit-2-'))&&!Object.keys(native.reviewPlans??{}).includes('reaudit-2'),'Current source must be frozen before independent round2 ownership');
  need(!fs.existsSync(root+'/data/people/date-audits/jinshu/109.json'),'Preserve absent/staged-deleted old date approval');
  need(hash(fs.readFileSync(workflow+'/review-1.json'))==='dbd6a595981018535f878fe098f34f78c52a555864ca183c2e37233efc091bb8','Original negative date report changed');
  return {receipt,m,registry,native};
}
export function assertSourceOwners(ledger,m,{executorToken=null}={}){
  const c=ledger.dateAudits?.['jinshu/109'],i=ledger.identityReviews?.['jinshu/109'];
  need(c?.worker===m.worker&&c.lane==='grokbot'&&c.status==='research-blocked'&&c.generationId===m.generationId&&c.sourceHash===m.sourceHash&&c.extractionHash===m.canonicalExtractionHash,'Retained date source owner changed');
  need((executorToken?c.executorToken===executorToken:!c.executorToken)&&!Object.values(c.jobs).some(j=>['claimed','running','running-tools'].includes(j.status))&&!ledger.claims?.['jinshu/109'],'Preserve active executor/extraction ownership');
  need(i?.worker==='jinshu-completion-109-identity'&&!i.activeRun,'Preserve retained identity owner');
  return {claim:c,identity:i};
}
export function recordMappings(registry,m,canonical,staged){
  const changes=registry.entries.filter(e=>e.recordKind!=='source-English').map(e=>{
    need(e.recordKind==='claim-label'&&[[2,'relation'],[2,'label','en']].some(p=>same(p,e.fieldPath)),'Only the reviewed descriptive claim scalars may change');
    const part=m.parts.find(p=>p.index===e.origin.part);need(part,'Exact original source review required');
    const hint=read(part.inputFile).localClaimLabelHints.find(h=>h.id===e.recordId);need(hint?.row[4].includes(e.unit)&&e.fieldPath.reduce((o,k)=>o?.[k],hint.row)===e.before,'Original complete claim witness changed');
    const mapping={...e};
    for(const[name,raw]of [['canonical',canonical],['staged',staged]]){
      const matches=raw.claims.flatMap((row,index)=>same(row,hint.row)?[{index,id:'claim-'+(index+1),row:structuredClone(row)}]:[]);
      need(matches.length===1,'Unique complete claim row required in '+name+' for '+e.recordId);mapping[name]=matches[0];
    }
    return mapping;
  });
  need(changes.length===2,'Exactly two independently reviewed record wordings required');return changes;
}
export function patchRecordWordings(raw,changes,name){
  const next=structuredClone(raw);
  for(const c of changes){const exact=c[name],row=next.claims[exact.index];need(same(row,exact.row),'Exact '+name+' original claim changed');const parent=c.fieldPath.slice(0,-1).reduce((o,k)=>o[k],row);need(parent[c.fieldPath.at(-1)]===c.before,'Original scalar changed');parent[c.fieldPath.at(-1)]=c.after;}
  assertRecordDelta(raw,next,changes,name);return next;
}
export function assertRecordDelta(before,after,changes,name){
  const restored=structuredClone(after.claims);
  for(const c of changes){const exact=c[name],expected=structuredClone(exact.row),parent=c.fieldPath.slice(0,-1).reduce((o,k)=>o[k],expected);parent[c.fieldPath.at(-1)]=c.after;need(same(restored[exact.index],expected),'Record delta differs from exact independently approved scalar');restored[exact.index]=structuredClone(exact.row);}
  need(same(restored,before.claims)&&same(before.people,after.people),'Undeclared claim/date/hint/person change');
}
