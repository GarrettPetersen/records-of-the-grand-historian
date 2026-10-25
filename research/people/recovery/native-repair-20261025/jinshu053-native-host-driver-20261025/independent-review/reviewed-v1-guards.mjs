export const PINS = Object.freeze({book:'jinshu',chapter:'053',key:'jinshu/053',
  worker:'Garretts-MacBook-Pro-2.jinshu086-date-recovery',lane:'cursor-sdk',
  generationId:'512909bb-3469-497d-8a21-9097461d8154',
  sourceHash:'sha256:8be24c1fb53c68cc907f213e73d3ca8e829b1740fca8fe53e055f338e6ce3f55',
  extractionHash:'sha256:d076c673be25ed07c67110068038b3774b568f126d5677f5b54712a6446254dd',
  job:'repair-0-001-2ab2369cb5584ba79c41-d076c673be25'});
export function need(ok,message) { if(!ok)throw new Error(message); }
export function assertUnstarted(job) {
  need(job && job.status==='interrupted','Expected interrupted, unstarted repair job');
  for(const field of ['agentId','priorAgentId','runId','sent','artifactHash','proposalAuthorId','nativeAuthorId'])
    need(!job[field],`Repair already has ${field}; preserve retained work`);
}
export function assertClaim(ledger,{hostname,token,reserving=false,busy,extractionBlocks}) {
  const claim=ledger.dateAudits?.[PINS.key];
  need(claim,'Missing sticky date claim');
  for(const field of ['worker','lane','generationId','sourceHash','extractionHash'])need(claim[field]===PINS[field],`Date claim changed: ${field}`);
  need(!Object.hasOwn(claim,'combinedCuration'),'Combined curation pending');
  need(claim.status==='active','Date claim is no longer active');
  need(!claim.executorHost || claim.executorHost===hostname,'Date claim belongs to another host');
  need(!extractionBlocks(ledger.claims?.[PINS.key]),'Extraction claim blocks date work');
  if(reserving) {
    need(!busy(claim,{executorToken:token}),'Date executor busy');
    // Even an expired token must be reconciled by the original CLI, never stolen here.
    need(!claim.executorToken && !claim.executorExpiresAt,'Existing executor ownership requires reconciliation');
    assertUnstarted(claim.jobs?.[PINS.job]);
  } else need(claim.executorToken===token,'Lost date executor lease');
  return claim;
}
export class IndependentReviewBoundary extends Error {}
