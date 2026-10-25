// Explicit migration only. Runtime classifiers never accept these removed labels.
const removed = new Set(['posthumous-reference', 'posthumous-commemoration']);
export function reconcileRetrospectiveValue(value) {
  const next = structuredClone(value);
  if (!next || typeof next !== 'object' || Array.isArray(next)) return next;
  if (next.receptionType === 'posthumous') next.receptionType = 'retrospective';
  for (const key of ['kind', 'action']) if (removed.has(next[key])) next[key] = 'retrospective-reference';
  return next;
}

export function reconcileRetrospectiveExtraction(extraction) {
  if (extraction.schemaVersion !== 2) throw new Error('Reception reconciliation requires compact schema 2');
  const candidate = structuredClone(extraction), changes = [];
  candidate.claims.forEach((row, index) => {
    const before = extraction.claims[index], after = structuredClone(before);
    after[2] = reconcileRetrospectiveValue(before[2]);
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      candidate.claims[index] = after;
      changes.push({id:`claim-${index+1}`,before,after});
    }
  });
  return {candidate,changes};
}

// Submission boundary only: never change a sealed before-row or packet hash.
export function reconcileRetrospectiveProposal(submission) {
  const proposal=structuredClone(submission), changes=[];
  if(!Array.isArray(proposal?.changes))return {proposal,changes};
  proposal.changes.forEach((change,index)=>{
    if(!['replace','add','add-reception-event'].includes(change.kind)||!Array.isArray(change.after)||change.after.length!==5)return;
    const before=structuredClone(change.after);
    change.after[2]=reconcileRetrospectiveValue(change.after[2]);
    if(JSON.stringify(before)!==JSON.stringify(change.after))changes.push({index,before,after:structuredClone(change.after)});
  });
  return {proposal,changes};
}
