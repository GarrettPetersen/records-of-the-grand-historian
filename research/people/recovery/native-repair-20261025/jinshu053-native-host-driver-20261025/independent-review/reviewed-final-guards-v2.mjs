import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
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
export function readWorkflowInventory(directory) {
  const inventory={};
  for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    need(entry.isFile(),`Unexpected non-file workflow entry: ${entry.name}`);
    const file=path.join(directory,entry.name);
    need(!fs.lstatSync(file).isSymbolicLink(),`Workflow symlink rejected: ${entry.name}`);
    inventory[entry.name]=createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  return inventory;
}
export function assertWorkflowInventory(directory,expected) {
  const actual=readWorkflowInventory(directory);
  need(JSON.stringify(actual)===JSON.stringify(expected),'Workflow directory inventory or content changed');
}
export function assertNoFutureDateArtifacts(directory,state) {
  for(const entry of fs.readdirSync(directory))need(entry==='state.json' || entry==='review-0.json' || /^audit-0-[a-z0-9]+\.json$/.test(entry),`Future or unexpected workflow artifact: ${entry}`);
  need(!Object.keys(state.reviewPlans??{}).some(key=>key!=='audit-0'),'Future independent review plan already exists');
  need(!Object.keys(state.jobs??{}).some(key=>key.startsWith('reaudit-') || key.startsWith('review-')),'Future independent review job already exists');
}
export function assertBaselineArtifacts(directory,expected) {
  for(const [name,digest] of Object.entries(expected))if(name!=='state.json')
    need(createHash('sha256').update(fs.readFileSync(path.join(directory,name))).digest('hex')===digest,`Frozen workflow baseline changed: ${name}`);
}
export function assertNoCachedReviewArtifacts(directory) {
  for(const entry of fs.readdirSync(directory))
    need(!/^(?:reaudit-|review-[1-9]|publication(?:\.|$)|editorial-amendment(?:\.|$))/.test(entry),`Cached future review/publication artifact: ${entry}`);
}
