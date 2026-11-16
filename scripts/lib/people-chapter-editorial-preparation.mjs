import {isDeepStrictEqual as same} from 'node:util';

const need=(ok,message)=>{if(!ok)throw Error('Editorial preparation: '+message);};
const record=review=>Object.fromEntries(Object.entries(review).filter(([k])=>!['schemaVersion','book','chapter'].includes(k)));
const wrap=(book,chapter,reviews)=>reviews.length===0?null:reviews.length===1
 ?{schemaVersion:3,book,chapter,...record(reviews[0])}
 :{schemaVersion:4,book,chapter,reviews:reviews.map(record)};
const proposal=repair=>Object.fromEntries(Object.entries(repair).filter(([k])=>k!=='status'));

// Preparation grants no approval. Retain actual reviewed records verbatim; only
// seed the repairs lacking an exact accepted decision. Native gates still validate
// source, independence, applied repairs and the complete resulting history.
export function prepareChapterEditorialHistory({extraction,canonical,current,reviewerAgentId,native}) {
 const {editorialReviews,editorialDecisionSeed,validateEditorialDecisionDocument}=native;
 need([editorialReviews,editorialDecisionSeed,validateEditorialDecisionDocument].every(f=>typeof f==='function'),'Pinned native editorial contracts required');
 for(const d of [canonical,current])if(d!==null&&!(d&&Object.keys(d).length===0))need([3,4].includes(d.schemaVersion)&&d.book===extraction.book&&d.chapter===extraction.chapter,'Malformed or wrong-scope history');
 const before=editorialReviews(canonical),existing=editorialReviews(current);
 need(existing.length>=before.length&&before.every((r,i)=>same(r,existing[i])),'Canonical editorial history changed');
 const reviewed=[],templates=[];
 for(const [i,r] of existing.entries()){
  if(i<before.length||r.reviewer?.agentId){
   if(i>=before.length)need(reviewerAgentId&&r.reviewer.agentId===reviewerAgentId,'Uncaptured reviewer cannot supply chapter approval');
   validateEditorialDecisionDocument(r);reviewed.push(r);
  }else{
   need(r.decisions?.every(d=>d.decision==='reject'&&d.reason===''&&d.sourceWitness===null)&&
    !r.claimRetractions?.length&&!r.claimRevisions?.length&&!r.claimAdditions?.length,'Partially written review requires same-reviewer reconciliation');
   templates.push(r);
  }
 }
 const covered=repair=>reviewed.some(r=>r.decisions.some(d=>{
  const p=r.proposals.find(p=>p.id===d.repairId);
  if(!['accept','revise'].includes(d.decision)||!p)return false;
  const actual=proposal(repair),expected={...p,after:d.decision==='revise'?d.after:p.after};
  return [p.reason,d.reason].includes(actual.reason)&&same({...expected,reason:actual.reason},actual);
 }));
 const pending=extraction.translationRepairs.filter(r=>!covered(r));
 const seed=pending.length?editorialDecisionSeed({...extraction,translationRepairs:pending.map(r=>({...r,status:'proposed'}))}):null;
 need(!seed||!reviewed.some(r=>r.input.proposalsFingerprint===seed.input.proposalsFingerprint),
  'Previously rejected corrections remain unchanged; preserve the report and return them to the owner instead of reseeding duplicate reviews');
 // A changed untouched template is recovery evidence, never an old approval.
 const retainedTemplate=seed&&templates.find(r=>same(r.proposals,seed.proposals)&&same(r.input,seed.input));
 if(seed)reviewed.push(retainedTemplate??seed);
 return{document:wrap(extraction.book,extraction.chapter,reviewed),pendingRepairIds:pending.map(r=>r.id),
  retainedReviewCount:reviewed.length-(seed?1:0),approvalGranted:false,
  retiredTemplates:templates.filter(r=>r!==retainedTemplate)};
}
